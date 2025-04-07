import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";
import SocialLoginButton from "../components/SocialLoginButton";
import { formContainer } from "./LoginFormSectionStyles";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { validateEmail } from "../utils/validation";
import { useState } from "react";
// import apiClientInstance from '../api/apiClientInstance'; // Import configured client
// import { AdminApi, TestAuthApi } from '../api/api/AdminApi';
import { loginUser } from "../utils/login";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {api} from '../utils/apiroutes'





const LoginFormSection = () => {
  var baseURL = import.meta.env.VITE_API_BASE_URL
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isValid, error } = validateEmail(email);

  const navigate = useNavigate();

  const handleLogIn = () => {
    const status = loginUser(email, password);
    if (status !== false) navigate('/users');
  }

  function handleSubmit(event) {
      event.preventDefault();
  
      const loginPayload = {
        email: email,
        password: password,
      };
      console.log(baseURL)
      console.log(import.meta.env);
      axios
        .post(`${baseURL}/api/Auth/login`, loginPayload)
        .then((response) => {
          const token = response.data.token;
  
          localStorage.setItem("token", token);
          localStorage.setItem("auth", true);  
          if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
  
          navigate("/users");
        })
        .catch((err) => console.log(err));
    }

  return (
    <Box sx={formContainer}>
      <Typography variant="h4" color="text.secondary" fontWeight={700} mb={2}>
        Welcome
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Login to continue
      </Typography>
      <CustomTextField label="Email" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} error={email.length > 0 && !isValid} helperText={email.length > 0 && error}/>
      <CustomTextField label="Password" type="password" sx={{ mb: 2 }}  value={password} onChange={p => setPassword(p.target.value)}/>
      <Box textAlign="right" mb={2}></Box>
      <CustomButton fullWidth onClick={handleSubmit}>LOGIN</CustomButton>
     
    </Box>
  );
};

export default LoginFormSection;
