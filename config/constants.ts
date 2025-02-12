/**
 * Constants Definition
 * RTHA
 * 
 * Created By Thornton at 01/20/2025
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
    background: '#fff',
    tint: tintColorLight,
    defaultIcon: '#000',
    grayIcon: '#666',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    defaultText: '#fff',
    grayText: '#777',
    darkGrayText: '#454b60',
    redText: 'red',
    defaultControlText: '#222',
    defaultButtonText: '#fff',
    background: '#151718',
    tint: tintColorDark,
    defaultIcon: '#fff',
    grayIcon: '#666',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const KEY_APP_STATE = '__app_state';
export const KEY_ACCESS_TOKEN = '__access_token';

export const InitialAppState: IAppState = {
  authenticated: false,
  user: null,
  currentPath: '/login',
  lockScreen: false,
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