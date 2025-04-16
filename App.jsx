import React, { useState } from 'react';
import {ScrollView, StyleSheet, Text, View, ImageBackground, TextInput, Pressable} from 'react-native';
import { Home, Notification, Bookmark, Profile, SearchNormal, Layer } from 'iconsax-react-native';
import { bannerData, categories, recommendedData, popularData,dailyTips} from './src/data';

// Theme Configuration
const fontType = {
  'Pop-Regular': 'Poppins-Regular',
  'Pop-SemiBold': 'Poppins-SemiBold',
  'Pjs-Medium': 'PlusJakartaSans-Medium',
  'Pjs-SemiBold': 'PlusJakartaSans-SemiBold',
};

const colors = {
  white: () => '#FFFFFF',
  grey: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
  greenMint: (opacity = 1) => `rgba(0, 200, 150, ${opacity})`,
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);

  const handleBookmark = (articleId) => {
    setBookmarkedArticles(prev => 
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  // Component: Banner Item
  const BannerItem = ({ image, title }) => {
    return (
      <View>
        <ImageBackground source={image} style={styles.bannerImage}>
          <Text style={styles.bannerText}>{title}</Text>
        </ImageBackground>
      </View>
    );
  };

  // Component: Article Card
  const ArticleCard = ({ id, image, title, duration }) => {
    const isBookmarked = bookmarkedArticles.includes(id);

    return (
      <View style={styles.recommendedCard}>
        <ImageBackground source={image} style={styles.recommendedImage}>
          <Pressable 
            style={styles.bookmarkButton} 
            onPress={() => handleBookmark(id)}
          >
            <Bookmark 
              size={20} 
              color={isBookmarked ? colors.greenMint() : colors.white()} 
              variant={isBookmarked ? 'Bold' : 'Linear'}
            />
          </Pressable>
        </ImageBackground>
        <View style={styles.articleContent}>
          <Text style={styles.recommendedTitle}>{title}</Text>
          <Text style={styles.recommendedDuration}>{duration}</Text>
        </View>
      </View>
    );
  };

  // Component: Banner Carousel
  const BannerCarousel = () => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
        {bannerData.map(item => (
          <BannerItem 
            key={item.id} 
            image={item.image} 
            title={item.title}
          />
        ))}
      </ScrollView>
    );
  };

  // Component: Category Grid
  const CategoryGrid = () => {
    return (
      <View style={styles.categoryContainer}>
        {categories.map(item => (
          <View key={item.id} style={styles.categoryItem}>
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </View>
        ))}
      </View>
    );
  };

  const RecommendedContent = () => {
    return (
      <View style={styles.recommendedContainer}>
        <Text style={styles.sectionTitle}>Rekomendasi untuk Anda</Text>
        <View style={styles.recommendedList}>
          {recommendedData.map(item => (
            <ArticleCard 
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              duration={item.duration}
            />
          ))}
        </View>
      </View>
    );
  };

  // Component: Daily Tip
  const DailyTip = () => {
    return (
      <View style={styles.tipContainer}>
        <Text style={styles.sectionTitle}>Tips Sehat Hari Ini</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💧</Text>
          <Text style={styles.tipText}>{dailyTips[0]}</Text>
        </View>
      </View>
    );
  };

  // Component: Popular Content
  const PopularContent = () => {
    return (
      <View style={styles.popularContainer}>
        <Text style={styles.sectionTitle}>Populer Minggu Ini</Text>
        {popularData.map(item => (
          <View key={item.id} style={styles.popularItem}>
            <Text style={styles.popularTitle}>{item.title}</Text>
            <Text style={styles.popularViews}>{item.views} views</Text>
          </View>
        ))}
      </View>
    );
  };

  // Component: Bottom Navigation
  const BottomNavigation = () => {
    return (
      <View style={styles.bottomNavContainer}>
        <Pressable 
          style={activeTab === 'home' ? styles.activeNavButton : styles.navButton} 
          onPress={() => handleTabPress('home')}
        >
          <Home
            size={24} 
            color={activeTab === 'home' ? colors.greenMint() : colors.grey()} 
            variant={activeTab === 'home' ? 'Bold' : 'Linear'}
          />
          <Text style={[
            styles.navText,
            {color: activeTab === 'home' ? colors.greenMint() : colors.grey()}
          ]}>Beranda</Text>
        </Pressable>
        <Pressable 
          style={activeTab === 'categories' ? styles.activeNavButton : styles.navButton} 
          onPress={() => handleTabPress('categories')}
        >
          <Layer 
            size={24} 
            color={activeTab === 'categories' ? colors.greenMint() : colors.grey()} 
            variant={activeTab === 'categories' ? 'Bold' : 'Linear'}
          />
          <Text style={[
            styles.navText,
            {color: activeTab === 'categories' ? colors.greenMint() : colors.grey()}
          ]}>Kategori</Text>
        </Pressable>
        <Pressable 
          style={activeTab === 'bookmarks' ? styles.activeNavButton : styles.navButton} 
          onPress={() => handleTabPress('bookmarks')}
        >
          <Bookmark 
            size={24} 
            color={activeTab === 'bookmarks' ? colors.greenMint() : colors.grey()} 
            variant={activeTab === 'bookmarks' ? 'Bold' : 'Linear'}
          />
          <Text style={[
            styles.navText,
            {color: activeTab === 'bookmarks' ? colors.greenMint() : colors.grey()}
          ]}>Bookmark</Text>
        </Pressable>
        <Pressable 
          style={activeTab === 'profile' ? styles.activeNavButton : styles.navButton} 
          onPress={() => handleTabPress('profile')}
        >
          <Profile 
            size={24} 
            color={activeTab === 'profile' ? colors.greenMint() : colors.grey()} 
            variant={activeTab === 'profile' ? 'Bold' : 'Linear'}
          />
          <Text style={[
            styles.navText,
            {color: activeTab === 'profile' ? colors.greenMint() : colors.grey()}
          ]}>Profil</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>HealthEdu</Text>
        <Notification color={colors.grey()} variant="Linear" size={24} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search" 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <SearchNormal size={20} color={colors.white()} />
        </Pressable>
      </View>

      {/* Main Content */}
      <ScrollView>
        <BannerCarousel />
        <CategoryGrid />
        <RecommendedContent />
        <DailyTip />
        <PopularContent />
      </ScrollView>

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
  searchContainer: {
    marginHorizontal: 24,
    backgroundColor: colors.grey(0.03),
    borderColor: colors.grey(0.2),
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    padding: 10,
    width: '90%',
  },
  searchButton: {
    backgroundColor: colors.greenMint(),
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%', // 3 kolom
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 5,
  },
  recommendedList: {
    marginTop: 10,
  },
  recommendedCard: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.white(),
    elevation: 3,
    shadowColor: colors.grey(),
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedImage: {
    width: '100%',
    aspectRatio: 16/9, // Menjaga aspect ratio gambar
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  bookmarkButton: {
    backgroundColor: colors.grey(0.1),
    borderRadius: 20,
    padding: 5,
    margin: 10,
  },
  articleContent: {
    padding: 10,
  },
  recommendedTitle: {
    fontSize: 12,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.grey(),
    marginBottom: 5,
  },
  recommendedDuration: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(0.6),
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
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
    flex: 1,
  },
  popularContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
    marginBottom: 80,
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
    flex: 1,
  },
  popularViews: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(0.6),
    marginLeft: 10,
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.grey(0.1),
    backgroundColor: colors.white(),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
    padding: 5,
  },
  activeNavButton: {
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.greenMint(),
  },
  navText: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Medium'],
    marginTop: 5,
  },
});