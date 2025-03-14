import React, { useState, useContext } from 'react';
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
import { updatePassword } from '@/services/auth';
import ApplicationContext from '@/context/ApplicationContext';
import { showToast } from '@/utils';

export default function UpdatePasswordScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  
  const { appState, setAppState } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<{[k: string]: string}>({});
  

  const handleUpdatePassword = async(): Promise<void> => {
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

    if (!appState.user?.email) {
      showToast(t('message.alert_invalid_user_info'));
    } else {
      setAppState({ ...appState, lockScreen: true });
      const result = await updatePassword(appState.user?.email, currentPassword, newPassword);

      if (result.code === 0) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        showToast(t('message.alert_update_password_success'));
      } else {
        if (result.code === -1) {
          showToast(t('message.alert_invalid_current_password'));
          errors['currentPassword'] = t('message.alert_input_current_password');
        } else {
          showToast(t('message.alert_update_password_fail'));
        }
      }
      setAppState({ ...appState, lockScreen: false });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.formGroup}>
          <ThemedInput
            style={[errors.currentPassword&& styles.error]}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={v => setCurrentPassword(v)}
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
            style={[errors.newPassword&& styles.error]}
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
    marginTop: 20,
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