import { useEffect, useState } from "react";
import FavoriteSong from "./favorite_song"
import { Song } from "./swipe_screen";

function Favorites({token}:{token: string}){
    type EmptySongArray = Song[];
    const [songs, setSongs] = useState<EmptySongArray>([]);

    useEffect(()=> {
        fetchDataAndUpdateState();
    })

    async function fetchDataAndUpdateState() {
        const data = await fetchData();
        setSongs(data);
    };
    
    async function fetchData(): Promise<Song[]>{
        try{
            const response = await fetch('/api/favorites/', {headers: {'jwt-token': token}})
            const data = await response.json();
            const mappedSongs: Song[] = data
            .filter((item: any) => item.preview_url !== null)
            .map((item: any) => ({
                id: item.id,
                song_id: item.song_id,
                song: {
                name: item.song.name,
                preview_url: item.song.preview_url,
                album:{
                    images: item.song.album.images.map((image: any) => ({url: image.url})),
                    name: item.song.album.name
                },
                artists: item.song.artists.map((artist: any) => ({name: artist.name}))
            }
            }));
            return mappedSongs;
        }catch (e){
            console.log('Error fetching data: ', e);
            return []
        }
    }

    return(
        <div>
            <h1>Favorites</h1>
            <div>
                {songs.map((song) => (
                    <FavoriteSong song={song}/>
                ))}
            </div>
        </div>
    )
}

export default Favorites;