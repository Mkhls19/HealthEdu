import React, { useState, useRef, useCallback } from 'react'; // Ditambahkan useRef, useCallback
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  Animated, // Ditambahkan Animated
  Platform, // Sudah ada
} from 'react-native';
import { SearchNormal, Notification } from 'iconsax-react-native';
import { fontType, colors } from '../../theme';
import { useFocusEffect } from '@react-navigation/native'; // Ditambahkan useFocusEffect

// Data (bannerData, categories, recommendedData, popularData) tetap sama seperti di file Anda
// Komponen internal (SectionHeader, BannerCarousel, CategoryGrid, dll.) juga tetap sama

// --- AMBIL DATA DARI src/data.jsx JIKA PERLU ---
// import { bannerData, categories, recommendedData, popularData, dailyTips } from '../../data';
// Jika Anda memindahkan data ke src/data.jsx, pastikan path image require() disesuaikan atau data gambar dikelola berbeda.
// Untuk contoh ini, saya asumsikan data masih didefinisikan lokal di HomeScreen atau diimpor dengan benar.

const bannerData = [
  { id: 1, image: require('../../assets/images/banner1.jpg'), title: 'Tips Jaga Kesehatan Mental' },
  { id: 2, image: require('../../assets/images/banner1.jpg'), title: 'Manfaat Tidur Cukup' }, // Pastikan path gambar benar
  { id: 3, image: require('../../assets/images/banner1.jpg'), title: 'Olahraga Rutin Setiap Hari' },// Pastikan path gambar benar
];

const categories = [
  { id: 1, icon: '👶', name: 'Kesehatan Anak' },
  { id: 2, icon: '👵', name: 'Kesehatan Lansia' },
  { id: 3, icon: '🍎', name: 'Nutrisi dan Diet' },
  { id: 4, icon: '🏋️', name: 'Olahraga & Kebugaran' },
  { id: 5, icon: '🩺', name: 'Penyakit & Pencegahan' },
  { id: 6, icon: '🧠', name: 'Kesehatan Mental' },
];

const recommendedData = [
  { id: 1, image: require('../../assets/images/article1.jpg'), title: '5 Manfaat Olahraga Pagi', duration: 'Baca 5 menit' }, // Pastikan path gambar benar
  { id: 2, image: require('../../assets/images/article1.jpg'), title: 'Diet Sehat untuk Pemula', duration: 'Baca 7 menit' }, // Pastikan path gambar benar
  { id: 3, image: require('../../assets/images/article1.jpg'), title: 'Cara Mengatasi Stres', duration: 'Baca 6 menit' }, // Pastikan path gambar benar
];

const popularData = [
  { id: 1, title: '10 Makanan Sehat untuk Jantung', views: '1.2k' },
  { id: 2, title: 'Yoga untuk Pemula', views: '950' },
  { id: 3, title: 'Cara Menjaga Kesehatan Mata', views: '1.5k' },
];

const SectionHeader = ({ title }) => {
  return <Text style={styles.sectionTitle}>{title}</Text>;
};

const BannerCarousel = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
      {bannerData.map(item => (
        <ImageBackground key={item.id} source={item.image} style={styles.bannerImage} resizeMode="cover">
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>{item.title}</Text>
          </View>
        </ImageBackground>
      ))}
    </ScrollView>
  );
};

const CategoryGrid = () => {
  return (
    <View style={styles.categorySectionContainer}>
      <SectionHeader title="Kategori Populer" />
      <FlatList
        data={categories}
        numColumns={3}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.categoryItem} onPress={() => Alert.alert("Kategori", `Anda memilih: ${item.name}`)}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
          </Pressable>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const RecommendedContent = () => {
  return (
    <View style={styles.recommendedContainer}>
      <SectionHeader title="Rekomendasi untuk Anda" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollContent}>
        {recommendedData.map(item => (
          <Pressable key={item.id} style={styles.recommendedCard} onPress={() => Alert.alert("Info", `Membuka artikel: ${item.title}`)}>
            <Image source={item.image} style={styles.recommendedImage} resizeMode="cover" />
            <Text style={styles.recommendedTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.recommendedDuration}>{item.duration}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const DailyTip = () => {
  return (
    <View style={styles.tipContainer}>
      <SectionHeader title="Tips Sehat Hari Ini" />
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💧</Text>
        <Text style={styles.tipText}>Minum 8 gelas air sehari untuk menjaga hidrasi tubuh Anda tetap optimal.</Text>
      </View>
    </View>
  );
};

const PopularContent = () => {
  return (
    <View style={styles.popularContainer}>
      <SectionHeader title="Populer Minggu Ini" />
      <FlatList
        data={popularData}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.popularItem} onPress={() => Alert.alert("Info", `Membuka artikel: ${item.title}`)}>
            <View style={styles.popularTextContainer}>
              <Text style={styles.popularTitle} numberOfLines={2}>{item.title}</Text>
            </View>
            <Text style={styles.popularViews}>{item.views} views</Text>
          </Pressable>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};


const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current; // Inisialisasi Animated.Value [cite: 11, 13, 15]

  useFocusEffect(
    useCallback(() => {
      // Setel ulang animasi ke 0 setiap kali layar fokus
      fadeAnim.setValue(0);
      // Mulai animasi timing
      Animated.timing(fadeAnim, {
        toValue: 1, // Animasikan ke opacity 1
        duration: 500, // Durasi animasi 500ms
        useNativeDriver: true, // Gunakan native driver untuk performa lebih baik [cite: 7, 9]
      }).start(); // Mulai animasi [cite: 15]

      return () => {
        // Opsional: Aksi cleanup jika layar tidak fokus lagi
        // fadeAnim.setValue(0); // Misalnya, reset opacity saat meninggalkan layar
      };
    }, [fadeAnim]) // Dependency array
  );

  const handleSearch = () => {
    if (searchText.trim() === '') {
      Alert.alert('Pencarian', 'Silakan masukkan kata kunci pencarian.');
      return;
    }
    Alert.alert('Mencari', `Anda mencari: ${searchText}`);
  };

  return (
    // Bungkus konten utama dengan Animated.View dan terapkan opacity [cite: 10, 15]
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HealthEdu</Text>
        <Pressable onPress={() => Alert.alert("Notifikasi", "Belum ada notifikasi baru.")}>
          <Notification color={colors.grey()} variant="Linear" size={26} />
        </Pressable>
      </View>

      <View style={searchBarStyles.container}>
        <TextInput
          style={searchBarStyles.input}
          placeholder="Cari artikel, tips..."
          placeholderTextColor={colors.grey()}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable style={searchBarStyles.button} onPress={handleSearch}>
          <SearchNormal size={20} color={colors.white()} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {searchText === '' ? (
          <>
            <BannerCarousel />
            <CategoryGrid />
            <RecommendedContent />
            <DailyTip />
            <PopularContent />
          </>
        ) : (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsText}>Menampilkan hasil untuk: "{searchText}"</Text>
          </View>
        )}
      </ScrollView>
    </Animated.View>
  );
};

export default HomeScreen;

// Styles (styles dan searchBarStyles) tetap sama seperti di file Anda
// Pastikan styles.container memiliki flex: 1 dan backgroundColor
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white(),
    marginTop: Platform.OS === 'ios' ? 30 : 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fontType['Pop-Bold'],
    color: colors.black(),
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  bannerContainer: {
    marginTop: 5,
  },
  bannerImage: {
    width: 320,
    height: 160,
    borderRadius: 12,
    marginHorizontal: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
   bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  bannerText: {
    color: colors.white(),
    fontSize: 16,
    fontFamily: fontType['Pop-SemiBold'],
  },
  categorySectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: colors.greenMint(0.2),
    minHeight: 100,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontType['Pop-SemiBold'],
    color: colors.black(),
    marginBottom: 12,
  },
  recommendedContainer: {
    marginTop: 15,
  },
  horizontalScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  recommendedCard: {
    width: 170,
    marginRight: 15,
    backgroundColor: colors.white(),
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    paddingBottom: 10,
  },
  recommendedImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  recommendedTitle: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    marginTop: 8,
    marginHorizontal: 10,
  },
  recommendedDuration: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    marginTop: 4,
    marginHorizontal: 10,
  },
  tipContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.lightBlue(),
  },
  tipIcon: {
    fontSize: 28,
    marginRight: 12,
    color: colors.blueMain(),
  },
  tipText: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.black(),
    flex: 1,
    lineHeight: 20,
  },
  popularContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
  },
  popularTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  popularTitle: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
  },
  popularViews: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  searchResultsContainer: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchResultsText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    textAlign: 'center',
  },
});

const searchBarStyles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
    backgroundColor: colors.extraLightGrey(),
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  input: {
    flex: 1,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.black(),
  },
  button: {
    backgroundColor: colors.greenMint(),
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: 3,
  },
});