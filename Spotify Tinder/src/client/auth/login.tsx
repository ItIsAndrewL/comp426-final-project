import "./login.css";
import { PAGE } from "../page";

import { useState } from "react";

function Login({ setPage, setErrorStatus, errorStatus }: any) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  let userAuthenticated = async () =>{
    let isAuth = await fetch('/api/isAuth');
    //setLoginStatus(isAuth.body);
  }


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
        // TODO: Add logic for successful sign in
        console.log(await response.json());
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
        <input id="userName" name="username" placeholder="johndoe123" type="text" onChange={e => setUserName(e.target.value)} />
        <p>Password</p>
        <input id="password" name="password" placeholder="*********" type="password" onChange={e => setPassword(e.target.value)} />
        <button id="loginButton" onClick={signIn}>Login</button>
        <p className='errorStatus'>{errorStatus}</p>
        <button id="tosignup" onClick={() => setPage(PAGE.SIGNUP)}>Need an account? Sign Up</button>
    </div>
  );
}

export default Login;
