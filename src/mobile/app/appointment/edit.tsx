/**
 * Edit Appointment Screen
 * RTHA
 * 
 * Created by Morgan on 02/07/2025
 */
import React, { useEffect, useState, useRef, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import Header from '@/app/layout/header';
import AppointmentForm from '@/app/appointment/appointment-form';

import { getAppointmentList } from '@/services/appointment';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
} from 'react-native';
import { IAppointment, TResponse } from '@/@types';

export default function AppointmentEditScreen() {
  const params = useLocalSearchParams();
  const initiatedRef = useRef<boolean>(false);
  
  const { appState } = useContext(ApplicationContext);

  const [appointment, setAppointment] = useState<IAppointment>()

  useEffect(() => {
    if (initiatedRef.current) return;
    if (!params.id) return;
    if (!appState.user?.id) return;

    initiatedRef.current = true;

    getAppointmentList(appState.user.id)
      .then((res: TResponse) => {
        if (res.success) {
          const find = res.data.find((v: IAppointment) => v.id === parseInt(params.id as string, 10));
          setAppointment(find);
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
      <AppointmentForm appointment={appointment}/>      
    </SafeAreaView>
  );
}