/**
 * Edit Medication Screen
 * RTHA
 * 
 * Created by Thornton on 01/28/2025
 */
import React, { useEffect, useState, useRef } from 'react';
import Header from '@/app/layout/header';
import MedicationForm from '@/app/medication/medication-form';

import { getMedicationList } from '@/services/medication';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
} from 'react-native';
import { IMedication, TResponse } from '@/@types';

export default function MedicationEditScreen() {
  const params = useLocalSearchParams();
  const initiatedRef = useRef<boolean>(false);

  const [medication, setMedication] = useState<IMedication>()

  useEffect(() => {
    if (initiatedRef.current) return;
    if (!params.id) return;

    initiatedRef.current = true;

    getMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          const find = res.data.find((v: IMedication) => v.id === parseInt(params.id as string, 10));
          console.log("find---------------", find);
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