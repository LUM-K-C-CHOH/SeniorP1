/**
 * Sign In Screen
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useState, useCallback, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import CustomButton from '@/components/CustomButton';

import { Stack, useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { login } from '@/services/auth';
import { TResponse } from '@/@types';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import { useThemeColor } from '@/hooks/useThemeColor';
import {
  Colors,
  KEY_DB_SYNCED,
  KEY_DB_SYNCED_APPOINTMENT,
  KEY_DB_SYNCED_EMERGENCY_CONTACT,
  KEY_DB_SYNCED_FREQUENCY,
  KEY_DB_SYNCED_MEDICATION,
  KEY_DB_SYNCED_NOTIFICATION,
  KEY_DB_SYNCED_SETTING
} from '@/config/constants';
import { validateEmail } from '@/utils';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { userSettingSync } from '@/services/setting';
import { frequencySync, medicationSync } from '@/services/medication';
import { appointmentSync } from '@/services/appointment';
import { emergencyContactSync } from '@/services/emergency';
import { notificationSync } from '@/services/notification';

let lockedSync = false;

export default function SignInScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const [syncDBPopupVisible, setSyncDBPopupVisible] = useState<boolean>(false);

  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const [email, setEmail] = useState<string>('morgan.thornton@bison.howard.edu');
  const [password, setPassword] = useState<string>('123123');
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  const handleSignIn = useCallback(async (): Promise<void> => {
    let errors:{[k: string]: string} = {}
    if (email.length === 0) {
      errors['email'] = t('message.alert_input_email');
    }

    if (email.length > 0 && !validateEmail(email)) {
      errors['email'] = t('message.alert_input_valid_email');
    }

    if (password.length === 0) {
      errors['password'] = t('message.alert_input_password');
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setAppState({
      ...appState,
      lockScreen: true
    });

    login(email, password)
      .then(async (res: TResponse) => {
        if (res.success) {
          setAppState({
            ...appState,
            lockScreen: false,
            authenticated: true,
            user: res.data
          });

          const synced = await getStorageItem(KEY_DB_SYNCED);
          if (synced !== 'true') {
            if (!lockedSync) {
              lockedSync = true;
              console.log('db sync start');
              setSyncDBPopupVisible(true);
              await syncDatabase();
              setSyncDBPopupVisible(false);
              lockedSync = false;
              console.log('db sync end');
            }
          } else {
            console.log('already synced...');
          }

          await new Promise(resolve => setTimeout(() => resolve(1), 100));

          router.replace('/');
        } else {
          let errors: {[k: string]: string} = {};
          errors['response_error'] = res.message?? '';
          setErrors(errors);
        }
      });
  }, [email, password]);

  const syncDatabase = async (): Promise<boolean> => {
    const settingSyncedStatus = await getStorageItem(KEY_DB_SYNCED_SETTING);
    let retSetting = true;
    if (settingSyncedStatus !== 'true') {
      retSetting = await userSettingSync();
      setStorageItem(KEY_DB_SYNCED_SETTING, retSetting ? 'true' : 'false');
    }
  
    const frequencySyncedStatus = await getStorageItem(KEY_DB_SYNCED_FREQUENCY);
    let retFrequency = true;
    if (frequencySyncedStatus !== 'true') {
      retFrequency = await frequencySync();
      setStorageItem(KEY_DB_SYNCED_FREQUENCY, retFrequency ? 'true' : 'false');
    }
  
    const medicationSyncedStatus = await getStorageItem(KEY_DB_SYNCED_MEDICATION);
    let retMedication = true;
    if (medicationSyncedStatus !== 'true') {
      retMedication = await medicationSync();
      setStorageItem(KEY_DB_SYNCED_MEDICATION, retFrequency ? 'true' : 'false');
    }
  
    const appointmentSyncedStatus = await getStorageItem(KEY_DB_SYNCED_APPOINTMENT);
    let retAppointment = true;
    if (appointmentSyncedStatus !== 'true') {
      retAppointment = await appointmentSync();
      setStorageItem(KEY_DB_SYNCED_APPOINTMENT, retAppointment ? 'true' : 'false');
    }
  
    const emergencyContactSyncedStatus = await getStorageItem(KEY_DB_SYNCED_EMERGENCY_CONTACT);
    let retEmergencyContact = true;
    if (emergencyContactSyncedStatus !== 'true') {
      retEmergencyContact = await emergencyContactSync();
      setStorageItem(KEY_DB_SYNCED_EMERGENCY_CONTACT, retEmergencyContact ? 'true' : 'false');
    }
  
    const notificationSyncedStatus = await getStorageItem(KEY_DB_SYNCED_NOTIFICATION);
    let retNotification = true;
    if (notificationSyncedStatus !== 'true') {
      retNotification = await notificationSync();
      setStorageItem(KEY_DB_SYNCED_NOTIFICATION, retNotification ? 'true' : 'false');
    }
  
    let ret = retSetting && retFrequency && retMedication && retAppointment && retEmergencyContact && retNotification;
    setStorageItem(KEY_DB_SYNCED, ret ? 'true' : 'false');
    return ret;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      {/* <Modal
        style={{ position: 'absolute' }}
        transparent={true}
        visible={syncDBPopupVisible}
        onRequestClose={() => setSyncDBPopupVisible(false)}
      >
        <Pressable
          style={styles.popupOverlay}
          onPress={() => setSyncDBPopupVisible(false)}
        />
        <ThemedView
          style={[
            styles.popupContainer,
            generateBoxShadowStyle(-2, 4, '#171717', 0.2, 3, 4, '#171717')
          ]}
        >
          <ThemedText>Syncing the databse...</ThemedText>
        </ThemedView>
      </Modal> */}
      <View style={styles.mainWrapper}>
        <ThemedText
          type="bigTitle"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
          style={styles.titleText}
        >
          {t('auth.sign_in')}
        </ThemedText>
        <ThemedText
          type="defaultMedium"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
          style={styles.descriptionText}
        >
          {t('auth.text_1')}
        </ThemedText>
        <View style={styles.formGroup}>
          <ThemedInput
            type="default"
            style={[errors.email&& styles.error]}
            placeholder="Email"
            value={email}
            onChangeText={v => setEmail(v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email&& 
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.email}
            </ThemedText>
          }
        </View>
        <View style={styles.formGroup}>
          <ThemedInput
            style={[errors.password&& styles.error]}
            placeholder="Password"
            value={password}
            onChangeText={v => setPassword(v)}
            secureTextEntry
          />
          {errors.password&& 
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.password}
            </ThemedText>
          }
        </View>
        <View
          style={[
            styles.linkWrapper, { justifyContent: 'flex-end' }
          ]}
        >
          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
              style={{ fontWeight: 600 }}
            >
              {t('auth.forgot_password')}{'?'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonWrapper}>
          <CustomButton
            onPress={handleSignIn}
            bgColor={'#fa9800'}
          >
            <ThemedText
              type="button"
              darkColor={Colors.dark.defaultButtonText}
              lightColor={Colors.light.defaultButtonText}
            >
              {t('auth.login')}
            </ThemedText>
          </CustomButton>
        </View>
        {errors.response_error&& 
          <View style={styles.errorWrapper}>
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.response_error}
            </ThemedText>
          </View>
        }
      </View>
      <View style={{ marginTop: 30 }}>
        <View style={styles.linkWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.darkGrayText}
            lightColor={Colors.light.darkGrayText}
            style={{ fontWeight: 400 }}
          >
            {t('auth.no_account')}{'? '}
          </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/auth/sign-up')}> 
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
            >
              {t('auth.register')}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View style={styles.linkWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.darkGrayText}
            lightColor={Colors.dark.darkGrayText}
            style={{ fontWeight: 400 }}
          >
            {t('need_help')}?
          </ThemedText>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.darkGrayText}
            lightColor={Colors.dark.darkGrayText}
            style={{ fontWeight: 400 }}
          >
            {t('check')}
          </ThemedText>
          <TouchableOpacity onPress={() => {}}>
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
              style={{ fontWeight: 600 }}
            >
              {t('support')}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  mainWrapper: {
   
  },
  titleText: {
    textAlign: 'center'
  },
  descriptionText: {
    textAlign: 'center',
    marginTop: 30,
  },
  formGroup: {
    marginTop: 20,
  },
  error: {
    borderColor: 'red',
  },
  errorWrapper: {
    alignItems: 'center',
    marginTop: 10
  },
  linkWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    justifyContent: 'center',
    marginTop: 10
  },
  buttonWrapper: {
    marginTop: 20
  }
});