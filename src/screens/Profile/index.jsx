import React, { useRef, useCallback } from 'react'; // Ditambahkan useRef, useCallback
import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView, Animated } from 'react-native'; // Ditambahkan Animated
import { colors, fontType } from '../../theme';
import { Edit, Setting2, Logout, MessageQuestion, AddSquare } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; // Ditambahkan useFocusEffect

const Profile = () => {
  const navigation = useNavigation();
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

  const user = {
    name: 'Pengguna HealthEdu',
    email: 'pengguna@example.com',
    profileImage: require('../../assets/images/article1.jpg'), // Pastikan path ini benar
  };

  const menuItems = [
    { id: 1, title: 'Edit Profil', icon: <Edit size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Edit Profil akan segera hadir!") },
    { id: 2, title: 'Tambah Artikel Baru', icon: <AddSquare size="22" color={colors.grey()}/>, action: () => navigation.navigate('FormArticle') },
    { id: 3, title: 'Pengaturan', icon: <Setting2 size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Pengaturan akan segera hadir!") },
    { id: 4, title: 'Pusat Bantuan', icon: <MessageQuestion size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Pusat Bantuan akan segera hadir!") },
    { id: 5, title: 'Keluar', icon: <Logout size="22" color={colors.orangeBright()}/>, action: () => Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?") , isDestructive: true},
  ];

  return (
    // Bungkus dengan Animated.View dan terapkan opacity [cite: 10, 15]
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileInfoContainer}>
          <Image source={user.profileImage} style={styles.profileImage} />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <Pressable key={item.id} style={styles.menuItem} onPress={item.action}>
              {item.icon}
              <Text style={[styles.menuItemText, item.isDestructive && styles.destructiveText]}>{item.title}</Text>
            </Pressable>
          ))}
        </View>
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
    paddingBottom: 20, // Agar ada ruang di bawah menu terakhir
  },
  profileInfoContainer: {
    alignItems: 'center',
    paddingVertical: 30, // Cukup ruang di atas dan bawah info profil
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey(),
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Membuat gambar menjadi lingkaran
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontFamily: fontType['Pjs-Bold'],
    color: colors.black(),
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'],
    color: colors.grey(),
  },
  menuContainer: {
    marginTop: 20, // Jarak dari info profil ke menu
    paddingHorizontal: 20, // Padding kiri kanan untuk item menu
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18, // Ketinggian setiap item menu
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey(0.5), // Garis pemisah yang lebih halus
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Medium'],
    color: colors.black(),
    marginLeft: 15, // Jarak dari ikon ke teks
  },
  destructiveText: {
    color: colors.orangeBright(), // Warna khusus untuk aksi destruktif
  }
});

export default Profile;