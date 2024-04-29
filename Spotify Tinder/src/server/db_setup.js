import { db } from "./db.js";

await db.run(`DROP TABLE IF EXISTS Users`);

await db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, userName varchar(50) NOT NULL, password varchar(256) NOT NULL)`);

await db.close();