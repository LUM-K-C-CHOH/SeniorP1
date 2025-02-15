/**
 * Emergency Alert Screen
 * RTHA
 * 
 * Created by Thornton on 01/28/2025
 */
import React, { useState, useContext } from 'react';
import Header from '@/app/layout/header';
import ConfirmPanel from '@/components/ConfrimPanel';
import ApplicationContext from '@/context/ApplicationContext';

import { Stack } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { generateBoxShadowStyle } from '@/utils';
import { PhonebookIcon } from '@/utils/svgs';
import { Images } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';

export default function EmergencyScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const { appState } = useContext(ApplicationContext);
  const { t } = useTranslation();
  
  const [callConfirmVisible, setCallConfirmVisible] = useState<boolean>(false);
  const [callResultVisible, setCallResultVisible] = useState<boolean>(false);

  const [shareLocation, setShareLocation] = useState<boolean>(false);

  const handleShareLocationChange = (v: boolean): void => {
    setShareLocation(v);
  }

  const handleCallHelp = (): void => {
    setCallConfirmVisible(false);
    setCallResultVisible(true);
  }

  const handleBack = (): void => {
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <ConfirmPanel
        visible={callConfirmVisible}
        titleText={t('confirmation')}
        positiveButtonText={t('yes')}
        negativeButtonText={t('no')}
        bodyText={t('emergency_control.call_confirm_text')}
        onCancel={() => setCallConfirmVisible(false)}
        onConfirm={handleCallHelp}
      />
      {callResultVisible&&
        <View style={[rstyles.container, { backgroundColor }]}>
          <ThemedText
            type="mediumTitle"
            style={rstyles.titleText}
          >
            {t('emergency_control.emergency_alert_released')}!
          </ThemedText>
          <View style={rstyles.bgWrapper}>
            <Image source={Images.Emergency} />
          </View>
          <ThemedText
            type="title"
            darkColor={Colors.dark.darkGrayText}
            lightColor={Colors.dark.darkGrayText}
          >
            {t('emergency_control.text_3')}
          </ThemedText>
          <View style={rstyles.backWrapper}>
            <ThemedText
              type="subtitle"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
              style={{ fontWeight: 400 }}
            >
              {t('click')}
            </ThemedText>
            <TouchableOpacity onPress={handleBack}>
              <ThemedText
                type="subtitle"
                darkColor={Colors.dark.darkGrayText}
                lightColor={Colors.dark.darkGrayText}
              >
                {t('here')}
              </ThemedText>
            </TouchableOpacity>
            <ThemedText
              type="subtitle"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
              style={{ fontWeight: 400 }}
            >
              {t('to_back')}
            </ThemedText>
          </View>
          <View style={rstyles.helpWrapper}>
            <ThemedText
              type="default"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
            >
              {t('need_help')}?
            </ThemedText>
            <ThemedText
              type="default"
              darkColor={Colors.dark.darkGrayText}
              lightColor={Colors.dark.darkGrayText}
            >
              {t('check')}
            </ThemedText>
            <TouchableOpacity onPress={() => {}}>
              <ThemedText
                type="default"
                darkColor={Colors.dark.darkGrayText}
                lightColor={Colors.dark.darkGrayText}
                style={{ fontWeight: 600 }}
              >
                {t('support')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      }
      {!callResultVisible&&
        <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
          <View style={styles.shareLocationWrapper}>
            <ThemedText
              type="defaultMedium"
              darkColor={'#aaa'}
              lightColor={'#3f3f3f'}
            >
              {t('emergency_control.share_my_location')}:
            </ThemedText>
            <Switch
              trackColor={{ false: '#eee', true: '#0066ff' }}
              ios_backgroundColor={'#0066ff'}
              thumbColor={shareLocation ? '#fff' : '#999'}
              value={shareLocation}
              onValueChange={(v) => handleShareLocationChange(v)}
            />
          </View>
          <View style={styles.callButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.callButton,
                generateBoxShadowStyle(-2, 4, '#000', 0.2, 3, 4, '#000')
              ]}
              onPress={() => setCallConfirmVisible(true)}
            >
              <Text style={styles.callButtonText}>{t('emergency_control.call_for_help')}!</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.helpWrapper}>
            <ThemedText
              type="default"
              style={styles.helpText}
            >
              {t('emergency_control.text_1')}
            </ThemedText>
            <ThemedText
              type="default"
              style={styles.helpText}
            >
              {t('emergency_control.text_2')}
            </ThemedText>
          </View>
          <TouchableHighlight style={styles.contactButtonWrapper} onPress={() => router.push('/emergency/contact')}>
            <ThemedView style={styles.contactButton}>
              <PhonebookIcon color={appState.setting.theme === 'light' ? '#356ade' : '#aaa'} />
              <ThemedText
                type="default"
                darkColor={'#aaa'}
                lightColor={'#236ad3'}
                style={styles.contactButtonText}
              >
                {t('emergency_control.emergency_contact')}
              </ThemedText>
            </ThemedView>
          </TouchableHighlight>
        </GestureHandlerRootView>
      }      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  shareLocationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50

  },
  callButtonWrapper: {
    alignItems: 'center',
    marginTop: 30
  },
  callButton: {
    backgroundColor: '#f25c5c',
    width: 250,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  callButtonText: {
    fontSize: 28,
    fontWeight: 500,
    color: '#fff',
  },
  helpWrapper: {
    alignItems: 'center',
    rowGap: 15,
    marginTop: 15
  },
  helpText: {
    width: 250,
    color: '#828282',
  },
  contactButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    borderRadius: 10
  },
  contactButton: {
    flexDirection: 'row',
    width: 130,
    height: 60,
    borderColor: '#e2e2e2',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  contactButtonText: {
    fontWeight: 600,
  }
});

const rstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    textAlign: 'center',
    color: '#0066ff',
    marginTop: 100
  },
  bgWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    width: 300,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 20
  },
  backWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 5,
    marginTop: 20,
  },
  helpWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 5,
    marginTop: 100,
  },
});