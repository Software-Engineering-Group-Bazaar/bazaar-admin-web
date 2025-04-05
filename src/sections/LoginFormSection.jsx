import React from "react";
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

const LoginFormSection = () => {
  const [email, setEmail] = useState('');
  const { isValid, error } = validateEmail(email);
  return (
    <Box sx={formContainer}>
      <Typography variant="h4" color="text.secondary" fontWeight={700} mb={2}>
        Welcome
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Login to continue
      </Typography>
      <CustomTextField label="Email" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} error={email.length > 0 && !isValid} helperText={email.length > 0 && error}/>
      <CustomTextField label="Password" type="password" sx={{ mb: 2 }} />
      <Box textAlign="right" mb={2}></Box>
      <CustomButton fullWidth>LOGIN</CustomButton>
     
    </Box>
  );
};

export default LoginFormSection;
