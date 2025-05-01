import axios from "axios";
import { useState } from "react";
import register from "../styles/register.module.css";
import { useNavigate } from 'react-router-dom';

function Register()
{
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [registered, setRegistered] = useState(false);

    async function handleSubmit(e)
    {   
        e.preventDefault();
        try
        {   
            const response = await axios.post("http://localhost:3000/api/register",
                { name: name, email: email, password: password },
            );
            // alert(response.data.message);
            console.log("Reuslt", response.data);
            localStorage.setItem('ID',response.data.newUser._id)
            
            setRegistered(true);
        }
        catch(err)
        {
            console.log(err);
        }
    }
    function handleName(e)
    {
        setName(e.target.value);
    }
    function handleEmail(e)
    {
        setEmail(e.target.value);
    }
    function handlePassword(e)
    {
        setPassword(e.target.value);
    }
    function handleOK()
    {
        navigate('/avatar');
    }

    return(
    <div className={register.container}>
        <form onSubmit={handleSubmit}>
        <h1 className={register.header}>Register</h1>        
        <div className={register.body}>
                <div className={register.content}>
                    <label htmlFor="name">Name:</label>
                    <input className={register.input} type="text" name="name" onChange={handleName} placeholder="enter name" defaultValue="" required></input>
                </div>
                <div className={register.content}>
                    <label htmlFor="email">Email:</label>
                    <input className={register.input} type="text" name="email" onChange={handleEmail} placeholder="enter email" defaultValue="" required></input>
                </div>
                <div className={register.content}>
                    <label htmlFor="password">Password:</label>
                    <input className={register.input} type="password" name="password" onChange={handlePassword} placeholder="enter password" defaultValue="" required></input>
                </div>
                <button className={register.register} type="submit">Register</button>
        </div>
        </form>

        {registered && <div className={register.success}>
            <div className={register.successbox}>
                <div>Success!</div>
                <button className={register.ok} onClick={handleOK}>OK</button>
            </div>
        </div>}

    </div>)
}

export default Register;