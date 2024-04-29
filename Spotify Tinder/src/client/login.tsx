import "./login.css";

import { useState } from "react";

function Login() {
  const [count, setCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const error_field = document.getElementById('errorField')!; //! Pretty sure this will always be null

  let userAuthenticated = async () =>{
    let isAuth = await fetch('/api/isAuth');
    //setLoginStatus(isAuth.body);
  }


  async function signIn(){
    try{
      // if(!userName || !password){
      //   error_field.innerHTML = `Please ensure Username and Password fields are filled in`;
      //   return
      // }
      return await fetch('/api/login', {
        method: 'POST', 
        body: JSON.stringify({userName: userName, password: password}), 
        headers: {'Content-type' : 'application/json'},
        //mode: 'cors'
      });

    }catch (e){
      console.log(e);
      // error_field.innerText = `Something went wrong, please try again.`;
      return;
    }
  }

  return (
    <div className='login'>
        <p id='errorField'></p>
        <p>Username</p>
        <input id="userName" name="username" placeholder="johndoe123" type="text" onChange={(e) => {setUserName(e.target.value); if(error_field) error_field.innerText = ``;} } />
        <p>Password</p>
        <input id="password" name="password" placeholder="*********" type="password" onChange={(e) => {setPassword(e.target.value); if(error_field) error_field.innerText = ``;}} />
        <button id="loginButton" onClick={signIn}>Login</button>
    </div>
  );
}

export default Login;
