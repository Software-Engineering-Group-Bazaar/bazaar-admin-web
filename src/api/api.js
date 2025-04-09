import axios from "axios";
import apiClientInstance from './apiClientInstance';
import TestAuthApi from './api/TestAuthApi';
import LoginDTO from './model/LoginDTO';






// ----------------------
// AUTH - Prijava korisnika
// ----------------------




export const apiLoginUserAsync = async (username, password) => {
  const testAuthApi = new TestAuthApi(apiClientInstance);
  const loginPayload = new LoginDTO();
  loginPayload.username = username;
  loginPayload.password = password;

  console.log("Attempting login via TestAuthApi for:", username);

  return new Promise((resolve, reject) => {
    try {
      testAuthApi.apiTestAuthLoginPost(loginPayload, (error, data, response) => {
        if (error) {
          console.error('Login API Error:', error);
          console.error('Login API Response:', response);
          const status = error?.status || response?.status || null;
          const message = 'Login failed. Please check your credentials.';
          reject({ message, status });
        } else {
          console.log('Login successful via API.');
          console.log('API Response Data:', data);
          resolve(data);
        }
      });
    } catch (err) {
      console.error('Synchronous error calling login API:', err);
      reject({ message: err.message || 'An unexpected error occurred.', status: null });
    }
  });
};







// ----------------------
// PENDING USERS - Neodobreni korisnici
// ----------------------





export const apiFetchPendingUsersAsync = async () => {
  try {
    const response = await axios.get('/api/Admin/users');
    return response.data.filter((user) => !user.isApproved);
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error);
    throw error;
  }
};

export const apiApproveUserAsync = async (userId) => {
  try {
    const response = await axios.post('/api/Admin/users/approve', { userId });
    return response.data;
  } catch (error) {
    console.error("Error approving user:", error);
    throw error;
  }
};





// ----------------------
// USER MANAGEMENT
// ----------------------




export const apiFetchApprovedUsersAsync = async () => {
  try {
    const response = await axios.get('/api/Admin/users');
    return response.data.filter((user) => user.isApproved && user.roles[0] !== "Admin");
  } catch (error) {
    console.error("Greška pri dohvaćanju odobrenih korisnika:", error);
    throw error;
  }
};

export const apiCreateUserAsync = async (newUserPayload) => {
  try {
    const response = await axios.post('/api/Admin/users/create', newUserPayload);
    return response.data;
  } catch (error) {
    console.error("Greška pri kreiranju korisnika:", error);
    throw error;
  }
};

export const apiDeleteUserAsync = async (userId) => {
  try {
    const response = await axios.delete(`/api/Admin/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
