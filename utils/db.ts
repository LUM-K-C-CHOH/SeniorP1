/**
 * Database Unitily
 * RTHA
 * 
 * Created by Thorton on 17/02/2025
 */
import * as SQLite from 'expo-sqlite';
import { createStore, Row, TablesSchema, } from 'tinybase';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';

const store = createStore();

const Tables = {
  USERS: 'users',
  SETTINGS: 'settings',
  MEDICATIONS: 'medications',
  FREQUENCIES: 'frequencies',
  APPOINTMENTS: 'appointments',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  NOTIFICATIONS: 'notifications',
}

const shcema: TablesSchema = {
  [Tables.USERS]: {
    id: { type: 'number', },
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' }
  },
  [Tables.SETTINGS]: {
    id: { type: 'number' },
    userId: { type: 'number' },
    theme: { type: 'string' },
    font: { type: 'string' },
    push: { type: 'string' },
  },
  [Tables.MEDICATIONS]: {
    id: { type: 'number' },
    image: { type: 'string' },
    name: { type: 'string' },
    stock: { type: 'number' },
    miniStock: { type: 'number' },
    frequencyId: { type: 'number' }, 
    notifications: { type: 'number' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    createdAt: { type: 'string' }
  },
  [Tables.FREQUENCIES]: {
    id: { type: 'number' },
    dosage: { type: 'number' },
    dosageUnit: { type: 'number' },
    cycle: { type: 'number' },
    times: { type: 'string' }
  }, 
  [Tables.APPOINTMENTS]: {
    id: { type: 'number' },
    contactId: { type: 'number' },
    scheduledTime: { type: 'string' },
    description: { type: 'string' },
    location: { type: 'string' },
    createdAt: { type: 'string' },
  },
  [Tables.EMERGENCY_CONTACTS]: {
    id: { type: 'number' },
    name: { type: 'string' },
    phone: { type: 'string' },
    image: { type: 'string' },
    type: { type: 'string' },
  },
  [Tables.NOTIFICATIONS]: {
    id: { type: 'number' },
    type: { type: 'number' },
    var1: { type: 'string' },
    status: { type: 'number' },
    targetId: { type: 'number' },
    reservedTime: { type: 'number' },
  }
};
store.setTablesSchema(shcema);

const persister = createExpoSqlitePersister(
  store,
  SQLite.openDatabaseSync('rtha.db'),
  {
    mode: 'tabular',
  }
);
persister.load().then(persister.startAutoSave);

export const addData = async (table: string, id: string | number, data: Row) => {
  store.setRow(table, id.toString(), data);
  await persister.save();
};

export const getAllData = (table: string) => {
  return store.getTable(table);
};

export const getRowData = (table: string, id: string | number) => {
  return store.getRow(table, id.toString());
};

export const updateData = async (table: string, id: string | number, data: Row) => {
  store.setPartialRow(table, id.toString(), data);
  await persister.save();
};

export const deleteData = async (table: string, id: string | number) => {
  store.delRow(table, id.toString());
  await persister.save();
};

export const syncFromServer = async (endpoint: string, table: string) => {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    store.setTable(table, data);
  } catch (error) {
    console.error(`Error syncing ${table} from server:`, error);
  }
};

export const syncToServer = async (table: string, id: string | number) => {
  const data = getRowData(table, id);
  if (data) {
    
    // insert, update
    // await fetch(`${endpoint}/${id}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
  } else {
    // delete

  }
};