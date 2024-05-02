import { useEffect, useState } from "react";
import Album_Art from "./album_art";
import Buttons from "./buttons";

export interface Song {
    name: string;
    preview_url: string | null;
    album: {
    images: { url: string }[];
    name: string;
    };
    artists: {name: string}[];
}


function SwipeScreen({token}: {token: string}){
    type EmptySongArray = Song[];
    const [songs, setSongs] = useState<EmptySongArray>([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0)
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)
  

    async function fetchData(): Promise<Song[]>{
        try{
            const response = await fetch('/api/get-next-tracks', {headers: {'jwt-token': token}})
            const data = await response.json();
            const mappedSongs: Song[] = data
            .filter((item: any) => item.preview_url !== null)
            .map((item: any) => ({
                name: item.name,
                preview_url: item.preview_url,
                album:{
                    images: item.album.images.map((image: any) => ({url: image.url})),
                    name: item.album.name
                },
                artists: item.artists.map((artist: any) => ({name: artist.name}))
            }));
            return mappedSongs;
        }catch (e){
            console.log('Error fetching data: ', e);
            return []
        }
    }

    useEffect( () => {
        async function fetchDataAndUpdateState() {
            const data = await fetchData();
            setSongs(data);
            setCurrentSongIndex(0)
        }
        fetchDataAndUpdateState();
    }, []);

    useEffect(() => {
        const audio = new Audio();
        setAudioRef(audio)

        if(currentSongIndex !== null && songs[currentSongIndex] && songs[currentSongIndex].preview_url){
            audio.src = songs[currentSongIndex].preview_url ?? '';
            audio.play()
        }

        return () => {
            audio.pause;
            audio.src = ''
        };
    }, [currentSongIndex, songs])

    const handleNextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    };
    
    const handleLikeDislike = (like: boolean) => {
        if(audioRef){
            audioRef.pause();
            audioRef.src = '';
        }

        handleNextSong()
    }
return(
    <div>
        {songs.length > 0 && (
            <div>
                {songs[currentSongIndex] && <Album_Art song={songs[currentSongIndex]}/>}
                <Buttons onlikeDislike={handleLikeDislike}/>
            </div>
        )}
    </div>
)
}

export default SwipeScreen;