/**
 * Database Sychronization
 * RTHA
 * 
 * Created by Morgan on 02/24/2025
 */
import NetInfo from '@react-native-community/netinfo';
import { getAllUnSyncedData, Tables, updateAllData, updateAllDataToSynced } from "./db";
import { getStorageItem, setStorageItem } from '@/utils/storage';
import {
  KEY_DB_SYNCED,
  KEY_DB_SYNCED_APPOINTMENT,
  KEY_DB_SYNCED_EMERGENCY_CONTACT,
  KEY_DB_SYNCED_FREQUENCY,
  KEY_DB_SYNCED_MEDICATION,
  KEY_DB_SYNCED_NOTIFICATION,
  KEY_DB_SYNCED_SETTING
} from '@/config/constants';
import { userSettingSyncWithServer, userSettingSyncToServer } from './setting';
import { frequencySyncWithServer, medicationSyncWithServer, medicationListSyncToServer, frequencyListSyncToServer } from './medication';
import { appointmentSyncWithServer, appointmentListSyncToServer } from './appointment';
import { emergencyContactSyncWithServer, emergencyContactListSyncToServer } from './emergency';
import { notificationSyncWithServer, notificationListSyncToServer } from './notification';
export const syncLocalDatabaseWithRemote = async (userId?: string) => {
  const settingSyncedStatus = await getStorageItem(KEY_DB_SYNCED_SETTING);
  let retSetting = true;
  if (settingSyncedStatus !== 'true') {
    retSetting = await userSettingSyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_SETTING, retSetting ? 'true' : 'false');
  }

  const frequencySyncedStatus = await getStorageItem(KEY_DB_SYNCED_FREQUENCY);
  let retFrequency = true;
  if (frequencySyncedStatus !== 'true') {
    retFrequency = await frequencySyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_FREQUENCY, retFrequency ? 'true' : 'false');
  }

  const medicationSyncedStatus = await getStorageItem(KEY_DB_SYNCED_MEDICATION);
  let retMedication = true;
  if (medicationSyncedStatus !== 'true') {
    retMedication = await medicationSyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_MEDICATION, retMedication ? 'true' : 'false');
  }

  const appointmentSyncedStatus = await getStorageItem(KEY_DB_SYNCED_APPOINTMENT);
  let retAppointment = true;
  if (appointmentSyncedStatus !== 'true') {
    retAppointment = await appointmentSyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_APPOINTMENT, retAppointment ? 'true' : 'false');
  }

  const emergencyContactSyncedStatus = await getStorageItem(KEY_DB_SYNCED_EMERGENCY_CONTACT);
  let retEmergencyContact = true;
  if (emergencyContactSyncedStatus !== 'true') {
    retEmergencyContact = await emergencyContactSyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_EMERGENCY_CONTACT, retEmergencyContact ? 'true' : 'false');
  }

  const notificationSyncedStatus = await getStorageItem(KEY_DB_SYNCED_NOTIFICATION);
  let retNotification = true;
  
  if (notificationSyncedStatus === 'true') {
    retNotification = await notificationSyncWithServer(userId);
    setStorageItem(KEY_DB_SYNCED_NOTIFICATION, retNotification ? 'true' : 'false');
  }

  let ret = retSetting && retFrequency && retMedication && retAppointment && retEmergencyContact && retNotification;
  setStorageItem(KEY_DB_SYNCED, ret ? 'true' : 'false');
  return ret;
}

export const syncLocalUpdatesToServer = async (user_id: string) => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    console.log('database sync: no internet connection.');
    return;
  }

  const settingData = await getAllUnSyncedData(Tables.SETTINGS);
  const medicationList = await getAllUnSyncedData(Tables.MEDICATIONS);
  const frequencyList = await getAllUnSyncedData(Tables.FREQUENCIES);
  const appointmentList = await getAllUnSyncedData(Tables.APPOINTMENTS);
  const emergencyContactList = await getAllUnSyncedData(Tables.EMERGENCY_CONTACTS);
  const notificationList = await getAllUnSyncedData(Tables.NOTIFICATIONS);

  if (settingData[0]) {
    const ret = await userSettingSyncToServer(settingData);
    if (ret) {
      updateAllDataToSynced(Tables.SETTINGS);
    }
  }
  
  if (medicationList.length > 0) {
    const ret = await medicationListSyncToServer(medicationList, user_id);
    if (ret) {
      updateAllDataToSynced(Tables.MEDICATIONS);
    }
  }
  
  if (frequencyList.length > 0) {
    const ret = await frequencyListSyncToServer(frequencyList, user_id);
    if (ret) {
      updateAllDataToSynced(Tables.FREQUENCIES);
    }
  }

  if (appointmentList.length > 0) {
    const ret = await appointmentListSyncToServer(appointmentList, user_id);
    if (ret) {
      updateAllDataToSynced(Tables.FREQUENCIES);
    }
  }

  if (emergencyContactList.length > 0) {
    const ret = await emergencyContactListSyncToServer(emergencyContactList, user_id);
    if (ret) {
      updateAllDataToSynced(Tables.EMERGENCY_CONTACTS);
    }
  }

  if (notificationList.length > 0) {
    const ret = await notificationListSyncToServer(notificationList, user_id);
    if (ret) {
      updateAllDataToSynced(Tables.NOTIFICATIONS);
    }
  }
}