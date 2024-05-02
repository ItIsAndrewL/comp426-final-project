import { useState } from "react"
import "./login.css"

import { PAGE } from "../page";

export default function Signup({ setPage, setErrorStatus, errorStatus }: any) {
    const [newUser, setNewUser] = useState("");
    const [newPass, setNewPass] = useState("");
    


    async function onSubmit() {
        if (!newUser || !newPass) {
            setErrorStatus("Please enter a Username and Password");
            return;
        }
        try {
            let response = await fetch('/api/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userName: newUser, password: newPass})
            });
            if (response.ok) {
                // Redirect to Login Page
                setErrorStatus("Account Creation Successful. Please Log In.");
                setPage(PAGE.LOGIN);
            } else {
                setErrorStatus(await response.text());
            }
        } catch (e) {
            console.log(e);
            setErrorStatus("There was an error, please try again.");
        }
    }


    return (
        <div className="signup">
            <h1>Sign Up</h1>
            <p>Username</p>
            <input id="userName" name="username" placeholder="johndoe123" type="text" onChange={e => {setNewUser(e.target.value); setErrorStatus("");}} />
            <p>Password</p>
            <input id="password" name="password" placeholder="*********" type="password" onChange={e => {setNewPass(e.target.value); setErrorStatus("");}} />
            <button id="loginButton" onClick={onSubmit}>Sign Up</button>
            <p className='errorStatus'>{errorStatus}</p>
            <button id="toLogIn" className="login-signup-btn" onClick={() => {setPage(PAGE.LOGIN); setErrorStatus("");}}>Have an account? Log In</button>
        </div>
    );
}