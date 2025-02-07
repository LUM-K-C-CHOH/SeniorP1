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
  name: string,
  scheduledTime: string,
  description: string,
  createdAt: string,
}

export type TResponse = {
  success: boolean,
  data?: any,
  message?: string
}