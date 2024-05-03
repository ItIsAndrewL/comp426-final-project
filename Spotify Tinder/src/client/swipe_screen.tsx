import { useEffect, useState } from "react";
import Album_Art from "./album_art.js";
import Buttons from "./buttons.js";

export interface Song {
    id: string;
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
    const [currentSongIndex, setCurrentSongIndex] = useState(-1)
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

    useEffect( () => {
        fetchDataAndUpdateState();
    }, []);

    useEffect(() => {
        if (songs.length > 0 && currentSongIndex === -1) {
          setCurrentSongIndex(0);
        }
      }, [songs, currentSongIndex]);

    useEffect(() => {
        const handleAudioPlayback = () => {
            if (audioRef) {
              audioRef.pause();
              audioRef.src = '';
            }
      
            if (currentSongIndex >= 0 && currentSongIndex < songs.length && songs[currentSongIndex] && songs[currentSongIndex].preview_url) {
              const audio = new Audio(songs[currentSongIndex].preview_url ?? '');
              setAudioRef(audio);
              audio.play();
            } else {
              console.log('Invalid index or no preview URL available');
            }
          };
      
          handleAudioPlayback();
    }, [songs, currentSongIndex]);
  

    async function fetchData(): Promise<Song[]>{
        try{
            const response = await fetch('/api/get-next-tracks', {headers: {'jwt-token': token}})
            const data = await response.json();
            const mappedSongs: Song[] = data
            .filter((item: any) => item.preview_url !== null)
            .map((item: any) => ({
                id: item.id,
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

    async function fetchDataAndUpdateState() {
        const data = await fetchData();
        setSongs(data);
    };

    async function addToFavorites(){
        try{
            const response = await fetch("/api/favorite/" + songs[currentSongIndex].id, {method: "POST", headers: {'jwt-token': token}});
            if(response.ok){
                console.log("song has been added")
            }else{
                console.log("song has not been added")
            }

        }catch (e){
            console.log("There's been an error: ",e)
        }
    }

    // function resetAudio(){
    //     if (audioRef) {
    //         audioRef.pause();
    //         audioRef.src = '';
    //     }

    //     if(currentSongIndex >= 0 && currentSongIndex < songs.length && songs[currentSongIndex] && songs[currentSongIndex].preview_url){
    //         const audio = new Audio();
    //         setAudioRef(audio);
    //         audio.src = songs[currentSongIndex].preview_url ?? '';
    //         audio.play()
    //     } else {
    //         console.log('Invalid index or no preview URL available');
    //       }

    // }

    

    const handleNextSong = () => {
        if(currentSongIndex < songs.length - 1){
            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
            // resetAudio();
        }else{
            fetchDataAndUpdateState().then(() => {
                setCurrentSongIndex(0);
            });
            // resetAudio();
        }
        
    };
    
    const handleLikeDislike = (like: boolean) => {
        if(audioRef){
            audioRef.pause();
            audioRef.src = '';
        }

        handleNextSong()

        if(like){
            addToFavorites();
        }else{
            console.log("I don't like:", songs[currentSongIndex].name)
        }
    }


if(songs.length === 0){
    return(
        <p>loading...</p>
    )
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