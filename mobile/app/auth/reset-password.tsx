import React, { useState, useEffect } from 'react';
import CustomButton from '@/components/CustomButton';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import {
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
import { LeftArrowIcon } from '@/utils/svgs';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { resetPassword, verifyCode } from '@/services/auth';
import { TResponse } from '@/@types';

export default function VerifyCodeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const theme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  const { t } = useTranslation();

  const [email, setEmail] = useState<string>('happyheartshine727@gmail.com');
  const [codes, setCodes] = useState<string[]>(['', '', '', '']);
  const [codeErrors, setCodeErrors] = useState<string[]>(['', '', '', '']);
  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
  }, [params])

  const handleCodeChange = (index: number, v: string): void => {
    if (v.length > 0 && !isNaN(parseInt(v, 10))) {
      codeErrors[index] = '';
      codes[index] = v;
    } else {
      codes[index] = '';
      codeErrors[index] = 'Invalid Code.';
    }

    setCodes([...codes])
    setCodeErrors([...codeErrors]);
  }

  const handleVerifyCode = (): void => {
    let errors: string[] = ['', '', '', ''];
    let invalidCode = false;
    for (let i = 0; i < codes.length; i++) {
      const c = codes[i];
      if (c.length === 0) {
        errors[i] = 'Invalid Code.';
        invalidCode = true;
      } else {
        errors[i] = '';
      }
    }

    setCodeErrors(errors);
    if (invalidCode) return;

    const code = codes.join('');
    verifyCode(code)
      .then((res: TResponse) => {
        if (res.success) {
          setIsVerified(true);
          setToken(res.data.token);
        } else {
          let errors: {[k: string]: string} = {};
          errors['response_error'] = res.message?? '';
          setErrors(errors);
        }
      });
  }

  const handleResetPassword = (): void => {
    let errors: {[k: string]: string} = {};
    if (newPassword.length === 0) {
      errors['newPassword'] = t('message.alert_input_new_password');
    }

    if (confirmPassword.length === 0) {
      errors['confirmPassword'] = t('message.alert_input_confirm_password');
    }

    if (confirmPassword !== newPassword) {
      errors['confirmPassword'] = t('message.alert_not_match_password');
    }
    
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    resetPassword(newPassword, token)
      .then((res: TResponse) => {
        if (res.success) {
          router.dismissAll();
          router.navigate('/auth/sign-in');
        } else {
          let errors: {[k: string]: string} = {};
          errors['response_error'] = res.message?? '';
          setErrors(errors);
        }
      });
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
      {!isVerified
        ? <View style={styles.mainWrapper}>
            <ThemedText
              type="bigTitle"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
              style={styles.titleText}
            >
              {t('auth.verify_code')}
            </ThemedText>
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
              style={styles.descriptionText}
            >
              {t('auth.text_4')}
            </ThemedText>
            <ThemedText
              type="default"
              darkColor={Colors.dark.grayText}
              lightColor={Colors.light.grayText}
              style={{ textAlign: 'center', marginTop: 10 }}
            >
              {t('auth.text_5')}{' '}{email}
            </ThemedText>
            <View style={styles.formGroup}>
              <View style={styles.controlWrapper}>
                {codes.map((code: string, index: number) =>
                  <ThemedInput
                    key={index}
                    type="default"
                    style={[styles.formControl, codeErrors[index].length > 0&& styles.error]}
                    value={code}
                    onChangeText={v => handleCodeChange(index, v)}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    maxLength={1}
                  />
                )}
              </View>
              {errors.response_error&& 
                <ThemedText
                  type="small"
                  darkColor={Colors.dark.redText}
                  lightColor={Colors.light.redText}
                >
                  {errors.response_error}
                </ThemedText>
              }
            </View>
            <View style={styles.buttonWrapper}>
              <CustomButton
                onPress={handleVerifyCode}
                bgColor={'#fa9800'}
              >
                <ThemedText
                  type="button"
                  darkColor={Colors.dark.defaultButtonText}
                  lightColor={Colors.light.defaultButtonText}
                >
                  {t('next')}
                </ThemedText>
              </CustomButton>
            </View>
          </View>
        : <View style={styles.mainWrapper}>
            <ThemedText
              type="bigTitle"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
              style={styles.titleText}
            >
              {t('auth.reset_password')}
            </ThemedText>
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
              style={styles.descriptionText}
            >
              {t('auth.text_6')}
            </ThemedText>
            <View style={styles.formGroup}>
              <ThemedInput
                style={[errors.newPassword&& styles.error]}
                placeholder="Password"
                value={newPassword}
                onChangeText={v => setNewPassword(v)}
                secureTextEntry
              />
              {errors.newPassword&& 
                <ThemedText
                  type="small"
                  darkColor={Colors.dark.redText}
                  lightColor={Colors.light.redText}
                >
                  {errors.newPassword}
                </ThemedText>
              }
            </View>
            <View style={styles.formGroup}>
              <ThemedInput
                style={[errors.confirmPassword&& styles.error]}
                placeholder="Confrim Password"
                value={confirmPassword}
                onChangeText={v => setConfirmPassword(v)}
                secureTextEntry
              />
              {errors.confirmPassword&& 
                <ThemedText
                  type="small"
                  darkColor={Colors.dark.redText}
                  lightColor={Colors.light.redText}
                >
                  {errors.confirmPassword}
                </ThemedText>
              }
            </View>
            <View style={styles.buttonWrapper}>
              <CustomButton
                onPress={handleResetPassword}
                bgColor={'#fa9800'}
              >
                <ThemedText
                  type="button"
                  darkColor={Colors.dark.defaultButtonText}
                  lightColor={Colors.light.defaultButtonText}
                >
                  {t('save')}
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
      }
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
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
    maxWidth: 310,
    alignSelf: 'center'
  },
  formGroup: {
    marginTop: 20,
  },
  controlWrapper: {
    flexDirection: 'row',
    columnGap: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
  formControl: {
    height: 45,
    width: 45,
    textAlign: 'center'
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