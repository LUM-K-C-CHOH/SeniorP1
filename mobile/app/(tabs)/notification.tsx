/**
 * Notification List Screen
 * RTHA
 * 
 * Created by Morgan on 01/28/2025
 */
import React, { useState, useEffect, useRef, useContext } from 'react';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';
import Modal from 'react-native-modal';
import ApplicationContext from '@/context/ApplicationContext';

import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { deleteNotificationGroup, getNotificationList } from '@/services/notification';
import { INotification, TResponse } from '@/@types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon } from '@/utils/svgs';
import { Colors, NotificationType } from '@/config/constants';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { showToast } from '@/utils';

export default function NotificationScreen() {
  const initiatedRef = useRef<boolean>(false);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const { appState, setAppState } = useContext(ApplicationContext);
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationList, setNotificationList] = useState<INotification[]>([]);
  const [selectableVisible, setSelectableVisible] = useState<boolean>(false);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [deleteConfrimVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);
  const [notificationPopupOptions, setNotificationPopupOptions] = useState<{ opened: boolean, notification: INotification|null }>({ opened: false, notification: null });

  useEffect(() => {
    if (initiatedRef.current) return;

    initiatedRef.current = true;

    getNotificationList()
      .then((res: TResponse) => {
        if (res.success) {
          setNotificationList(res.data);
        }
      })
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
    if (checkedIdList.length === notificationList.length) {
      setCheckedIdList([]);
    } else {
      const idList = notificationList.map(v => v.id as number);
      setCheckedIdList(idList);
    }
  }

  const handleContactDelete = (): void => {
    if (checkedIdList.length === 0) return;

    setAppState({ ...appState, lockScreen: true });

    const idList = checkedIdList.join(',');
    const ret = deleteNotificationGroup(idList);
    if (ret) {
      const filter = notificationList.filter(v => !checkedIdList.includes(v.id as number));
      setNotificationList([...filter]);
      setDeleteConfirmResultVisible(true);
    } else {
      showToast(t('message.alert_delete_fail'));
    }

    setAppState({ ...appState, lockScreen: false });
  }

  const handleDeleteConfirmResult = (): void => {
    setDeleteConfirmVisible(false);
    setDeleteConfirmResultVisible(false);
    setCheckedIdList([]);
  }

  const getNotificationTypeText = (notification: INotification|null): string => {
    if (!notification) return '';

    if (notification.type === NotificationType.MEDICATION) {
      return t('notification_manage.low_stock_alert');
    } else if (notification.type === NotificationType.APPOINTMENT) {
      return t('notification_manage.appointment_alert');
    } else if (notification.type === NotificationType.EMERGENCY) {
      return t('notification_manage.emergency_alert');
    }
    return ``;
  }

  const getNotificationMessage = (notification: INotification|null): string => {
    if (!notification) return '';

    if (notification.type === NotificationType.MEDICATION) {
      return t('notification_manage.message_low_stock').replace('${var1}', notification.var1);
    } else if (notification.type === NotificationType.APPOINTMENT) {
      return t('notification_manage.message_appointment');
    } else if (notification.type === NotificationType.EMERGENCY) {
      return t('notification_manage.message_emergency');
    }
    return ``;
  }

  const handleRefillReminderSetting = (notification: INotification|null): void => {
    setNotificationPopupOptions({ opened: false, notification: null });

    if (!notification) return;

    router.push({ pathname: '/medication', params: { medicationId: notification.targetId } })
  }

  const handleLoadData = async (): Promise<void> => {
    setIsLoading(true);
    getNotificationList()
      .then((res: TResponse) => {
        setIsLoading(false);

        if (res.success) {
          setNotificationList(res.data?? []);
        } else {

        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }

  type NotificationItemProps = {
    id: number,
    notification: INotification,
    checkedStatus: boolean,
  };
  
  const NotificationItem = ({
    id,
    notification,
    checkedStatus
  }: NotificationItemProps): JSX.Element => {
    return (
      <TouchableHighlight
        onLongPress={handleLongPress}
        onPress={() => setNotificationPopupOptions({ opened: true, notification })}
      >
        <ThemedView
          style={[
            nstyles.itemWrapper,
            {
              borderBottomColor: appState.setting.theme === 'light' ? Colors.light.defaultSplitter : Colors.dark.defaultSplitter
            }
          ]}
        >
          <View
            style={nstyles.typeWrapper}
          >
            <ThemedText
              type="small"
              style={nstyles.typeText}
            >
              {getNotificationTypeText(notification)}
            </ThemedText>
          </View>
          <View style={nstyles.infoWrapper}>
            <ThemedText
              type="default"
            >
              {getNotificationMessage(notification)}
            </ThemedText>
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
      <Modal
        isVisible={notificationPopupOptions.opened}
        style={pstyles.container}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackdropPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
        onBackButtonPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
        onSwipeComplete={() => setNotificationPopupOptions({ opened: false, notification: null })}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <ThemedView style={pstyles.mainWrapper}>
          <View style={pstyles.titleWrapper}>
            <ThemedText type="subtitle">
              {getNotificationTypeText(notificationPopupOptions.notification)}
            </ThemedText>
          </View>
          <View style={pstyles.textWrapper}>
            <ThemedText
              type="default"
              style={pstyles.normalText}
            >
              {getNotificationMessage(notificationPopupOptions.notification)}
            </ThemedText>
          </View>
          <View style={pstyles.actionsWrapper}>
            <TouchableHighlight
              onPress={() => handleRefillReminderSetting(notificationPopupOptions.notification)}
              style={pstyles.button}
            >
              <ThemedView style={[pstyles.buttonTextWrapper, { borderRightColor: '#e2e2e2', borderRightWidth: 1 }]}>
                <ThemedText type="default">
                  {t('refill_now')
                }</ThemedText>
              </ThemedView>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
              style={pstyles.button}
            >
              <ThemedView style={pstyles.buttonTextWrapper}>
                <ThemedText type="default">
                  {t('snooze')}
                </ThemedText>
              </ThemedView>
            </TouchableHighlight>
        </View>
        </ThemedView>
      </Modal>
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
            <View style={ConfirmResultStyle.iconWrapper}>
              <CircleCheckIcon />
            </View>
            <View style={ConfirmResultStyle.actionsWrapper}>
              <ThemedText style={ConfirmResultStyle.labelText}>{t('click')}</ThemedText>
              <TouchableOpacity onPress={handleDeleteConfirmResult}>
                <ThemedText
                  style={[
                    ConfirmResultStyle.labelText, ConfirmResultStyle.linkText
                  ]}
                >
                  {t('here')}
                </ThemedText>
              </TouchableOpacity>
              <ThemedText style={ConfirmResultStyle.labelText}>
                {t('to_continue')}
              </ThemedText>
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
                {checkedIdList.length === notificationList.length
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
                  setDeleteConfirmVisible(true)
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
          data={notificationList}
          renderItem={
            ({item}) => <NotificationItem
                          id={item.id as number}
                          notification={item}
                          checkedStatus={checkedIdList.includes(item.id as number)}
                        />
          }
          keyExtractor={item => `${item.id}`}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleLoadData} />
          }
        />
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

const nstyles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    columnGap: 10,
  },
  typeWrapper: {
    width: 80,
  },
  typeText: {  
    textTransform: 'uppercase'
  },
  infoWrapper: {
    flex: 1,
  },
});

const pstyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mainWrapper: {
    width: '90%',
    maxWidth: 450,
    borderRadius: 10
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 15
  },
  textWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  normalText: {
    textAlign: 'center'
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
