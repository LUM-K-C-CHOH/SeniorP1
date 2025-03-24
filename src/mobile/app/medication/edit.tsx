/**
 * Edit Medication Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React, { useEffect, useState, useRef, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
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

  const { appState } = useContext(ApplicationContext);
  
  const [medication, setMedication] = useState<IMedication>()

  useEffect(() => {
    if (initiatedRef.current) return;
    if (!params.id) return;
    if (!appState.user?.id) return;

    initiatedRef.current = true;

    getMedicationList(appState.user.id)
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