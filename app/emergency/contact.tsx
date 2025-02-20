
/**
 * Emergency Contact List Screen
 * RTHA
 * 
 * Created by Thornton on 02/10/2025
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import Header from '@/app/layout/header';
import CustomButton from '@/components/CustomButton';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';

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
import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon, PhoneIcon } from '@/utils/svgs';
import { ThemedText } from '@/components/ThemedText';
import { IEmergencyContact, TResponse } from '@/@types';
import { getEmergencyContactList, deleteEmergencyContactGroup } from '@/services/emergency';
import { getMarkColorFromName, getMarkLabelFromName, showToast } from '@/utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';

export default function EmergencyContactScreen() {
  const initiatedRef = useRef<boolean>(false);
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();
  const { appState } = useContext(ApplicationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactList, setContactList] = useState<IEmergencyContact[]>([]);
  const [selectableVisible, setSelectableVisible] = useState<boolean>(false);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [deleteConfrimVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);

  useEffect(() => {
    if (initiatedRef.current) return;

    initiatedRef.current = true;

    getEmergencyContactList()
      .then((res: TResponse) => {
        if (res.success) {
          setContactList(res.data?? []);          
        } else {
        }
      });
  }, []);

  const handleLongPress = (): void => {
    setSelectableVisible(true);
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
      const idList = contactList.map(v => v.id);
      setCheckedIdList(idList);
    }
  }

  const handleContactDelete = (): void => {
   if (checkedIdList.length === 0) return;
   
    const idList = checkedIdList.join(',');
    const ret = deleteEmergencyContactGroup(idList);
    if (ret) {
      const filter = contactList.filter(v => !checkedIdList.includes(v.id));
      setContactList([...filter]);
      setDeleteConfirmResultVisible(true);
    } else {
      showToast(t('message.alert_delete_fail'));
    }
  }

  const handleDeleteConfirmResult = (): void => {
    setDeleteConfirmVisible(false);
    setDeleteConfirmResultVisible(false);
    setCheckedIdList([]);
  }

  const handleLoadData = async (): Promise<void> => {
    setIsLoading(true);
    getEmergencyContactList()
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

  type ContactItemProps = {
    id: number,
    name: string,
    phone: string,
    checkedStatus: boolean,
  };

  const ContactItem = ({ id, name, phone, checkedStatus }: ContactItemProps): JSX.Element => {
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
              <ThemedText type="default">
                {name}
              </ThemedText>
            </View>
            <View style={cstyles.rowWrapper}>
              <PhoneIcon color={appState.setting.theme === 'light' ? '#000' : '#fff'} />
              <ThemedText type="default">
                {phone}
              </ThemedText>
            </View>
          </View>
          {selectableVisible&&
            <TouchableOpacity onPress={() => handleStatusChange(id, !checkedStatus)}>
              {checkedStatus
                ? <CheckboxFilledIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
                : <CheckboxBlankIcon color={appState.setting.theme === 'light' ? '#1d1b20' : '#fff'} />
              }
            </TouchableOpacity>
          }
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
        bodyText={t('emergency_control.confirm_delete').replace('${count}', `${checkedIdList.length}`)}
        resultVisible={deleteConfirmResultVisible}
        resultElement={
          <ThemedView style={ConfirmResultStyle.container}>
            <ThemedText style={ConfirmResultStyle.titleText}>
              {t('message.deleted_successfully')}
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
                          id={item.id}
                          name={item.name}
                          phone={item.phone}
                          checkedStatus={checkedIdList.includes(item.id)}
                        />
          }
          keyExtractor={item => `${item.id}`}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleLoadData} />
          }
        />
        <View style={styles.actionWrapper}>
          <CustomButton onPress={() => {}}>
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
  actionWrapper: {
    alignItems: 'center',    
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

