// src/screens/FormArticle/index.jsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fontType, colors } from '../../theme';
import { useFocusEffect } from '@react-navigation/native';
// Impor fungsi Firebase
import { createArticleFirebase } from '../../services/firebase'; 
const ArticleForm = () => {
  const navigation = useNavigation();
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    category: '', // Kategori sebagai input teks bebas
  });
  const [loading, setLoading] = useState(false); // Ubah nama state jika perlu (misal: isSubmitting)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return () => {};
    }, [fadeAnim])
  );

  const handleChange = (key, value) => {
    setArticleData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleUpload = async () => {
    if (!articleData.title || !articleData.content || !articleData.category) {
      Alert.alert('Input Tidak Lengkap', 'Judul, Kategori, dan Konten artikel tidak boleh kosong.');
      return;
    }
    setLoading(true);
    try {
      // Payload untuk Firebase (tanpa image, createdAt akan di-handle oleh serverTimestamp)
      const payload = {
        title: articleData.title,
        content: articleData.content,
        category: articleData.category,
        // totalLikes, totalShares, isBookmarked akan di-default di fungsi createArticleFirebase
      };

      await createArticleFirebase(payload); // <--- GUNAKAN FUNGSI FIREBASE

      Alert.alert('Sukses', 'Artikel berhasil ditambahkan!');
      navigation.goBack();

    } catch (error) {
      console.error("Error uploading article to Firebase:", error);
      Alert.alert('Error', `Terjadi kesalahan saat mengupload artikel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tambah Artikel Baru</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={textInputStyles.container}>
          <Text style={textInputStyles.label}>Judul Artikel</Text>
          <TextInput
            placeholder="Masukkan judul artikel"
            value={articleData.title}
            onChangeText={text => handleChange('title', text)}
            placeholderTextColor={colors.grey(0.6)}
            style={textInputStyles.input}
          />
        </View>

        <View style={textInputStyles.container}>
          <Text style={textInputStyles.label}>Kategori Artikel</Text>
          <TextInput
            placeholder="Contoh: Kesehatan, Nutrisi, Olahraga"
            value={articleData.category}
            onChangeText={text => handleChange('category', text)}
            placeholderTextColor={colors.grey(0.6)}
            style={textInputStyles.input}
          />
        </View>

        <View style={textInputStyles.container}>
          <Text style={textInputStyles.label}>Konten Artikel</Text>
          <TextInput
            placeholder="Tulis konten artikel di sini..."
            value={articleData.content}
            onChangeText={text => handleChange('content', text)}
            placeholderTextColor={colors.grey(0.6)}
            multiline
            numberOfLines={10}
            style={[textInputStyles.input, textInputStyles.textArea]}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.greenMint()} />
        </View>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={loading}>
          <Text style={styles.buttonLabel}>Upload Artikel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Styles (styles, textInputStyles) tetap sama seperti versi terakhir Anda
// Pastikan styles.loadingOverlay sudah ada.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 16,
    color: colors.black(),
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  bottomBar: {
    backgroundColor: colors.white(),
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey(),
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: colors.greenMint(),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.white(),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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

export default ArticleForm;