import { db } from "./db.mjs";

db.run(`DROP TABLE IF EXISTS Users`);

db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY_KEY, userName varchar(50) NOT NULL, password varchar(256) NOT NULL)`);

db.close();