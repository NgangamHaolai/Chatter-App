import axios from "axios";
import { useState, useRef } from "react";
import login from "../styles/login.module.css";
import { useNavigate } from "react-router-dom";

function Login()
{        
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [usernameError, setUsernameError] = useState("");
    // const [passwordError, setPasswordError] = useState("");

    const successRef = useRef(null);
    const [ loggedIn, setLoggedIn ] = useState(false);

    function handleUsername(e)
    {
        setUsername(e.target.value);
    }
    function handlePassword(e)
    {
        setPassword(e.target.value);
    }
    async function handleLogin(e)
    {
        e.preventDefault();
        try
        {            
            const response = await axios.post(`${import.meta.env.VITE_CHATTER_APP_URL_SERVER}/api/login`, 
                {username: username, password: password},
            );
            // alert(response.data.message);
            // console.log("the id:",response.data.userID);
            localStorage.setItem('ID', response.data.userID);
            // console.log(response.data);
            setLoggedIn(true);
            successRef.current.focus();
        }
        catch(err)
        {
            // if(err.response.status === 404)
            // {
            //     // return alert(err.response.data.message);
            //     return setUsernameError(err.response.data.message);
            // }
            // if(err.response.status === 401)
            // {
            //     return setPasswordError(err.response.data.message);
            // }
            console.log(err);
        }
    }
    function handleOK()
    {
        navigate('/chat');
    }

    return(<div>
        <div className={login.container}>
            
        <form onSubmit={handleLogin}>
            <h1 className={login.header}>Login</h1>
            <div className={login.body}>
                <div className={login.username}>
                    <label htmlFor="username">Username:</label>
                    <input className={login.input} type="text" defaultValue={username} name="email" onChange={handleUsername} placeholder="enter username" required></input>
                    {usernameError && <p className={login.err}>**{usernameError}**</p>}
                </div>
                <div className={login.password}>
                    <label htmlFor="password">Password:</label>
                    <input className={login.input} type="password" name="password" onChange={handlePassword} placeholder="enter password" required></input>
                    {passwordError && <p className={login.err}>**{passwordError}**</p>}
                </div>
                    <button className={login.login} type="submit">Login</button>
            </div>
        </form>

        { loggedIn && <div className={login.success}>
                <div className={login.successbox}>
                    <div>Success!</div>
                    <button className={login.OK} onClick={handleOK} type="submit" ref={successRef}>OK</button>
                </div>
        </div>}
        </div>
    </div>)
}
export default Login;