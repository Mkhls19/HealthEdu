import React, { useRef, useCallback } from 'react'; // Ditambahkan useRef, useCallback
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Animated } from 'react-native'; // Ditambahkan Animated
import { colors, fontType } from '../../theme';
import { categories as allCategories } from '../../data'; // Pastikan data ini tersedia dan benar
import { useFocusEffect } from '@react-navigation/native'; // Ditambahkan useFocusEffect

const Category = () => {
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
        // Opsional: Logika cleanup
      };
    }, [fadeAnim])
  );

  const renderCategoryItem = ({ item }) => (
    <Pressable
      style={styles.categoryItem}
      onPress={() => Alert.alert("Kategori Dipilih", `Anda memilih kategori: ${item.name}`)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </Pressable>
  );

  return (
    // Bungkus dengan Animated.View dan terapkan opacity [cite: 10, 15]
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Semua Kategori</Text>
      </View>
      <FlatList
        data={allCategories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  listContainer: {
    paddingHorizontal: 10, // Memberi jarak dari tepi layar
    paddingVertical: 20,
  },
  categoryItem: {
    flex: 1, // Agar item mengambil ruang yang sama dalam kolom
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10, // Jarak antar item
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.greenMint(0.15),
    minHeight: 120,
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
    fontSize: 32,
    marginBottom: 10,
    // Jika ikon berupa karakter/emoji, pastikan font mendukungnya
  },
  categoryName: {
    fontSize: 14,
    fontFamily: fontType['Pjs-SemiBold'],
    color: colors.black(),
    textAlign: 'center',
  },
});

export default Category;