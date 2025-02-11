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
  Text,
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

export default function NotificationScreen() {
  const initialRef = useRef<boolean>(false);

  const { t } = useTranslation();

  const [notificationList, setNotificationList] = useState<INotification[]>([]);
  const [selectableVisible, setSelectableVisible] = useState<boolean>(false);
  const [checkedIdList, setCheckedIdList] = useState<number[]>([]);
  const [deleteConfrimVisible, setDeleteConfirmVisible] = useState<boolean>(false);
  const [deleteConfirmResultVisible, setDeleteConfirmResultVisible] = useState<boolean>(false);
  const [notificationPopupOptions, setNotificationPopupOptions] = useState<{ opened: boolean, notification: INotification|null }>({ opened: false, notification: null });

  useEffect(() => {
    if (initialRef.current) return;

    initialRef.current = true;

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
            <ThemedText style={nstyles.typeText}>{getNotificationTypeText(notification)}</ThemedText>
          </View>
          <View style={nstyles.infoWrapper}>
            <ThemedText style={nstyles.normalText}>{getNotificationMessage(notification)}</ThemedText>
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
            <ThemedText style={pstyles.titleText}>{getNotificationTypeText(notificationPopupOptions.notification)}</ThemedText>
          </View>
          <View style={pstyles.textWrapper}>
            <ThemedText style={pstyles.normalText}>{getNotificationMessage(notificationPopupOptions.notification)}</ThemedText>
          </View>
          <View style={pstyles.actionsWrapper}>
            <TouchableHighlight
              onPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
              style={pstyles.button}
            >
              <View style={[pstyles.buttonTextWrapper, { borderRightColor: '#e2e2e2', borderRightWidth: 1 }]}>
                <Text style={pstyles.buttonText}>{t('refill_now')}</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => setNotificationPopupOptions({ opened: false, notification: null })}
              style={pstyles.button}
            >
              <View style={pstyles.buttonTextWrapper}>
                <Text style={pstyles.buttonText}>{t('snooze')}</Text>
              </View>
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
      <GestureHandlerRootView style={styles.container}>
        {selectableVisible&&
          <ThemedView style={styles.toolbarWrapper}>
            <TouchableOpacity onPress={handleSelectAll}>
              <View style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
                {checkedIdList.length === notificationList.length
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
    fontSize: 12,
    fontWeight: 400,
    color: '#000',    
    textTransform: 'uppercase'
  },
  infoWrapper: {
    flex: 1,
  },
  normalText: {
    fontSize: 14,
    fontWeight: 400,
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
    backgroundColor: '#fff',
    borderRadius: 10
  },
  titleWrapper: {
    alignItems: 'center',
    marginTop: 15
  },
  titleText: {
    fontSize: 17,
    fontWeight: 600,
    color: '#000'
  },
  textWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  normalText: {
    fontSize: 14,
    fontWeight: 400,
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
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 400,
    color: '#000'
  }
});
