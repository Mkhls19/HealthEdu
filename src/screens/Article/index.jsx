// src/screens/Article/index.jsx (atau ArtikelScreen/index.jsx)
import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Platform, // Ditambahkan
} from 'react-native';
import { colors, fontType } from '../../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// Import fungsi Firebase
import { getAllArticlesFirebase } from '../../services/firebase'; // <--- GANTI IMPORT API

// Fungsi format tanggal (bisa dipindah ke utils/formatDate.js jika digunakan di banyak tempat)
const formatDate = (timestamp) => {
  if (!timestamp) return 'Tanggal tidak tersedia';
  try {
    // Firestore timestamp memiliki properti toDate() untuk konversi ke objek Date JavaScript
    const date = timestamp.toDate();
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date from Firebase timestamp:", error);
    // Fallback jika timestamp bukan objek Firestore Timestamp (misalnya, masih data lama)
    try {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) {
        return 'Format tanggal salah';
    }
  }
};

// Pastikan nama komponen ini sesuai dengan yang Anda ekspor dan gunakan di App.jsx
const ArticleScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    try {
      const data = await getAllArticlesFirebase(); // <--- GUNAKAN FUNGSI FIREBASE
      // Tidak perlu sorting manual lagi jika sudah di orderBy di fungsi firebase.js
      // Jika orderBy belum diimplementasikan di firebase.js atau ingin sorting berbeda:
      // const sortedData = data.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setArticles(data); // Langsung set data jika sudah diurutkan dari Firestore
    } catch (error) {
      console.error("Error fetching articles from Firebase:", error);
      Alert.alert('Error', 'Gagal memuat artikel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchArticles();
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
    fetchArticles();
  }, []);

  const renderArticleItem = ({ item }) => (
    <Pressable
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArtikelDetail', { articleId: item.id })}
    >
      <View style={styles.articleTextContainer}>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.articleCategory} numberOfLines={1}>Kategori: {item.category}</Text>
        {/* Pastikan item.createdAt adalah objek Timestamp Firestore atau string ISO yang valid */}
        {item.createdAt && <Text style={styles.articleDate} numberOfLines={1}>{formatDate(item.createdAt)}</Text>}
        {typeof item.totalShares === 'number' && (
          <Text style={styles.articleShares} numberOfLines={1}>Dibagikan: {item.totalShares} kali</Text>
        )}
      </View>
    </Pressable>
  );

  if (loading && articles.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.greenMint()} />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Artikel</Text>
      </View>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        keyExtractor={item => item.id.toString()}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.greenMint()]} />
        }
        ListEmptyComponent={
          !loading && <View style={styles.centered}><Text style={styles.emptyText}>Belum ada artikel.</Text></View>
        }
      />
    </Animated.View>
  );
};

// Styles (gunakan styles yang sudah Anda definisikan sebelumnya, pastikan konsisten)
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
    paddingTop: Platform.OS === 'ios' ? 45 : 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fontType['Pop-Bold'],
    color: colors.black(),
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flexGrow: 1,
  },
  articleCard: {
    backgroundColor: colors.white(),
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: colors.black(0.5),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1, // Tambahkan border tipis agar kartu lebih terlihat
    borderColor: colors.extraLightGrey(0.8),
  },
  articleTextContainer: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 17,
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    marginBottom: 6,
  },
  articleCategory: {
    fontSize: 13,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.greenMint(),
    marginBottom: 4,
  },
  articleDate: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    marginBottom: 4,
  },
  articleShares: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
    textAlign: 'center',
  }
});

// Pastikan nama komponen yang diekspor sesuai dengan yang digunakan di App.jsx dan src/index.jsx
export default ArticleScreen; // Atau 'Article' jika itu nama yang Anda gunakan