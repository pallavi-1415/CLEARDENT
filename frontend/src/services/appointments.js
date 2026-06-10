import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/appointments`;

/**
 * Book a new dental appointment.
 * @param {object} appointmentData 
 * @param {string} token 
 * @returns {Promise<object>} The server response.
 */
export const createAppointment = async (appointmentData, token) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Booking appointment failed');
  }
  return data;
};

/**
 * Fetch all appointments for the logged-in user.
 * @param {string} token 
 * @returns {Promise<Array>} List of appointments.
 */
export const getMyAppointments = async (token) => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Fetching appointments failed');
  }
  return data;
};

/**
 * Cancel an appointment.
 * @param {string} appointmentId 
 * @param {string} token 
 * @returns {Promise<object>} The server response.
 */
export const cancelAppointment = async (appointmentId, token) => {
  const response = await fetch(`${API_URL}/${appointmentId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Cancelling appointment failed');
  }
  return data;
};
