/**
 * Main Layout of Tab Screens
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import ApplicationContext from '@/context/ApplicationContext';
import Header from '@/app/layout/header';

import { Tabs, usePathname } from 'expo-router';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Colors, NotificationStatus } from '@/config/constants';

import {
  HomeIcon,
  ReminderIcon,
  AppointmentIcon,
  MedicationIcon,
} from '@/utils/svgs';
import { INotification, TResponse } from '@/@types';
import { getNotificationList } from '@/services/notification';

export default function TabLayout() {
  const initiatedRef = useRef<boolean>(false);

  const { appState } = useContext(ApplicationContext);

  const [unReadNotificationCount, setUnReadNotificationCount] = useState<number>(0);

  const path = usePathname();
  useEffect(() => {
    if (!appState.user?.id) return;

    console.log('Tab layout focused');
    
    getNotificationList(appState.user.id)
      .then((res: TResponse) => {
        if (res.success) {          
          const count = res.data.reduce((acc: number, cur: INotification) => acc + (cur.status === NotificationStatus.PENDING ? 1 : 0), 0);
          setUnReadNotificationCount(count);
        }
      });
  }, [path]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          // tabBarActiveTintColor: Colors[appState.setting.theme].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarInactiveBackgroundColor: appState.setting.theme === 'light' ? '#fff' : '#000',
          tabBarActiveBackgroundColor: appState.setting.theme === 'light' ? '#fff' : '#000',
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            href: '/',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <View style={{ marginTop: 5 }}><HomeIcon color={color} /></View>,
          }}
        />
        <Tabs.Screen
          name="medication"
          options={{
            href: '/medication',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <View style={{ marginTop: 5 }}><MedicationIcon color={color} width={38} height={38} /></View>,
          }}
        />
        <Tabs.Screen
          name="appointment"
          options={{
            href: '/appointment',
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <View style={{ marginTop: 5 }}><AppointmentIcon color={color} width={24} height={24} /></View>,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            href: '/notification',
            tabBarBadge: unReadNotificationCount,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <View style={{ marginTop: 5 }}><ReminderIcon color={color} /></View>,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  popupOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  popupContainer: {
    position: 'absolute',
    top: 40,
    right: 10,
  },
});
