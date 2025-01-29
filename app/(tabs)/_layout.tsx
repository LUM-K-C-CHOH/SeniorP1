import React from 'react';
import TabBarBackground from '@/components/ui/TabBarBackground';

import { Tabs } from 'expo-router';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/config/constants';
import { useColorScheme } from '@/hooks/useColorScheme';

import {
  HomeIcon,
  ReminderIcon,
  AppointmentIcon,
  MedicationIcon,
} from '@/utils/assets';

import Header from '@/app/layout/header';

export default function TabLayout() {  

  const colorScheme = useColorScheme();  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
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
            tabBarStyle: { paddingTop: 5 },
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="medication"
          options={{
            tabBarStyle: { paddingTop: 5 },
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <MedicationIcon color={color} width={38} height={38} />,
          }}
        />
        <Tabs.Screen
          name="appointment"
          options={{
            tabBarStyle: { paddingTop: 5 },
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <AppointmentIcon color={color} width={24} height={24} />,
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            tabBarStyle: { paddingTop: 5 },
            tabBarBadge: 2,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <ReminderIcon color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
});
