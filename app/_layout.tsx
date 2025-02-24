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
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

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

if (__DEV__) {
  require('@/services/mock');
}

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

const BACKGROUND_TASK = 'background-fetch';
TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    const appState = globalState.getAppState();
    globalState.saveAppState({ 
      ...appState,
      setting: {
        ...appState.setting,
        theme: 'dark'
      }
     })
    const now = new Date().toISOString();
    console.log(`background task executed at: ${now}`);

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("background task failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackgroundFetchAsync() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    console.log("checking background task status:", status);

    if (status === BackgroundFetch.BackgroundFetchStatus.Denied) {
      console.log("background task is denied. Requesting permission...");
      return;
    }

    if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
      console.log("bacgkround task is restricted.");
      return;
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
    
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
        minimumInterval: 60, // Run every 1 minute
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("background task registered successfully!");
    } else {
      console.log("background task already registered.");
    }
  } catch (error) {
    console.error("failed to register background task:", error);
  }
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK);
}

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

  const checkStatus = async () => {
    const tasks = await TaskManager.getRegisteredTasksAsync();
    console.log("registered tasks:", tasks);
  
    const status = await BackgroundFetch.getStatusAsync();
    console.log("background task status:", status);
  
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK);
    console.log("is background task registered?", isRegistered);
  };
  
  useEffect(() => {
    const state = globalState.getAppState();
    checkAuth();
    
    if (state.authenticated) {
      requestPermissions();
      checkStatus()
        .then(() => {
          registerBackgroundFetchAsync();
        });
      
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
