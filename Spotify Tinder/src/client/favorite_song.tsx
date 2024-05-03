import { Song } from "./swipe_screen";

function favoriteSong({song}:{song:Song}){

return(
    <div>
    <div>
        <img src={song.album.images[0].url}/>
    </div>
    <div>
         <p>{song.name}</p>
         {song.artists.map((artist) => (<p>{artist.name}</p>))}
    </div>
    </div>
)

}

export default favoriteSong