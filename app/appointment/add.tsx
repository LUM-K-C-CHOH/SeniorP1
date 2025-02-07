import React from 'react';
import Animated from 'react-native-reanimated';
import Header from '@/app/layout/header';
import AppointmentForm from '@/app/appointment/appointment-form';

import { Stack } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function AppointmentAddScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <AppointmentForm />
    </SafeAreaView>
  );
}