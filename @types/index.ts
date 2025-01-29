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
  frequency: string,
  notifications: number,
}

export type TResponse = {
  success: boolean,
  data?: any,
  message?: string
}