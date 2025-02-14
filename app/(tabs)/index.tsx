/**
 * index.tsx
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useContext } from 'react';
import Animated from 'react-native-reanimated';
import ApplicationContext from '@/context/ApplicationContext';

import { StyleSheet, SafeAreaView, View, TouchableOpacity, useColorScheme } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { Colors } from '@/config/constants';
import { ThemedView } from '@/components/ThemedView';
import { generateBoxShadowStyle } from '@/utils';
import { AppointmentIcon, MedicationIcon, ReminderOutlineIcon, StoreIcon, WalkIcon } from '@/utils/svgs';

export default function DashboardScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const theme = useColorScheme();
  
  const { t } = useTranslation();
  const { appState } = useContext(ApplicationContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Animated.ScrollView>
        <View style={styles.titleContainer}>
          <ThemedText type="title">{t('dashboard.welcome_back')}</ThemedText>
          <ThemedText
            type="default"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
          >
            {t('dashboard.hi')}{', '}{appState.user?.name}
          </ThemedText>
        </View>
        <View style={styles.rowWrapper}>
          <ThemedView
            darkColor={'#fff'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#fafafa'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <StoreIcon color={theme === 'light' ? '#8a8a8a' : '#8a8a8a'} />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.medication_store')}
              </ThemedText>
            </View>
          </ThemedView>
          <ThemedView
            darkColor={'#fff'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#fafafa'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <AppointmentIcon
                  width={14}
                  height={14}
                  color={theme === 'light' ? '#8a8a8a' : '#8a8a8a'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.todays_appointments')}
              </ThemedText>
            </View>
          </ThemedView>
        </View>
        <View style={styles.rowWrapper}>
          <ThemedView
            darkColor={'#fff'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#fafafa'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <MedicationIcon
                  width={23}
                  height={23}
                  color={theme === 'light' ? '#8a8a8a' : '#8a8a8a'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.todays_medications')}
              </ThemedText>
            </View>
          </ThemedView>
          <ThemedView
            darkColor={'#fff'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#fafafa'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <ReminderOutlineIcon
                  color={theme === 'light' ? '#8a8a8a' : '#8a8a8a'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.refill_reminders')}
              </ThemedText>
            </View>
          </ThemedView>
        </View>
      </Animated.ScrollView>
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => router.push('/emergency')}
        >
          <ThemedText
            type="button"
            darkColor={Colors.dark.defaultButtonText}
            lightColor={Colors.light.defaultButtonText}
          >
            {t('dashboard.alert_emergency')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10
  },
  titleContainer: {
    rowGap: 2,
    marginLeft: 10
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    marginTop: 10
  },
  
  emergencyButton: {
    backgroundColor: '#da1d1d',
    width: 235,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45
  },
  actionWrapper: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15
  }
});

const cstyles = StyleSheet.create({
  container: {
    width: '46%',
    height: 210,
    marginLeft: 10
  },
  topWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    padding: 5
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    width: 100
  }
  
});