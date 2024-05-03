import { db } from "./db.js";

export class Favorites {
    #id: number;
    #user_id: number;
    #favorite_id: string; // Spotify song ID

    constructor(id: number, user_id: number, favorite: string) {
        this.#id = id;
        this.#user_id = user_id;
        this.#favorite_id = favorite;
    }

    static async add_favorite(user_id: number, favorite: string): Promise<boolean> {
        /**
         * Add a song id to the user's favorite list
         * 
         * @returns Promise<boolean> if adding succeeded
         */
        // TODO: Make sure user_id exists in user table
        // TODO: Make sure favorite is not a duplicate for the user
        try {
            await db.run('INSERT INTO Favorites VALUES (NULL, ?, ?)', user_id, favorite);
            return true;
        } catch (e) {
            return false;
        }
    }

    static async get_user_favorites(user_id: number): Promise<Favorites[] | null> {
        /**
         * Gets a list of users favorites, ordered according to their last added
         * 
         * @params user_id id of the user
         * @returns Promise<Favorites[]> ordered list of favorite objects, null on error
         */
        // TODO: Make sure user_id exists in user table
        try {
            let result = await db.all("SELECT (id, song_id) FROM Favorites WHERE user_id = ?", user_id);
            return result.sort((a: any,b: any) => b.id - a.id);
        } catch (e) {
            return null;
        }
    }
}