/**
 * Appointment List Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-native-modal';
import CustomButton from '@/components/CustomButton';

import {
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
  Text,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { IAppointment, IContact, TResponse } from '@/@types';
import { getAppointmentList } from '@/services/appointment';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { ClockIcon, DeleteIcon, EditIcon } from '@/utils/svgs';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { getDateString, getMarkColorFromName, getMarkLabelFromName } from '@/utils';
import { getContactList } from '@/services/contact';
import ConfirmPanel from '@/components/ConfrimPanel';

export default function AppointmentScreen() {
  const { t } = useTranslation();

  const initialRef = useRef<boolean>();
  const router = useRouter();
  
  const [appointmentList, setAppointmentList] = useState<IAppointment[]>([]);
  const [contactList, setContactList] = useState<IContact[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmPopupOptions, setDeleteConfirmPopupOptions] = useState<{[k: string]: boolean|number}>({ opened: false, id: -1 });

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;
    Promise.all(
      [
        getAppointmentList(),
        getContactList()
      ]
    ).then((res: TResponse[]) => {
      if (res[0].success) {
        setAppointmentList(res[0].data?? []);
      } else {

      }
      if (res[1].success) {
        setContactList(res[1].data?? []);
      } else {

      }
    });
      
  }, []);

  const handleEditRow = (rowMap: RowMap<IAppointment>, id: number): void => {
    const find = appointmentList.find(v => v.id === id);
    
    if (!find) return;

    router.push({ pathname: '/appointment/edit', params: { id } });
  }

  const handleDeleteRow = (rowMap: RowMap<IAppointment>, id: number): void => {
    console.log('delete', id);
    setDeleteConfirmPopupOptions({ opened: true, id });
  }

  const handleDeleteConfrim = (): void => {
    const delteId: number = deleteConfirmPopupOptions.id as number;

    if (delteId < 0) return;
    
    setDeleteConfirmPopupOptions({ opened: false, id: -1 });
  }

  const handleOpenedRow = (): void => {

  }

  const handleLoadData = async (): Promise<void> => {
    setIsLoading(true);
    getAppointmentList()
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setAppointmentList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  }

  const handleAddAppointment = (): void => {
    router.push('/appointment/add');
  }

  const getContactName = (id: number): string => {
    const find = contactList.find(v => v.id === id);
    return find ? find.name : '';
  }

  const renderItem = (data: ListRenderItemInfo<IAppointment>) => (
      <ThemedView style={styles.itemWrapper}>
        <View
          style={[
            styles.logoWrapper,
            { backgroundColor: getMarkColorFromName(getContactName(data.item.contactId)).bgColor }
          ]}
        >
          <ThemedText
            style={[{ color: getMarkColorFromName(getContactName(data.item.contactId)).textColor }]}            
          >
            {getMarkLabelFromName(getContactName(data.item.contactId))}
          </ThemedText>
        </View>
        <View style={styles.infoWrapper}>
          <View style={styles.rowWrapper}>
            <ThemedText style={styles.normalText}>
              {getContactName(data.item.contactId)}
            </ThemedText>
          </View>
          <View style={styles.rowWrapper}>
            <ClockIcon />
            <ThemedText style={styles.normalText}>{getDateString(data.item.scheduledTime)}</ThemedText>
          </View>
          <View style={styles.rowWrapper}>
            <ThemedText style={[styles.normalText, { color: '#999' }]}>{data.item.description}</ThemedText>
          </View>          
        </View>
      </ThemedView>
    );
  
    const renderHiddenItem = (data: ListRenderItemInfo<IAppointment>, rowMap: RowMap<IAppointment>) => (
      <ThemedView style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => handleEditRow(rowMap, data.item.id)}
        >
          <EditIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => handleDeleteRow(rowMap, data.item.id)}
        >
          <DeleteIcon />
        </TouchableOpacity>
      </ThemedView>
    );
  
  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <ConfirmPanel
        visible={deleteConfirmPopupOptions.opened as boolean}
        titleText={t('confirmation')}
        positiveButtonText={t('delete')}
        negativeButtonText={t('cancel')}
        bodyText={t('message.confirm_delete')}
        onCancel={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        onConfirm={handleDeleteConfrim}
      />
      <SwipeListView
        style={styles.mainWrapper}
        data={appointmentList}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe={true}
        rightOpenValue={-150}
        previewRowKey={'0'}
        previewOpenValue={0}
        previewOpenDelay={3000}
        onRowDidOpen={handleOpenedRow}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleLoadData} />
        }
      />
      <ThemedView style={styles.actionWrapper}>
        <CustomButton onPress={handleAddAppointment}>
          <Text style={styles.addAppointmentButtonText}>+{t('appointment_manage.add_appointment')}</Text>
        </CustomButton>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: 'white',    
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: '#07d22d',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: '#fb4420',
    right: 0,
  },
  backTextWhite: {
    color: '#fff',
  },
  actionWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  addAppointmentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
  }, 
});