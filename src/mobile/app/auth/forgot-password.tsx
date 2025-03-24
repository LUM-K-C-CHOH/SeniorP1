import React, { useState, useContext } from 'react';
import CustomButton from '@/components/CustomButton';

import ApplicationContext from '@/context/ApplicationContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import { Colors } from '@/config/constants';
import { useTranslation } from 'react-i18next';
import { showToast, validateEmail } from '@/utils';
import { LeftArrowIcon } from '@/utils/svgs';
import { useRouter } from 'expo-router';
import { sendVerificationCode } from '@/services/auth';
import { TResponse } from '@/@types';

export default function ForgotPasswordScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const theme = useColorScheme();
  const router = useRouter();

  const { t } = useTranslation();

  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  const { appState, setAppState } = useContext(ApplicationContext);

  const handleSendVerifyCode = async (): Promise<void> => {
    let errors: {[k: string]: string} = {};

    if (email.length === 0) {
      errors['email'] = t('message.alert_input_email');
    }

    if (email.length > 0 && !validateEmail(email)) {
      errors['email'] = t('message.alert_input_valid_email');
    }

    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    setAppState({
      ...appState,
      lockScreen: true
    });

    const ret = await sendVerificationCode(email);
    setAppState({
      ...appState,
      lockScreen: false
    });
    
    if (ret) {
      showToast(t('message.alert_forgot_password_success'));
    } else {
      showToast(t('message.alert_forgot_password_fail'));
    }
    
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity
        style={styles.backButtonWrapper}
        onPress={() => router.back()}
      >
        <LeftArrowIcon
          color={theme === 'light' ? '#454b60' : '#454b60'}
        />
        <ThemedText
          type="defaultMedium"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
        >
          {t('back')}
        </ThemedText>
      </TouchableOpacity>
      <View style={styles.mainWrapper}>
        <ThemedText
          type="bigTitle"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
          style={styles.titleText}
        >
          {t('auth.forgot_password')}
        </ThemedText>
        <ThemedText
          type="defaultMedium"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
          style={styles.descriptionText}
        >
          {t('auth.text_3')}
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
        <View style={styles.buttonWrapper}>
          <CustomButton
            onPress={handleSendVerifyCode}
            bgColor={'#fa9800'}
          >
            <ThemedText
              type="button"
              darkColor={Colors.dark.defaultButtonText}
              lightColor={Colors.light.defaultButtonText}
            >
              {t('send')}
            </ThemedText>
          </CustomButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
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
  },
  backButtonWrapper: {
    position: 'absolute',
    flexDirection: 'row',
    left: 20,
    top: 50,
    alignItems: 'center',
    columnGap: 10
  }
});