/**
 * Main Layout of Tab Screens
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useContext } from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';
import ApplicationContext from '@/context/ApplicationContext';

import { Tabs } from 'expo-router';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/config/constants';

import {
  HomeIcon,
  ReminderIcon,
  AppointmentIcon,
  MedicationIcon,
} from '@/utils/svgs';

import Header from '@/app/layout/header';

export default function TabLayout() {
  const { appState } = useContext(ApplicationContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[appState.setting.theme].tint,
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
            tabBarBadge: 2,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <View style={{ marginTop: 5 }}><ReminderIcon color={color} /></View>,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
