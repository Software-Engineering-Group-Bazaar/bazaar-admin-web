// src/api/apiClientInstance.js
import ApiClient from './ApiClient'; // Import the generated ApiClient
import request from 'superagent'; // Import superagent directly TO CONFIGURE DEFAULTS

const apiClientInstance = new ApiClient();

// Configure the base path (use HTTP as per your HAR log)
apiClientInstance.basePath = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5054';
console.log(`ApiClient basePath configured to: ${apiClientInstance.basePath}`);


// --- Configure superagent defaults to SEND COOKIES ---
// This tells *all* subsequent superagent requests made through its standard import
// (which the generated ApiClient likely uses) to include credentials (cookies).
try {
    // THIS IS THE KEY LINE FOR COOKIE AUTH:
    request.defaults({ withCredentials: true });
    console.log("Superagent default withCredentials configured globally.");
} catch (err) {
    // This shouldn't normally fail, but good to have a catch block
    console.error("Could not configure superagent defaults:", err);
}
// --- End of superagent configuration ---


// No need to override callApi or look for ApiClient specific options,
// as applyAuthToRequest only handles spec-defined auth schemes, not cookies.

export default apiClientInstance;