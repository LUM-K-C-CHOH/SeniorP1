/**
 * Database Unitily
 * RTHA
 * 
 * Created by Thorton on 17/02/2025
 */
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app_data.db');

export const Tables = {
  USERS: 'users',
  SETTINGS: 'settings',
  MEDICATIONS: 'medications',
  FREQUENCIES: 'frequencies',
  APPOINTMENTS: 'appointments',
  EMERGENCY_CONTACTS: 'emergency_contacts',
  NOTIFICATIONS: 'notifications',
}

export const setupDatabase = async () => {
  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.USERS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        country VARCHAR(10) NOT NULL,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.SETTINGS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        theme VARCHAR(10) NOT NULL,
        font VARCHAR(10) NOT NULL,
        push VARCHAR(10) NOT NULL,
        created_at DATETIME,
        updated_at DATETIME
      )
    `); 

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.FREQUENCIES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        medication_id INTEGER NOT NULL,
        dosage INTEGER NOT NULL,
        dosage_unit INTEGER NOT NULL,
        cycle INTEGER NOT NULL,
        times TEXT NOT NULL,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.MEDICATIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image VARCHAR(255),
        name VARCHAR(50) NOT NULL,
        stock INTEGER NOT NULL,
        threshold INTEGER NOT NULL,
        email_alert VARCHAR(10) NOT NULL,
        push_alert VARCHAR(10) NOT NULL,
        start_date VARCHAR(20) NOT NULL,
        end_date VARCHAR(20) NOT NULL,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.APPOINTMENTS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50),
        phone VARCHAR(50),
        image VARCHAR(255),
        scheduled_time VARCHAR(50),
        description TEXT,
        location TEXT,
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.EMERGENCY_CONTACTS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(50),
        phone VARCHAR(50),
        image VARCHAR(255),
        type VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
      )
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${Tables.NOTIFICATIONS} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TINYINT,
        status TINYINT,
        target_id INTEGER,
        var1 VARCHAR(50),
        var2 VARCHAR(50),
        var3 VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
      )
    `);
  });  
}

export const addData = (table: string, data: any): number => {
  let fieldNames: string[] = [];
  let bindValues: string[] = [];
  let dataValues: any[] = [];
  if (table === Tables.USERS) {
    fieldNames = ['name', 'email', 'phone', 'country', 'password', 'created_at', 'updated_at'];
    dataValues = [
      data.name,
      data.email,
      data.phone,
      data.country,
      data.password
    ];
  } else if (table === Tables.SETTINGS) {
    fieldNames = ['user_id', 'theme', 'font', 'push', 'created_at', 'updated_at'];
    dataValues = [
      data.userId,
      data.theme,
      data.font,
      data.push
    ];
  } else if (table === Tables.MEDICATIONS) {
    fieldNames = ['name', 'image', 'stock', 'threshold', 'email_alert', 'push_alert', 'start_date', 'end_date', 'created_at', 'updated_at'];
    dataValues = [
      data.name,
      data.image,
      data.stock,
      data.threshold,
      data.emailAlert,
      data.pushAlert,
      data.startDate,
      data.endDate
    ];
  } else if (table === Tables.FREQUENCIES) {
    fieldNames = ['medication_id', 'dosage', 'dosage_unit', 'cycle', 'times', 'created_at', 'updated_at'];
    dataValues = [
      data.medicationId,
      data.dosage,
      data.dosageUnit,
      data.cycle,
      data.times.join(',')
    ];
  } else if (table === Tables.APPOINTMENTS) {
    fieldNames = ['name', 'phone', 'image', 'scheduled_time', 'location', 'description', 'created_at', 'updated_at'];
    dataValues = [
      data.name,
      data.phone,
      data.image,
      data.scheduledTime,
      data.location,
      data.description,
    ];
  } else if (table === Tables.EMERGENCY_CONTACTS) {
    fieldNames = ['name', 'phone', 'image', 'type', 'created_at', 'updated_at'];
    dataValues = [
      data.name,
      data.phone,
      data.image,
      data.type,
    ];
  } else if (table === Tables.NOTIFICATIONS) {
    fieldNames = ['type', 'status', 'target_id', 'var1', 'var2', 'var3', 'created_at', 'updated_at'];
    dataValues = [       
      data.type,
      data.status,
      data.target_id,
      data.var1,
      data.var2,
      data.var3
    ];
  }
  
  if (fieldNames.length === 0 || dataValues.length === 0) {
    return -1;
  }

  if (data.id) {
    fieldNames = ['id', ...fieldNames];
    dataValues = [data.id, ...dataValues];
  }

  bindValues = Array.from(new Array(fieldNames.length), (_, index) => index < fieldNames.length - 2 ? '?' : 'DATETIME(\'now\')');
  
  const ret = db.runSync(
    `INSERT OR REPLACE INTO ${table} (${fieldNames.join(',')})
    VALUES (${bindValues.join(',')})`,
    dataValues
  );
  return ret.lastInsertRowId;
}

export const getAllData = async (table: string): Promise<any> => {
  const all = await db.getAllAsync(
    `SELECT * FROM ${table}`
  );
  return all;
}

export const getRowData = (table: string, id: number, whereField: string = 'id') => {
  const one = db.getFirstSync(
    `SELECT * FROM ${table} WHERE ${whereField} = ?`,
    [id]
  );

  return one;
}

export const updateData = (table: string, id: number, data: any, whereField: string = 'id') => {
  let fieldNames: string[] = [];
  let dataValues: any[] = [];
  let bindValues: string[] = [];

  if (table === Tables.USERS) {
    fieldNames = ['name', 'email', 'phone', 'country', 'updated_at'];
    dataValues = [
      data.name,
      data.email,
      data.phone,
      data.country,
      id
    ];
  } else if (table === Tables.SETTINGS) {
    fieldNames = ['theme', 'font', 'push', 'updated_at'];
    dataValues = [
      data.theme,
      data.font,
      data.push,
      id
    ];
  } else if (table === Tables.MEDICATIONS) {
    fieldNames = ['name', 'image', 'stock', 'threshold', 'email_alert', 'push_alert', 'start_date', 'end_date', 'updated_at'];
    dataValues = [
      data.name,
      data.image,
      data.stock,
      data.threshold,
      data.emailAlert,
      data.pushAlert,
      data.startDate,
      data.endDate,
      id
    ];
  } else if (table === Tables.FREQUENCIES) {
    fieldNames = ['dosage', 'dosage_unit', 'cycle', 'times', 'updated_at'];
    dataValues = [
      data.dosage,
      data.dosageUnit,
      data.cycle,
      data.times.join(','),
      id
    ];
  } else if (table === Tables.APPOINTMENTS) {
    fieldNames = ['name', 'phone', 'image', 'scheduled_time', 'description', 'location', 'updated_at'];
    dataValues = [
      data.name,
      data.phone,
      data.image,
      data.scheduledTime,
      data.description,
      data.location,
      id
    ];
  } else if (table === Tables.EMERGENCY_CONTACTS) {
    fieldNames = ['name', 'phone', 'image', 'type', 'updated_at'];
    dataValues = [
      data.name,
      data.phone,
      data.image,
      data.type,
      id
    ];
  } else if (table === Tables.NOTIFICATIONS) {
    fieldNames = ['type', 'status', 'target_id', 'var1', 'var2', 'var3', 'updated_at'];
    dataValues = [
      data.type,
      data.status,
      data.target_id,
      data.var1,
      data.var2,
      data.var3,
      id
    ];
  }

  bindValues = fieldNames.map((v: string, index: number) => index < fieldNames.length - 1 ? `${v}=?` : `${v}=DATETIME(\'now\')`);
  const ret = db.runSync(
    `UPDATE ${table} SET ${bindValues.join(',')} WHERE ${whereField} = ?`,
    dataValues
  );
  return ret.changes > 0;
}

export const deleteData = (table: string, id: number, whereField: string = 'id') => {
  const ret = db.runSync(`DELETE FROM ${table} WHERE ${whereField} = ?`, [id]);
  return ret.changes > 0;
}

