/**
 * Emergency Alert Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React, { useState, useContext, useEffect } from 'react';
import Header from '@/app/layout/header';
import ConfirmPanel from '@/components/ConfrimPanel';
import ApplicationContext from '@/context/ApplicationContext';
import * as Location from 'expo-location';
import { getEmergencyContactList, addEmergencyContact } from '@/services/emergency';

import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon, PhoneIcon } from '@/utils/svgs';
import CustomButton from '@/components/CustomButton';
import Modal from 'react-native-modal';
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
  FlatList
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { generateBoxShadowStyle, showToast } from '@/utils';
import { PhonebookIcon } from '@/utils/svgs';
import { Images } from '@/utils/assets';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';
import { IEmergencyContact, TResponse } from '@/@types';
import { sendEmergencySyncToServer } from '@/services/sendEmergency';

export default function EmergencyScreen() {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const { appState, setAppState } = useContext(ApplicationContext);
  const { t } = useTranslation();
  
  const [callConfirmVisible, setCallConfirmVisible] = useState<boolean>(false);
  const [callResultVisible, setCallResultVisible] = useState<boolean>(false);

  const [shareLocation, setShareLocation] = useState<boolean>(false);

  const [contactList, setContactList] = useState<IEmergencyContact[]>([]);
  const [orgContactList, setOrgContactList] = useState<IEmergencyContact[]>([]);
  
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactPopupVisible, setContactPopupVisible] = useState<boolean>(false);
  
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(5); // Start from 10 seconds
  const [currentAddress, setCurrentAddress] = useState<string[]>([""]);
  const handleShareLocationChange = (v: boolean): void => {
    setShareLocation(v);
    if(!shareLocation){
      handleCallHelp();
    }else {
      setCurrentAddress([""]);
    }
  }
  const handleCallHelp = async (): Promise<void> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      showToast(t('message.alert_location_permission_denied'));
      return;
    }
    setAppState({...appState, lockScreen: true});
    let location = await Location.getCurrentPositionAsync({});
    
    let latitude = location.coords.latitude, longitude = location.coords.longitude;
    let [address] = await Location.reverseGeocodeAsync({ latitude, longitude});
    setAppState({...appState, lockScreen: false});
    setCurrentAddress([
      "street: " + address.street || "",
      "city: " + address.city || "",
      "region: " + address.region || "",
      "country: " + address.country || "",
      "postalCode: " + address.postalCode || "",
    ]);
    setCallConfirmVisible(false);
  }

  const handleBack = (): void => {
    router.back();
  }
  const handleSendEmergencyContact = async (): Promise<void> => {
    let data: String[] = [];

    setCallConfirmVisible(false);
    setContactPopupVisible(false);
    
    setAppState({...appState, lockScreen: true})
    
    for(let i = 0; i < checkedIdList.length; i ++){
      for(let j = 0; j < orgContactList.length; j ++){
          if(orgContactList[j].id === checkedIdList[i]){
            const phoneString = orgContactList[j].phone.split(",").map(number => number.trim());
            data = [...data, ...phoneString];
          }
      }
    }

    const result = await sendEmergencySyncToServer(data, currentAddress);
    
    setContactPopupVisible(false);
    setCallConfirmVisible(false);
    setCallResultVisible(true);

    setAppState({...appState, lockScreen: false});
    
    const res = JSON.stringify(result);
    const resObject = JSON.parse(res);

    if (resObject.code === 0) {
      showToast(t('message.alert_help_success').replace('${numbers}', `${resObject.message?? ''}`));
    } else if(resObject.code === 1) {
      showToast(t('message.alert_help_half_success').replace('${numbers}', `${resObject.message?? ''}`));
    } else {
      showToast(t('message.alert_help_fail'));
    }
  }

  const handleGetOrgEmergencyContact = async (): Promise<void> => {
    if (!appState.user?.id) return;

    setCheckedIdList([]);
    setCountdown(5);
    const { data } = await getEmergencyContactList(appState.user.id);
    if (data) {
      setOrgContactList(data);
    }
    setContactPopupVisible(true);
  }

  // const checkExistFromEmerygencyContact = (phone: string) => {
  //   for (let i = 0; i < contactList.length; i++) {
  //     const op = contactList[i].phone;
  //     if (op.indexOf(phone) > -1)
  //       return true;
  //   }

  //   return false;
  // }
  
  // const handleEmergencyContactAdd = async (indexList: number[]): Promise<void> => {
  //   if (appState.lockScreen) return;
    
  //   const orgContact = orgContactList[indexList];
  //   const exist = checkExistFromEmerygencyContact(orgContact.phone);

  //   if (exist) return;

  //   setAppState({ ...appState, lockScreen: true });

  //   const ret = await addEmergencyContact(orgContact, appState.user?.id);
  //   if (ret) {
  //     handleLoadData();
  //     showToast(t('message.alert_save_success'));
  //   } else {
  //     showToast(t('message.alert_save_fail'));
  //   }

  //   setAppState({ ...appState, lockScreen: false });
  // }

  // type OrgContactItemProps = {
  //   index: number,
  //   name: string,
  //   phone: string,
  // };

  type ContactItemProps = {
    id: number,
    name: string,
    phone: string,
    checkedStatus: boolean,
  };

  const handleStatusChange = (id: number, status: boolean): void => {
    if (status && !checkedIdList.includes(id)) {
      setCheckedIdList([...checkedIdList, id]);
    } else {
      const filter = checkedIdList.filter(v => v !== id);
      setCheckedIdList(filter);
    }
  }

  const OrgContactItem = ({ id, name, phone, checkedStatus }: ContactItemProps): JSX.Element => {
    return (
      <ThemedView
        style={[
          pstyles.itemWrapper,
          {
            borderBottomColor: appState.setting.theme === 'light' ? Colors.light.defaultSplitter : Colors.dark.defaultSplitter
          }
        ]}
      >
        <View>
          <ThemedText type="default">{name}</ThemedText>
          <ThemedText type='defaultSize'
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
          >
            {phone}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={() => handleStatusChange(id, !checkedStatus)}>
          {checkedStatus
            ? <CheckboxFilledIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
            : <CheckboxBlankIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
          }
        </TouchableOpacity>

      </ThemedView>
    );
  }



  useEffect(() => {
    let timer: any;
    if (callConfirmVisible) {
      timer = setInterval(() => {
        setCountdown(prevTime => {
          if (prevTime === 1) {
            clearInterval(timer); // Stop the timer
            setCallConfirmVisible(false); // Auto-close the modal
            setContactPopupVisible(false);
            handleSendEmergencyContact();
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup on unmount
  }, [callConfirmVisible, countdown]);

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
        negativeButtonText={t(`No ( ${countdown > 0 ? `${countdown}s` : t('no')} )`)}
        bodyText={t('emergency_control.call_confirm_text')}
        onCancel={() => {
          setCallConfirmVisible(false);
          setCountdown(5);
          setCheckedIdList([]);
          setContactPopupVisible(false);
        }}
        onConfirm={handleSendEmergencyContact}
      />

      <Modal
        isVisible={contactPopupVisible}
        style={pstyles.container}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackdropPress={() => setContactPopupVisible(false)}
        onBackButtonPress={() => setContactPopupVisible(false)}
        onSwipeComplete={() => setContactPopupVisible(false)}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <ThemedView style={pstyles.mainWrapper}>
          <View style={pstyles.titleWrapper}>
            <ThemedText type="subtitle" style={pstyles.normalText}>
              {t('emergency_control.emergency_contact')}
            </ThemedText>
          </View>
          <FlatList
            data={orgContactList}
            renderItem={
              ({item}) => <OrgContactItem
                                    id={item.id!}
                                    name={item.name}
                                    phone={item.phone}
                                    checkedStatus={checkedIdList.includes(item.id!)}
                                  />
            }
          />
          <View style={styles.actionWrapper}>
            <CustomButton onPress={() => {
              if(checkedIdList.length === 0){
                showToast("Please select contact");
              }else {
                setCallConfirmVisible(true);
              }
            }}>
              <ThemedText
                type="button"
                darkColor={Colors.dark.defaultButtonText}
                lightColor={Colors.light.defaultButtonText}
              >
                {t('emergency_control.send_emergency_message')}
              </ThemedText>
            </CustomButton>
          </View>
        </ThemedView>
      </Modal>

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
            style={rstyles.titleText}
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
              onPress={handleGetOrgEmergencyContact}
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
  actionWrapper: {
    alignItems: 'center',    
    paddingHorizontal: 10,
    paddingVertical: 10
  },
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

const rstyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    marginInline: 50,
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
const pstyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mainWrapper: {
    width: '90%',
    maxWidth: 450,
    borderRadius: 10,
    maxHeight: 500,
    minHeight: 400,
    paddingHorizontal: 15
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  normalText: {
    textAlign: 'center'
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    columnGap: 10,
    justifyContent: 'space-between'
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    overflow: 'hidden',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  button: {
    flex: 1,
    height: 45
  },
  buttonTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});