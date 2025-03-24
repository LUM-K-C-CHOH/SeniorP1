/**
 * Sign In Screen
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
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
} from '@/config/constants';
import { showToast, validateEmail } from '@/utils';
import { getStorageItem, setStorageItem } from '@/utils/storage';
import { getUserSetting } from '@/services/setting';
import { syncLocalDatabaseWithRemote } from '@/services/sync';
let lockedSync = false;

export default function SignInScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const [syncDBPopupVisible, setSyncDBPopupVisible] = useState<boolean>(false);

  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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

    try {
      const resultLogIn: TResponse = await login(email, password);
      if (resultLogIn.success) {
        const state = {
          ...appState,
          lockScreen: false,
          authenticated: true,
          user: resultLogIn.data
        }
        
        const synced = await getStorageItem(KEY_DB_SYNCED);
        
        if (synced !== 'true') {
          if (!lockedSync) {
            lockedSync = true;
            console.log('db sync start');
            setSyncDBPopupVisible(true);
            await syncLocalDatabaseWithRemote(resultLogIn.data?.id);
            setSyncDBPopupVisible(false);
            lockedSync = false;
            console.log('db sync end');

            const setting = await getUserSetting();

            setAppState({
              ...state,
              user: resultLogIn.data,
              setting: setting
            });
            setStorageItem('USER_ID', resultLogIn.data.id);
          } else {
              setAppState(state);
          }
        } else {
          setAppState(state);
          console.log('already synced...');
        }
        
        await new Promise(resolve => setTimeout(() => resolve(1), 100));
        router.replace('/');
      }
      else {
        setAppState({
          ...appState,
          lockScreen: false
        });
        showToast(t('message.alert_login_fail'));
      }

    } catch (error) {
      setAppState({
        ...appState,
        lockScreen: false
      });
      showToast(t('message.alert_login_fail'));
      console.log(error);
    }  
  }, [email, password]);
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