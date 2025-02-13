/**
 * Main Layout for App
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as globalState from '@/config/global';

import '@/i18n';
import 'react-native-reanimated';

import {
  View,
  ActivityIndicator,
  AppState,
  AppStateStatus
} from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApplicationContextProvider, IAppContext } from '@/context/ApplicationContext';
import { IAppState } from '@/@types';
import { InitialAppState, KEY_ACCESS_TOKEN } from '@/config/constants';
import { setStorageItem } from '@/utils/storage';

if (__DEV__) {
  require('@/services/mock');
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

globalState.loadAppState();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const path = usePathname();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    checkAuth();

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

  const checkAuth = (): void => {
    const state = globalState.getAppState();
    if (!state.authenticated && path.indexOf('auth') < 0) {
      console.log(path);
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

  useEffect(() => {
    checkAuth();
  }, [appContext]);

  // if (!loaded) {
  //   return null;
  // }

  return (
    <ApplicationContextProvider value={appContext}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
      </ThemeProvider>
    </ApplicationContextProvider>
  );
}
