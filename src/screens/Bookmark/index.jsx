import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, fontType } from '../../theme'; //

const Bookmark = () => {
  // Data dummy untuk artikel yang di-bookmark (bisa diganti dengan data dari state atau API)
  const bookmarkedArticles = [
    { id: 1, title: '5 Manfaat Olahraga Pagi', category: 'Olahraga dan Kebugaran' }, //
    { id: 2, title: 'Cara Mengatasi Stres', category: 'Kesehatan Mental' }, //
    { id: 3, title: '10 Makanan Sehat untuk Jantung', category: 'Nutrisi dan Diet' }, //
  ];

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(), //
  },
  header: {
    backgroundColor: colors.white(), //
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey(), //
    alignItems: 'center', // Pusatkan judul header
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fontType['Pop-Bold'], //
    color: colors.black(), //
    marginTop:30, // Sesuaikan dengan HomeScreen jika diperlukan
  },
  scrollContainer: {
    padding: 20,
  },
  bookmarkItem: {
    backgroundColor: colors.extraLightGrey(), //
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontFamily: fontType['Pjs-SemiBold'], //
    color: colors.black(), //
    marginBottom: 5,
  },
  bookmarkCategory: {
    fontSize: 12,
    fontFamily: fontType['Pjs-Regular'], //
    color: colors.grey(), //
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Medium'], //
    color: colors.grey(), //
  },
});

export default Bookmark;