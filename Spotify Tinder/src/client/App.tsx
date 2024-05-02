import "./App.css";

import { PAGE } from "./page"

import { useEffect, useState } from "react";

import Login from "./auth/login";
import Signup from "./auth/signup"

function App() {
  const [page, setPage] = useState(PAGE.BLANK);
  const [errorStatus, setErrorStatus] = useState("");
  const [token, setToken] = useState("");

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
  if (page == PAGE.LOGIN) {
    content = <Login setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} setToken={setToken} />;
  } else if (page == PAGE.SIGNUP) {
    content = <Signup setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} />;
  } else if (page == PAGE.AUTHED) {
    content = <h1>AUTHED!</h1>;

    fetch('/api/spotify-auth', {
      headers: {
        'jwt-token': token
      }
    });
  }


  return (
    <div className="App">
      <h1 className="Title">Spotify Tinder</h1>
      {content}
    </div>
  );

  
}

export default App;
