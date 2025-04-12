//import axios from "axios";
import apiClientInstance from './apiClientInstance';
import TestAuthApi from './api/TestAuthApi';
import LoginDTO from './model/LoginDTO';
import users from '../data/users';
import pendingUsers from '../data/pendingUsers.js';
import axios from 'axios';

const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
const API_FLAG = import.meta.env.VITE_API_FLAG;
const API_ENV_DEV = 'dev';

console.log('Mock', API_FLAG);
console.log('api ', baseApiUrl);

const apiSetAuthHeader = () => {
  const token = localStorage.getItem('token');

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// ----------------------
// AUTH - Prijava korisnika
// ----------------------

export const apiLoginUserAsync = async (username, password) => {
  if (API_FLAG == API_ENV_DEV) {
    const testAuthApi = new TestAuthApi(apiClientInstance);
    const loginPayload = new LoginDTO();
    loginPayload.username = username;
    loginPayload.password = password;

    console.log('Attempting login via TestAuthApi for:', username);

    localStorage.setItem('auth', true);
  } else {
    const ret = await axios.post(`${baseApiUrl}/api/Auth/login`, {
      email: username,
      email: username,
      password: password,
      app: 'Admin',
    });
    const token = ret.data.token;
    localStorage.setItem('auth', true);
    localStorage.setItem('token', token);
  }
};

// ----------------------
// PENDING USERS - Neodobreni korisnici
// ----------------------

export const apiFetchPendingUsersAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    try {
      // Pretpostavljamo da se "pendingUsers" dohvaća iz lokalnog niza
      return pendingUsers;
    } catch (error) {
      console.error('Greška pri dohvaćanju korisnika:', error);
      throw error;
    }
  } else {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    const users = await axios.get(`${baseApiUrl}/api/Admin/users`);
    return users.data.filter((u) => !u.isApproved);
  }
};

export const apiApproveUserAsync = async (userId) => {
  if (API_ENV_DEV == API_FLAG) {
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
        throw new Error('User not found in pending users.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      throw error;
    }
  } else {
    const token = localStorage.getItem('token');

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return axios.post(`${baseApiUrl}/api/Admin/approve`, {
      userId: userId,
    });
  }
};

// ----------------------
// USER MANAGEMENT
// ----------------------

export const apiFetchApprovedUsersAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    try {
      // dohvati users iz niza koji su odobreni
      return users.filter((user) => user.isApproved);
    } catch (error) {
      console.error('Greška pri dohvaćanju odobrenih korisnika:', error);
      throw error;
    }
  } else {
    apiSetAuthHeader();
    const users = await axios.get(`${baseApiUrl}/api/Admin/users`);
    return users.data.filter((u) => u.isApproved);
  }
};

export const apiCreateUserAsync = async (newUserPayload) => {
  if (API_ENV_DEV == API_FLAG) {
    try {
      // dodaj novog korisnika u niz "users"
      const newUser = {
        ...newUserPayload,
        id: users.length + 1,
        isApproved: false,
      };
      //users.push(newUser);
      pendingUsers.push(newUser); // korisnik će biti u pendingUsers dok ga ne odobri admin, onda se prebacuje u users
      return newUser;
    } catch (error) {
      console.error('Greška pri kreiranju korisnika:', error);
      throw error;
    }
  } else {
    apiSetAuthHeader();
    return axios.post(`${baseApiUrl}/api/Admin/users/create`, {
      userName: newUserPayload.userName,
      email: newUserPayload.email,
      password: newUserPayload.password,
      role: newUserPayload.role,
    });
  }
};

export const apiDeleteUserAsync = async (userId) => {
  if (API_ENV_DEV == API_FLAG) {
    try {
      // Pronađi korisnika u "users" i ukloni ga iz niza
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        const user = users[userIndex];
        users.splice(userIndex, 1);
        return user;
      } else {
        throw new Error('User not found.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  } else {
    apiSetAuthHeader();
    return axios.delete(`${baseApiUrl}/api/Admin/user/${userId}`);
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
  if (API_ENV_DEV == API_FLAG) {
    console.log('Mock API - Creating Product:', newProduct);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: newProduct }), 1000)
    );
  } else {
    apiSetAuthHeader();
    const formData = new FormData();
    return axios.post(
      `${baseApiUrl}/api/Admin/products/create`,
      {
        ProductCategoryId: newProduct.productcategoryid,
        Name: newProduct.name,
        RetailPrice: newProduct.price,
        WholesalePrice: newProduct.price,
        Weight: newProduct.weight,
        WeightUnit: newProduct.weightunit,
        Volume: newProduct.volume,
        VolumeUnit: newProduct.volumeunit,
        StoreId: newProduct.storeid,
        Files: newProduct.photos,
      },
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
};

// Get product categories
export const apiGetProductCategoriesAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    //izbrisi kad ne bude trebalo
    const mockCategories = [
      { id: '1', type: 'product', name: 'Beverages' },
      { id: '2', type: 'store', name: 'Snacks' },
      { id: '3', type: 'product', name: 'Cleaning' },
      { id: '4', type: 'store', name: 'Beverages' },
      { id: '5', type: 'product', name: 'Snacks' },
      { id: '6', type: 'store', name: 'Cleaning' },
    ];
    return new Promise((resolve) =>
      setTimeout(() => resolve(mockCategories), 500)
    );
  } else {
    apiSetAuthHeader();
    categories = await axios.get(`${baseApiUrl}/api/Admin/categories`);
    return categories.data;
  }
};

// Get store details
export const apiGetStoreByIdAsync = async (storeId) => {
  if (API_ENV_DEV == API_FLAG) {
    // izbrisati naknadno
    const mockStore = {
      id: storeId,
      name: 'Nova Market',
      description: 'Brza i kvalitetna dostava proizvoda.',
      isOnline: true,
      createdAt: '2024-01-01',
      products: [],
    };

    return new Promise((resolve) => setTimeout(() => resolve(mockStore), 500));
  } else {
    apiSetAuthHeader();
    const store = await axios.get(`${baseApiUrl}/api/Admin/stores/${storeId}`);
    return store.data;
  }
};

//update store status (online/offline)
export const apiUpdateStoreStatusAsync = async (storeId, isOnline) => {
  if (API_ENV_DEV == API_FLAG) {
    console.log('Mock API - Updating store status:', { storeId, isOnline });

    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, isOnline }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.put(`${baseApiUrl}/api/Admin/store/${storeId}`, {
      name: null,
      categoryId: null,
      address: null,
      id: storeId,
      isActive: isOnline,
      description: null,
    });
  }
};

// Get all stores
export const apiGetAllStoresAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    //izbrisati poslije
    const mockStores = [
      {
        id: 1,
        name: 'Nova Market',
        description: 'Brza i kvalitetna dostava proizvoda.',
        address: 'Sarajevo',
      },
      {
        id: 2,
        name: 'Tech World',
        description: 'Elektronika i gadgeti.',
        address: 'Mostar',
      },
      {
        id: 3,
        name: 'BioShop',
        description: 'Prirodna kozmetika i hrana.',
        address: 'Banja Luka',
      },
      {
        id: 4,
        name: 'Fashion Spot',
        description: 'Savremena garderoba.',
        address: 'Tuzla',
      },
      {
        id: 5,
        name: 'Office Plus',
        description: 'Kancelarijski materijal i oprema.',
        address: 'Sarajevo',
      },
      {
        id: 6,
        name: 'Auto Centar',
        description: 'Dijelovi i oprema za automobile.',
        address: 'Zenica',
      },
      {
        id: 7,
        name: 'Pet Planet',
        description: 'Hrana i oprema za kućne ljubimce.',
        address: 'Mostar',
      },
      {
        id: 8,
        name: 'Green Garden',
        description: 'Sve za vašu baštu.',
        address: 'Sarajevo',
      },
      {
        id: 9,
        name: 'Kids Toys',
        description: 'Igračke i oprema za djecu.',
        address: 'Sarajevo',
      },
      {
        id: 10,
        name: 'Mega Market',
        description: 'Vaš svakodnevni supermarket.',
        address: 'Banja Luka',
      },
      {
        id: 11,
        name: 'Green Garden',
        description: 'Sve za vašu baštu.',
        address: 'Sarajevo',
      },
      {
        id: 12,
        name: 'Kids Toys',
        description: 'Igračke i oprema za djecu.',
        address: 'Mostar',
      },
      {
        id: 13,
        name: 'Mega Market',
        description: 'Vaš svakodnevni supermarket.',
        address: 'Zenica',
      },
      {
        id: 14,
        name: 'Green Garden',
        description: 'Sve za vašu baštu.',
        address: 'Sarajevo',
      },
      {
        id: 15,
        name: 'Kids Toys',
        description: 'Igračke i oprema za djecu.',
        address: 'Tuzla',
      },
      {
        id: 16,
        name: 'Mega Market',
        description: 'Vaš svakodnevni supermarket.',
        address: 'Banja Luka',
      },
      {
        id: 17,
        name: 'Green Garden',
        description: 'Sve za vašu baštu.',
        address: 'Sarajevo',
      },
      {
        id: 18,
        name: 'Kids Toys',
        description: 'Igračke i oprema za djecu.',
        address: 'Mostar',
      },
      {
        id: 19,
        name: 'Mega Market',
        description: 'Vaš svakodnevni supermarket.',
        address: 'Tuzla',
      },
    ];

    return new Promise((resolve) => setTimeout(() => resolve(mockStores), 500));
  } else {
    apiSetAuthHeader();
    const stores = await axios.get(`${baseApiUrl}/api/Admin/stores`);
    return stores.data;
  }
};

export const apiDeleteCategoryAsync = async (categoryId) => {
  if (API_ENV_DEV == API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, deletedId: categoryId }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.delete(`${baseApiUrl}/api/Admin/store/category/${categoryId}`);
  }
};

export const apiAddCategoryAsync = async (newCategory) => {
  if (API_ENV_DEV == API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: newCategory }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.post(`${baseApiUrl}/api/Admin/store/categories/create`, {
      name: newCategory,
    });
  }
};

export const apiUpdateCategoryAsync = async (updatedCategory) => {
  if (API_ENV_DEV == API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: updatedCategory }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.put(
      `${baseApiUrl}/api/Admin/store/category/${updatedCategory.id}`,
      {
        name: updatedCategory.name,
      }
    );
  }
};

export const apiAddStoreAsync = async (newStore) => {
  if (API_ENV_DEV) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: { ...newStore, id: Date.now() } }),
        800
      )
    );
  } else {
    apiSetAuthHeader();
    return axios(`${baseApiUrl}/api/Admin/store/create`, {
      name: newStore.name,
      categoryId: newStore.categoryId,
      address: newStore.address,
      description: newStore.description,
    });
  }
};

// Mock ažuriranje korisnika
export const apiUpdateUserAsync = async (updatedUser) => {
  if (API_ENV_DEV == API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, updatedUser }), 500)
    );
  } else {
    console.log('NOPE izbaciti ovo');
  }
};

// Mock promjena statusa korisnika (Online/Offline)
export const apiToggleUserAvailabilityAsync = async (userId, currentStatus) => {
  if (API_ENV_DEV == API_FLAG) {
    const newStatus = currentStatus === 'Online' ? 'Offline' : 'Online';
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, availability: newStatus }),
        10000
      )
    );
  } else {
    apiSetAuthHeader();
    return axios.post(`${baseApiUrl}/api/Admin/activate`, {
      userId: userId,
      activationStatus: currentStatus,
    });
  }
};
