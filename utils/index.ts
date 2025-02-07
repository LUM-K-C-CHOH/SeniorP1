import dayjs from "dayjs";
import { Platform } from "react-native";

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