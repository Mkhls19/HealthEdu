import React, { useRef, useCallback } from 'react'; // Ditambahkan useRef, useCallback
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native'; // Ditambahkan Animated
import { colors, fontType } from '../../theme';
import { useFocusEffect } from '@react-navigation/native'; // Ditambahkan useFocusEffect

const Bookmark = () => {
  const bookmarkedArticles = [
    { id: 1, title: '5 Manfaat Olahraga Pagi', category: 'Olahraga dan Kebugaran' },
    { id: 2, title: 'Cara Mengatasi Stres', category: 'Kesehatan Mental' },
    { id: 3, title: '10 Makanan Sehat untuk Jantung', category: 'Nutrisi dan Diet' },
  ];

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
        // Opsional: Logika cleanup jika diperlukan
      };
    }, [fadeAnim])
  );

  return (
    // Bungkus dengan Animated.View dan terapkan opacity [cite: 10, 15]
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Artikel Tersimpan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {bookmarkedArticles.length > 0 ? (
          bookmarkedArticles.map(item => (
            <View key={item.id} style={styles.bookmarkItem}>
              <Text style={styles.bookmarkTitle}>{item.title}</Text>
              <Text style={styles.bookmarkCategory}>{item.category}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada artikel yang disimpan.</Text>
          </View>
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
    marginTop:30, // Sesuaikan dengan kebutuhan UI Anda
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1, // Penting agar emptyContainer bisa di tengah
  },
  bookmarkItem: {
    backgroundColor: colors.extraLightGrey(),
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    marginBottom: 5,
  },
  bookmarkCategory: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  emptyContainer: {
    flex: 1, // Memastikan mengambil sisa ruang jika scrollContainer memiliki flexGrow:1
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 50, // Bisa dihapus atau disesuaikan jika flex:1 sudah cukup
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.grey(),
  },
});

export default Bookmark;