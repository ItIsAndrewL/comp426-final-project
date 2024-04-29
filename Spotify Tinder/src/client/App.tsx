import "./App.css";

import { useState } from "react";

import reactLogo from "./assets/react.svg";
import Login from "./login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Login />
    </div>
  );

  
}

export default App;
