import { Icon } from "@expo/vector-icons/build/createIconSet";

/**
 * Types Definition
 * RTHA
 * 
 * Created by Morgan on 01/23/2025
 */
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ISetting {
  userId: string,
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

export type IFrequency = {
  id?: number,
  userId: string,
  medicationId: number,
  dosage: number,
  dosageUnit: number,
  cycle: number,
  times: string[]
}
export interface IMedication {
  id?: number,
  userId: string,
  image: string,
  name: string,
  stock: number,
  frequency: IFrequency,
  startDate: string,
  endDate: string,
  stockDate: string,
  threshold: number,
  pushAlert: string,
  emailAlert: string,
}

export interface IAppointment {
  id?: number,
  userId: string,
  name: string,
  phone: string,
  image: string,
  scheduledTime: string,
  description: string,
  location: string,
}

export interface IContact {
  id?: number,
  name: string,
  phone: string,
  image: string,
}

export interface IEmergencyContact extends IContact {
  userId: string,
  type?: string
}
export interface INotification {
  id?: number,
  userId: string,
  type: number,
  var1: string,
  var2: string,
  var3: string,
  status: number,
  targetId: any,
}

export type TResponse = {
  success: boolean,
  data?: any,
  message?: string
}