import React, { useState } from "react";
import axios from "axios";
import "../../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { useToken } from "./tokenContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAuthToken } = useToken();

  // Función para el login convencional
  const login = async () => {
    try {
      const params = new URLSearchParams();
      params.append("username", username);
      params.append("password", password);

      console.log("Authentication data sent:", username, password);
      const response = await axios.post("/api/auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      console.log("response.status:", response.status);
      console.log("TOKEN:", response.data.access_token);
      if (response.status === 200) {
        setAuthToken(response.data.access_token);
        localStorage.setItem("token", response.data.access_token);
        onLogin();
        navigate("/home");
        console.log("LOGIN SUCCESSFUL", response.data);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Función para redirigir al registro
  const register = async () => {
    navigate("/register");
  };

  // Manejador de éxito para el inicio de sesión con Google
  const handleGoogleSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      console.log("Google TOKEN:", googleToken);

      // Enviar el token de Google al backend para autenticar o registrar al usuario
      const res = await axios.post("/api/auth/google", { token: googleToken });
      if (res.status === 200) {
        setAuthToken(res.data.access_token);
        localStorage.setItem("token", res.data.access_token);
        onLogin();
        navigate("/home");
        console.log("Login con Google exitoso");
      }
    } catch (err) {
      console.error("Error durante el login con Google:", err);
    }
  };

  // Manejador de error para el inicio de sesión con Google
  const handleGoogleFailure = (error) => {
    console.error("Error de inicio de sesión con Google:", error);
  };

  return (
    <div className="login">
      <h1>Iniciar Sesión</h1>
      <div className="google-login-container">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
      </div>
      <div className="login-input-container">
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="auth-button-container">
        <button className="auth-button" onClick={login}>
          Login
        </button>
        <button className="auth-button" onClick={register}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
