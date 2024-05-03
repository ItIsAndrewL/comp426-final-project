import "./App.css";
import {Song} from './swipe_screen'
import { useState } from "react";

function Album_Art({song}: {song: Song}) {

  return (
    <div>
      <div>
        <img width={300} height={300} src={song.album.images[0].url}></img>
      </div>
      <div>
        <h3>{song.name || "Unknown Song"}</h3>
        <p>{song.album.name || "Unknown Album"}</p>
        {song.artists.map((artist) => (
          <p>{artist.name || "Unknown Artist"}</p>
        ))}
      </div>
    </div>
    
  );
}

export default Album_Art;
