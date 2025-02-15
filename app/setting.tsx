/**
 * Setting Screen
 * RTHA
 * 
 * Create by Thornton on 02/14/2025
 */
import React, { useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';

import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { RadioBlankIcon, RadioFilledIcon } from '@/utils/svgs';
import { useTranslation } from 'react-i18next';

import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack } from 'expo-router';
import Header from './layout/header';

export default function SettingScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  const { appState, setAppState } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const handleColorThemeChange = (mode: 'light'|'dark'): void => {
    if (mode === appState.setting.theme) return;
    setAppState({
      ...appState,
      setting: {
        ...appState.setting,
        theme: mode
      }
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <View style={styles.mainWrapper}>
        <View style={styles.rowWrapper}>
          <ThemedText type="title">{t('appearance')}</ThemedText>
        </View>
        <View style={styles.rowWrapper}>        
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => handleColorThemeChange('light')}
          >
            {appState.setting.theme === 'light'
              ? <RadioFilledIcon width={32} height={32} color={'#454b60'} />
              : <RadioBlankIcon width={32} height={32} color={'#aaa'} />
            }
            <ThemedText type="default">{t('light')}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.itemWrapper}
            onPress={() => handleColorThemeChange('dark')}
          >
            {appState.setting.theme === 'dark'
              ? <RadioFilledIcon width={32} height={32} color={'#aaa'} />
              : <RadioBlankIcon width={32} height={32} color={'#454b60'} />
            }
            <ThemedText type="default">{t('dark')}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,   
  },
  mainWrapper: {
    padding: 15
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
    marginTop: 5
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
  }
});