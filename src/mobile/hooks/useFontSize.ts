/**
 * Font Size hook
 * RTHA
 * 
 * Created by Morgan on 03/23/2025
 */
import React, { useContext } from 'react';
import ApplicationContext from '@/context/ApplicationContext';

export function useFontSizeRatio() {
  const { appState } = useContext(ApplicationContext);
  const fontsize = appState.setting.font ?? 'normal';
  if (fontsize === 'normal') {
    return 1;
  } else if (fontsize === 'small') {
    return 0.8;
  } else if (fontsize === 'large') {
    return 1.2;
  }
  return 1;
}