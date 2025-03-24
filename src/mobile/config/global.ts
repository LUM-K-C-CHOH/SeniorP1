/**
 * Global State Manage
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
import { IAppState } from '@/@types';
import { InitialAppState, KEY_APP_STATE } from '@/config/constants';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { SHA256 } from 'crypto-js';

let appState: IAppState = InitialAppState;

export const loadAppState = async (): Promise<void> => {
  const res = await getStorageItem(KEY_APP_STATE);
  let state;
  try {
    state = JSON.parse(res);
  } catch (e) {
    state = { ...InitialAppState };
    setStorageItem(KEY_APP_STATE, JSON.stringify(state));      
  } finally {
    appState = state;
  }

  console.log('load app state >>>', appState);
}

export const saveAppState = (state: IAppState, where?: string): void => {
  getStorageItem(KEY_APP_STATE).then(old => {
    const new_ = JSON.stringify(state);

    console.log('save app state >>> ', where, new_);

    if (old && old.length > 0) {
      const oldHash = SHA256(old).toString();
      const newHash = SHA256(new_).toString();

      if (oldHash === newHash) return;
    }

    if (state.lockScreen) return;

    appState = state;
    setStorageItem(KEY_APP_STATE, new_);
  });
}

export const getAppState = (): IAppState => {
  return appState;
}

export const setAppState = (state: IAppState, needSave = false): void => {
  appState = state;
  if (needSave) {
    saveAppState(state);
  }
}