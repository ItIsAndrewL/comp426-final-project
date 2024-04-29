import "./login.css";
import { PAGE } from "../page";

import { useState } from "react";

function Login({ setPage, setErrorStatus, errorStatus, setToken }: any) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function signIn(){
    try{
      if(!userName || !password){
        setErrorStatus(`Please ensure Username and Password fields are filled in`);
        return;
      }
      let response = await fetch('/api/login', {
        method: 'POST', 
        body: JSON.stringify({userName: userName, password: password}), 
        headers: {'Content-type' : 'application/json'},
      });

      if (response.ok) {
        let json: {isAuth: boolean, token: string} = await response.json();
        if (json.isAuth) {
          localStorage.setItem('jwt-token', json.token);
          setToken(json.token);
          setPage(PAGE.AUTHED);
        } else {
          setErrorStatus(await response.text());
        }
      } else {
        setErrorStatus(await response.text());
        return;
      }
    }catch (e){
      setErrorStatus(`Something went wrong, please try again.`);
      return;
    }
  }

  return (
    <div className='login'>
      <h1>Log In</h1>
        <p>Username</p>
        <input id="userName" name="username" placeholder="johndoe123" type="text" onChange={e => {setUserName(e.target.value); setErrorStatus("");}} />
        <p>Password</p>
        <input id="password" name="password" placeholder="*********" type="password" onChange={e => {setPassword(e.target.value); setErrorStatus("");}} />
        <button id="loginButton" onClick={signIn}>Login</button>
        <p className='errorStatus'>{errorStatus}</p>
        <button id="tosignup" onClick={() => {setPage(PAGE.SIGNUP); setErrorStatus("");}}>Need an account? Sign Up</button>
    </div>
  );
}

export default Login;
