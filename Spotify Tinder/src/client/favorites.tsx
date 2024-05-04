import { useEffect, useState } from "react";
import FavoriteSong from "./favorite_song"
import { Song } from "./swipe_screen";
import {PAGE} from "./page"

function Favorites({token, setPage}:{token: string, setPage: any}){
    type EmptySongArray = Song[];
    const [songs, setSongs] = useState<EmptySongArray>([]);

    useEffect(()=> {
        fetchDataAndUpdateState();
    }, [])

    async function fetchDataAndUpdateState() {
        const data = await fetchData();
        setSongs(data);
    };
    
    async function fetchData(): Promise<Song[]>{
        try{
            const response = await fetch('/api/favorites/', {headers: {'jwt-token': token}})
            const data = await response.json();
            const mappedSongs: Song[] = data
            .map((item: any) => ({
                id: item.id,
                song_id: item.song_id,
                name: item.title,
                preview_url: '',
                album: {
                    images: [{ url: item.song_url }],
                    name: '',
                    },
                    artists: {name: item.artists}
            }));
            console.log(mappedSongs)
            return mappedSongs;
        }catch (e){
            console.log('Error fetching data: ', e);
            return []
        }
    }

    async function deleteSong(id: string){
        try{
            const response = await fetch('/api/favorite/' + id, {headers: {'jwt-token': token}, method: 'DELETE'})
            if(response.ok){
                console.log("song deleted")
                setSongs(songs.filter((song) => song.id != id));
                return
            }else{
                console.log("song not deleted: ", id)
            }
        }catch(e){
            console.log(e)
            return
        }
    }

    return(
        <div>
            <h1>Favorites</h1>
            <button onClick={() => setPage(PAGE.AUTHED)}>Back</button>
            <div>
                {songs.map((song) => (
                    <FavoriteSong song={song} delete={() => deleteSong(song.id)} />
                ))}
            </div>
        </div>
    )
}

export default Favorites;