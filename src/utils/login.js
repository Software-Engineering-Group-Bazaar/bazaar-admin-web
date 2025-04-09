/*// src/services/authService.js
import apiClientInstance from '../api/apiClientInstance';
// *** IMPORTANT: Use the correct API class name based on your HAR log ***
import  TestAuthApi  from '../api/api/TestAuthApi'; // <<< Make sure this matches your generated file name
import  LoginDTO  from '../api/model/LoginDTO';

export const loginUser = async (username, password) => {
  // Use the correct API class
  const testAuthApi = new TestAuthApi(apiClientInstance); // <<< Use correct class instance

  const loginPayload = new LoginDTO();
  loginPayload.username = username;
  loginPayload.password = password;

  console.log("Attempting login via TestAuthApi for:", username);

  return new Promise((resolve, reject) => {
    try {
      // *** IMPORTANT: Check the method name in generated TestAuthApi.js ***
      // It might be testAuthLoginPost, apiTestAuthLoginPost, etc.
      testAuthApi.apiTestAuthLoginPost(loginPayload, (error, data, response) => { // <<< Use correct method name
        if (error) {
          console.error('Login API Error:', error);
          console.error('Login API Response:', response);
          const status = error?.status || response?.status || null;
          let message = 'Login failed. Please check your credentials.';
          return false;
          //reject({ message: message, status: status }); // TODO: Lijepo prikazati
        } else {
          console.log('Login successful via API.');
          console.log('API Response Data:', data);
          localStorage.setItem('auth', true);
          resolve(data);
        }
      });
    } catch (err) {
       console.error('Synchronous error calling login API:', err);
       reject({ message: err.message || 'An unexpected error occurred.', status: null });
    }
  });
};*/