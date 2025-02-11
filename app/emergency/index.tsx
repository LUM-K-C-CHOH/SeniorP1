/**
 * Emergency Alert Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useState } from 'react';
import Header from '@/app/layout/header';
import ConfirmPanel from '@/components/ConfrimPanel';

import { Stack } from 'expo-router';
import {
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { generateBoxShadowStyle } from '@/utils';
import { PhonebookIcon } from '@/utils/svgs';
import { Images } from '@/utils/assets';
import { useRouter } from 'expo-router';

export default function EmergencyScreen() {
  const router = useRouter();

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
        negaitiveButtonText={t('no')}
        bodyText={t('emergency_control.call_confirm_text')}
        onCancel={() => setCallConfirmVisible(false)}
        onConfirm={handleCallHelp}
      />
      {callResultVisible&&
        <ThemedView style={rstyles.container}>
          <ThemedText style={rstyles.titleText}>{t('emergency_control.emergency_alert_released')}!</ThemedText>
          <View style={rstyles.bgWrapper}>
            <Image source={Images.Emergency} />
          </View>
          <ThemedText style={rstyles.resultText}>{t('emergency_control.text_3')}</ThemedText>
          <View style={rstyles.backWrapper}>
            <ThemedText style={rstyles.backText}>{t('click')}</ThemedText>
            <TouchableOpacity onPress={handleBack}>
              <ThemedText style={[rstyles.backText, { fontWeight: 600 }]}>{t('here')}</ThemedText>
            </TouchableOpacity>
            <ThemedText style={rstyles.backText}>{t('to_back')}</ThemedText>
          </View>
          <View style={rstyles.helpWrapper}>
            <ThemedText style={rstyles.helpText}>{t('emergency_control.need_help')}?</ThemedText>
            <ThemedText style={rstyles.helpText}>{t('emergency_control.check')}</ThemedText>
            <TouchableOpacity onPress={() => {}}>
              <ThemedText style={[rstyles.helpText, { fontWeight: 600 }]}>{t('emergency_control.support')}</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      }
      {!callResultVisible&&
        <GestureHandlerRootView style={styles.container}>
          <ThemedView style={styles.shareLocationWrapper}>
            <ThemedText style={styles.shareLocationText}>{t('emergency_control.share_my_location')}:</ThemedText>
            <Switch
              trackColor={{ false: '#eee', true: '#0066ff' }}
              ios_backgroundColor={'#0066ff'}
              thumbColor={shareLocation ? '#fff' : '#999'}
              value={shareLocation}
              onValueChange={(v) => handleShareLocationChange(v)}
            />
          </ThemedView>
          <ThemedView style={styles.callButtonWrapper}>
            <TouchableOpacity
              style={[
                styles.callButton,
                generateBoxShadowStyle(-2, 4, '#000', 0.2, 3, 4, '#000')
              ]}
              onPress={() => setCallConfirmVisible(true)}
            >
              <Text style={styles.callButtonText}>{t('emergency_control.call_for_help')}!</Text>
            </TouchableOpacity>
          </ThemedView>
          <ThemedView style={styles.helpWrapper}>
            <ThemedText style={styles.helpText}>{t('emergency_control.text_1')}</ThemedText>
            <ThemedText style={styles.helpText}>{t('emergency_control.text_2')}</ThemedText>
          </ThemedView>
          <TouchableHighlight style={styles.contactButtonWrapper} onPress={() => router.push('/emergency/contact')}>
            <ThemedView style={styles.contactButton}>
              <PhonebookIcon />
              <Text style={styles.contactButtonText}>{t('emergency_control.emergency_contact')}</Text>
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
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  shareLocationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -50

  },
  shareLocationText: {
    color: '#3f3f3f',
    fontSize: 17,
    fontWeight: 600
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
    fontSize: 15,
    fontWeight: 400
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
    backgroundColor: '#fff',
    borderRadius: 10
  },
  contactButtonText: {
    color: '#236ad3',
    fontSize: 14,
    fontWeight: 600,
  }
});

const rstyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  titleText: {
    textAlign: 'center',
    color: '#0066ff',
    fontSize: 24,
    fontWeight: 700,
    marginTop: 100
  },
  bgWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#454b60',
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
  backText: {
    fontSize: 20,
    fontWeight: 400,
    color: '#454b60',
  },
  helpWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 5,
    marginTop: 100,
  },
  helpText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#454b60',
  }
});