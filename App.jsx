import React, { useEffect } from 'react'; // Ditambahkan useEffect
import {Platform, PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native'; // Ditambahkan import notifee

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

// Fungsi untuk mendaftarkan aplikasi dengan FCM dan mendapatkan token
async function registerAppWithFCM() {
  try {
    // Meminta izin notifikasi POST_NOTIFICATIONS untuk Android 13+
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted.');
      } else {
        console.warn('Notification permission denied.');
      }
    }

    // Hanya mendaftarkan jika aplikasi belum terdaftar untuk pesan jarak jauh
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging().registerDeviceForRemoteMessages();
      console.log('Device registered for remote messages.');
    } else {
      console.log('Device already registered for remote messages.');
    }

    const token = await messaging().getToken();
    console.log('FCM token from App.jsx:', token); // Token FCM akan tampil di konsol Metro
  } catch (error) {
    console.error("Error during FCM setup or token retrieval in App.jsx:", error);
  }
}

// Panggil fungsi pendaftaran FCM saat aplikasi dimulai
registerAppWithFCM();

// Handler untuk pesan background/quit state (harus di luar komponen React)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // Membuat channel notifikasi jika belum ada
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  // Menampilkan notifikasi menggunakan Notifee
  notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // Pastikan ikon ini ada di drawable/mipmap
      color: colors.greenMint(), // Gunakan warna heksadesimal jika perlu, contoh: '#00C896'
    },
  });
});


// Stack Navigator untuk Tab Profil
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
          title: 'Kembali',
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
        }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator BARU untuk Tab Artikel
function ArticleStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        // Opsi default untuk semua layar di stack ini
      }}>
      <Stack.Screen
        name="ArtikelList"
        component={Article}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ArtikelDetail"
        component={ArticleDetail}
        options={{
          headerShown: false,}}
          />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Listener untuk pesan saat aplikasi di foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Message received in foreground!', remoteMessage);

      // Membuat channel notifikasi jika belum ada
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      // Menampilkan notifikasi menggunakan Notifee
      notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher', // Pastikan ikon ini ada di drawable/mipmap
          color: colors.greenMint(), // Gunakan warna heksadesimal jika perlu, contoh: '#00C896'
        },
      });
    });

    // Listener saat notifikasi dibuka dari background/quit state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // Anda bisa menambahkan navigasi ke layar tertentu di sini
    });

    // Periksa apakah aplikasi dibuka dari notifikasi saat aplikasi ditutup (quit state)
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // Anda bisa menambahkan navigasi ke layar tertentu di sini
        }
      });

    return unsubscribe; // Cleanup listener saat komponen unmount
  }, []); // useEffect ini hanya berjalan sekali saat komponen App di-mount

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'ArtikelTab') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Bookmark') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            } else if (route.name === 'ProfilTab') {
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
        <Tab.Screen
          name="ArtikelTab"
          component={ArticleStackScreen}
          options={{ tabBarLabel: 'Artikel' }}
        />
        <Tab.Screen name="Bookmark" component={Bookmark} />
        <Tab.Screen
          name="ProfilTab"
          component={ProfileStackScreen}
          options={{ tabBarLabel: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
