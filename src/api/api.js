//import axios from "axios";
import apiClientInstance from './apiClientInstance';
import TestAuthApi from './api/TestAuthApi';
import LoginDTO from './model/LoginDTO';
import users from '../data/users';
import stores from '../data/stores';
import categories from '../data/categories';
import products from '../data/products';
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
        email: newUserPayload.email,
        userName: newUserPayload.userName,
        password: newUserPayload.password,
        id: users.length + 1,
        isApproved: false,
        roles:[newUserPayload.role]
      };
      //users.push(newUser);
      pendingUsers.push(newUser);
      return {data: newUser};
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

/**
 * Fetches products for a specific store
 * @param {number} storeId - ID of the store
 * @returns {Promise<{status: number, data: Array}>} List of products
 */
export const apiGetStoreProductsAsync = async (storeId) => {
  if (API_ENV_DEV === API_FLAG) {
    return {
      status: 200,
      data: products.filter(p => p.storeId === storeId)
    };
  } else {
    try {
      const response = await axios.get(`${baseApiUrl}/api/Admin/stores/${storeId}/products`);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error fetching store products:', error);
      return { status: error.response?.status || 500, data: [] };
    }
  }
};

/**
 * Creates a new product
 * @param {Object} productData - Product data to create
 * @returns {Promise<{status: number, data: Object}>} Created product
 */
export const apiCreateProductAsync = async (productData) => {
  if (API_ENV_DEV === API_FLAG) {
    try {
      const newProduct = {
        id: products.length + 1,
        ...productData
      };
      products.push(newProduct);
      return { status: 201, data: newProduct };
    } catch (error) {
      console.error('Product creation failed:', error);
      return { status: 500, data: null };
    }
  } else {
    try {
      const formData = new FormData();
      formData.append('RetailPrice', String(productData.price ?? 0));
      formData.append('ProductCategoryId', String(productData.productcategoryid));
      formData.append('WholesalePrice', String(productData.price ?? 0));
      formData.append('Name', productData.name);
      formData.append('Weight', String(productData.weight ?? 0));
      formData.append('Volume', String(productData.volume ?? 0));
      formData.append('WeightUnit', productData.weightunit ?? '');
      formData.append('StoreId', String(productData.storeId));
      formData.append('VolumeUnit', productData.volumeunit ?? '');

      if (productData.photos?.length > 0) {
        productData.photos.forEach((file) => {
          if (file instanceof File) {
            formData.append('Files', file, file.name);
          }
        });
      }

      const response = await axios.post(
        `${baseApiUrl}/api/Admin/products/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Product creation failed:', error);
      return { status: error.response?.status || 500, data: null };
    }
  }
};

/**
 * Updates an existing product
 * @param {Object} productData - Product data to update
 * @returns {Promise<{status: number, data: Object}>} Updated product
 */
export const apiUpdateProductAsync = async (productData) => {
  if (API_ENV_DEV === API_FLAG) {
    const index = products.findIndex(p => p.id === productData.id);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      return { status: 200, data: products[index] };
    }
    return { status: 404, data: null };
  } else {
    try {
      const formData = new FormData();
      formData.append('ProductId', String(productData.id));
      formData.append('RetailPrice', String(productData.price ?? 0));
      formData.append('WholesalePrice', String(productData.price ?? 0));
      formData.append('ProductCategoryId', String(productData.productcategoryid));
      formData.append('Name', productData.name);
      formData.append('Weight', String(productData.weight ?? 0));
      formData.append('Volume', String(productData.volume ?? 0));
      formData.append('WeightUnit', productData.weightunit ?? '');
      formData.append('VolumeUnit', productData.volumeunit ?? '');
      formData.append('IsActive', String(productData.isActive ?? true));

      if (productData.photos?.length > 0) {
        productData.photos.forEach((photo) => {
          if (photo instanceof File) {
            formData.append('Files', photo, photo.name);
          } else {
            formData.append('ExistingPhotos', photo); 
          }
        });
      }

      const response = await axios.put(
        `${baseApiUrl}/api/Admin/products/update/${productData.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error updating product:', error);
      return { status: error.response?.status || 500, data: null };
    }
  }
};

/**
 * Deletes a product
 * @param {number} productId - ID of the product to delete
 * @returns {Promise<{status: number, data: Object}>} Deletion result
 */
export const apiDeleteProductAsync = async (productId) => {
  if (API_ENV_DEV === API_FLAG) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products.splice(index, 1);
      return { status: 204, data: null };
    }
    return { status: 404, data: null };
  } else {
    try {
      const response = await axios.delete(`${baseApiUrl}/api/Admin/products/${productId}`);
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { status: error.response?.status || 500, data: null };
    }
  }
};

export const apiGetProductCategoriesAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    return categories.filter((cat) => cat.type === 'product');
  } else {
    apiSetAuthHeader();
    const res = await axios.get(`${baseApiUrl}/api/Admin/categories`);
    return res.data;
  }
};

export const apiGetStoreCategoriesAsync = async () => {
  if (API_ENV_DEV == API_FLAG) {
    return categories.filter((cat) => cat.type === 'store');
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

    return stores.filter((trgovina) => trgovina.id === storeId);
  } else {
    apiSetAuthHeader();
    const store = await axios.get(`${baseApiUrl}/api/Admin/stores/${storeId}`);
    return store.data;
  }
};

export const apiUpdateStoreAsync = async (store) => {
  if (API_ENV_DEV === API_FLAG) {
    const index = stores.indexOf((st) => store.name==st.name)
    stores[index]={
      ...store
    }
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
    return stores
    //return new Promise((resolve) => setTimeout(() => resolve({stores}), 500));
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
    const rez = categories.filter((cat) => cat.id == categoryId);
    const index = categories.indexOf(rez);
    if(index>-1){
      categories.splice(index,1);
      console.log("deleted");
    }
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
    const rez = categories.filter((cat) => cat.id == categoryId);
    const index = categories.indexOf(rez);
    if(index>-1){
      categories.splice(index,1);
      console.log("deleted");
    }
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
    try{
    const newCategory = {
      id: categories.length+1,
      name: name,
      type: "product",
    }
    categories.push(newCategory);
    return {data: newCategory};
  } catch(error){
    console.log("Error pri kreiranju kategorije proizvoda!");
    throw error;
  }
    //return new Promise((resolve) =>
      //setTimeout(
        //() => resolve({ success: true, data: { id: Date.now(), name } }),
        //500
      //)
    //);
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
    try{
      const newCategory = {
        id: categories.length+1,
        name: name,
        type: "store",
      }
      categories.push(newCategory);
      return newCategory;
    } catch(error){
      console.log("Error pri kreiranju kategorije trgovine!");
      throw error;
    }
   // return new Promise((resolve) =>
   //   setTimeout(
   //     () => resolve({ success: true, data: { id: Date.now(), name } }),
   //     500
   //   )
    //);
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
  if (API_ENV_DEV === API_FLAG){
    const index = categories.findIndex((cat) => cat.id === updatedCategory);
    categories[index]={
      ...updatedCategory
    };
    //???
  }
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
  if (API_ENV_DEV === API_FLAG){
    const index = categories.findIndex((cat) => cat.name === updatedCategory.name);
    categories[index]={
      ...updatedCategory
    };
    return { success: true, data: response.data };
  } else {
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
}
};

export const apiAddStoreAsync = async (newStore) => {
  if (API_ENV_DEV === API_FLAG) {
    stores.push(newStore);
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
    const rez = stores.find((store) => store.id == storeId);
    const index = stores.indexOf(rez);
    //console.log(index);
    if(index>-1){
      stores.splice(index,1);
      console.log(storeId)
      console.log(rez.id)
    }
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
    const index = users.findIndex((us) => us.id === updatedUser.id);
    users[index]={
      ...updatedUser
    };
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, updatedUser }), 500)
    );
  } else {
    apiSetAuthHeader();
    return axios.put(`${baseApiUrl}/api/Admin/users/update`, {
      userName: updatedUser.email,
      id: updatedUser.id,
      role: updatedUser.roles[0],
      lastActive: updatedUser.isActive,
      isApproved: updatedUser.isApproved,
      email: updatedUser.email,
    });
  }
};

// Mock promjena statusa korisnika (Online/Offline)
export const apiToggleUserAvailabilityAsync = async (userId, currentStatus) => {
  if (API_ENV_DEV == API_FLAG) {
    const newStatus = currentStatus === 'Online' ? 'false' : 'true';
    const index = users.find((us) => us.id==userId);
    users[index].availability = newStatus; 
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
