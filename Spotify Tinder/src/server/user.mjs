import { db } from "./db.mjs";

export class User {
    #id
    #userName
    #password

    constructor(id, userName){
        this.#id = id;
        this.userName = userName;
    }

    static async createUser(data){
        console.log(data.userName + ' ' + data.password)
        if((data.userName == undefined) || (data.password == undefined) || (typeof data.userName != 'string') || (typeof data.password != 'string')){
            console.log("failed to create user")
            return null;
        }

        try{
            let result = await db.run(`INSERT INTO Users (userName, password) VALUES (?, ?)`, data.userName, data.password);
            let id = result.lastID;
            return new User(id, data.userName);
        }catch (e){
            console.log(e)
            return null;
        }
    }

    static async login(data){
        if((data.userName == undefined) || (data.password == undefined) || (typeof data.userName != 'string') || (typeof data.password != 'string')){
            return null;
        }

        try{
            let result = await db.run(`SELECT id FROM Users WHERE userName = ? AND password = ?`, data.userName, data.password);
            if(!result){
                return null;
            }
            return new User(result, data.userName);

        }catch (e){
            return null;
        }
    }

    json(){
        return {
            id: this.#id,
            userName: this.#userName
        }
    }
}