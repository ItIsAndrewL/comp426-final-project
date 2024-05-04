import { db } from "./db.js";

await db.run(`DROP TABLE IF EXISTS Users`);

await db.run('DROP TABLE IF EXISTS Favorites')

await db.run(`CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY, userName varchar(50) NOT NULL, password varchar(256) NOT NULL)`);

await db.run('CREATE TABLE IF NOT EXISTS Favorites (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, song_id varchar(256) NOT NULL, title TEXT, artist TEXT, album_url TEXT, FOREIGN KEY (user_id) REFERENCES Users(id))');

await db.close();