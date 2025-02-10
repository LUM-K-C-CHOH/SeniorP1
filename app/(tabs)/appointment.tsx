/**
 * appointment.tsx
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
  Text
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
        <ThemedView
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
        </ThemedView>
        <ThemedView style={styles.infoWrapper}>
          <ThemedView style={styles.row}>
            <ThemedText style={styles.normalText}>
              {getContactName(data.item.contactId)}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.row}>
            <ClockIcon />
            <ThemedText style={styles.normalText}>{getDateString(data.item.scheduledTime)}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.row}>
            <ThemedText style={[styles.normalText, { color: '#999' }]}>{data.item.description}</ThemedText>
          </ThemedView>          
        </ThemedView>
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
      <Modal
        isVisible={deleteConfirmPopupOptions.opened as boolean}
        onBackdropPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        onBackButtonPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        onSwipeComplete={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
        swipeDirection="left"
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={300}
        animationOutTiming={300}
      >
        <ThemedView style={pstyles.deleteConfirmModalContainer}>
          <ThemedView style={pstyles.deleteConfirmModalBody}>
            <ThemedText style={pstyles.deleteConfirmModalBodyText}>{t('message.confirm_delete')}</ThemedText>
          </ThemedView>
          <ThemedView style={pstyles.deleteConfirmModalActions}>
            <TouchableOpacity
              style={pstyles.deleteConfirmModalNegativeButton}
              onPress={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
            >
              <Text style={pstyles.deleteConfirmModalNegativeButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={pstyles.deleteConfirmModalPositiveButton}
              onPress={handleDeleteConfrim}
            >
              <Text style={pstyles.deleteConfirmModalPositiveButtonText}>{t('delete')}</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </Modal>
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
  row: {
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

const pstyles = StyleSheet.create({
  deleteConfirmModalContainer: {
    paddingHorizontal: 20,
    borderRadius: 10
  },
  deleteConfirmModalBody: {
    paddingVertical: 15
  },
  deleteConfirmModalBodyText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 400,
  },
  deleteConfirmModalActions: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    justifyContent: 'center',
    columnGap: 50
  },
  deleteConfirmModalNegativeButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#e8e7e7'
  },
  deleteConfirmModalNegativeButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 400
  },
  deleteConfirmModalPositiveButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fbc4c4'
  },
  deleteConfirmModalPositiveButtonText: {
    color: '#fc2727',
    fontSize: 14,
    fontWeight: 400
  },
});