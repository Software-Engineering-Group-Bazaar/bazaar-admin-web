// src/api/apiClientInstance.js
import ApiClient from './ApiClient'; // Import the generated ApiClient
import request from 'superagent'; // Import superagent directly if needed for default config

const apiClientInstance = new ApiClient();

// Configure the base path using the environment variable
apiClientInstance.basePath = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5054'; // Fallback optional

// --- Option A: Configure superagent defaults (might affect other superagent uses) ---
// This tells *all* subsequent superagent requests made through this import
// to include credentials. Often works well if the ApiClient uses the standard import.
// Uncomment this block if Option B doesn't work or isn't available.

    try {
        request.defaults({ withCredentials: true });
        console.log("Superagent default withCredentials configured.");
    } catch (err) {
        console.error("Could not configure superagent defaults:", err);
    }


// --- Option B: Check if ApiClient has a way to set default options ---
// Inspect your generated `ApiClient.js`. Does it have a method like
// `setDefaultOptions`, `setRequestOptions`, or a property like `defaultHeaders`,
// `defaultParams` where you might be able to sneak in superagent options?
// Example (Hypothetical - check your actual file):
/*
if (typeof apiClientInstance.setDefaultRequestOptions === 'function') {
     apiClientInstance.setDefaultRequestOptions({ withCredentials: true });
     console.log("ApiClient default request options configured for withCredentials.");
} else {
     console.warn("ApiClient does not seem to have a method to set default request options. Relying on direct superagent config or potential manual override if needed.");
     // If neither default config works, we might need to adjust the call in the service layer later.
     // For now, try Option A (uncomment above) if this isn't available.
}
*/

// --- Fallback: Try Option A if Option B isn't viable ---
// If you uncomment Option A, make sure Option B is commented out or non-functional.
// Choose one primary method for configuration. For simplicity, configuring
// superagent defaults (Option A) is often effective if the generated client
// uses the standard superagent import internally.

// If Option B didn't work, uncomment Option A above this line and try again.


export default apiClientInstance;