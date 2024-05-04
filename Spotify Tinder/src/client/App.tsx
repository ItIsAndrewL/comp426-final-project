import "./App.css";

import { PAGE } from "./page"

import { useEffect, useState } from "react";

import Login from "./auth/login";
import Signup from "./auth/signup"
import Album_Art from "./album_art";
import Buttons from "./buttons";
import SwipeScreen from "./swipe_screen";
import Favorites from "./favorites";

function App() {
  const [page, setPage] = useState(PAGE.BLANK);
  const [errorStatus, setErrorStatus] = useState("");
  const [token, setToken] = useState("");
  const [showComponent, setShowComponent] = useState('A');

  useEffect(() => {
    //* Note this will fire twice in dev due to Strict mode being on
    const token = localStorage.getItem('jwt-token') ?? "";
    setToken(token);
    fetch('/api/isAuth', {
      headers: {
        'jwt-token': token
      }
    }).then(res => res.json())
    .then(data => {
      if (data.isAuth) {
        setPage(PAGE.AUTHED);
      } else {
        setPage(PAGE.LOGIN);
      }
    });
  }, []);

  let logout = () => {
    setToken('');
    localStorage.removeItem('jwt-token');
  }

  let content;
  if(page == PAGE.FAVORITES) {
    content = <Favorites token={token} setPage={setPage}/>
  } else if (page == PAGE.LOGIN) {
    content = <Login setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} setToken={setToken} />;
  } else if (page == PAGE.SIGNUP) {
    content = <Signup setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} />;
  } else if (page == PAGE.AUTHED) {
    content = (
      <div>
      <SwipeScreen token={token} setPage={setPage}/>
      </div>
    );
  } else {
    content = <h1>LOADING!</h1>;
  }


  return (
    <div className="App">
      <h1 className="Title">Spotify Tinder</h1>
         <div>{content}</div>
    </div>
  );

  
}

export default App;
