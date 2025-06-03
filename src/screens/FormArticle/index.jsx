import React, { useState, useRef, useCallback } from 'react'; // Ditambahkan useRef, useCallback
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Animated, // Ditambahkan Animated
  // Platform, // Jika menggunakan StatusBar.currentHeight
  // StatusBar, // Jika menggunakan StatusBar.currentHeight
} from 'react-native';
// import {ArrowLeft} from 'iconsax-react-native'; // Nonaktifkan jika tidak ada tombol kembali di header
import { useNavigation } from '@react-navigation/native';
import { fontType, colors } from '../../theme';
import { useFocusEffect } from '@react-navigation/native'; // Ditambahkan useFocusEffect

const ArticleForm = () => {
  const navigation = useNavigation();
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    category: 'Kesehatan Umum', // Contoh kategori default
  });

  const fadeAnim = useRef(new Animated.Value(0)).current; // Inisialisasi Animated.Value [cite: 11, 13, 15]

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0); // Reset animasi
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true, // [cite: 7, 9]
      }).start(); // Mulai animasi [cite: 15]

      return () => {
        // Opsional: Logika cleanup
      };
    }, [fadeAnim])
  );

  const handleChange = (key, value) => {
    setArticleData({
      ...articleData,
      [key]: value,
    });
  };

  const handleUpload = () => {
    if (!articleData.title || !articleData.content) {
      Alert.alert(
        'Input Tidak Lengkap',
        'Judul dan Konten artikel tidak boleh kosong.',
      );
      return;
    }
    console.log('Data Artikel:', articleData);
    Alert.alert(
      'Artikel Ditambahkan',
      `Judul: ${articleData.title}\nKonten: ${articleData.content.substring(0,100)}...`,
    );
    navigation.goBack(); // Kembali ke layar sebelumnya
  };

  return (
    // Bungkus dengan Animated.View dan terapkan opacity [cite: 10, 15]
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        {/* Jika Anda membutuhkan tombol kembali:
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.black()} />
        </TouchableOpacity> 
        */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Tambah Artikel Baru</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
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
          <Text style={textInputStyles.label}>Konten Artikel</Text>
          <TextInput
            placeholder="Tulis konten artikel di sini..."
            value={articleData.content}
            onChangeText={text => handleChange('content', text)}
            placeholderTextColor={colors.grey(0.6)}
            multiline
            numberOfLines={10} // Atur tinggi awal
            style={[textInputStyles.input, textInputStyles.textArea]}
          />
        </View>
        {/* Anda bisa tambahkan input untuk kategori, gambar, dll. di sini */}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonLabel}>Upload Artikel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ArticleForm;

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
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 8, // Jika ingin header di bawah status bar
    paddingTop: 8, // Sesuaikan jika tidak memperhitungkan status bar secara eksplisit
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
  },
  // backButton: { // Aktifkan jika menggunakan tombol kembali
  //   position: 'absolute',
  //   left: 24, // Atau padding horizontal header
  //   top: 0, // Sesuaikan dengan paddingTop header
  //   bottom: 0, // Sesuaikan dengan paddingBottom header
  //   justifyContent: 'center',
  //   zIndex: 1, // Agar di atas elemen lain jika ada overlap
  // },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    // marginLeft: -24, // Hapus atau sesuaikan jika tidak ada tombol kembali fisik di kiri
  },
  headerTitle: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 16,
    color: colors.black(),
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 15, // Jarak antar elemen form
  },
  bottomBar: {
    backgroundColor: colors.white(),
    paddingHorizontal: 24,
    paddingVertical: 15, // Padding atas bawah untuk tombol
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
    width: '100%', // Agar tombol memenuhi lebar bottomBar jika diinginkan
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.white(),
  },
});

const textInputStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.lightGrey(0.5),
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.black(),
    backgroundColor: colors.extraLightGrey(0.2),
  },
  textArea: {
    minHeight: 150,
    textAlignVertical: 'top', // Agar teks di area multi-baris mulai dari atas
  },
});