import React, { useState } from 'react';
import axios from 'axios';

import {useNavigate} from 'react-router-dom';

import '../../styles/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    
    const register = async () => {
        try {
            const userData = {
                username: username,
                email: email,
                phone: phone,
                password: password,
            };
            console.log('Datos enviados:', username, email, phone, password);
            const response = await axios.post('/api/auth/register', userData);
        
            if (response.status === 200){
                navigate('/');
            }
        } catch (err) {
            console.error('Error durante el registro:', err);
        }
    }
    return (
        <div className="auth-container">
            <h1 className='auth-tittle'> </h1>
            <div className="auth-imput-container">
                <input type="text" placeholder = "username " vale={username} onChange={(e)=> setUsername(e.target.value)}/>
                <input type="email" placeholder = "email " vale={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type="text" placeholder = "phone " vale={phone} onChange={(e)=> setPhone(e.target.value)}/>
                <input type="password" placeholder = "password " vale={password} onChange={(e)=> setPassword(e.target.value)}/>
            </div>
            <div className='auth-button-container'>
                <button className="auth-button" onClick={register}>Register</button>
                <br/>
                <br/>
                <a href="/" className="auth-link">Ya tienes una cuenta? Iniciar sesión</a>
            </div>
        </div>
    );
    }

export default Register;