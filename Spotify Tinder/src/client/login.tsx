import "./login.css";

import { useState } from "react";

function Login() {
  const [count, setCount] = useState(0);
  let error_field = document.getElementById('errorField') as HTMLParagraphElement;

  async function Login(userName: string, password: string){

    return await fetch('https://localhost/login:3000', {method: 'POST', body: JSON.stringify({userName: userName, password: password}), headers: {'Content-type' : 'application/json'}});
  }

  const loginButton = document.getElementById("LoginButton");
  if(loginButton){
    loginButton.onclick = async () => {
      let username_element = document.getElementById('userName') as HTMLInputElement;
      let password_element = document.getElementById('password') as HTMLInputElement;
      let userName = username_element.value;
      let password = password_element.value;
      if(userName == '' && password == ''){
        error_field.innerHTML = "Please complete username and password fields."
        setTimeout(() => error_field.innerHTML = '', 5000)
      }
      Login(userName, password);
    }
  }

  return (
    <div className='login'>
        <p id='errorField'></p>
        <input id="userName" placeholder="johndoe123" type="text">Username</input>
        <input id="password" placeholder="*********" type="password">Password</input>
        <button id="loginButton">Login</button>
    </div>
  );
}

export default Login;
