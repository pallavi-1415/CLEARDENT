import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Log in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} The server response containing token and user details.
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

/**
 * Register a new user.
 * Supports patient (JSON) and doctor (FormData with license file).
 */
export const signupUser = async (nameOrData, email, dob, password, role = 'patient', specialization = '', licenseFile = null) => {
  let body;
  let headers = {};

  if (nameOrData instanceof FormData) {
    body = nameOrData;
    // Omit Content-Type header so the browser sets boundary automatically
  } else if (typeof nameOrData === 'object' && nameOrData !== null) {
    body = JSON.stringify(nameOrData);
    headers['Content-Type'] = 'application/json';
  } else {
    // If explicitly registering a doctor
    if (role === 'doctor') {
      const fd = new FormData();
      fd.append('name', nameOrData);
      fd.append('email', email);
      fd.append('dob', dob);
      fd.append('password', password);
      fd.append('role', role);
      fd.append('specialization', specialization);
      if (licenseFile) {
        fd.append('license', licenseFile);
      }
      body = fd;
    } else {
      body = JSON.stringify({ name: nameOrData, email, dob, password, role });
      headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers,
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }
  return data;
};

/**
 * Fetch approved doctors in real-time.
 */
export const fetchApprovedDoctors = async () => {
  const response = await fetch(`${API_URL}/doctors/approved`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch approved doctors');
  }
  return data;
};
