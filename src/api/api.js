//import axios from "axios";
import apiClientInstance from './apiClientInstance';
import TestAuthApi from './api/TestAuthApi';
import LoginDTO from './model/LoginDTO';
import users from "../data/users"
import pendingUsers from "../data/pendingUsers.js";





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
    // Pretpostavljamo da se "pendingUsers" dohvaća iz lokalnog niza
    return pendingUsers;
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika:", error);
    throw error;
  }
};



export const apiApproveUserAsync = async (userId) => {
  try {
    // pronađi korisnika u "pendingUsers" nizu i označi ga kao odobrenog
    const userIndex = pendingUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      const user = pendingUsers[userIndex];
      user.isApproved = true;
      // premjesti korisnika iz pendingUsers u users
      users.push(user);
      pendingUsers.splice(userIndex, 1);
      return user;
    } else {
      throw new Error("User not found in pending users.");
    }
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
    // dohvati users iz niza koji su odobreni
    return users.filter((user) => user.isApproved);
  } catch (error) {
    console.error("Greška pri dohvaćanju odobrenih korisnika:", error);
    throw error;
  }
};



export const apiCreateUserAsync = async (newUserPayload) => {
  try {
    // dodaj novog korisnika u niz "users"
    const newUser = { ...newUserPayload, id: users.length + 1, isApproved: false };
    //users.push(newUser);
    pendingUsers.push(newUser); // korisnik će biti u pendingUsers dok ga ne odobri admin, onda se prebacuje u users
    return newUser;
  } catch (error) {
    console.error("Greška pri kreiranju korisnika:", error);
    throw error;
  }
};

export const apiDeleteUserAsync = async (userId) => {
  try {
    // Pronađi korisnika u "users" i ukloni ga iz niza
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      users.splice(userIndex, 1);
      return user;
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};








/*

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
};*/
