/**
 * index.tsx
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useEffect, useState, useContext, useCallback } from 'react';
import Animated from 'react-native-reanimated';
import ApplicationContext from '@/context/ApplicationContext';
import dayjs from 'dayjs';

import {
  ProgressChart,
} from 'react-native-chart-kit';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/config/constants';
import { ThemedView } from '@/components/ThemedView';
import { generateBoxShadowStyle } from '@/utils';
import {
  AppointmentIcon,
  MedicationIcon,
  ReminderOutlineIcon,
  StoreIcon
} from '@/utils/svgs';
import { getTodayAppointmentList } from '@/services/appointment';
import { IAppointment, IMedication, TResponse } from '@/@types';
import {
  getRefillMedicationList,
  getTodayMedicationList,
  getMedicationSufficient
} from '@/services/medication';

export default function DashboardScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  
  const { t } = useTranslation();
  const { appState } = useContext(ApplicationContext);

  const [initiated, setInitiated] = useState<boolean>(false);
  const [appointmentList, setAppointmentList] = useState<IAppointment[]>([]);
  const [medicationList, setMedicationList] = useState<IMedication[]>([]);
  const [refillMedicationList, setRefillMedicationList] = useState<IMedication[]>([]);
  const [medicationSufficient, setMedicationSufficient] = useState<number>(0);

  useFocusEffect(   
    useCallback(() => {
      setInitiated(false);
    }, [])
  );

  useEffect(() => {
    if (initiated) return;
    
    setInitiated(true);

    Promise.all([
      getTodayAppointmentList(),
      getTodayMedicationList(),
      getRefillMedicationList(),
      getMedicationSufficient()
    ]).then((results: TResponse[]) => {
      if (results[0].success) {
        setAppointmentList(results[0].data);
      }

      if (results[1].success) {
        setMedicationList(results[1].data);
      }

      if (results[2].success) {
        setRefillMedicationList(results[2].data);
      }

      if (results[3].success) {
        setMedicationSufficient(results[3].data.sufficient);
      }
    });
  }, []);

  const getTime = (datetimeStr: string): string => {
    return dayjs(datetimeStr).format('hh:mm A');
  }

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
            darkColor={'#222'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#666'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <StoreIcon color={appState.setting.theme === 'light' ? '#8a8a8a' : '#aaa'} />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.medication_store')}
              </ThemedText>
            </View>
            <View style={cstyles.sufficientWrapper}>
              <ProgressChart
                data={{
                  labels: [""],
                  data: [medicationSufficient / 100]
                }}
                width={160}
                height={160}
                strokeWidth={16}
                radius={55}
                chartConfig={{
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientFrom: appState.setting.theme === 'light' ? '#fff' : '#222',
                  backgroundGradientTo: appState.setting.theme === 'light' ? '#fff' : '#222',
                  backgroundGradientToOpacity: 0.5,
                  color: (opacity = 1) => `rgba(7, 181, 7, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false,
                }}
                center={[10, 0]}
                hideLegend={true}
              />
              <View style={{ position: 'absolute' }}>
                <ThemedText
                  type="default"
                  darkColor={Colors.dark.grayText}
                  lightColor={Colors.light.grayText}
                >
                  {t('sufficient')}
                </ThemedText>
                <ThemedText type="bigTitle">{medicationSufficient}%</ThemedText>
              </View>
            </View>
          </ThemedView>
          <ThemedView
            darkColor={'#222'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#666'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <AppointmentIcon
                  width={14}
                  height={14}
                  color={appState.setting.theme === 'light' ? '#8a8a8a' : '#aaa'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.todays_appointments')}
              </ThemedText>
            </View>
            <Animated.ScrollView style={{ marginTop: 5 }}>
              {appointmentList.map((data: IAppointment, index: number) =>
                <View key={index} style={cstyles.appointmentItemWrapper}>
                  <ThemedText
                    type="default"
                  >
                    {getTime(data.scheduledTime)}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    darkColor={Colors.dark.grayText}
                    lightColor={Colors.light.grayText}
                  >
                    {data.name}
                  </ThemedText>
                </View>
              )}
            </Animated.ScrollView>
          </ThemedView>
        </View>
        <View style={styles.rowWrapper}>
          <ThemedView
            darkColor={'#222'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#666'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <MedicationIcon
                  width={23}
                  height={23}
                  color={appState.setting.theme === 'light' ? '#8a8a8a' : '#aaa'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.todays_medications')}
              </ThemedText>
            </View>
            <Animated.ScrollView style={{ marginTop: 5 }}>
              {medicationList.map((data: IMedication, index: number) =>
                <View key={index} style={cstyles.medicationItemWrapper}>
                  <ThemedText type="default">{getTime(`${dayjs().format('YYYY-MM-DD')} ${data.frequency.times[0]}:00`)}</ThemedText>
                  <ThemedText
                    type="small"
                    darkColor={Colors.dark.grayText}
                    lightColor={Colors.light.grayText}
                  >
                    {data.name}
                  </ThemedText>
                </View>
              )}
            </Animated.ScrollView>
          </ThemedView>
          <ThemedView
            darkColor={'#222'}
            lightColor={'#fff'}
            style={[
              cstyles.container,
              generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
            ]}
          >
            <View style={cstyles.topWrapper}>
              <ThemedView 
                darkColor={'#666'}
                lightColor={'#fafafa'}
                style={[
                  cstyles.iconWrapper,
                  generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
                ]}
              >
                <ReminderOutlineIcon
                  color={appState.setting.theme === 'light' ? '#8a8a8a' : '#aaa'}
                />
              </ThemedView>
              <ThemedText
                type="default"
                style={cstyles.titleText}
              >
                {t('dashboard.refill_reminders')}
              </ThemedText>
            </View>
            <Animated.ScrollView style={{ marginTop: 5 }}>
              {refillMedicationList.map((data: IMedication, index: number) =>
                <View key={index} style={cstyles.refillItemWrapper}>
                  <ThemedText
                    type="small"
                    darkColor={Colors.dark.grayText}
                    lightColor={Colors.light.grayText}
                  >
                    {data.name}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    darkColor={'red'}
                    lightColor={'red'}
                    style={{ fontWeight: 600 }}
                  >
                    {data.stock}
                  </ThemedText>
                  <ThemedText type="default">/</ThemedText>
                  <ThemedText type="default">
                    {data.threshold}
                  </ThemedText>
                </View>
              )}
            </Animated.ScrollView>
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
  },
  
});

const cstyles = StyleSheet.create({
  container: {
    width: '46%',
    height: 211,
    marginLeft: 10,
    paddingTop: 5,
    paddingBottom: 10
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
  },
  medicationItemWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  appointmentItemWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  refillItemWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sufficientWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});