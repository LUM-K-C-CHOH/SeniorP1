/**
 * Internationalization Configuration
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
import i18n from 'i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from '@/locales/en-US/translation.json';
import pt from '@/locales/pt-BR/translation.json';

import { initReactI18next } from 'react-i18next';

const resources = {
  'en-US': { translation: en },
  'pt-BR': { translation: pt },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.locale;
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLanguage,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;