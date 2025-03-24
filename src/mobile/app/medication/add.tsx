/**
 * Add Medication Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React from 'react';
import Animated from 'react-native-reanimated';
import Header from '@/app/layout/header';
import MedicationForm from '@/app/medication/medication-form';

import { Stack } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function MedicationAddScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <MedicationForm />
    </SafeAreaView>
  );
}