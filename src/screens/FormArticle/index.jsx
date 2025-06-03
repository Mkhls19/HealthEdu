import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {ArrowLeft} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {fontType, colors} from '../../theme';

const ArticleForm = () => {
  const navigation = useNavigation();
  const [articleData, setArticleData] = useState({
    title: '',
    content: '',
    category: 'Kesehatan Umum', // Contoh kategori default
  });

  const handleChange = (key, value) => {
    setArticleData({
      ...articleData,
      [key]: value,
    });
  };

  const handleUpload = () => {
    // Di sini logika untuk mengirim data artikel (misalnya ke API atau state global)
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
      `Judul: ${articleData.title}\nKonten: ${articleData.content.substring(
        0,
        100,
      )}...`,
    );
    // Kembali ke layar sebelumnya atau ke Home setelah upload
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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

        {/* Kamu bisa tambahkan input untuk kategori, gambar, dll. di sini */}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonLabel}>Upload Artikel</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center', // Memastikan judul ada di tengah sisa ruang
    marginLeft: -24, // Kompensasi tombol back agar judul benar-benar di tengah layar
  },
  headerTitle: {
    fontFamily: fontType['Pjs-Bold'],
    fontSize: 16,
    color: colors.black(),
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 15,
  },
  bottomBar: {
    backgroundColor: colors.white(),
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey(),
    alignItems: 'center', // Tombol upload di tengah
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: colors.greenMint(), // Warna tombol bisa disesuaikan
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
    minHeight: 150, // Tinggi minimum untuk area teks
    textAlignVertical: 'top', // Mulai teks dari atas untuk Android
  },
});