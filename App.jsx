import React from 'react';
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