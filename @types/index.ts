import { Icon } from "@expo/vector-icons/build/createIconSet";

/**
 * Types Definition
 * RTHA
 * 
 * Created By Thornton at 01/23/2025
 */
export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface IAppState {
  authenticated: boolean;
  user: IUser|null;
  currentPath: string;
  lockScreen: boolean;
}

export interface IMedication {
  id: number,
  image: string,
  name: string,
  dosage: string,
  stock: number,
  miniStock: number,
  frequency: string,
  notifications: number,
  startDate: string,
  endDate: string,
}

export interface IAppointment {
  id: number,
  contactId: number,
  scheduledTime: string,
  description: string,
  location: string,
  createdAt: string,
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