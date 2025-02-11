/**
 * Medication List Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useState, useEffect, useRef } from 'react';
import CustomButton from '@/components/CustomButton';
import Modal from 'react-native-modal';
import ConfirmPanel from '@/components/ConfrimPanel';

import {
  Image,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableHighlight,
  Switch,
  View
} from 'react-native';

import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { getMedicationList } from '@/services/medication';
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
import { useSearchParams } from 'expo-router/build/hooks';

export default function MedicationScreen() {
  const initialRef = useRef<boolean>(false);
  const initialParamRef = useRef<boolean>(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const { t } = useTranslation();

  const [medicationList, setMedicationList] = useState<IMedication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteConfirmPopupOptions, setDeleteConfirmPopupOptions] = useState<{[k: string]: boolean|number}>({ opened: false, id: -1 });
  const [reminderSettingPanelOptions, setReminderSettingPanelOptions] = useState<{[k: string]: boolean|number|string}>({ opened: false, id: -1, threshold: '', pushNotification: false, emailAlert: false, miniStock: 0, saved: false });

  const [reminderSettingErrors, setReminderSettingErrors] = useState<{[k: string]: string}>();

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;
    
    getMedicationList()
      .then((res: TResponse) => {
        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      });
  }, []);

  useEffect(() => {
    console.log('init param', initialParamRef.current)
    if (medicationList.length === 0) return;
    if (!params.medicationId) return;
    if (initialParamRef.current) return;

    initialParamRef.current = true;

    const medicationId = parseInt(params.medicationId as string, 10);
    const find = medicationList.find((v: IMedication) => v.id === medicationId);
    
    if (find) {
      setReminderSettingPanelOptions({ opened: true, id: medicationId });
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

  const handleEditRow = (rowMap: RowMap<IMedication>, id: number): void => {
    const find = medicationList.find(v => v.id === id);
    
    if (!find) return;

    router.push({ pathname: '/medication/edit', params: { id } });
  }

  const handleDeleteRow = (rowMap: RowMap<IMedication>, id: number): void => {
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
    getMedicationList()
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setMedicationList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.log(error);
      });
  }

  const handleAddMedication = (): void => {
    router.push('/medication/add');
  }

  const handleReminderSettingVisible = (visible: boolean, id?: number): void => {
    const find = medicationList.find(v => v.id === id);
    
    if (visible && find) {
      setReminderSettingPanelOptions({ opened: true, id: find.id, miniStock: find.miniStock?? 0, saved: false });
    } else if (!visible) {
      setReminderSettingErrors({});
      setReminderSettingPanelOptions({ opened: false, id: -1, threshold: '', pushNotification: false, emailAlert: false, miniStock: 0, saved: false });
    }
    
  }

  const handleReminderSettingSave = (): void => {
    const threshold = reminderSettingPanelOptions.threshold as string;
    const errors: {[k: string]: string} = {};
    
    if (!threshold || threshold?.length === 0 || parseInt(threshold, 10) < 1 || parseInt(threshold, 10) > 1000) {
      errors['threshold'] = t('message.alert_threshold').replace('${range}', '1-1000');
      setReminderSettingErrors(errors);
      return;
    }


    setReminderSettingErrors({});
    setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, saved: true })
  } 

  const renderItem = (data: ListRenderItemInfo<IMedication>) => (
    <ThemedView style={styles.itemWrapper}>
      <Image source={{ uri: data.item.image }} width={60} height={60}/>
      <View style={styles.infoWrapper}>
        <View style={{ flexGrow: 1 }}>
          <ThemedText style={styles.itemTitle}>{data.item.name}</ThemedText>
          <View style={styles.itemTextWrapper}>
            <PillIcon />
            <ThemedText style={styles.normalText}>{data.item.dosage}</ThemedText>
            <ThemedText>{'•'}</ThemedText>
            <ThemedText style={styles.normalText}>{data.item.frequency}</ThemedText>
          </View>
          <View style={styles.itemTextWrapper}>
            <StockIcon color={getColorByLevel(data.item.stock)} />
            <ThemedText
              style={[styles.normalText, { color: getColorByLevel(data.item.stock) }]}
            >
              {`${data.item.stock} Tablets`}
            </ThemedText>
          </View>
        </View>
        <View style={{ rowGap: 5 }}>
          <View style={{ flexDirection: 'row', columnGap: 5 }}>
            <BellIcon />
            <FlyIcon />
          </View>
          <View>
            <TouchableOpacity onPress={() => handleReminderSettingVisible(true, data.item.id)}>
              <SettingIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ThemedView>
  );

  const renderHiddenItem = (data: ListRenderItemInfo<IMedication>, rowMap: RowMap<IMedication>) => (
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
    <GestureHandlerRootView style={styles.container}>
      <ConfirmPanel
        visible={deleteConfirmPopupOptions.opened as boolean}
        titleText={t('confirmation')}
        positiveButtonText={t('delete')}
        negativeButtonText={t('cancel')}
        bodyText={t('message.confirm_delete')}
        onCancel={() => setDeleteConfirmPopupOptions({ opened: false, id: -1 })}
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
              style={[
                rstyles.titleText,
                {
                  textAlign: 'center'
                }
              ]}
            >
              {t('refill_reminder_preference.refill_reminder_updated')}
            </ThemedText>
            <View style={{ alignItems: 'center' }}><CircleCheckIcon /></View>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 5,
                justifyContent: 'center'
              }}
            >
              <ThemedText style={rstyles.labelText}>{t('click')}</ThemedText>
              <TouchableOpacity onPress={() => handleReminderSettingVisible(false)}>
                <ThemedText style={[rstyles.labelText, { fontWeight: 600 }]}>{t('here')}</ThemedText>
              </TouchableOpacity>
              <ThemedText style={rstyles.labelText}>{t('to_continue')}</ThemedText>
            </View>
          </ThemedView>
        }
        {!reminderSettingPanelOptions.saved&&
          <ThemedView style={rstyles.container}>
            <View style={rstyles.header}>
              <ThemedText style={rstyles.titleText}>{t('refill_reminder_preference.refill_reminder_preference')}</ThemedText>
              <ThemedText style={rstyles.descText}>{t('refill_reminder_preference.alert_when_amount_low').replace('${mini}', `${reminderSettingPanelOptions.miniStock?? 1}`)}</ThemedText>
            </View>
            <View style={[rstyles.rowWrapper, rstyles.thretholdWrapper]}>
              <ThemedText style={rstyles.labelText}>{t('refill_reminder_preference.threshold')}:</ThemedText>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={{ textAlign: 'right', height: 50 }}
                  placeholder="1-1000"
                  value={reminderSettingPanelOptions.threshold as string}
                  onChangeText={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, threshold: v })}
                />
              </View>
            </View>
            {reminderSettingErrors?.threshold&&
              <View style={[rstyles.rowWrapper]}>
                <ThemedText style={rstyles.errorText}>{reminderSettingErrors.threshold}</ThemedText>
              </View>
            }
            <View style={[rstyles.rowWrapper]}>
              <ThemedText style={rstyles.labelText}>{t('refill_reminder_preference.push_notification')}:</ThemedText>
              <View>
                <Switch
                  trackColor={{ false: '#eee', true: '#0066ff' }}
                  ios_backgroundColor={'#0066ff'}
                  thumbColor={reminderSettingPanelOptions.pushNotification ? '#fff' : '#999'}
                  value={reminderSettingPanelOptions.pushNotification as boolean}
                  onValueChange={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, pushNotification: v })}
                />
              </View>
            </View>
            <View style={[rstyles.rowWrapper]}>
              <ThemedText style={rstyles.labelText}>{t('refill_reminder_preference.email_alert')}:</ThemedText>
              <View>
                <Switch
                  trackColor={{ false: '#eee', true: '#0066ff' }}
                  ios_backgroundColor={'#0066ff'}
                  thumbColor={reminderSettingPanelOptions.emailAlert ? '#fff' : '#999'}
                  value={reminderSettingPanelOptions.emailAlert as boolean}
                  onValueChange={(v) => setReminderSettingPanelOptions({ ...reminderSettingPanelOptions, emailAlert: v })}
                />
              </View>
            </View>
            <View style={[rstyles.action]}>
              <TouchableHighlight
                onPress={handleReminderSettingSave}
                style={rstyles.button}
              >
                <View style={[rstyles.buttonTextWrapper, { borderRightColor: '#e2e2e2', borderRightWidth: 1 }]}>
                  <Text style={rstyles.buttonText}>{t('save')}</Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => handleReminderSettingVisible(false)}
                style={rstyles.button}
              >
                <View style={rstyles.buttonTextWrapper}>
                  <Text style={rstyles.buttonText}>{t('dismiss')}</Text>
                </View>
              </TouchableHighlight>
            </View>
          </ThemedView>
        }
      </Modal>
      <ThemedView style={styles.listHeader}>
        <ThemedText
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
      </ThemedView>
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
      <ThemedView style={styles.actionWrapper}>
        <CustomButton onPress={handleAddMedication}>
          <Text style={styles.addMedicationButtonText}>+{t('medication_manage.add_medication')}</Text>
        </CustomButton>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listHeader: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10
  },
  listHeaderText: {
    textAlign: 'center',
    fontSize: 14
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    columnGap: 10,
  },
  infoWrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: '#777',    
  },
  itemTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#000',
    columnGap: 5,
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
  addMedicationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 500
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
  titleText: {
    fontSize: 20,
    fontWeight: 600,
    color: '#000'
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 15
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 400
  },
  descText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#000'
  },
  thretholdWrapper: {
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1
  },
  labelText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000'
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1
  },
  button: {
    flex: 1,
    height: 45
  },
  buttonTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000'
  }
});
