import { IAppState } from '@/@types';

const tintColorLight = '#114dbd';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
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