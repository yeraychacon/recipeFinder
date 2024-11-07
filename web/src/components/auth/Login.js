import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { useToken } from './tokenContext';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setAuthToken } = useToken();

    const login = async () => {
        try {
            const userData = {
                username: username,
                password: password,
            };
            console.log('Datos enviados:', username);
            const response = await axios.post('http://localhost:4000/auth/login', userData);
            console.log('Respuesta:', response);
            if (response.status === 200) {
                setAuthToken(response.data.token);
                navigate('/home');
            }
        } catch (err) {
            console.error('Error durante el login:', err);
        }
    };

    const register = async () => {
        navigate('/register');
    }
    return (
        <div className="login">
            <span className="loginTitle">Login</span>
            <form className="loginForm">
                <label>Username</label>
                <input
                    type="text"
                    className="loginInput"
                    placeholder="Enter your username..."
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    className="loginInput"
                    placeholder="Enter your password..."
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="loginButton" onClick={login}>Login</button>
                <button className="registerButton" onClick={register}>Register</button>
            </form>
        </div>
    );
}

export default Login;