
/**
 * Emergency Contact List Screen
 * RTHA
 * 
 * Created by Morgan on 02/10/2025
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import Header from '@/app/layout/header';
import CustomButton from '@/components/CustomButton';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';
import * as Contacts from 'expo-contacts';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  FlatList
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon, PhoneIcon, FlyIcon, DoctorIcon } from '@/utils/svgs';
import { ThemedText } from '@/components/ThemedText';
import { IContact, IEmergencyContact, TResponse} from '@/@types';
import { getEmergencyContactList, deleteEmergencyContactGroup, addEmergencyContact, updateEmergencyContact } from '@/services/emergency';
import { getMarkColorFromName, getMarkLabelFromName, showToast } from '@/utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors, EmergencyType } from '@/config/constants';
import { SelectList } from 'react-native-dropdown-select-list'

import { CloseIcon, SearchIcon } from '@/utils/svgs';
import { ThemedInput } from '@/components/ThemedIntput';


export default function EmergencyContactScreen() {
  const initiatedRef = useRef<boolean>(false);
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const [errors, setErrors] = useState<{[k: string]: string}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactList, setContactList] = useState<IEmergencyContact[]>([]);
  const [orgContactList, setOrgContactList] = useState<IContact[]>([]);
  const [selectableVisible, setSelectableVisible] = useState<boolean>(false);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [deleteConfrimVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);
  const [contactPopupVisible, setContactPopupVisible] = useState<boolean>(false);
  const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);
  const [emergencyData, setEmergencyData] = useState<IEmergencyContact>();
   
  useEffect(() => {
    if (initiatedRef.current) return;
    if (!appState.user?.id) return;

    initiatedRef.current = true;

    getEmergencyContactList(appState.user.id)
      .then((res: TResponse) => {
        if (res.success) {
          setContactList(res.data?? []);          
        } else {
        }
      });
  }, []);

  const typeList = [
    { key: EmergencyType.PERSON, value: 'Person' },
    { key: EmergencyType.DOCTOR, value: 'Doctor' },
    { key: EmergencyType.NURSE, value: 'Nurse' },    
  ];
  const handleLongPress = (): void => {
    setSelectableVisible(true);
  }

  const handleFormValueChange = (type: string, value: string): void => {    
    if (type === 'name') {
      setEmergencyData({ ...emergencyData!, name: value });
      if (value.length > 0) {
        const { name, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['name'] = t('message.alert_input_name');
        setErrors({ ...errors });
      }
      return;
    }

    if (type === 'phone') {
      setEmergencyData({ ...emergencyData!, phone: value });  
      if (value.length > 0) {
        const { dosage, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['dosage'] = t('message.alert_input_dosage');
        setErrors({ ...errors });
      }

      return;
    }

    if (type === 'type') {
      setEmergencyData({ ...emergencyData!, type: value });  
      if (`${value}`.length > 0) {
        const { type, ...rest } = errors;
        setErrors(rest);
      } else {
        errors['type'] = t('message.alert_select_dosage_unit');
        setErrors({ ...errors });
      }
      return;
    }
  }

  const handleStatusChange = (id: number, status: boolean): void => {
    if (status && !checkedIdList.includes(id)) {
      setCheckedIdList([...checkedIdList, id]);
    } else {
      const filter = checkedIdList.filter(v => v !== id);
      setCheckedIdList(filter);
    }
  }

  const handleSelectAll = (): void => {
    if (checkedIdList.length === contactList.length) {
      setCheckedIdList([]);
    } else {
      const idList = contactList.map(v => v.id!);
      setCheckedIdList(idList);
    }
  }

  const handleContactDelete = async (): Promise<void> => {
    if (checkedIdList.length === 0) return;
    if (appState.lockScreen) return;
    if (!appState.user?.id) return;
   
    setAppState({ ...appState, lockScreen: true });

    const idList = checkedIdList.join(',');
    const ret = await deleteEmergencyContactGroup(idList, appState.user.id);
    if (ret) {
      const filter = contactList.filter(v => !checkedIdList.includes(v.id!));
      setContactList([...filter]);
      setCheckedIdList([]);
      setSelectableVisible(false);
      setDeleteConfirmResultVisible(true);
    } else {
      showToast(t('message.alert_delete_fail'));
    }

    setAppState({ ...appState, lockScreen: false });
    setDeleteConfirmVisible(false);
  }

  const handleDeleteConfirmResult = (): void => {
    setDeleteConfirmVisible(false);
    setDeleteConfirmResultVisible(false);
    setCheckedIdList([]);
  }

  const handleLoadData = async (): Promise<void> => {
    if (!appState.user?.id) return;

    setIsLoading(true);
    getEmergencyContactList(appState.user.id)
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setContactList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  }

  const handleGetOrgContact = async (): Promise<void> => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.FirstName,
          Contacts.Fields.LastName,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.ContactType,
          Contacts.Fields.Emails,
          Contacts.Fields.Image
        ],
      });

      let orgContactList: IContact[] = data.map(v => ({
        name: v.name,
        image: v.image ? v.image.uri?? '' : '',
        type: v.contactType as string,
        phone: v.phoneNumbers ? v.phoneNumbers?.map(p => p.number).join(',') : ''
      }));

      setOrgContactList(orgContactList);
      setContactPopupVisible(true);
    } else {
      showToast(t('message.alert_contact_permission_denied'));
    }
  }

  const checkExistFromEmerygencyContact = (phone: string) => {
    for (let i = 0; i < contactList.length; i ++) {
      const op = contactList[i].phone;
      if (op.indexOf(phone) > -1)
        return true;
    }

    return false;
  }

  const handleEmergencyContactAdd = async (index: number): Promise<void> => {
    if (appState.lockScreen) return;
    if (!appState.user?.id) return;

    const orgContact = orgContactList[index];
    const exist = checkExistFromEmerygencyContact(orgContact.phone);

    if (exist) return;

    setAppState({ ...appState, lockScreen: true });

    const data = {
      ...orgContact,
      userId: appState.user.id
    };
    const ret = await addEmergencyContact(data);
    if (ret) {
      handleLoadData();
      showToast(t('message.alert_save_success'));
    } else {
      showToast(t('message.alert_save_fail'));
    }

    setAppState({ ...appState, lockScreen: false });
  }

  const handleEditPopupVisible = (id?: number) => {
    if(!id) return;
    const find = contactList.find(v => v.id === id);
    if(!find) return;
    
    setEmergencyData(find);
    setEditPopupVisible(true);
  }
  
  const handleEmergencyContactUpdate = async(): Promise<void> => {
    if (appState.lockScreen) return;
    if (!emergencyData) return;

    setEditPopupVisible(false);

    setAppState({ ...appState, lockScreen: true });
    const ret = await updateEmergencyContact(emergencyData);

    if (ret) {
      handleLoadData();     
      showToast(t('message.alert_update_success'));
    } else {
      showToast(t('message.alert_update_fail'));
    }

    setAppState({ ...appState, lockScreen: false });
  }

  type OrgContactItemProps = {
    index: number,
    name: string,
    phone: string
  };

  type ContactItemProps = {
    id: number,
    name: string,
    phone: string,
    type: string,
    checkedStatus: boolean,
  };

  const OrgContactItem = ({ index, name, phone}: OrgContactItemProps): JSX.Element => {
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
          <ThemedText type="contactSize"
            darkColor={Colors.dark.grayText}
            lightColor={Colors.light.grayText}
          >
            {phone}
          </ThemedText>
        </View>
        <View>
          {!checkExistFromEmerygencyContact(phone)
            ? <TouchableOpacity onPress={() => handleEmergencyContactAdd(index)}>
                <ThemedText
                  darkColor={'#98c5f7'}
                  lightColor={'#0579fb'}
                >
                  {t('add')}
                </ThemedText>
              </TouchableOpacity>
            : <ThemedText
                darkColor={Colors.dark.grayText}
                lightColor={Colors.dark.grayText}
              >
                {t('already_added')}
              </ThemedText>
          }
          
        </View>
      </ThemedView>
    );
  }

  const ContactItem = ({ id, name, phone, type, checkedStatus }: ContactItemProps): JSX.Element => {
    return (
      <TouchableHighlight onLongPress={handleLongPress}>
        <ThemedView
          style={[
            cstyles.itemWrapper,
            {
              borderBottomColor: appState.setting.theme === 'light' ? Colors.light.defaultSplitter : Colors.dark.defaultSplitter
            }
          ]}
        >
          <View
            style={[
              cstyles.logoWrapper,
              { backgroundColor: getMarkColorFromName(name).bgColor }
            ]}
          >
            <ThemedText
              style={[{ color: getMarkColorFromName(name).textColor }]}            
            >
              {getMarkLabelFromName(name)}
            </ThemedText>
          </View>
          <View style={cstyles.infoWrapper}>
            <View style={cstyles.rowWrapper}>
              <ThemedText type="default"> {name} </ThemedText>
            </View>
            <View style={cstyles.rowWrapper}>
              <PhoneIcon color={appState.setting.theme === 'light' ? '#000' : '#fff'} />
              <ThemedText type="default"> {phone} </ThemedText>
            </View>
            <View style={cstyles.rowWrapper}>
              <DoctorIcon width={18} height={18} color={appState.setting.theme === 'light' ? '#000' : '#fff'} />
              <ThemedText type="default"> {typeList.find(v => v.key === type)?.value} </ThemedText>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {selectableVisible ? (
                <TouchableOpacity onPress={() => handleStatusChange(id, !checkedStatus)}>
                  {checkedStatus 
                    ? (<CheckboxFilledIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />)
                    : (<CheckboxBlankIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />)
                  }
                </TouchableOpacity>
              ) : (
              <TouchableOpacity onPress={() => handleEditPopupVisible(id)} style={{ marginLeft: 9 }}>
                <Ionicons name="create-outline" size={24} color={appState.setting.theme === 'light' ? '#000' : '#fff'} />
              </TouchableOpacity>
              )
            }
          </View>
        </ThemedView>
      </TouchableHighlight>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Header />
      <ConfirmPanel
        visible={deleteConfrimVisible}
        titleText={t('confirmation')}
        positiveButtonText={t('yes')}
        negativeButtonText={t('no')}
        bodyText={t('message.confirm_delete')}
        resultVisible={deleteConfirmResultVisible}
        resultElement={
          <ThemedView style={ConfirmResultStyle.container}>
            <ThemedText style={ConfirmResultStyle.titleText}>
              {t('message.alert_delete_success')}
            </ThemedText>
            <View style={ConfirmResultStyle.iconWrapper}><CircleCheckIcon /></View>
            <View style={ConfirmResultStyle.actionsWrapper}>
              <ThemedText style={ConfirmResultStyle.labelText}>{t('click')}</ThemedText>
              <TouchableOpacity
                onPress={handleDeleteConfirmResult}
              >
                <ThemedText style={[ConfirmResultStyle.labelText, ConfirmResultStyle.linkText]}>{t('here')}</ThemedText>
              </TouchableOpacity>
              <ThemedText style={ConfirmResultStyle.labelText}>{t('to_continue')}</ThemedText>
            </View>
          </ThemedView>
        }
        onCancel={handleDeleteConfirmResult}
        onConfirm={handleContactDelete}
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
              {t('contacts')}
            </ThemedText>
          </View>
          <FlatList
            data={orgContactList}
            renderItem={
              ({item, index}) => <OrgContactItem
                                    index={index}
                                    name={item.name}
                                    phone={item.phone}
                                  />
            }
          />
        </ThemedView>
      </Modal>

      <Modal
        isVisible={editPopupVisible}
        style={pstyles.container}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackdropPress={() => setEditPopupVisible(false)}
        onBackButtonPress={() => setEditPopupVisible(false)}
        onSwipeComplete={() => setEditPopupVisible(false)}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <ThemedView style={pstyles.contactWrapper}>
          <View style={pstyles.titleWrapper}>
            <ThemedText type="subtitle" style={pstyles.normalText}>
              {t('emergency_control.emergency_contact')}
            </ThemedText>
          </View>
          <View style={styles.formGroup}>
            <ThemedText
              type="default"
              darkColor={Colors.dark.grayText}
              lightColor={Colors.light.grayText}
              style={styles.controlLabel}
            >
              {t('name')}{':'}
            </ThemedText>
            <View style={styles.formControlWrapper}>
              <ThemedInput
                style={[
                  errors.name ? { borderColor: 'red' } : {}
                ]}
                type="default"
                value={emergencyData?.name}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(v) => handleFormValueChange('name', v)}
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
          </View>
          <View style={styles.formGroup}>
            <ThemedText
              type="default"
              darkColor={Colors.dark.grayText}
              lightColor={Colors.light.grayText}
              style={styles.controlLabel}
            >
              {t('phone')}{':'}
            </ThemedText>
            <View style={styles.formControlWrapper}>
              <ThemedInput
                style={[
                  errors.phone ? { borderColor: 'red' } : {}
                ]}
                type="default"
                value={emergencyData?.phone}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(v) => handleFormValueChange('phone', v)}
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
          </View>          
          <View style={styles.formGroup}>
            <ThemedText
              type="default"
              darkColor={Colors.dark.grayText}
              lightColor={Colors.light.grayText}
              style={styles.controlLabel}
            >
              {t('Role')}{':'}
            </ThemedText>
            <View style={styles.formControlWrapper}>
              <SelectList
                setSelected={(v: string) => handleFormValueChange('type', v)}
                data={typeList}
                save="key"
                placeholder="--Select--"
                searchPlaceholder=""
                searchicon={<SearchIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
                closeicon={<CloseIcon color={appState.setting.theme === 'light' ? '#454b60' : '#aaa'} />}
                defaultOption={typeList.find(v => v.key === emergencyData?.type)}
                boxStyles={{
                  borderColor: errors.type ? 'red' : appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                  paddingHorizontal: 10,
                }}
                inputStyles={{
                  color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText,
                }}
                dropdownStyles={{
                  borderColor: appState.setting.theme === 'light' ? Colors.light.defaultControlBorder : Colors.dark.defaultControlBorder,
                }}
                dropdownTextStyles={{
                  color: appState.setting.theme === 'light' ? Colors.light.defaultControlText : Colors.dark.defaultControlText
                }}
              />
              {errors.type&&
                <ThemedText
                  type="small"
                  darkColor={Colors.dark.redText}
                  lightColor={Colors.light.redText}
                >
                  {errors.type}
                </ThemedText>
              }
            </View>
          </View>

          <View style={styles.action1Wrapper}>
            <CustomButton onPress={() => handleEmergencyContactUpdate()}>
              <ThemedText
                type="button"
                darkColor={Colors.dark.defaultButtonText}
                lightColor={Colors.light.defaultButtonText}
              >
                {t('emergency_control.update_contact')} 
              </ThemedText>
            </CustomButton>
          </View>

        </ThemedView>
      </Modal>
      <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
        {selectableVisible&&
          <View style={styles.toolbarWrapper}>
            <TouchableOpacity onPress={handleSelectAll}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 5,
                  alignItems: 'center'
                }}
              >
                {checkedIdList.length === contactList.length
                  ? <CheckboxFilledIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
                  : <CheckboxBlankIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
                }                
                <ThemedText type="default">
                  {t('select_all')}
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={
                () => {
                  if (checkedIdList.length === 0) return;
                  setDeleteConfirmVisible(true);
                }
              }
            >
              <ThemedText type="default">
                {t('delete')}({checkedIdList.length})
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectableVisible(false)}>
              <ThemedText type="default">
                {t('cancel')}
              </ThemedText>
            </TouchableOpacity>
          </View>
        }
        <FlatList
          data={contactList}
          renderItem={
            ({item}) => <ContactItem
                          id={item.id!}
                          name={item.name}
                          phone={item.phone}
                          type={item.type as string}
                          checkedStatus={checkedIdList.includes(item.id!)}
                        />
          }
          keyExtractor={item => `${item.id}`}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleLoadData} />
          }
        />
        <View style={styles.actionWrapper}>
          <CustomButton onPress={handleGetOrgContact}>
            <ThemedText
              type="button"
              darkColor={Colors.dark.defaultButtonText}
              lightColor={Colors.light.defaultButtonText}
            >
              + {t('emergency_control.add_from_contact')}
            </ThemedText>
          </CustomButton>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formGroup: {
    flexDirection: 'row',
    columnGap: 0,
    marginTop: 25,
    paddingHorizontal: 0,
  },
  controlLabel: {
    width: 120,
    marginTop: 12
  },
  formControlWrapper: {
    flex: 1,
  },
  actionWrapper: {
    alignItems: 'center',    
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  action1Wrapper: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  toolbarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10
  },
});

const cstyles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    columnGap: 10,
  },
  logoWrapper: {
    width: 70,
    height: 70,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  infoWrapper: {
    flex: 1,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5
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
    minHeight: 300,
    paddingHorizontal: 15
  },
  contactWrapper: {
    width: '90%',
    maxWidth: 450,
    borderRadius: 10,
    maxHeight: 500,
    minHeight: 350,
    paddingHorizontal: 15
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
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