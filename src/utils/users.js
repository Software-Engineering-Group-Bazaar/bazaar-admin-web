// src/services/adminService.js

import apiClientInstance from '../api/apiClientInstance'; // Your configured instance
// Adjust the import path based on your generation
import  AdminApi  from '../api/api/AdminApi';

/**
 * Fetches the list of all users from the admin endpoint.
 * Assumes the user is authenticated via HttpOnly cookie.
 * Returns the array of user data on success.
 * Throws an error object { message: string, status: number | null } on failure.
 *
 * @returns {Promise<Array<object>>} A promise that resolves with the array of users on success.
 * @throws {object} An error object with message and status on failure (e.g., 401, 403, 500).
 */
export const fetchAdminUsers = async () => {
  // Instantiate the specific API class using the configured client
  const adminApi = new AdminApi(apiClientInstance);

  console.log("Attempting to fetch admin users..."); // Debug log

  // Wrap the generated callback method in a Promise
  return new Promise((resolve, reject) => {
    try {
      // Call the generated method for GET /api/Admin/users.
      // *** IMPORTANT: Check your generated AdminApi.js ***
      // The method name might be getUsers, apiAdminUsersGet, listAdminUsers, etc.
      // It typically only takes the callback function as an argument for a simple GET.
      adminApi.apiAdminUsersGet((error, data, response) => { // <<< Use correct method name
        if (error) {
          // Handle API errors (e.g., 401 Unauthorized, 403 Forbidden, 500 Server Error)
          console.error('Fetch Admin Users API Error:', error);
          console.error('Fetch Admin Users API Response:', response);

          const status = error?.status || response?.status || null;
          let message = 'Failed to fetch users.'; // Default message

          // Customize message based on status
          if (status === 401) {
            message = 'Unauthorized. Please log in again.';
          } else if (status === 403) {
            message = 'Forbidden. You do not have permission to view users.';
          } else if (status >= 500) {
            message = 'Server error fetching users. Please try again later.';
          } else if (error?.message) {
             message = error.message;
          } else if (response?.text) {
             try { message = JSON.parse(response.text).detail || JSON.parse(response.text).title || message } catch (e) { message = response.text.substring(0, 100) || message }
          }

          reject({ message: message, status: status });
        } else {
          // Request successful!
          console.log('Successfully fetched admin users.');
          console.log('API Response Data:', data);
          // Resolve the promise with the user data array
          resolve(data || []); // Ensure we return an array even if API returns null/undefined
        }
      });
    } catch (err) {
      // Catch synchronous errors during API call setup
       console.error('Synchronous error calling fetch users API:', err);
       reject({ message: err.message || 'An unexpected error occurred.', status: null });
    }
  });
};

// Add other admin-related service functions here (e.g., approveUser, deleteUser)