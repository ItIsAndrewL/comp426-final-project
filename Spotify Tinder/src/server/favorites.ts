import { db } from "./db.js";

export class Favorites {
    #id: number;
    #user_id: number;
    #favorite_id: string; // Spotify song ID
    #title: string;
    #artists: string;
    #album_url: string;

    constructor(id: number, user_id: number, favorite: string, title: string = "", artists: string = "", album_url: string = "") {
        this.#id = id;
        this.#user_id = user_id;
        this.#favorite_id = favorite;
        this.#title = title;
        this.#artists = artists;
        this.#album_url = album_url;
    }

    static async add_favorite(user_id: number, favorite_id: string, title: string = "", artists: string = "", album_url: string = ""): Promise<boolean> {
        /**
         * Add a song id to the user's favorite list
         * 
         * @return Promise<boolean> if adding succeeded
         */
        // TODO: Make sure favorite is not a duplicate for the user
        try {
            await db.run('INSERT INTO Favorites VALUES (NULL, ?, ?, ?, ?, ?)', user_id, favorite_id, title, artists, album_url);
            return true;
        } catch (e) {
            return false;
        }
    }

    static async get_user_favorites(user_id: number): Promise<Favorites[] | null> {
        /**
         * Gets a list of users favorites, ordered according to their last added
         * 
         * @param user_id id of the user
         * @returns Promise<Favorites[]> ordered list of favorite objects, null on error
         */
        try {
            let result = await db.all("SELECT * FROM Favorites WHERE user_id = ?", user_id);
            return result.map((row: any) => new Favorites(row.id, row.user_id, row.song_id)).sort((a: Favorites, b: Favorites) => b.#id - a.#id);
        } catch (e) {
            return null;
        }
    }

    static async remove_favorite(id: number, user_id: number): Promise<boolean> {
        /**
         * Attempts to return the specified favorite if the user_id is a match
         * 
         * @param id of the favorite table
         * @param user_id of the user who's favorite this is
         */
        try {
            let result = await db.get("SELECT * FROM Favorites WHERE user_id = ? AND id = ?", user_id, id);
            if (!result) {
                return false;
            }
            await db.run("DELETE FROM Favorites WHERE id = ?", id);
            return true;
        } catch (e) {
            return false;
        }
    }

    static async get_last_5_songs(user_id: number): Promise<string[] | null> {
        let favorites = await Favorites.get_user_favorites(user_id);
        if (favorites == null) {
            return null;
        }
        return favorites.map((val: any) => val.#favorite_id).slice(0, 4);
    }

    to_json(song: any) {
        /**
         * Converts object to JSON without the user_id field
         */
        return {
            "id": this.#id,
            "song_id": this.#favorite_id,
            "song": song
        };
    }

    get song_id() {
        return this.#favorite_id;
    }
}