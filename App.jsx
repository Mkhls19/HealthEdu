import React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'; // Ditambahkan TransitionPresets
import Ionicons from 'react-native-vector-icons/Ionicons';

import {fontType, colors} from './src/theme';
import {
  HomeScreen,
  Bookmark,
  Article, 
  Profile,
  ArticleForm,
  ArticleDetail, 
} from './src'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator untuk Tab Profil (Tetap sama)
function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FormArticle"
        component={ArticleForm}
        options={{
          title: 'Kembali', // Judul di header akan 'Tambah Artikel Baru' dari layar itu sendiri
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white(),
            elevation: 1,
            shadowOpacity: 0.1,
          },
          headerTintColor: colors.black(),
          headerTitleStyle: {
            fontFamily: fontType['Pop-Bold'],
            fontSize: 18,
          },
          // Untuk mengganti teks tombol kembali default, gunakan headerBackTitle
          // headerBackTitle: 'Kembali', // Untuk iOS
          // headerBackTitleVisible: true, // Untuk iOS
        }}
      />
      {/* Tambahkan layar lain yang mungkin dinavigasi dari Profile di sini jika ada */}
    </Stack.Navigator>
  );
}

// Stack Navigator BARU untuk Tab Artikel
function ArticleStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Opsi default untuk semua layar di stack ini
        // headerShown: false, // Bisa di-set di sini atau per layar
      }}>
      <Stack.Screen
        name="ArtikelList" // Nama untuk layar daftar artikel di dalam stack
        component={Article} // Menggunakan komponen ArtikelScreen yang sudah ada
        options={{headerShown: false}} // Header kustom sudah ada di ArtikelScreen
      />
      <Stack.Screen
        name="ArtikelDetail" // Nama untuk layar detail artikel
        component={ArticleDetail}
        options={{
          headerShown: false,}}
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
            } else if (route.name === 'ArtikelTab') { // Nama tab diubah untuk merujuk ke stack
              iconName = focused ? 'newspaper' : 'newspaper-outline'; // Mengganti ikon 'article' dengan 'newspaper'
            } else if (route.name === 'Bookmark') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (route.name === 'ProfilTab') { // Nama tab diubah untuk merujuk ke stack
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.greenMint(),
          tabBarInactiveTintColor: colors.grey(),
          tabBarLabelStyle: {
            fontSize: 10,
            fontFamily: fontType['Pjs-Medium'],
            marginBottom: Platform.OS === 'ios' ? 0 : 5,
          },
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 80 : 60,
            paddingTop: 5,
            backgroundColor: colors.white(),
            borderTopWidth: 1,
            borderTopColor: colors.lightGrey(),
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* Menggunakan ArticleStackScreen untuk tab "Artikel" */}
        <Tab.Screen
          name="ArtikelTab" // Nama tab bisa tetap "Artikel" atau diubah
          component={ArticleStackScreen}
          options={{ tabBarLabel: 'Artikel' }} // Label yang tampil di tab bar
        />
        <Tab.Screen name="Bookmark" component={Bookmark} />
        {/* Menggunakan ProfileStackScreen untuk tab "Profil" */}
        <Tab.Screen
          name="ProfilTab" // Nama tab bisa tetap "Profil" atau diubah
          component={ProfileStackScreen}
          options={{ tabBarLabel: 'Profil' }} // Label yang tampil di tab bar
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}