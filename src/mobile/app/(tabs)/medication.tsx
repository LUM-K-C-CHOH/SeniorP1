/**
 * Medication List Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import CustomButton from '@/components/CustomButton';
import Modal from 'react-native-modal';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';
import ApplicationContext from '@/context/ApplicationContext';

import {
  Image,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Switch,
  View,
  Text,
} from 'react-native';

import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { deleteMedication, getMedicationList, updateMedication } from '@/services/medication';
import { IMedication, TResponse } from '@/@types';
import {
  BellIcon,
  CircleCheckIcon,
  DeleteIcon,
  EditIcon,
  FlyIcon,
  PillIcon,
  SettingIcon,
  StockIcon
} from '@/utils/svgs';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useTranslation } from 'react-i18next';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/config/constants';
import {
  getDosageUnitString,
  showToast,
  getMedicationMarkColorFromName,
  getMedicationMarkLabelFromName
} from '@/utils';
import { useFocusEffect } from '@react-navigation/native';

export default function MedicationScreen() {
  const initiatedRef = useRef<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();
  const { appState, setAppState } = useContext(ApplicationContext);

  const [initiatedParam, setInitiatedParam] = useState<boolean>(false);
  const [medicationList, setMedicationList] = useState<IMedication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmPopupOptions, setDeleteConfirmPopupOptions] = useState<{[k: string]: boolean|number}>({ opened: false, id: -1 });
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);
  const [reminderSettingPanelOptions, setReminderSettingPanelOptions] = useState<{[k: string]: boolean|number|string}>({ opened: false, id: -1, name: '', threshold: 0, pushAlert: 'off', emailAlert: 'off', saved: false });

  const [reminderSettingErrors, setReminderSettingErrors] = useState<{[k: string]: string}>();

  useFocusEffect(
    useCallback(() => {
      setInitiatedParam(false);

      if (!appState.user?.id) return;
      
      console.log('Medication tab focused');

      getMedicationList(appState.user.id)
        .then((res: TResponse) => {
          if (res.success) {
            setMedicationList(res.data?? []);
          }
        });
    }, [])
  );

  useEffect(() => {
    if (medicationList.length === 0) return;
    if (!params.medicationId) return;
    if (initiatedParam) return;

    setInitiatedParam(true);
   
    const medicationId = parseInt(params.medicationId as string, 10);
    const find = medicationList.find((v: IMedication) => v.id === medicationId);
    
    if (find) {
      setReminderSettingPanelOptions({
        opened: true,
        id: find.id as number,
        name: find.name,
        threshold: find.threshold?? 0,
        emailAlert: find.emailAlert,
        pushAlert: find.pushAlert,
        saved: false
      });
    }
  }, [params, medicationList]);

  const getColorByLevel = (stock: number): string => {
    if (stock > 15) {
      return '#34C759';
    } else if (stock > 5) {
      return '#FF9500';
    } else {
      return 'red';
    }
  }

  const handleEditRow = (rowMap: RowMap<IMedication>, id?: number): void => {
    if (!id) return;

    const find = medicationList.find(v => v.id === id);
    
    if (!find) return;

    router.push({ pathname: '/medication/edit', params: { id } });
  }

  const handleDeleteRow = (rowMap: RowMap<IMedication>, id: number|undefined): void => {
    if (!id) return;

    setDeleteConfirmPopupOptions({ opened: true, id });
  }

  const handleDeleteConfrim = async(): Promise<void> => {
    const deleteId: number = deleteConfirmPopupOptions.id as number;

    if (deleteId < 0) return;
    
    setAppState({ ...appState, lockScreen: true });

    const ret = await deleteMedication(deleteId, appState.user?.id)
    if (ret) {
      const filter = medicationList.filter(v => v.id !== deleteId);
      setMedicationList([...filter]);
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

    setIsLoading(true);
    getMedicationList(appState.user.id)
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }

  const handleAddMedication = (): void => {
    router.push('/medication/add');
  }

  const handleReminderSettingVisible = (visible: boolean, id?: number): void => {
    if (visible && !id) return;

    const find = medicationList.find(v => v.id === id);
    
    if (visible && find) {
      if (!find.id) return;

      setReminderSettingPanelOptions({
        opened: true,
        id: find.id,
        name: find.name,
        threshold: find.threshold?? 0,
        emailAlert: find.emailAlert,
        pushAlert: find.pushAlert,
        saved: false
      });
    } else if (!visible) {
      setReminderSettingErrors({});
      setReminderSettingPanelOptions({
        opened: false,
        id: -1,
        name: '',
        threshold: 0,
        pushAlert: 'off',
        emailAlert: 'off',
        saved: false
      });
    }
    
  }

  const handleReminderSettingSave = async (): Promise<void> => {
    const threshold = reminderSettingPanelOptions.threshold as string;
    const errors: {[k: string]: string} = {};
    
    if (!threshold || threshold?.length === 0 || parseInt(threshold, 10) < 1 || parseInt(threshold, 10) > 1000) {
      errors['threshold'] = t('message.alert_threshold').replace('${range}', '1-1000');
      setReminderSettingErrors(errors);
      return;
    }

    const findIndex = medicationList.findIndex(v => v.id === reminderSettingPanelOptions.id);
    if (findIndex < 0) return;

    const data = { ...medicationList[findIndex] };
    data.pushAlert = reminderSettingPanelOptions.pushAlert as string;
    data.emailAlert = reminderSettingPanelOptions.emailAlert as string;
    data.threshold = reminderSettingPanelOptions.threshold as number;
    data.image = data.image ? data.image : '';
    const ret = await updateMedication(data);
    if (ret) {
      medicationList[findIndex] = data;
      setMedicationList([...medicationList]);
      setReminderSettingErrors({});
      setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, saved: true })
    }
  }

  const renderItem = (data: ListRenderItemInfo<IMedication>) => (
    <ThemedView
      style={[
        styles.itemWrapper,
        {
          borderBottomColor: appState.setting.theme === 'light' ? Colors.light.defaultSplitter : Colors.dark.defaultSplitter
        }
      ]}
    >
      <View style={{rowGap: 5}}> 
        <View style={[styles.logoWrapper, { backgroundColor: getMedicationMarkColorFromName(data.item.name?? 'N').bgColor }]}>
          <ThemedText style={[{ color: getMedicationMarkColorFromName(data.item.name?? 'N').textColor }]}>
            {getMedicationMarkLabelFromName(data.item.name?? 'N/A')}
          </ThemedText>
        </View>
      </View>
      <View style={styles.infoWrapper}>
        <View style={styles.infoWrapper}>
          
          <View style={{ flexGrow: 1 }}>
            <View style={styles.itemTextWrapper}>
              <ThemedText
                type="defaultMedium"
                darkColor={Colors.dark.grayText}
                lightColor={Colors.light.grayText}
              >
                {data.item.name}
              </ThemedText>
            </View>
            <View style={styles.itemTextWrapper}>
              <PillIcon color={appState.setting.theme === 'light' ? Colors.light.defaultIcon : Colors.light.defaultIcon}/>
              <ThemedText type="default">{data.item.frequency.dosage}{getDosageUnitString(data.item.frequency.dosageUnit)}</ThemedText>
              <ThemedText>{'•'}</ThemedText>
              <ThemedText type="default">{`${data.item.frequency.times.length} / ${data.item.frequency.cycle}d`}</ThemedText>
            </View>
            <View style={styles.itemTextWrapper}>
              <StockIcon color={getColorByLevel(data.item.stock)} />
              <ThemedText
                type="default"
                style={{ color: getColorByLevel(data.item.stock) }}
              >
                {`${data.item.stock} ${getDosageUnitString(data.item.frequency.dosageUnit)}`}
              </ThemedText>
            </View>
          </View>
          <View style={{ rowGap: 5 }}>
            <View style={{ flexDirection: 'row', columnGap: 5 }}>
              <BellIcon color={appState.setting.theme === 'light' ? Colors.light.grayIcon : Colors.light.grayIcon} />
              <FlyIcon color={appState.setting.theme === 'light' ? Colors.light.grayIcon : Colors.light.grayIcon} />
            </View>
            <View>
              <TouchableOpacity onPress={() => handleReminderSettingVisible(true, data.item.id)}>
                <SettingIcon color={appState.setting.theme === 'light' ? '#0066ff' : '#0066ff'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );

  const renderHiddenItem = (data: ListRenderItemInfo<IMedication>, rowMap: RowMap<IMedication>) => (
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
      <Modal
        isVisible={reminderSettingPanelOptions.opened as boolean}
        swipeDirection={['down']}
        style={rstyles.reminderPanel}
        onBackdropPress={() => handleReminderSettingVisible(false)}
        onBackButtonPress={() => handleReminderSettingVisible(false)}
        onSwipeComplete={() => handleReminderSettingVisible(false)}
        animationInTiming={300}
        animationOutTiming={300}
      >
        {reminderSettingPanelOptions.saved&&
          <ThemedView
            style={[
              rstyles.container,
              {
                rowGap: 10,
                paddingTop: 50,
                paddingBottom: 50
              }
            ]}
          >
            <ThemedText
              type="subtitle"
              style={{ textAlign: 'center' }}
            >
              {t('refill_reminder_preference.refill_reminder_updated')}
            </ThemedText>
            <View style={{ alignItems: 'center' }}>
              <CircleCheckIcon />
            </View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 5,
                justifyContent: 'center'
              }}
            >
              <ThemedText type="default">{t('click')}</ThemedText>
              <TouchableOpacity onPress={() => handleReminderSettingVisible(false)}>
                <ThemedText type="default" style={{ fontWeight: 600 }}>{t('here')}</ThemedText>
              </TouchableOpacity>
              <ThemedText type="default">{t('to_continue')}</ThemedText>
            </View>
          </ThemedView>
        }
        {!reminderSettingPanelOptions.saved&&
          <ThemedView style={rstyles.container}>
            <View style={rstyles.header}>
              <ThemedText
                type="subtitle"
              >
                {t('refill_reminder_preference.refill_reminder_preference')}
              </ThemedText>
              <ThemedText
                type="default"
                darkColor={Colors.dark.grayText}
                lightColor={Colors.light.darkGrayText}
              >
                {t('refill_reminder_preference.alert_when_amount_low').replace('${name}', `${reminderSettingPanelOptions.name?? ''}`)}
              </ThemedText>
            </View>
            <View style={[rstyles.rowWrapper, rstyles.thretholdWrapper]}>

              <ThemedText type="default">{t('threshold')}:</ThemedText>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{
                    textAlign: 'right',
                    height: 50,
                    color: appState.setting.theme === 'light' ? '#000' : '#fff'
                  }}
                  placeholder="1-1000"
                  keyboardType="number-pad"
                  value={`${reminderSettingPanelOptions.threshold}`}
                  onChangeText={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, threshold: v })}
                />
              </View>
            </View>
            {reminderSettingErrors?.threshold&&
              <View style={[rstyles.rowWrapper]}>
                <ThemedText type="small" style={rstyles.errorText}>{reminderSettingErrors.threshold}</ThemedText>
              </View>
            }
            <View style={[rstyles.rowWrapper]}>
              <ThemedText type="default">{t('push_notification')}:</ThemedText>
              <View>
                <Switch
                  trackColor={{ false: '#eee', true: '#0066ff' }}
                  ios_backgroundColor={'#0066ff'}
                  thumbColor={reminderSettingPanelOptions.pushAlert === 'on' ? '#fff' : '#999'}
                  value={reminderSettingPanelOptions.pushAlert === 'on'}
                  onValueChange={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, pushAlert: v ? 'on' : 'off' })}
                />
              </View>
            </View>
            <View style={[rstyles.rowWrapper]}>
              <ThemedText type="default">{t('email_alert')}:</ThemedText>
              <View>
                <Switch
                  trackColor={{ false: '#eee', true: '#0066ff' }}
                  ios_backgroundColor={'#0066ff'}
                  thumbColor={reminderSettingPanelOptions.emailAlert === 'on' ? '#fff' : '#999'}
                  value={reminderSettingPanelOptions.emailAlert === 'on'}
                  onValueChange={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, emailAlert: v ? 'on' : 'off' })}
                />
              </View>
            </View>
            <View style={[rstyles.action]}>
              <TouchableHighlight
                onPress={handleReminderSettingSave}
                style={rstyles.button}
              >
                <ThemedView style={[rstyles.buttonTextWrapper, { borderRightColor: '#e2e2e2', borderRightWidth: 1 }]}>
                  <ThemedText type="default" style={rstyles.buttonText}>{t('save')}</ThemedText>
                </ThemedView>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => handleReminderSettingVisible(false)}
                style={rstyles.button}
              >
                <ThemedView style={rstyles.buttonTextWrapper}>
                  <ThemedText type="default" style={rstyles.buttonText}>{t('dismiss')}</ThemedText>
                </ThemedView>
              </TouchableHighlight>
            </View>
          </ThemedView>
        }
      </Modal>
      <View style={styles.listHeader}>
        <ThemedText
          type="default"
          style={[styles.listHeaderText, { width: '20%' }]}
        >
          {t('medication_manage.item')}
        </ThemedText>
        <ThemedText
          style={[styles.listHeaderText, { width: '40%' }]}
        >
          {t('medication_manage.description')}
        </ThemedText>
        <ThemedText
          style={[styles.listHeaderText, { width: '40%' }]}
        >
          {t('medication_manage.refill_reminder')}
        </ThemedText>
      </View>
      <SwipeListView
        data={medicationList}
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
        <CustomButton onPress={handleAddMedication}>
          <ThemedText
            type="button"
            darkColor={Colors.dark.defaultButtonText}
            lightColor={Colors.light.defaultButtonText}
          >
            +{t('medication_manage.add_medication')}
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
  listHeader: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  listHeaderText: {
    textAlign: 'center',
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    columnGap: 10,
  },
  infoWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  itemTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },  
  logoWrapper: {
    width: 70,
    height: 70,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
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
  }
});

const rstyles = StyleSheet.create({
  reminderPanel: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    paddingTop: 15
  },
  header: {
    alignItems: 'center'
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginVertical: 5
  },
  errorText: {
    color: 'red',
  },
  thretholdWrapper: {
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
    marginTop: 10
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
  buttonText: {
    color: '#000'
  }
});
