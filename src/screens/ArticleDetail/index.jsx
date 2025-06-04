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
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { colors, fontType } from '../../theme';
// Import fungsi Firebase
import {
  getArticleByIdFirebase,
  updateArticleFirebase,
  deleteArticleFirebase
} from '../../services/firebase';
import { ArrowLeft, Edit, Trash, Bookmark as BookmarkIcon, Heart, Send2, Check, CloseSquare } from 'iconsax-react-native';

// Fungsi format tanggal
const formatDate = (timestamp) => {
  if (!timestamp) return 'Tanggal tidak tersedia';
  try {
    const date = timestamp.toDate(); // Konversi Firestore Timestamp ke Date
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    // Fallback jika bukan Firestore Timestamp (misalnya sudah string atau Date object)
    try {
        const date = new Date(timestamp);
         return date.toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", error, e);
        return 'Format tanggal salah';
    }
  }
};

const ArtikelDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { articleId } = route.params;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editableArticleData, setEditableArticleData] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchArticleDetail = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) setLoading(true);
    try {
      const data = await getArticleByIdFirebase(articleId); // <--- GUNAKAN FUNGSI FIREBASE
      if (data) {
        setArticle(data);
        setIsBookmarked(data.isBookmarked || false);
        setEditableArticleData({
          title: data.title,
          content: data.content,
          category: data.category,
        });
      } else {
        Alert.alert('Error', 'Artikel tidak ditemukan.');
        if (navigation.canGoBack()) navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching article detail from Firebase:", error);
      Alert.alert('Error', 'Gagal memuat detail artikel.');
      if (navigation.canGoBack()) navigation.goBack();
    } finally {
      if (showLoadingIndicator) setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleDetail();
  }, [articleId]);

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return () => {
        fadeAnim.setValue(0);
        setIsEditing(false);
      }
    }, [fadeAnim])
  );

  const handleToggleBookmark = async () => {
    if (!article || bookmarkLoading || isEditing) return;
    setBookmarkLoading(true);
    try {
      const newBookmarkStatus = !isBookmarked;
      await updateArticleFirebase(articleId, { isBookmarked: newBookmarkStatus }); // <--- GUNAKAN FUNGSI FIREBASE
      // Fetch ulang data untuk mendapatkan versi terbaru (termasuk kemungkinan updatedAt dari server)
      const updatedData = await getArticleByIdFirebase(articleId);
      if (updatedData) {
        setArticle(updatedData);
        setIsBookmarked(updatedData.isBookmarked || false);
      }
      Alert.alert('Sukses', newBookmarkStatus ? 'Artikel disimpan!' : 'Artikel dihapus dari simpanan.');
    } catch (error) {
      console.error("Error updating bookmark status with Firebase:", error);
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
      await updateArticleFirebase(articleId, payload); // <--- GUNAKAN FUNGSI FIREBASE
      const updatedData = await getArticleByIdFirebase(articleId); // Fetch data terbaru
      if (updatedData) {
        setArticle(updatedData);
        setIsBookmarked(updatedData.isBookmarked || false);
      }
      setIsEditing(false);
      Alert.alert('Sukses', 'Artikel berhasil diperbarui!');
    } catch (error) {
      console.error("Error saving changes with Firebase:", error);
      Alert.alert('Error', `Gagal menyimpan perubahan: ${error.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = () => {
    if (!article || isEditing) return;
    Alert.alert(
      "Hapus Artikel",
      "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", onPress: async () => {
            setLoading(true);
            try {
              await deleteArticleFirebase(articleId); // <--- GUNAKAN FUNGSI FIREBASE
              Alert.alert("Sukses", "Artikel berhasil dihapus.");
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting article with Firebase:", error);
              Alert.alert("Error", `Gagal menghapus artikel: ${error.message}`);
              setLoading(false);
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  // Sisa kode JSX dan Styles tetap sama seperti versi terakhir Anda
  // Pastikan untuk menggunakan `formatDate` untuk `article.createdAt`
  // dan `article.totalLikes || 0`, `article.totalShares || 0`
  // ... (kode JSX dan Styles dari respons Anda sebelumnya) ...

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
        keyboardShouldPersistTaps="handled"
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
      </ScrollView>
    </Animated.View>
  );
};

// Styles (styles dan textInputStyles dari respons Anda sebelumnya)
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
    paddingTop: Platform.OS === 'ios' ? 45 : 15,
    backgroundColor: colors.white(),
    height: Platform.OS === 'ios' ? 90 : 60,
  },
  headerNavButton: {
    padding: 8,
    zIndex:1
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    marginHorizontal: 5,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minWidth: 40,
  },
  actionButton: {
    padding: 8,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
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
    fontSize: 13,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.greenMint(),
    backgroundColor: colors.greenMint(0.1),
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  date: {
    fontSize: 12,
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
    fontSize: 15,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.black(0.8),
    lineHeight: 24,
    textAlign: 'left',
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
    justifyContent: 'space-around',
    marginTop: 25,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 130,
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
    gap: 18,
  },
});

const textInputStyles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontFamily: fontType['Pjs-Medium'],
        color: colors.black(0.7),
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.grey(0.4),
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 15,
        fontFamily: fontType['Pjs-Regular'],
        color: colors.black(),
        backgroundColor: colors.white(),
    },
    textArea: {
        minHeight: 180,
        textAlignVertical: 'top',
    },
});


export default ArtikelDetailScreen;