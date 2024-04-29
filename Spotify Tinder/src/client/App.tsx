import "./App.css";
import { PAGE } from "./page"

import { useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";
import Login from "./auth/login";
import Signup from "./auth/signup"

function App() {
  const [page, setPage] = useState(PAGE.LOGIN);
  const [errorStatus, setErrorStatus] = useState("");

  let content;
  if (page == PAGE.LOGIN) {
    content = <Login setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} />;
  } else if (page == PAGE.SIGNUP) {
    content = <Signup setPage={setPage} errorStatus={errorStatus} setErrorStatus={setErrorStatus} />;
  }


  return (
    <div className="App">
      {content}
    </div>
  );

  
}

export default App;
