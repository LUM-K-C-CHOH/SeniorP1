/**
 * Global State Definition
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
import React from 'react';

import { IAppState } from '@/@types';
import { InitialAppState } from '@/config/constants';

export interface IAppContext {
  appState: IAppState;
  setAppState: (data: IAppState) => void;
  logout: () => void;
}

const initialAppContext: IAppContext = {
  appState: InitialAppState,
  setAppState: (data: IAppState) => { console.log(data); },
  logout: () => { console.log('logout'); } 
}

const ApplicationContext = React.createContext(initialAppContext);

export const ApplicationContextProvider = ApplicationContext.Provider;
export const ApplicationContextConsumer = ApplicationContext.Consumer;

export default ApplicationContext;