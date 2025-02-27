/**
 * Utility Definition
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import Toast from 'react-native-simple-toast';
import dayjs from 'dayjs';

import { DosageUnitType } from '@/config/constants';
import { Platform } from 'react-native';

export const generateBoxShadowStyle = (
  xOffset: number,
  yOffset: number,
  shadowColorIos: string,
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
  shadowColorAndroid: string,
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
};

export const getDateString = (date: string): string => {
  const isToday = require('dayjs/plugin/isToday');
  dayjs.extend(isToday);
  if ((dayjs(date) as any).isToday()) {
    return 'Today';
  } else {
    const str = dayjs(date).format('hh:mm A, MMM D YYYY').toString();
    return str;
  }
}

export const getMarkLabelFromName = (name: string): string => {
  if (name.trim().length === 0) {
    return '';
  }
  const arr = name.split(' ');
  const s = arr.reduce((acc, cur) => `${acc}${cur[0].toUpperCase()}`, '');
  return s;
}

export const getMarkColorFromName = (name: string): {[k: string]: string} => {
  if (name.trim().length === 0) {
    return { bgColor: '#eee', textColor: '#000' };
  }
  const arr = name.split(' ');
  const s = arr.reduce((acc, cur) => `${acc}${cur[0].toUpperCase()}`, '');
  const hash = (s[0].charCodeAt(0) * 69892959 + s[1].charCodeAt(0)) % 16777215;

  const bgcolor = `#${hash.toString(16).padStart(6, '0')}`;

  const r = parseInt(bgcolor.substring(1, 3), 16);
  const g = parseInt(bgcolor.substring(3, 5), 16);
  const b = parseInt(bgcolor.substring(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  const textcolor = luminance > 0.5 ? "#333" : "#eee";
  return { bgColor: bgcolor, textColor: textcolor };
}

export const validateEmail = (email: string): boolean => {
  return !!String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const getDosageUnitString = (dosageUnit: number) => {
    switch (dosageUnit) {
      case DosageUnitType.PL:
        return 'pill';
      case DosageUnitType.MG:
        return 'mg';
      case DosageUnitType.ML:
        return 'ml'
    }

    return 'pill';
  }

  export const showToast = (message: string) => {
    Toast.showWithGravityAndOffset(
      message, 
      Toast.LONG, 
      Toast.BOTTOM, 
      0,
      30,
      {
        backgroundColor: 'black',
        textColor: 'white',
        tapToDismissEnabled: true,
      }
    );
  }