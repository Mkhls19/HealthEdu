import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { colors, fontType } from '../../theme'; //
import { Edit, Setting2, Logout, MessageQuestion } from 'iconsax-react-native';

const Profile = () => {
  const user = {
    name: 'Pengguna HealthEdu',
    email: 'pengguna@example.com',
    // Ganti dengan path ke gambar profil pengguna jika ada, atau gunakan placeholder
    profileImage: require('../../assets/images/article1.jpg'), // Anda perlu menambahkan gambar placeholder ini
  };

  const menuItems = [
    { id: 1, title: 'Edit Profil', icon: <Edit size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Edit Profil akan segera hadir!") }, //
    { id: 2, title: 'Pengaturan', icon: <Setting2 size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Pengaturan akan segera hadir!") }, //
    { id: 3, title: 'Pusat Bantuan', icon: <MessageQuestion size="22" color={colors.grey()}/>, action: () => Alert.alert("Fitur", "Fitur Pusat Bantuan akan segera hadir!") }, //
    { id: 4, title: 'Keluar', icon: <Logout size="22" color={colors.orangeBright()}/>, action: () => Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?") , isDestructive: true}, //
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
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
  profileInfoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey(), //
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 20,
    fontFamily: fontType['Pjs-Bold'], //
    color: colors.black(), //
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: fontType['Pjs-Regular'], //
    color: colors.grey(), //
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.extraLightGrey(0.5), //
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fontType['Pjs-Medium'], //
    color: colors.black(), //
    marginLeft: 15,
  },
  destructiveText: {
    color: colors.orangeBright(), //
  }
});

export default Profile;