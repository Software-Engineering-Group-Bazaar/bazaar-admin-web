import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import SocialLoginButton from '../components/SocialLoginButton';
import { formContainer, socialButtonsWrapper } from './LoginFormSectionStyles';
import { FcGoogle } from 'react-icons/fc';          
import { FaFacebookF } from 'react-icons/fa';

const LoginFormSection = () => {
  return (
    <Box sx={formContainer}>
      <Typography variant="h4" color="text.secondary" fontWeight={700} mb={2}>
        Welcome
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Login to continue
      </Typography>
      <CustomTextField label="Email" sx={{ mb: 2 }}/>
      <CustomTextField label="Password" type="password" sx={{ mb: 2 }}/>
      <Box textAlign="right" mb={2}>
      <Typography
        variant="body2"
        sx={{
            cursor: 'pointer',
            fontWeight: 'bold',
            color: 'primary.main',
            transition: 'color 0.3s',
            '&:hover': {
            color: 'primary.dark', 
            },
        }}
        align="right"
        >
        Forgot your password?
        </Typography>
      </Box>
      <CustomButton fullWidth>LOGIN</CustomButton>
      <Box my={3} display="flex" alignItems="center">
        <Box flex={1} height="1px" bgcolor="#ccc" />
        <Typography mx={2} color="text.secondary">OR</Typography>
        <Box flex={1} height="1px" bgcolor="#ccc" />
      </Box>
      <Box sx={socialButtonsWrapper}>
      <SocialLoginButton icon={<FcGoogle />} label="Google" />
      <SocialLoginButton icon={<FaFacebookF />} label="Facebook" />
      </Box>
      <Typography align="center" color="text.secondary" mt={4}>
        Don’t have an account?{' '}
        <Box
            component="span"
            fontWeight="bold"
            sx={{
                color: 'primary.main',
                cursor: 'pointer',
                transition: 'color 0.3s',
                '&:hover': {
                color: 'primary.dark', 
                },
            }}
            >
            Register Now
        </Box>
      </Typography>
    </Box>
  );
};

export default LoginFormSection;
