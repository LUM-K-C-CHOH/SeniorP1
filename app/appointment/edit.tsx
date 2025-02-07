import React, { useEffect, useState, useRef } from 'react';
import Animated from 'react-native-reanimated';
import Header from '@/app/layout/header';
import AppointmentForm from '@/app/appointment/appointment-form';

import { getAppointmentList } from '@/services/appointment';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { IAppointment, TResponse } from '@/@types';

export default function AppointmentEditScreen() {
  const params = useLocalSearchParams();
  const initialRef = useRef<boolean>();

  const [appointment, setAppointment] = useState<IAppointment>()

  useEffect(() => {
    if (initialRef.current) return;
    if (!params.id) return;

    initialRef.current = true;

    getAppointmentList()
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
      <Animated.ScrollView style={styles.container}>
        <AppointmentForm appointment={appointment}/>
      </Animated.ScrollView>
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