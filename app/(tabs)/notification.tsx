/**
 * Notification List Screen
 * RTHA
 * 
 * Created By Thornton at 01/28/2025
 */
import React, { useState, useEffect, useRef } from 'react';
import ConfirmPanel, { ConfirmResultStyle } from '@/components/ConfrimPanel';
import Modal from 'react-native-modal';

import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTranslation } from 'react-i18next';
import { getNotificationList } from '@/services/notification';
import { INotification, TResponse } from '@/@types';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CheckboxBlankIcon, CheckboxFilledIcon, CircleCheckIcon } from '@/utils/svgs';
import { NotificationType } from '@/config/constants';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function NotificationScreen() {
  const initiatedRef = useRef<boolean>(false);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');

  const { t } = useTranslation();

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
      const idList = notificationList.map(v => v.id);
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

  type ContactItemProps = {
    id: number,
    notification: INotification,
    checkedStatus: boolean,
  };
  
  const ContactItem = ({
    id,
    notification,
    checkedStatus
  }: ContactItemProps): JSX.Element => {
    return (
      <TouchableHighlight
        onLongPress={handleLongPress}
        onPress={() => setNotificationPopupOptions({ opened: true, notification })}
      >
        <ThemedView style={nstyles.itemWrapper}>
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
              style={nstyles.normalText}
            >
              {getNotificationMessage(notification)}
            </ThemedText>
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
            <ThemedText
              type="subtitle"
              style={pstyles.titleText}
            >
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
                <ThemedText
                  type="default"
                  style={pstyles.buttonText}
                >
                  {t('refill_now')
                }</ThemedText>
              </ThemedView>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
              style={pstyles.button}
            >
              <ThemedView style={pstyles.buttonTextWrapper}>
                <ThemedText
                  type="default"
                  style={pstyles.buttonText}
                >
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
              <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
                {checkedIdList.length === notificationList.length
                  ? <CheckboxFilledIcon />
                  : <CheckboxBlankIcon />
                }                
                <ThemedText type="default" style={styles.toolbarText}>{t('select_all')}</ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteConfirmVisible(true)}>
              <ThemedText type="default" style={styles.toolbarText}>{t('delete')}({checkedIdList.length})</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectableVisible(false)}>
              <ThemedText type="default" style={styles.toolbarText}>{t('cancel')}</ThemedText>
            </TouchableOpacity>
          </View>
        }
        <FlatList
          data={notificationList}
          renderItem={
            ({item}) => <ContactItem
                          id={item.id}
                          notification={item}
                          checkedStatus={checkedIdList.includes(item.id)}
                        />
          }
          keyExtractor={item => `${item.id}`}
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
  toolbarText: {
    color: '#000',
  }
});

const nstyles = StyleSheet.create({
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    columnGap: 10,
  },
  typeWrapper: {
    width: 80,
  },
  typeText: {
    color: '#000',    
    textTransform: 'uppercase'
  },
  infoWrapper: {
    flex: 1,
  },
  normalText: {
    color: '#000'
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
  titleText: {
    color: '#000'
  },
  textWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  normalText: {
    color: '#000',
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
  buttonText: {
    color: '#000'
  }
});
