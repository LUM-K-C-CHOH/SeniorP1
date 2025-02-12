import React, { useState } from 'react';
import Header from '@/app/layout/header';
import CustomButton from '@/components/CustomButton';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import { ThemedInput } from '@/components/ThemedIntput';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/config/constants';

export default function UpdatePasswordScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{[k: string]: string}>({});

  const handleUpdatePassword = (): void => {
    let errors: {[k: string]: string} = {};
    
    if (currentPassword.length === 0) {
      errors['currentPassword'] = t('message.alert_input_current_password');
    }

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
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.formGroup}>
          <ThemedInput
            style={[styles.formControl, errors.currentPassword&& styles.error]}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={v => setNewPassword(v)}
            secureTextEntry
          />
          {errors.currentPassword&& 
            <ThemedText
              type="small"
              darkColor={Colors.dark.redText}
              lightColor={Colors.light.redText}
            >
              {errors.currentPassword}
            </ThemedText>
          }
        </View>
        <View style={styles.formGroup}>
          <ThemedInput
            style={[styles.formControl, errors.newPassword&& styles.error]}
            placeholder="New Password"
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
            onPress={handleUpdatePassword}
          >
            <ThemedText
              type="button"
              darkColor={Colors.dark.defaultButtonText}
              lightColor={Colors.light.defaultButtonText}
            >
              {t('update')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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

  },
  formControl: {
    height: 45,
    borderWidth: 1,
    borderColor: '#454b60',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  error: {
    borderColor: 'red',
  },
  errorWrapper: {
    alignItems: 'center',
    marginTop: 10
  },
  buttonWrapper: {
    marginTop: 20
  },
});