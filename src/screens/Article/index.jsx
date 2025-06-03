// src/screens/ArtikelScreen/index.jsx
import React, { useRef, useCallback, useState } from 'react'; // useEffect dihapus karena useFocusEffect sudah mencakup
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
  Animated,
  // Image, // Dihilangkan jika tidak ada gambar artikel
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, fontType } from '../../theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
// Import fungsi getAllArticles dari layanan API kita
import { getAllArticles } from '../../services/api'; // <--- PERUBAHAN DI SINI

// Fungsi format tanggal sederhana (bisa dipindah ke utils jika digunakan di banyak tempat)
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
    return 'Format tanggal salah';
  }
};

const ArtikelScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArticles = async () => {
    // Tidak perlu setLoading(true) di sini jika sudah diatur oleh useFocusEffect
    // atau pemicu awal. Untuk refresh, setRefreshing(true) sudah cukup.
    try {
      // Menggunakan fungsi getAllArticles dari api.js
      const data = await getAllArticles(); // <--- PERUBAHAN DI SINI
      // Urutkan dari yang terbaru berdasarkan createdAt
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setArticles(sortedData);
    } catch (error) {
      console.error("Error fetching articles:", error);
      Alert.alert('Error', 'Gagal memuat artikel.');
    } finally {
      setLoading(false); // Pastikan loading di-set false setelah fetch
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading true di awal fokus
      fetchArticles();
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return () => {};
    }, []) // Dependency array kosong agar fetchArticles dipanggil saat fokus
          // dan tidak bergantung pada fadeAnim untuk re-fetch.
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
      {/* Jika Anda memutuskan untuk memiliki field 'image' di MockAPI (meski kosong atau URL placeholder),
          Anda bisa menampilkan komponen Image di sini. Jika tidak, bagian ini bisa dihilangkan.
      {item.image && ( // Tampilkan gambar jika ada URL
        <Image source={{ uri: item.image }} style={styles.articleImage} resizeMode="cover" />
      )}
      */}
      <View style={styles.articleTextContainer}>
        <Text style={styles.articleTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.articleCategory} numberOfLines={1}>{item.category}</Text>
        {item.createdAt && <Text style={styles.articleDate} numberOfLines={1}>{formatDate(item.createdAt)}</Text>}
        {/* Menampilkan totalShares jika ada */}
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
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fontType['Pop-Bold'],
    color: colors.black(),
    marginTop: Platform.OS === 'ios' ? 30 : 20, // Penyesuaian margin atas
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
    shadowOffset: { width: 0, height: 1 }, // Penyesuaian shadow
    shadowOpacity: 0.05, // Penyesuaian shadow
    shadowRadius: 2, // Penyesuaian shadow
    // Hapus overflow: 'hidden' jika tidak ada gambar agar shadow terlihat lebih baik di iOS
  },
  // Hapus style articleImage jika tidak ada gambar
  // articleImage: {
  //   width: '100%',
  //   height: 180,
  //   borderTopLeftRadius: 12, // Jika ada gambar dan overflow hidden dihilangkan
  //   borderTopRightRadius: 12, // Jika ada gambar dan overflow hidden dihilangkan
  // },
  articleTextContainer: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 17, // Sedikit diperbesar
    fontFamily: fontType['Pjs-Bold'], // Font lebih tebal untuk judul
    color: colors.black(),
    marginBottom: 6,
  },
  articleCategory: {
    fontSize: 13,
    fontFamily: fontType['Pjs-Medium'], // Medium untuk kategori
    color: colors.greenMint(),
    marginBottom: 4,
  },
  articleDate: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'], // Regular untuk tanggal
    color: colors.grey(),
    marginBottom: 4,
  },
  articleShares: { // Style untuk totalShares
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  }
});

export default ArtikelScreen;