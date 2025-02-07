/**
 * Emergency Alert Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React from 'react';
import Header from '@/app/layout/header';
import { Stack } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export default function EmergencyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});