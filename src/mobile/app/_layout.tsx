/**
 * Main Layout for App
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
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
      await setStorageItem(KEY_DB_INITIALIZED, 'true');
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

    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      
      setAppContext({
        ...appContext,
        appState: state
      });
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [path, loaded]);

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
    console.log('check auth...', state.authenticated, path);
    if (!state.authenticated && path.indexOf('auth') < 0) {
      router.replace('/auth/sign-in');
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

  return (
    <ApplicationContextProvider value={appContext}>
        {appContext.appState.lockScreen &&
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