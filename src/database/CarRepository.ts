import { SQLiteDatabase } from "expo-sqlite";
import { execQuery, getQuery, runQuery } from "./SQLiteDatabase";

export type Car = {
  id?: number;
  brand: string;
  model: string;
  hp: number;
};

export default class CarRepository {
  
  
  constructor() {
    this.up();
  }

  public async up() {
    await execQuery(`
      CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);
    `)
  }

  public async down() {
    await execQuery("DROP TABLE cars;");
  }

  public async create(car: Car) {
    const result = await runQuery(
      "INSERT INTO cars (brand, model, hp) values (?, ?, ?);",
      [car.brand, car.model, car.hp]
    );
    console.log(result);
  }

  public async update(car: Car) {
    const result = await runQuery(
      "UPDATE cars SET brand=?, model=?, hp=? WHERE id = ?;",
      [car.brand, car.model, car.hp, car.id]
    );
    console.log(result);
  }

  public async delete(id: number) {
    await runQuery(
      "DELETE FROM cars WHERE id = ?",
      [id]
    );
  }

  public async getByModel(filter: string) {
    const result = await getQuery("SELECT * FROM cars where model LIKE '%"+ filter +"%'");
    console.log(result)
    return result;
  }

  public async all() {
    const result = await getQuery("SELECT * FROM cars");
    return result;
  }
}
