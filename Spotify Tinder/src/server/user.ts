import { createHash } from "crypto";

import { db } from "./db.js";

export class User {
    #id: number;
    #userName: string;

    constructor(id: number, userName: string){
        this.#id = id;
        this.#userName = userName;
    }

    static async createUser(userName: string, password: string){
        // TODO: Test for username/password already existing
        let rows = await db.all(`SELECT id FROM Users WHERE userName = ? AND password = ?`, userName, User.#hash(password));
        if (rows.length > 0) {
            return null;
        }

        let result = await db.run(`INSERT INTO Users (userName, password) VALUES (?, ?)`, userName, User.#hash(password));
        let id = result.lastID;
        return new User(id, userName);
    }

    static async login(userName: string, password: string){
        try{
            let result = await db.get(`SELECT * FROM Users WHERE userName = ? AND password = ?`, userName, User.#hash(password));
            if(!result){
                return null;
            }
            return new User(result.id, result.userName);

        }
        catch (e){
            console.log(e);
            return null;
        }
    }

    static async verify(user_id: number): Promise<boolean> {
        try {
            let result = await db.get('SELECT * FROM Users WHERE id = ?', user_id);
            if (!result) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    }

    static #hash = (string: string): string => {
        return createHash('sha256').update(string).digest('hex');
    }

    json(){
        return {
            id: this.#id,
            userName: this.#userName
        }
    }
}