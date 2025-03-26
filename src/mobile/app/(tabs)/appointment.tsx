/**
 * Appointment List Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import ApplicationContext from '@/context/ApplicationContext';
import CustomButton from '@/components/CustomButton';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';

import {
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { IAppointment, TResponse } from '@/@types';
import { deleteAppointment, getAppointmentList } from '@/services/appointment';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { CircleCheckIcon, ClockIcon, DeleteIcon, EditIcon } from '@/utils/svgs';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { getDateString, getMarkColorFromName, getMarkLabelFromName, showToast } from '@/utils';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';
import { useFocusEffect } from '@react-navigation/native';

export default function AppointmentScreen() {
  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const initiatedRef = useRef<boolean>(false);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const [appointmentList, setAppointmentList] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmPopupOptions, setDeleteConfirmPopupOptions] = useState<{[k: string]: boolean|number}>({ opened: false, id: -1 });
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);
  
  useFocusEffect(
    useCallback(() => {
      if (!appState.user?.id) return;
      
      console.log('Appointment tab focused');

      getAppointmentList(appState.user.id)
        .then((res: TResponse) => {
          if (res.success) {
            setAppointmentList(res.data?? []);
          }
        });
    }, [])
  );

  const handleEditRow = (rowMap: RowMap<IAppointment>, id?: number): void => {
    if (!id) return;

    const find = appointmentList.find(v => v.id === id);
    
    if (!find) return;

    router.push({ pathname: '/appointment/edit', params: { id } });
  }

  const handleDeleteRow = (rowMap: RowMap<IAppointment>, id?: number): void => {
    if (!id) return;

    setDeleteConfirmPopupOptions({ opened: true, id });
  }

  const handleDeleteConfrim = async (): Promise<void> => {
    const deleteId: number = deleteConfirmPopupOptions.id as number;

    if (deleteId < 0) return;
    
    setAppState({ ...appState, lockScreen: true });

    const ret = await deleteAppointment(deleteId, appState.user?.id)
    if (ret) {
      const filter = appointmentList.filter(v => v.id !== deleteId);
      setAppointmentList([...filter]);
      setDeleteConfirmResultVisible(true);
    } else {
      showToast(t('message.alert_delete_fail'));
    }

    setAppState({ ...appState, lockScreen: false });
  }

  const handleDeleteConfirmResult = (): void => {
    setDeleteConfirmPopupOptions({ opened: false, id: -1 });
    setDeleteConfirmResultVisible(false);
  }

  const handleOpenedRow = (): void => {

  }

  const handleLoadData = async (): Promise<void> => {
    if (!appState.user?.id) return;
    if (isLoading) return;

    setIsLoading(true);
    getAppointmentList(appState.user.id)
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

  const renderItem = (data: ListRenderItemInfo<IAppointment>) => (
    <ThemedView
      style={[
        styles.itemWrapper,
        {
          borderBottomColor: appState.setting.theme === 'light' ? Colors.light.defaultSplitter : Colors.dark.defaultSplitter
        }
      ]}
    >
      <View
        style={[
          styles.logoWrapper,
          { backgroundColor: getMarkColorFromName(data.item.name).bgColor }
        ]}
      >
        <ThemedText
          style={[{ color: getMarkColorFromName(data.item.name).textColor }]}
        >
          {getMarkLabelFromName(data.item.name)}
        </ThemedText>
      </View>
      <View style={styles.infoWrapper}>
        <View style={styles.rowWrapper}>
          <ThemedText type="default">{data.item.name}</ThemedText>
        </View>
        <View style={styles.rowWrapper}>
          <ClockIcon color={appState.setting.theme === 'light' ? '#1e1e1e' : '#fff'} />
          <ThemedText type="default">{getDateString(data.item.scheduledTime)}</ThemedText>
        </View>
        <View style={styles.rowWrapper}>
          <ThemedText
            type="default"
            lightColor='#888'
            darkColor='#777'
          >
            {data.item.description}
          </ThemedText>
        </View>          
      </View>
    </ThemedView>
  );
  
  const renderHiddenItem = (data: ListRenderItemInfo<IAppointment>, rowMap: RowMap<IAppointment>) => (
    <View style={styles.rowBack}>
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
    </View>
  );
  
  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor }]}>
      <ConfirmPanel
        visible={deleteConfirmPopupOptions.opened as boolean}
        titleText={t('confirmation')}
        positiveButtonText={t('delete')}
        negativeButtonText={t('cancel')}
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
        onConfirm={handleDeleteConfrim}
      />
      <SwipeListView
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
      <View style={styles.actionWrapper}>
        <CustomButton onPress={handleAddAppointment}>
          <ThemedText
            type="button"
            darkColor={Colors.dark.defaultButtonText}
            lightColor={Colors.light.defaultButtonText}
          >
            +{t('appointment_manage.add_appointment')}
          </ThemedText>
        </CustomButton>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ddd',
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
  actionWrapper: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15
  },
});