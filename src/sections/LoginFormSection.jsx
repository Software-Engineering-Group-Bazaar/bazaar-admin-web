import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";
import SocialLoginButton from "../components/SocialLoginButton";
import { formContainer } from "./LoginFormSectionStyles";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const LoginFormSection = () => {
  return (
    <Box sx={formContainer}>
      <Typography variant="h4" color="text.secondary" fontWeight={700} mb={2}>
        Welcome
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Login to continue
      </Typography>
      <CustomTextField label="Email" sx={{ mb: 2 }} />
      <CustomTextField label="Password" type="password" sx={{ mb: 2 }} />
      <Box textAlign="right" mb={2}></Box>
      <CustomButton fullWidth>LOGIN</CustomButton>
     
    </Box>
  );
};

export default LoginFormSection;
