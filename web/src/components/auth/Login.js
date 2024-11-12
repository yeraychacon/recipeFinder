import React, { useState }  from 'react';
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
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            console.log('Datos  enviados:', username, password);
            const response = await axios.post('/api/auth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log('response.status:', response.status);
            console.log('TOKEN:', response.data.access_token);
            if (response.status === 200){
                setAuthToken(response.data.access_token);
                localStorage.setItem('token', response.data.access_token);
                onLogin();
                navigate('/home');
                console.log('Login exitoso');
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
            <h1>Register</h1>
            <div className="login-imput-container">
                <input type="text" placeholder = "username " vale={username} onChange={(e)=> setUsername(e.target.value)}/>
                <input type="password" placeholder = "password " vale={password} onChange={(e)=> setPassword(e.target.value)}/>
            </div>
            <div className="auth-button-container">
                <button className="auth-button" onClick={login}>Login</button>
                <button className="auth-button" onClick={register}>Register</button>
            </div>
        </div>
    );
}

export default Login;