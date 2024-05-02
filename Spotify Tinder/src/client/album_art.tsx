import "./App.css";

import { useState } from "react";

function Album_Art() {
  const [count, setCount] = useState(0);
  const [imageLink, setImageLink] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");


  

  return (
    <div>
      <div>
        <img width={300} height={300}></img>
      </div>
      <div>
        <h3>{songTitle}</h3>
        <p>{songTitle}</p>
      </div>
    </div>
    
  );
}

export default Album_Art;
