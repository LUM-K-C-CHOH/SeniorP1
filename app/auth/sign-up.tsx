/**
 * Sign Up Screen
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React, { useState, useCallback, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import CustomButton from '@/components/CustomButton';
import PhoneInput, {
  ICountry,
  isValidPhoneNumber,
} from 'react-native-international-phone-number';
import Animated from 'react-native-reanimated';

import { Stack, useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Alert
} from 'react-native';
import { register } from '@/services/auth';
import { TResponse } from '@/@types';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedIntput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';
import { showToast, validateEmail } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const theme = useColorScheme();

  const { t } = useTranslation();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<ICountry>();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  const { appState, setAppState } = useContext(ApplicationContext);

  const handleSignUp = useCallback(async () => {
    let errors: {[k: string]: string} = {};
    
    if (name.length === 0) {
      errors['name'] = t('message.alert_input_name');
    }

    if (email.length === 0) {
      errors['email'] = t('message.alert_input_email');
    }

    if (email.length > 0 && !validateEmail(email)) {
      errors['email'] = t('message.alert_input_valid_email');
    }

    if (!country || phone.length === 0) {
      errors['phone'] = t('message.alert_input_phone');
    } 
    
    if (country) {
      let valid = isValidPhoneNumber(phone, country);
      if (!valid) {
        errors['phone'] = t('message.alert_input_valid_phone');
      }
    } else {
      errors['phone'] = t('message.alert_select_country');
    }

    if (password.length === 0) {
      errors['password'] = t('message.alert_input_password');
    }

    if (confirmPassword.length === 0) {
      errors['confirmPassword'] = t('message.alert_input_confirm_password');
    }

    if (confirmPassword !== password) {
      errors['confirmPassword'] = t('message.alert_not_match_password');
    }
    
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;

    let phoneNumber = phone.replaceAll(' ', '');
    let countryCode = country?.callingCode?? '+1';
    try {
      let resultSignUp = await register(name, email, countryCode, phoneNumber, password);
      const state = {
        name: name,
        email: email,
        password: password
      }
      await AsyncStorage.setItem('user', JSON.stringify({ name: name, email: email }));

      if(resultSignUp.success){
        showToast('registered successfully!');
        router.replace('/auth/sign-in');
      }else {
        showToast('register is already existed');
      }
    } catch (error) {
      console.log(error);
    }
  }, [email, password, confirmPassword]);

  return (
    <Animated.ScrollView style={[styles.container, { backgroundColor }]}>
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
          {t('auth.sign_up')}
        </ThemedText>
        <ThemedText
          type="defaultMedium"
          darkColor={Colors.dark.darkGrayText}
          lightColor={Colors.light.darkGrayText}
          style={styles.descriptionText}
        >
          {t('auth.text_2')}
        </ThemedText>
        <View style={styles.formGroup}>
          <ThemedInput
            type="default"
            style={[styles.formControl, errors.name&& styles.error]}
            placeholder="Name"
            value={name}
            onChangeText={v => setName(v)}
            autoCapitalize="none"
          />
          {errors.name&& 
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.name}
            </ThemedText>
          }
        </View>
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
          <PhoneInput
            phoneInputStyles={{
              container: {
                borderColor: errors.phone ? 'red' : '#454b60',
                height: 45,
              },
              input: {
                color: theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText,
                fontSize: 16,
                fontWeight: 400,
              },
            }}
            defaultCountry={'US'}
            value={phone}
            onChangePhoneNumber={v => setPhone(v)}
            selectedCountry={country}
            onChangeSelectedCountry={v => setCountry(v)}
            placeholder="Phone number"
            placeholderTextColor="#999"
          />
          {errors.phone&& 
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.phone}
            </ThemedText>
          }
        </View>
        <View style={styles.formGroup}>
          <ThemedInput
            style={[styles.formControl, errors.password&& styles.error]}
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
        <View style={styles.formGroup}>
          <ThemedInput
            style={[styles.formControl, errors.confirmPassword&& styles.error]}
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
            onPress={handleSignUp}
            bgColor={'#fa9800'} //#fa9800
          >
            <ThemedText
              type="button"
              darkColor={Colors.dark.defaultButtonText}
              lightColor={Colors.light.defaultButtonText}
            >
              {t('auth.join')}
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
      <View style={{ paddingVertical: 30 }}>
        <View style={styles.linkWrapper}>
          <ThemedText
            type="defaultMedium"
            darkColor={Colors.dark.darkGrayText}
            lightColor={Colors.light.darkGrayText}
            style={{ fontWeight: 400 }}
          >
            {t('auth.already_have_account')}{'? '}
          </ThemedText>
          <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}> 
            <ThemedText
              type="defaultMedium"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.light.darkGrayText}
            >
              {t('auth.sign_in')}
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
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainWrapper: {
    paddingTop: 50
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
  formControl: {
    marginTop: 10
  }
});