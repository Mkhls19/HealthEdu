import React from 'react';
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
} from 'react-native';
import {
  SearchNormal,
  Notification,
  Heart,
  Profile,
  Bookmark,
} from 'iconsax-react-native';
import {fontType, colors} from './src/theme';

// Data Dummy
const bannerData = [
  {id: 1, image: require('./src/assets/banner1.jpg'), title: 'Tips Menjaga Kesehatan di Musim Hujan'},
  {id: 2, image: require('./src/assets/banner1.jpg'), title: 'Pentingnya Vaksinasi untuk Anak'},
  {id: 3, image: require('./src/assets/banner1.jpg'), title: 'Cara Menjaga Kesehatan Mental'},
];

const categories = [
  {id: 1, icon: '👶', name: 'Kesehatan Anak'},
  {id: 2, icon: '👵', name: 'Kesehatan Lansia'},
  {id: 3, icon: '🍎', name: 'Nutrisi dan Diet'},
  {id: 4, icon: '🏋️', name: 'Olahraga dan Kebugaran'},
  {id: 5, icon: '🩺', name: 'Penyakit dan Pencegahan'},
  {id: 6, icon: '🧠', name: 'Kesehatan Mental'},
];

const recommendedData = [
  {id: 1, image: require('./src/assets/article1.jpg'), title: '5 Manfaat Olahraga Pagi', duration: 'Baca 5 menit'},
  {id: 2, image: require('./src/assets/article1.jpg'), title: 'Diet Sehat untuk Pemula', duration: 'Baca 7 menit'},
  {id: 3, image: require('./src/assets/article1.jpg'), title: 'Cara Mengatasi Stres', duration: 'Baca 6 menit'},
];

const popularData = [
  {id: 1, title: '10 Makanan Sehat untuk Jantung', views: '1.2k'},
  {id: 2, title: 'Yoga untuk Pemula', views: '950'},
  {id: 3, title: 'Cara Menjaga Kesehatan Mata', views: '1.5k'},
];

// Komponen Banner/Carousel
const BannerCarousel = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
      {bannerData.map(item => (
        <ImageBackground key={item.id} source={item.image} style={styles.bannerImage}>
          <Text style={styles.bannerText}>{item.title}</Text>
        </ImageBackground>
      ))}
    </ScrollView>
  );
};

// Komponen Kategori Konten
const CategoryGrid = () => {
  return (
    <FlatList
      data={categories}
      numColumns={3}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View style={styles.categoryItem}>
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryName}>{item.name}</Text>
        </View>
      )}
      contentContainerStyle={styles.categoryContainer}
    />
  );
};

// Komponen Konten Rekomendasi Harian
const RecommendedContent = () => {
  return (
    <View style={styles.recommendedContainer}>
      <Text style={styles.sectionTitle}>Rekomendasi untuk Anda</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recommendedData.map(item => (
          <View key={item.id} style={styles.recommendedCard}>
            <Image source={item.image} style={styles.recommendedImage} />
            <Text style={styles.recommendedTitle}>{item.title}</Text>
            <Text style={styles.recommendedDuration}>{item.duration}</Text>
            <Pressable style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Baca Selengkapnya</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Komponen Tips Kesehatan Harian
const DailyTip = () => {
  return (
    <View style={styles.tipContainer}>
      <Text style={styles.sectionTitle}>Tips Sehat Hari Ini</Text>
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💧</Text>
        <Text style={styles.tipText}>Minum 8 gelas air sehari untuk menjaga hidrasi tubuh.</Text>
      </View>
    </View>
  );
};

// Komponen Konten Populer
const PopularContent = () => {
  return (
    <View style={styles.popularContainer}>
      <Text style={styles.sectionTitle}>Populer Minggu Ini</Text>
      <FlatList
        data={popularData}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.popularItem}>
            <Text style={styles.popularTitle}>{item.title}</Text>
            <Text style={styles.popularViews}>{item.views} views</Text>
          </View>
        )}
      />
    </View>
  );
};

// Komponen Footer/Navigasi Bawah
const BottomNavigation = () => {
  return (
    <View style={styles.bottomNavContainer}>
      <Pressable style={styles.navButton}>
        <Heart size={24} color={colors.grey()} />
        <Text style={styles.navText}>Beranda</Text>
      </Pressable>
      <Pressable style={styles.navButton}>
        <Profile size={24} color={colors.grey()} />
        <Text style={styles.navText}>Kategori</Text>
      </Pressable>
      <Pressable style={styles.navButton}>
        <Bookmark size={24} color={colors.grey()} />
        <Text style={styles.navText}>Bookmark</Text>
      </Pressable>
      <Pressable style={styles.navButton}>
        <Profile size={24} color={colors.grey()} />
        <Text style={styles.navText}>Profil</Text>
      </Pressable>
    </View>
  );
};

// Komponen Utama
export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>HealthEdu</Text>
        <Notification color={colors.grey()} variant="Linear" size={24} />
      </View>

      {/* Search Bar */}
      <View style={searchBar.container}>
        <TextInput style={searchBar.input} placeholder="Search" />
        <Pressable style={searchBar.button}>
          <SearchNormal size={20} color={colors.white()} />
        </Pressable>
      </View>

      {/* Banner/Carousel */}
      <BannerCarousel />

      {/* Kategori Konten */}
      <CategoryGrid />

      {/* Konten Rekomendasi Harian */}
      <RecommendedContent />

      {/* Tips Kesehatan Harian */}
      <DailyTip />

      {/* Konten Populer */}
      <PopularContent />

      {/* Footer/Navigasi Bawah */}
      <BottomNavigation />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  header: {
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    elevation: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: fontType['Pop-Regular'],
    color: colors.grey(),
  },
  bannerContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
  },
  bannerImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 10,
  },
  bannerText: {
    color: colors.white(),
    fontSize: 16,
    fontFamily: fontType['Pop-SemiBold'],
  },
  categoryContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.greenMint(0.1),
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
    marginTop: 5,
  },
  recommendedContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontType['Pop-SemiBold'],
    color: colors.grey(),
    marginBottom: 10,
  },
  recommendedCard: {
    width: 200,
    marginRight: 10,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  recommendedTitle: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.grey(),
    marginTop: 5,
  },
  recommendedDuration: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(0.6),
  },
  readMoreButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: colors.greenMint(),
    borderRadius: 5,
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.white(),
  },
  tipContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.greenMint(0.1),
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  tipText: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
  },
  popularContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  popularItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey(0.1),
  },
  popularTitle: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.grey(),
  },
  popularViews: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(0.6),
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.1),
    backgroundColor: colors.greenMint(),
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
    marginTop: 5,
  },
});

const searchBar = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    backgroundColor: colors.grey(0.03),
    borderColor: colors.grey(0.2),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
  },
  input: {
    height: 40,
    padding: 10,
    width: '90%',
  },
  button: {
    backgroundColor: colors.greenMint(),
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});