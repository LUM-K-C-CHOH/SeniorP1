/**
 * Main Layout for App
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as globalState from '@/config/global';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import '@/i18n';
import 'react-native-reanimated';

import {
  View,
  ActivityIndicator,
  AppState,
  AppStateStatus
} from 'react-native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ApplicationContextProvider, IAppContext } from '@/context/ApplicationContext';
import { IAppState } from '@/@types';
import {
  InitialAppState,
  KEY_ACCESS_TOKEN,
  KEY_DB_INITIALIZED,
} from '@/config/constants';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { setupDatabase } from '@/services/db';
import { registerBackgroundDBSyncTask } from '@/tasks/db-sync';
import { registerBackgroundNotificationTask } from '@/tasks/notification';

// if (__DEV__) {
//   require('@/services/mock');
// }

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Load the app state
globalState.loadAppState();

// Set up the local database
getStorageItem(KEY_DB_INITIALIZED)
  .then(async (res: string) => {
    if (res !== 'true') {
      console.log('db setup start');
      await setupDatabase();
      setStorageItem(KEY_DB_INITIALIZED, 'true');
      console.log('db setup end');
    }
  })
  .catch(error => {
    console.error('db setup error', error);
  });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  const router = useRouter();
  const path = usePathname();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const requestPermissions = async () => {
    await Contacts.requestPermissionsAsync();
    await Location.requestForegroundPermissionsAsync();
  }
  
  useEffect(() => {
    const state = globalState.getAppState();
    checkAuth();
    
    if (state.authenticated) {
      requestPermissions();
      registerBackgroundDBSyncTask();
      registerBackgroundNotificationTask();
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [path]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      const state = globalState.getAppState();
      setAppContext({
        ...appContext,
        appState: state
      });
    }
  }, [loaded]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      checkAuth();
    }
  };

  const setAppState = (state: IAppState) => {
    const data = { ...state };
    setAppContext({
      ...appContext,
      appState: data
    });
    
    globalState.saveAppState(data);
  }

  const checkAuth = async (): Promise<void> => {
    const state = globalState.getAppState();
    if (!state.authenticated && path.indexOf('auth') < 0) {
      // console.log(path);
      router.replace('/auth/sign-in');
    } else {
      if (state.authenticated) {
        
      }
    }
  }

  const logout = async (): Promise<void> => {
    setAppState(InitialAppState);
    setStorageItem(KEY_ACCESS_TOKEN, '');
  }

  const [appContext, setAppContext] = useState<IAppContext>({
    appState: globalState.getAppState(),
    setAppState,
    logout,
  });

  useEffect(() => {
    checkAuth();
  }, [appContext]);

  // if (!loaded) {
  //   return null;
  // }
  
  // This code souldn't be placed here. Let's put it into the appropriate place in later.

  // const makeCall = (phoneNumber: string) => {
  //   if (Platform.OS === 'android') {
  //     Linking.openURL(`tel:${phoneNumber}`);
  //   } else {
  //     Linking.openURL(`telprompt:${phoneNumber}`);
  //   }
  // };

  // let tapCount = 0;
  // let tapTimeout: NodeJS.Timeout;

  // const handleEmergencyPress = () => {
  //   tapCount++;
  //   if (tapTimeout) {
  //     clearTimeout(tapTimeout);
  //   }
  //   tapTimeout = setTimeout(() => {
  //     if (tapCount === 1) {
  //       makeCall('1234567890'); // Call caregiver
  //     } else if (tapCount === 2) {
  //       makeCall('0987654321'); // Call nurse
  //     } else if (tapCount === 3) {
  //       makeCall('1122334455'); // Call doctor
  //     }
  //     tapCount = 0;
  //   }, 500);
  // };

  // const handleEmergencyLongPress = (duration: number) => {
  //   if (duration >= 5000) {
  //     makeCall('911'); // Call police
  //   } else if (duration >= 2000) {
  //     makeCall('119'); // Call ambulance
  //   }
  // };

  return (
    <ApplicationContextProvider value={appContext}>
        {appContext.appState.lockScreen&&
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              backgroundColor: '#00000030',
              zIndex: 100,
            }}
          >
            <ActivityIndicator size="large" color="#fe5603" />
          </View>
        }
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
    </ApplicationContextProvider>
  );
}
