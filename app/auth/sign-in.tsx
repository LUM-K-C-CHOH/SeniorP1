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
import { Colors } from '@/config/constants';
import { validateEmail } from '@/utils';

export default function SignInScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

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

          await new Promise(resolve => setTimeout(() => resolve(1), 100));

          router.replace('/');
        } else {
          let errors: {[k: string]: string} = {};
          errors['response_error'] = res.message?? '';
          setErrors(errors);
        }
      });
  }, [email, password]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
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