
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

  localStorage.setItem("auth", true);
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

// Create a new product
export const apiCreateProductAsync = async (newProduct) => {
  console.log("Mock API - Creating Product:", newProduct);
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, data: newProduct }), 1000)
  );
};

// Get product categories
export const apiGetProductCategoriesAsync = async () => {
    //izbrisi kad ne bude trebalo
  const mockCategories = [
    { id: "1", name: "Beverages" },
    { id: "2", name: "Snacks" },
    { id: "3", name: "Cleaning" },
  ];
  return new Promise((resolve) =>
    setTimeout(() => resolve(mockCategories), 500)
  );
};

// Get store details
export const apiGetStoreByIdAsync = async (storeId) => {
  // izbrisati naknadno
  const mockStore = {
    id: storeId,
    name: "Nova Market",
    description: "Brza i kvalitetna dostava proizvoda.",
    isOnline: true,
    createdAt: "2024-01-01",
    products: [],
  };

  return new Promise((resolve) =>
    setTimeout(() => resolve(mockStore), 500)
  );
};

//update store status (online/offline)
export const apiUpdateStoreStatusAsync = async (storeId, isOnline) => {
  console.log("Mock API - Updating store status:", { storeId, isOnline });

  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, isOnline }), 500)
  );
};

// Get all stores
export const apiGetAllStoresAsync = async () => {
  //izbrisati poslije
  const mockStores = [
    { id: 1, name: "Nova Market", description: "Brza i kvalitetna dostava proizvoda." },
    { id: 2, name: "Tech World", description: "Elektronika i gadgeti." },
    { id: 3, name: "BioShop", description: "Prirodna kozmetika i hrana." },
    { id: 4, name: "Fashion Spot", description: "Savremena garderoba." },
    { id: 5, name: "Office Plus", description: "Kancelarijski materijal i oprema." },
    { id: 6, name: "Auto Centar", description: "Dijelovi i oprema za automobile." },
    { id: 7, name: "Pet Planet", description: "Hrana i oprema za kućne ljubimce." },
    { id: 8, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 9, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 10, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 11, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 12, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 13, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 14, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 15, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 16, name: "Mega Market", description: "Vaš svakodnevni supermarket." },
    { id: 17, name: "Green Garden", description: "Sve za vašu baštu." },
    { id: 18, name: "Kids Toys", description: "Igračke i oprema za djecu." },
    { id: 19, name: "Mega Market", description: "Vaš svakodnevni supermarket." }
  ];
  return new Promise((resolve) => setTimeout(() => resolve(mockStores), 500));
};








