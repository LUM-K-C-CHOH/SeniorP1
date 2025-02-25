/**
 * Main Layout for App
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as globalState from '@/config/global';
import * as Linking from 'expo-linking';
import { PermissionsAndroid, Platform } from 'react-native';

import '@/i18n';
import 'react-native-reanimated';

import {
  View,
  ActivityIndicator,
  AppState,
  AppStateStatus,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ApplicationContextProvider } from '@/context/ApplicationContext';
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
  const [appContext, setAppContext] = React.useState({
    appState: InitialAppState,
    setAppState: (state: IAppState) => setAppState(state),
    logout: async () => await logout(),
  });
  const router = useRouter();
  const path = usePathname();
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    checkAuth();
    requestCallPermission();
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

  const requestCallPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Call Permission',
            message: 'This app needs permission to make emergency calls.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Call functionality may not work correctly.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const makeCall = (phoneNumber: string) => {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Linking.openURL(`telprompt:${phoneNumber}`);
    }
  };

  let tapCount = 0;
  let tapTimeout: NodeJS.Timeout;

  const handleEmergencyPress = () => {
    tapCount++;
    if (tapTimeout) {
      clearTimeout(tapTimeout);
    }
    tapTimeout = setTimeout(() => {
      if (tapCount === 1) {
        makeCall('1234567890'); // Call caregiver
      } else if (tapCount === 2) {
        makeCall('0987654321'); // Call nurse
      } else if (tapCount === 3) {
        makeCall('1122334455'); // Call doctor
      }
      tapCount = 0;
    }, 500);
  };

  const handleEmergencyLongPress = (duration: number) => {
    if (duration >= 5000) {
      makeCall('911'); // Call police
    } else if (duration >= 2000) {
      makeCall('119'); // Call ambulance
    }
  };

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
        <TouchableOpacity
          onPress={handleEmergencyPress}
          onLongPress={() => handleEmergencyLongPress(2000)} // Example duration
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'red',
            padding: 15,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Emergency</Text>
        </TouchableOpacity>
      </ThemeProvider>
    </ApplicationContextProvider>
  );
}
