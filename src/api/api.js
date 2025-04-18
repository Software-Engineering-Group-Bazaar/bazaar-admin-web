//import axios from "axios";
import apiClientInstance from './apiClientInstance';
import TestAuthApi from './api/TestAuthApi';
import LoginDTO from './model/LoginDTO';
import users from '../data/users';
import pendingUsers from '../data/pendingUsers.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

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
    return axios.post(`${baseApiUrl}/api/Admin/users/approve`, {
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
    return users.data
      .filter((u) => u.isApproved)
      .filter(
        (u) =>
          (u.roles && u.roles != 'Admin') || (u.roles && u.roles[0] != 'Admin')
      );
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
      pendingUsers.push(newUser);
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

// {
//   "name": "aa",
//   "price": "1",
//   "weight": "1",
//   "weightunit": "kg",
//   "volume": "1",
//   "volumeunit": "L",
//   "productcategoryid": 1,
//   "storeId": 2,
//   "photos": [
//     {
//       "path": "./maca.jpg",
//       "relativePath": "./maca.jpg"
//     }
//   ]
// }

export const apiCreateProductAsync = async (productData) => {
  if (API_ENV_DEV !== API_FLAG) {
    try {
      // Create a FormData object
      const formData = new FormData();

      // --- FIX HERE ---
      // Append product data fields, ensuring valid defaults for numbers
      // Use ?? 0 to default null/undefined numeric values to 0 before converting to string.
      // Adjust the default (e.g., to null or omit if API allows) based on API requirements.
      formData.append('RetailPrice', String(productData.price ?? 0));
      formData.append(
        'ProductCategoryId',
        String(productData.productcategoryid)
      ); // Assuming this is always provided
      formData.append('WholesalePrice', String(productData.price ?? 0));
      formData.append('Name', productData.name);
      formData.append('Weight', String(productData.weight ?? 0));
      formData.append('Volume', String(productData.volume ?? 0));
      formData.append('WeightUnit', productData.weightunit ?? ''); // Default to empty string if optional
      formData.append('StoreId', String(productData.storeId)); // Assuming this is always provided
      formData.append('VolumeUnit', productData.volumeunit ?? ''); // Default to empty string if optional
      const imageFiles = productData.photos;
      // Append each file in the array (Ensure this loop is correct if multiple files are expected)
      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          if (file instanceof File) {
            formData.append('Files', file, file.name); // Use the same key 'Files'
          }
        });
      }
      console.log(formData);
      const response = await axios.post(
        `${baseApiUrl}/api/Admin/products/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Product creation failed:', error);
      return { success: false };
    }
  }
};

export const apiGetProductCategoriesAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    return mockCategories.filter((cat) => cat.type === 'product');
  } else {
    apiSetAuthHeader();
    const res = await axios.get(`${baseApiUrl}/api/Admin/categories`);
    return res.data;
  }
};

export const apiGetStoreCategoriesAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    return mockCategories.filter((cat) => cat.type === 'store');
  } else {
    apiSetAuthHeader();
    const res = await axios.get(`${baseApiUrl}/api/Admin/store/categories`);
    return res.data;
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

export const apiUpdateStoreAsync = async (store) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: store }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.put(`${baseApiUrl}/api/Admin/store/${store.id}`, {
      id: store.id,
      name: store.name,
      address: store.address,
      categoryId: store.categoryId,
      description: store.description,
      isActive: store.isActive,
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
    console.log(stores);
    return stores.data;
  }
};

// DELETE product category
export const apiDeleteProductCategoryAsync = async (categoryId) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, deletedId: categoryId }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.delete(`${baseApiUrl}/api/Admin/categories/${categoryId}`);
  }
};

// DELETE store category
export const apiDeleteStoreCategoryAsync = async (categoryId) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, deletedId: categoryId }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.delete(`${baseApiUrl}/api/Admin/store/category/${categoryId}`);
  }
};

export const apiAddProductCategoryAsync = async (name) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: { id: Date.now(), name } }),
        500
      )
    );
  } else {
    apiSetAuthHeader();
    try {
      const res = await axios.post(`${baseApiUrl}/api/Admin/categories`, {
        name,
      });
      return { success: true, data: res.data };
    } catch (err) {
      console.error('Error creating product category:', err);
      return { success: false };
    }
  }
};

export const apiAddStoreCategoryAsync = async (name) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: { id: Date.now(), name } }),
        500
      )
    );
  } else {
    apiSetAuthHeader();
    try {
      const res = await axios.post(
        `${baseApiUrl}/api/Admin/store/categories/create`,
        { name }
      );
      return { success: res.status < 400, data: res.data };
    } catch (err) {
      console.error('Error creating store category:', err);
      return { success: false };
    }
  }
};

export const apiUpdateProductCategoryAsync = async (updatedCategory) => {
  apiSetAuthHeader();
  try {
    const response = await axios.put(
      `${baseApiUrl}/api/Admin/categories/${updatedCategory.id}`,
      { name: updatedCategory.name }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating product category:', error);
    return { success: false, message: error.message };
  }
};

export const apiUpdateStoreCategoryAsync = async (updatedCategory) => {
  apiSetAuthHeader();
  try {
    const response = await axios.put(
      `${baseApiUrl}/api/Admin/store/category/${updatedCategory.id}`,
      { name: updatedCategory.name }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating store category:', error);
    return { success: false, message: error.message };
  }
};

export const apiAddStoreAsync = async (newStore) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, data: { ...newStore, id: Date.now() } }),
        800
      )
    );
  } else {
    apiSetAuthHeader();
    try {
      const response = await axios.post(
        `${baseApiUrl}/api/Admin/store/create`,
        {
          name: newStore.name,
          categoryId: newStore.categoryid,
          address: newStore.address,
          description: newStore.description,
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error('Greška pri kreiranju prodavnice:', error);
      return { success: false };
    }
  }
};

export const apiDeleteStoreAsync = async (storeId) => {
  if (API_ENV_DEV === API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, deletedId: storeId }), 500)
    );
  } else {
    apiSetAuthHeader();
    try {
      const res = await axios.delete(
        `${baseApiUrl}/api/Admin/store/${storeId}`
      );
      return { success: res.status === 204 };
    } catch (error) {
      console.error('Greška pri brisanju prodavnice:', error);
      return { success: false };
    }
  }
};

// Mock ažuriranje korisnika
export const apiUpdateUserAsync = async (updatedUser) => {
  if (API_ENV_DEV == API_FLAG) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, updatedUser }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.put(`${baseApiUrl}/api/Admin/users/update`, {
      userName: updatedUser.email,
      id: updatedUser.id,
      role: updatedUser.roles[0],
      isActive: updatedUser.isActive,
      isApproved: updatedUser.isApproved,
      email: updatedUser.email,
    });
  }
};

// Mock promjena statusa korisnika (Online/Offline)
export const apiToggleUserAvailabilityAsync = async (userId, currentStatus) => {
  if (API_ENV_DEV == API_FLAG) {
    const newStatus = currentStatus === 'Online' ? 'false' : 'true';
    return new Promise((resolve) =>
      setTimeout(
        () => resolve({ success: true, availability: newStatus }),
        10000
      )
    );
  } else {
    apiSetAuthHeader();
    return axios.post(`${baseApiUrl}/api/Admin/users/activate`, {
      userId: userId,
      activationStatus: currentStatus,
    });
  }
};

/**
 * Simulira export proizvoda u Excel formatu.
 * @returns {Promise<{status: number, data: Blob}>} Axios-like odgovor sa blobom Excel fajla
 */
export const apiExportProductsToExcelAsync = async (storeId) => {
  if (API_ENV_DEV == API_FLAG) {
    const mockProducts = [
      { name: 'Product 1', price: 100, description: 'Description 1' },
      { name: 'Product 2', price: 200, description: 'Description 2' },
      { name: 'Product 3', price: 300, description: 'Description 3' },
    ];

    const ws = XLSX.utils.json_to_sheet(mockProducts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return {
      status: 200,
      data: blob,
    };
  } else {
    apiSetAuthHeader();
    try {
      const response = await axios.get(`/api/Admin/store/${storeId}/products`);
      const products = response.data;

      // Pretvori podatke u Excel format
      const ws = XLSX.utils.json_to_sheet(products);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');
      const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      return { status: 200, data: blob };
    } catch (error) {
      return {
        status: error.response?.status || 500,
        data: error.response?.data || error,
      };
    }
  }
};

/**
 * Simulira export proizvoda u CSV formatu.
 * @returns {Promise<{status: number, data: Blob}>} Axios-like odgovor sa blobom CSV fajla
 */
export const apiExportProductsToCSVAsync = async (storeId) => {
  if (API_ENV_DEV == API_FLAG) {
    const csvContent =
      'Product ID,Product Name,Price\n1,Product A,10.99\n2,Product B,19.99';
    const blob = new Blob([csvContent], { type: 'text/csv' });

    return {
      status: 200,
      data: blob,
    };
  } else {
    apiSetAuthHeader();
    try {
      const response = await axios.get(`/api/Admin/store/${storeId}/products`);
      const products = response.data;

      // Pretvaranje objekata u CSV string
      const header = Object.keys(products[0] || {}).join(',');
      const rows = products.map((product) => Object.values(product).join(','));
      const csvContent = [header, ...rows].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });

      return { status: 200, data: blob };
    } catch (error) {
      return {
        status: error.response?.status || 500,
        data: error.response?.data || error,
      };
    }
  }
};
