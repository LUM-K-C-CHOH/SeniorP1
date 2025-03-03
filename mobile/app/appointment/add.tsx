/**
 * Add Appointment Screen
 * RTHA
 * 
 * Created by Thornton on 02/07/2025
 */
import React from 'react';
import Header from '@/app/layout/header';
import AppointmentForm from '@/app/appointment/appointment-form';

import { Stack } from 'expo-router';
import {
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