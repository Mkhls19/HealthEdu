// src/screens/Bookmark/index.jsx
import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { colors, fontType } from '../../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// Import fungsi Firebase
import { getBookmarkedArticlesFirebase } from '../../services/firebase'; 

// Fungsi format tanggal (konsisten dengan ArtikelDetailScreen)
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
    // Fallback
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

// Ganti nama komponen jika Anda sebelumnya menggunakan 'Bookmark'
const BookmarkScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookmarkedArticles = async () => {
    try {
      const data = await getBookmarkedArticlesFirebase(); // <--- GUNAKAN FUNGSI FIREBASE
      // Sorting sudah dihandle di firebase.js (orderBy createdAt desc)
      setBookmarkedArticles(data);
    } catch (error) {
      console.error("Error fetching bookmarked articles from Firebase:", error);
      Alert.alert('Error', 'Gagal memuat artikel yang disimpan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookmarkedArticles();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return () => {};
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookmarkedArticles();
  }, []);

  const renderBookmarkItem = (item) => (
    <Pressable
      key={item.id}
      style={styles.bookmarkItem}
      onPress={() => {
        navigation.navigate('ArtikelTab', {
          screen: 'ArtikelDetail',
          params: { articleId: item.id },
        });
      }}
    >
      <Text style={styles.bookmarkTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.bookmarkCategory}>Kategori: {item.category}</Text>
      {item.createdAt && <Text style={styles.bookmarkDate}>{formatDate(item.createdAt)}</Text>}
    </Pressable>
  );

  // Sisa kode JSX dan Styles tetap sama seperti versi terakhir Anda
  // ... (kode JSX dan Styles dari respons Anda sebelumnya) ...
  if (loading && bookmarkedArticles.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.greenMint()} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Artikel Tersimpan</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.greenMint()]} />
        }
      >
        {bookmarkedArticles.length > 0 ? (
          bookmarkedArticles.map(item => renderBookmarkItem(item))
        ) : (
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Belum ada artikel yang Anda simpan.</Text>
            </View>
          )
        )}
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
  },
  header: {
    backgroundColor: colors.white(),
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(),
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fontType['Pop-Bold'],
    color: colors.black(),
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
  },
  bookmarkItem: {
    backgroundColor: colors.extraLightGrey(0.5),
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGrey(),
  },
  bookmarkTitle: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    marginBottom: 5,
  },
  bookmarkCategory: {
    fontSize: 13,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    marginBottom: 3,
  },
  bookmarkDate: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Light'],
    color: colors.grey(0.8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
    textAlign: 'center',
  },
});


export default BookmarkScreen;