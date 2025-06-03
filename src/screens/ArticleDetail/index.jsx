// src/screens/ArtikelDetailScreen/index.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Animated,
  Platform,
  TextInput, // Diperlukan untuk inline editing
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
import { getArticleById, updateArticle, deleteArticle } from '../../services/api';
import { ArrowLeft, Edit, Trash, Bookmark as BookmarkIcon, Heart, Send2, Check, CloseSquare } from 'iconsax-react-native';

// Fungsi format tanggal
const formatDate = (isoString) => {
  if (!isoString) return 'Tanggal tidak tersedia';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Format tanggal salah';
  }
};

const ArtikelDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { articleId } = route.params;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true); // Loading untuk fetch awal dan operasi utama (delete)
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false); // Loading khusus untuk aksi bookmark

  const [isEditing, setIsEditing] = useState(false);
  const [editableArticleData, setEditableArticleData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchArticleDetail = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) {
        setLoading(true);
    }
    try {
      const data = await getArticleById(articleId);
      setArticle(data);
      setIsBookmarked(data.isBookmarked || false);
      setEditableArticleData({ // Inisialisasi data untuk form edit
        title: data.title,
        content: data.content,
        category: data.category,
      });
    } catch (error) {
      console.error("Error fetching article detail:", error.response?.data || error.message);
      Alert.alert('Error', 'Gagal memuat detail artikel.');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } finally {
      if (showLoadingIndicator) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchArticleDetail();
  }, [articleId]);

  useFocusEffect(
    useCallback(() => {
      // Jika ingin data refresh setiap kali layar fokus (setelah edit/bookmark dari tempat lain)
      // Anda bisa memanggil fetchArticleDetail(false) di sini;
      // "false" agar tidak menampilkan loading indicator besar.
      // Namun, karena kita mengupdate state 'article' setelah update bookmark/edit,
      // mungkin tidak perlu fetch ulang di sini kecuali ada perubahan dari sumber eksternal.

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return () => {
        fadeAnim.setValue(0); // Reset animasi saat meninggalkan layar
        setIsEditing(false); // Keluar dari mode edit jika layar tidak fokus
      }
    }, [fadeAnim])
  );

  const handleToggleBookmark = async () => {
    if (!article || bookmarkLoading || isEditing) return; // Jangan bookmark saat edit
    setBookmarkLoading(true);
    try {
      const newBookmarkStatus = !isBookmarked;
      const updatedArticleData = await updateArticle(articleId, { isBookmarked: newBookmarkStatus });
      setArticle(updatedArticleData);
      setIsBookmarked(newBookmarkStatus);
      Alert.alert('Sukses', newBookmarkStatus ? 'Artikel disimpan!' : 'Artikel dihapus dari simpanan.');
    } catch (error) {
      console.error("Error updating bookmark status:", error.response?.data || error.message);
      Alert.alert('Error', 'Gagal memperbarui status simpan artikel.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (!article) return;
    if (!isEditing) {
      setEditableArticleData({
        title: article.title,
        content: article.content,
        category: article.category,
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditableDataChange = (key, value) => {
    setEditableArticleData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editableArticleData.title || !editableArticleData.content || !editableArticleData.category) {
      Alert.alert('Input Tidak Lengkap', 'Judul, Kategori, dan Konten tidak boleh kosong.');
      return;
    }
    setIsSavingEdit(true);
    try {
      const payload = {
        title: editableArticleData.title,
        content: editableArticleData.content,
        category: editableArticleData.category,
      };
      const updatedData = await updateArticle(articleId, payload);
      setArticle(updatedData);
      setIsBookmarked(updatedData.isBookmarked || false); // Update status bookmark juga jika ada perubahan dari server
      setIsEditing(false);
      Alert.alert('Sukses', 'Artikel berhasil diperbarui!');
    } catch (error) {
      console.error("Error saving changes:", error.response?.data || error.message);
      Alert.alert('Error', `Gagal menyimpan perubahan: ${error.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = () => {
    if (!article || isEditing) return; // Jangan delete saat edit
    Alert.alert(
      "Hapus Artikel",
      "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", onPress: async () => {
            setLoading(true);
            try {
              await deleteArticle(articleId);
              Alert.alert("Sukses", "Artikel berhasil dihapus.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting article:", error.response?.data || error.message);
              Alert.alert("Error", `Gagal menghapus artikel: ${error.message}`);
              setLoading(false);
            }
            // setLoading(false) tidak perlu jika navigasi berhasil
          },
          style: "destructive"
        }
      ]
    );
  };

  if (loading && !article) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.greenMint()} />
      </View>
    );
  }

  if (!article) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Artikel tidak ditemukan atau gagal dimuat.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonOnError}>
            <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => isEditing ? handleEditToggle() : navigation.goBack()} style={styles.headerNavButton}>
          {isEditing ? <CloseSquare size={24} color={colors.black()} variant="Bold" /> : <ArrowLeft size={24} color={colors.black()} />}
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{isEditing ? 'Edit Artikel' : article.title}</Text>
        <View style={styles.headerActions}>
          {!isEditing && (
            <TouchableOpacity onPress={handleToggleBookmark} disabled={bookmarkLoading} style={styles.actionButton}>
              {bookmarkLoading ? (
                <ActivityIndicator size="small" color={colors.greenMint()} />
              ) : (
                <BookmarkIcon size={24} color={isBookmarked ? colors.greenMint() : colors.black()} variant={isBookmarked ? 'Bold' : 'Linear'}/>
              )}
            </TouchableOpacity>
          )}
           {isEditing && (
            <TouchableOpacity onPress={handleSaveChanges} disabled={isSavingEdit} style={styles.actionButton}>
              {isSavingEdit ? <ActivityIndicator size="small" color={colors.blueMain()} /> : <Check size={24} color={colors.blueMain()} variant="Bold"/>}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Agar tap di luar input menutup keyboard saat edit
      >
        {isEditing ? (
          <View style={styles.editFormContainer}>
            <View style={textInputStyles.container}>
              <Text style={textInputStyles.label}>Judul Artikel</Text>
              <TextInput
                value={editableArticleData.title}
                onChangeText={text => handleEditableDataChange('title', text)}
                style={textInputStyles.input}
                placeholder="Judul artikel"
                placeholderTextColor={colors.grey(0.6)}
              />
            </View>
            <View style={textInputStyles.container}>
              <Text style={textInputStyles.label}>Kategori</Text>
              <TextInput
                value={editableArticleData.category}
                onChangeText={text => handleEditableDataChange('category', text)}
                style={textInputStyles.input}
                placeholder="Kategori artikel"
                placeholderTextColor={colors.grey(0.6)}
              />
            </View>
            <View style={textInputStyles.container}>
              <Text style={textInputStyles.label}>Konten</Text>
              <TextInput
                value={editableArticleData.content}
                onChangeText={text => handleEditableDataChange('content', text)}
                style={[textInputStyles.input, textInputStyles.textArea]}
                multiline
                numberOfLines={10}
                placeholder="Konten artikel"
                placeholderTextColor={colors.grey(0.6)}
                textAlignVertical="top"
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.title}>{article.title}</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.category}>{article.category}</Text>
              <Text style={styles.date}>{formatDate(article.createdAt)}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>{article.content}</Text>
            </View>
            <View style={styles.statsSection}>
                <View style={styles.statsItem}>
                    <Heart size={18} color={colors.grey()} variant="Linear"/>
                    <Text style={styles.statsText}>{article.totalLikes !== undefined ? article.totalLikes : 0}</Text>
                </View>
                <View style={styles.statsItem}>
                    <Send2 size={18} color={colors.grey()} variant="Linear" style={{transform: [{rotate: '-45deg'}]}}/>
                    <Text style={styles.statsText}>{article.totalShares !== undefined ? article.totalShares : 0}</Text>
                </View>
            </View>
          </>
        )}

        {!isEditing && (
          <View style={styles.actionButtonsBottom}>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditToggle}>
                  <Edit size={18} color={colors.white()} />
                  <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete} disabled={loading}>
                  {loading ? <ActivityIndicator size="small" color={colors.white()} /> : <Trash size={18} color={colors.white()} />}
                  <Text style={styles.buttonText}>Hapus</Text>
              </TouchableOpacity>
          </View>
        )}
        {/* Tombol Simpan dan Batal saat mode edit dipindahkan ke header untuk UI yang lebih bersih */}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    textAlign: 'center',
  },
  backButtonOnError: {
    marginTop: 20,
    backgroundColor: colors.greenMint(0.8),
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: colors.white(),
    fontFamily: fontType['Pjs-Bold'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10, // Sedikit dikurangi
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
    paddingTop: Platform.OS === 'ios' ? 45 : 15, // Disesuaikan untuk status bar
    backgroundColor: colors.white(),
    height: Platform.OS === 'ios' ? 90 : 60, // Tinggi header
  },
  headerNavButton: {
    padding: 8, // Area tekan lebih besar
    zIndex:1 // Pastikan di atas elemen lain jika ada overlap tak terduga
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    marginHorizontal: 5, // Mengurangi margin agar lebih pas
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 40, // Beri ruang minimal untuk tombol aksi
  },
  actionButton: {
    padding: 8, // Area tekan lebih besar
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 80, // Lebih banyak ruang di bawah
  },
  title: {
    fontSize: 22, // Sedikit lebih kecil
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    marginBottom: 12,
    lineHeight: 30,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'center',
  },
  category: {
    fontSize: 13, // Sedikit lebih kecil
    fontFamily: fontType['Pjs-Medium'],
    color: colors.greenMint(),
    backgroundColor: colors.greenMint(0.1),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  date: {
    fontSize: 12, // Sedikit lebih kecil
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGrey(0.7),
    paddingTop: 18,
    marginTop: 8,
  },
  content: {
    fontSize: 15, // Sedikit lebih kecil
    fontFamily: fontType['Pjs-Regular'],
    color: colors.black(0.8), // Sedikit lebih gelap
    lineHeight: 24, // Jarak antar baris
    textAlign: 'left', // Default, bisa juga 'justify'
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 25,
    marginTop: 25,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.extraLightGrey(0.7),
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statsText: {
    fontSize: 13,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  actionButtonsBottom: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Atau 'space-between' atau 'flex-end'
    marginTop: 25,
    // marginBottom: 20, // Dihilangkan, padding di scrollContentContainer
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18, // Disesuaikan
    paddingVertical: 12, // Disesuaikan
    borderRadius: 8,
    minWidth: 130, // Disesuaikan
    justifyContent: 'center',
    elevation: 2,
  },
  editButton: {
    backgroundColor: colors.blueMain(0.9),
  },
  deleteButton: {
    backgroundColor: colors.orangeBright(),
  },
  buttonText: {
    color: colors.white(),
    fontFamily: fontType['Pjs-SemiBold'],
    marginLeft: 8,
    fontSize: 14,
  },
  editFormContainer: {
    gap: 18, // Jarak antar field input
  },
});

const textInputStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontFamily: fontType['Pjs-Medium'],
        color: colors.black(0.7), // Label lebih jelas
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grey(0.4), // Border lebih jelas
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10, // Padding lebih nyaman
        fontSize: 15,
        fontFamily: fontType['Pjs-Regular'],
        color: colors.black(),
        backgroundColor: colors.white(), // Latar belakang input putih
    },
    textArea: {
        minHeight: 180, // Lebih tinggi
        textAlignVertical: 'top',
    },
});

export default ArtikelDetailScreen;