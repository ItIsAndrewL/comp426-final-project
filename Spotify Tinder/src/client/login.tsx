import "./login.css";

import { useState } from "react";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [errorStatus, setErrorStatus] = useState("");

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
        // * Add logic for successful sign in
      } else {
        setErrorStatus(await response.text());
        return;
      }

    }catch (e){
      console.log(e);
      setErrorStatus(`Something went wrong, please try again.`);
      return;
    }
  }

  return (
    <div className='login'>
        <p>Username</p>
        <input id="userName" name="username" placeholder="johndoe123" type="text" onChange={e => setUserName(e.target.value)} />
        <p>Password</p>
        <input id="password" name="password" placeholder="*********" type="password" onChange={e => setPassword(e.target.value)} />
        <button id="loginButton" onClick={signIn}>Login</button>
        <p className='errorStatus'>{errorStatus}</p>
    </div>
  );
}

export default Login;
