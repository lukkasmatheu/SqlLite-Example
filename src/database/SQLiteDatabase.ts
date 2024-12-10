import * as SQLite from 'expo-sqlite';
import { SQLiteRunResult } from 'expo-sqlite';
import { Car } from './CarRepository';

export const db = SQLite.openDatabaseSync("database.sqlite");

export function execQuery(query:string):Promise<void> {
  return db.execAsync(query);
}

export function runQuery(query:string,parameters:any[]):Promise<SQLiteRunResult> {
  return db.runAsync(query,parameters);
}

export function getQuery(query:string,parameters?:any[]):Promise<Car[]> {
  return parameters == null ? db.getAllAsync<Car>(query): db.getAllAsync<Car>(query,parameters);
}
