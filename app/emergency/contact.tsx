
/**
 * Emergency Contact List Screen
 * RTHA
 * 
 * Created By Thornton at 02/10/2025
 */
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/app/layout/header';
import CustomButton from '@/components/CustomButton';

import { Stack } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon, PhoneIcon } from '@/utils/svgs';
import { ThemedText } from '@/components/ThemedText';
import { IEmergencyContact, TResponse } from '@/@types';
import { getContactList } from '@/services/emergency';
import { getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';

export default function EmergencyContactScreen() {
  const initialRef = useRef<boolean>(false);
  
  const { t } = useTranslation();

  const [contactList, setContactList] = useState<IEmergencyContact[]>([]);
  const [selectableVisible, setSelectableVisible] = useState<boolean>(false);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [deleteConfrimVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;

    getContactList()
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
    setDeleteConfirmResultVisible(true);
  }

  const handleDeleteConfirmResult = (): void => {
    setDeleteConfirmVisible(false);
    setDeleteConfirmResultVisible(false);
    setCheckedIdList([]);
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
        <ThemedView style={cstyles.itemWrapper}>
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
              <ThemedText style={cstyles.normalText}>
                {name}
              </ThemedText>
            </View>
            <View style={cstyles.rowWrapper}>
              <PhoneIcon />
              <ThemedText style={cstyles.normalText}>{phone}</ThemedText>
            </View>
          </View>
          {selectableVisible&&
            <TouchableOpacity onPress={() => handleStatusChange(id, !checkedStatus)}>
              {checkedStatus
                ? <CheckboxFilledIcon />
                : <CheckboxBlankIcon />
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
      <GestureHandlerRootView style={styles.container}>
        {selectableVisible&&
          <ThemedView style={styles.toolbarWrapper}>
            <TouchableOpacity onPress={handleSelectAll}>
              <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
                {checkedIdList.length === contactList.length
                  ? <CheckboxFilledIcon />
                  : <CheckboxBlankIcon />
                }                
                <Text style={styles.toobarText}>{t('select_all')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteConfirmVisible(true)}>
              <Text style={styles.toobarText}>{t('delete')}({checkedIdList.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectableVisible(false)}>
              <Text style={styles.toobarText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </ThemedView>
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
        />
        <ThemedView style={styles.actionWrapper}>
          <CustomButton onPress={() => {}}>
            <Text style={styles.addContactButtonText}>+ {t('emergency_control.add_from_contact')}</Text>
          </CustomButton>
        </ThemedView>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionWrapper: {
    alignItems: 'center',    
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
  },
  toolbarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10
  },
  toobarText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000'
  }
});

const cstyles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: '#e2e2e2',
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
  normalText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000'
  },
});

