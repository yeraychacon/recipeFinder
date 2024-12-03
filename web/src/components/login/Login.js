import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Auth.css";
import { useNavigate } from "react-router-dom";
import { useToken } from "./tokenContext";
import { GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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

  // Manejador de error para el inicio de sesión con Google
  const handleGoogleFailure = (error) => {
    console.error("Error de inicio de sesión con Google:", error);
  };

  // Implementación de Google One Tap Login
  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      const credentialResponseDecoded = jwtDecode(
        credentialResponse.credential
      );
      console.log("Google One Tap credential:", credentialResponseDecoded);
      // Manejar el login con las credenciales de Google
      handleGoogleLogin(credentialResponseDecoded);
    },
    onError: (error) => {
      console.error("Google One Tap error:", error);
    },
  });

  // Función para manejar el inicio de sesión con Google
  const handleGoogleLogin = async (credentialResponseDecoded) => {
    try {
      const response = await axios.post("/api/auth/google", {
        credentialResponseDecoded,
      });
      if (response.status === 200) {
        setAuthToken(response.data.access_token);
        localStorage.setItem("token", response.data.access_token);
        onLogin();
        navigate("/home");
        console.log("LOGIN SUCCESSFUL WITH GOOGLE", response.data);
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="auth-container">
      <h1>Iniciar Sesión</h1>
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
        <br />
        <br />
        <a href="/register" className="auth-link">
          ¿No tienes cuenta? Registrate
        </a>
        <br />
        <br />
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const credentialResponseDecoded = jwtDecode(
                credentialResponse.credential
              );
              console.log("Google credential:", credentialResponseDecoded);
              handleGoogleLogin(credentialResponseDecoded);
            }}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
