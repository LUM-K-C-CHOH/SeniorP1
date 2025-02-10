/**
 * Edit Medication Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useEffect, useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import Header from '@/app/layout/header';
import MedicationForm from '@/app/medication/medication-form';

import { getMedicationList } from '@/services/medication';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { IMedication, TResponse } from '@/@types';

export default function MedicationEditScreen() {
  const params = useLocalSearchParams();
  const initialRef = useRef<boolean>();

  const [medication, setMedication] = useState<IMedication>()

  useEffect(() => {
    if (initialRef.current) return;
    if (!params.id) return;

    initialRef.current = true;

    getMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          const find = res.data.find((v: IMedication) => v.id === parseInt(params.id as string, 10));
          setMedication(find);
        } else {

        }
      });
  }, []);
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <MedicationForm medication={medication}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  }
});