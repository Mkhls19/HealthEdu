import React from 'react';
<<<<<<< HEAD
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen, Bookmark, Kategori, Profile } from './src';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            // Atur ikon untuk masing-masing tab
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Kategori') {
              // Ganti ikon untuk Kategori di sini
              iconName = focused ? 'apps' : 'apps-outline'; // Contoh: ikon grid
            } else if (route.name === 'Bookmark') {
              iconName = focused ? 'bookmark' : 'bookmark-outline'; // Disesuaikan agar jadi filled
            } else if (route.name === 'Profil') {
              // Ganti ikon untuk Profil di sini
              iconName = focused ? 'person-circle' : 'person-circle-outline'; // Contoh: ikon orang
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Kategori" component={Kategori} />
        <Tab.Screen name="Bookmark" component={Bookmark} />
        <Tab.Screen name="Profil" component={Profile} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
=======
import {Platform} from 'react-native'; // Import Platform
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Impor tema jika digunakan di tabBar (opsional, sesuaikan jika perlu)
import {fontType, colors} from './src/theme';

// Impor layar-layar Anda, pastikan ArticleForm sudah diekspor dari ./src/index.jsx
import {HomeScreen, Bookmark, Kategori, Profile, ArticleForm} from './src';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Menggunakan satu Stack untuk konsistensi

// Stack Navigator untuk Tab Profil
function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain" // Beri nama yang jelas untuk layar Profile utama
        component={Profile}
        options={{headerShown: false}} // Sembunyikan header default untuk Profile di stack
      />
      <Stack.Screen
        name="FormArticle" // Nama ini yang akan digunakan untuk navigasi
        component={ArticleForm}
        options={{
          title: 'Kembali',
          headerShown: true, // Tampilkan header untuk form
          headerStyle: {
            backgroundColor: colors.white(), // Sesuaikan dengan tema
            elevation: 1, // Bayangan tipis untuk Android
            shadowOpacity: 0.1, // Bayangan tipis untuk iOS
          },
          headerTintColor: colors.black(), // Warna tombol back dan judul
          headerTitleStyle: {
            fontFamily: fontType['Pop-Bold'], // Gunakan fontType
            fontSize: 18, // Sesuaikan ukuran
          },
          // Kamu bisa menambahkan tombol back kustom jika diperlukan
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Kategori') {
              iconName = focused ? 'apps' : 'apps-outline';
            } else if (route.name === 'Bookmark') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (route.name === 'Profil') {
              // Nama tab adalah "Profil", yang merender ProfileStackScreen
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.greenMint(), // Menggunakan warna dari theme
          tabBarInactiveTintColor: colors.grey(),   // Menggunakan warna dari theme
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: fontType['Pjs-Medium'], // Menggunakan fontType dari theme
            marginBottom: Platform.OS === 'ios' ? 0 : 5,
          },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 80 : 60,
            paddingTop: 5,
            backgroundColor: colors.white(), // Menggunakan warna dari theme
            borderTopWidth: 1,
            borderTopColor: colors.lightGrey(), // Menggunakan warna dari theme
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Kategori" component={Kategori} />
        <Tab.Screen name="Bookmark" component={Bookmark} />
        <Tab.Screen name="Profil" component={ProfileStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> 802ae13 ([BAB 5] NAVIGATION)
