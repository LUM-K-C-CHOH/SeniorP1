import { Icon } from "@expo/vector-icons/build/createIconSet";

/**
 * Types Definition
 * RTHA
 * 
 * Created by Thornton on 01/23/2025
 */
export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ISetting {
  theme: 'dark'|'light',
  font: 'small'|'normal'|'large',
  push: 'on'|'off'
}

export interface IAppState {
  authenticated: boolean;
  user: IUser|null;
  currentPath: string;
  lockScreen: boolean;
  setting: ISetting
}

export type TFrequency = {
  dosage: number,
  dosageUnit: number,
  cycle: number,
  times: string[]
}
export interface IMedication {
  id?: number,
  image: string,
  name: string,
  stock: number,
  frequency: TFrequency,
  startDate: string,
  endDate: string,
  threshold: number,
  pushAlert: string,
  emailAlert: string,
}

export interface IAppointment {
  id?: number,
  name: string,
  phone: string,
  image: string,
  scheduledTime: string,
  description: string,
  location: string,
}

export interface IContact {
  id: number,
  name: string,
  phone: string,
  image: string,
}

export interface IEmergencyContact extends IContact {
  type?: string
}

export interface INotification {
  id: number,
  type: number,
  var1: string,
  status: number,
  targetId: number,
  reservedTime: number,
}

export type TResponse = {
  success: boolean,
  data?: any,
  message?: string
}