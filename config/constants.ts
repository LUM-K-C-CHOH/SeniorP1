/**
 * Constants Definition
 * RTHA
 * 
 * Created by Thornton on 01/20/2025
 */
import { IAppState } from '@/@types';

const tintColorLight = '#114dbd';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    defaultText: '#000',
    grayText: '#777',
    darkGrayText: '#454b60',
    redText: 'red',
    defaultButtonText: '#fff',
    defaultControlText: '#222',
    defaultControlBorder: '#e2e2e2',
    defaultSplitter: '#e2e2e2',
    background: '#fff',
    tint: tintColorLight,
    defaultIcon: '#000',
    grayIcon: '#666',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    calendarDayBarBGColor: '#f5f7fa',
  },
  dark: {
    defaultText: '#fff',
    grayText: '#aaa',
    darkGrayText: '#454b60',
    redText: 'red',
    defaultControlText: '#fff',
    defaultControlBorder: '#666',
    defaultSplitter: '#666',
    defaultButtonText: '#fff',
    background: '#151718',
    tint: tintColorDark,
    defaultIcon: '#fff',
    grayIcon: '#666',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    calendarDayBarBGColor: '#888',
  },
};

export const KEY_APP_STATE = '__app_state';
export const KEY_ACCESS_TOKEN = '__access_token';
export const KEY_DB_INITIALIZED = '__db_initialized';
export const KEY_DB_SYNCED = '__db_synced';
export const KEY_DB_SYNCED_SETTING = '__db_synced_setting';
export const KEY_DB_SYNCED_FREQUENCY = '__db_synced_frequency';
export const KEY_DB_SYNCED_MEDICATION = '__db_synced_medication';
export const KEY_DB_SYNCED_APPOINTMENT = '__db_synced_appointment';
export const KEY_DB_SYNCED_EMERGENCY_CONTACT = '__db_synced_emergency_contact';
export const KEY_DB_SYNCED_NOTIFICATION = '__db_synced_notification';

export const InitialAppState: IAppState = {
  authenticated: false,
  user: null,
  currentPath: '/login',
  lockScreen: false,
  setting: {
    theme: 'light',
    font: 'normal',
    push: 'on'
  }
}

export const NotificationType = {
  MEDICATION: 1,
  APPOINTMENT: 2,
  EMERGENCY: 3
}

export const NotificationStatus = {
  PENDING: 1,
  SENT: 2
}

export const DosageUnitType = {
  PL: 1,
  MG: 2,
  ML: 3,
}

export const MedicationCycleType = {
  EVERYDAY: 1,
  TWODAYS: 2,
  THREEDAYS: 3
}

export const SyncStatus = {
  SYNCED: 'synced',
  ADDED: 'add',
  UPDATED: 'updated',
  DELETED: 'deleted',
}