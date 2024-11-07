import React, { useState } from 'react';
import axios from 'axios';
//import css
import {useNavigate} from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
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
            const response = await axios.post('http://localhost:4000/auth/register', userData);
        
            if (response.status == 200){
                navigate('/');
            }
        } catch (err) {
            console.error('Error durante el registro:', err);
        }
    }
    return (
        <div className="register">
        <span className="registerTitle">Register</span>
        <form className="registerForm">
            <label>Username</label>
            <input
            type="text"
            className="registerInput"
            placeholder="Enter your username..."
            onChange={(e) => setUsername(e.target.value)}
            />
            <label>Email</label>
            <input
            type="email"
            className="registerInput"
            placeholder="Enter your email..."
            onChange={(e) => setUsername(e.target.value)}
            />
            <label>Phone</label>
            <input
            type="text"
            className="registerInput"
            placeholder="Enter your phone number..."
            onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
            type="password"
            className="registerInput"
            placeholder="Enter your password..."
            onChange={(e) => setPassword(e.target.value)}
            />
            <button className="registerButton" type="submit">
            Register
            </button>
        </form>
        <button className="registerLoginButton" onClick={() => navigate('/')}>
            Login
        </button>
        {error && <span style={{ color: 'red', marginTop: '10px' }}>{error}</span>}
        </div>
    );
    }

export default Register;