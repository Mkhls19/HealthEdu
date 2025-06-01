import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { colors, fontType } from '../../theme'; //
import { categories as allCategories } from '../../data'; // Menggunakan data kategori dari data.jsx

const Category = () => {
  const renderCategoryItem = ({ item }) => (
    <Pressable
      style={styles.categoryItem}
      onPress={() => Alert.alert("Kategori Dipilih", `Anda memilih kategori: ${item.name}`)} //
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Semua Kategori</Text>
      </View>
      <FlatList
        data={allCategories} //
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()} //
        numColumns={2} // Tampilan 2 kolom untuk variasi
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fontType['Pop-Bold'], //
    color: colors.black(), //
    marginTop:30,
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.greenMint(0.15), //
    minHeight: 120, // Memberikan tinggi minimum
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32, // Sedikit lebih besar untuk tampilan kategori utama
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'], //
    color: colors.black(), //
    textAlign: 'center',
  },
});

export default Category;