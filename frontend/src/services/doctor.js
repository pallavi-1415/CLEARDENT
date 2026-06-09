import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/doctor`;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getDoctorStats = async (token) => {
  const response = await fetch(`${API_URL}/stats`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch doctor stats');
  return data;
};

export const getDoctorAppointments = async (token) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch doctor appointments');
  return data;
};

export const getDoctorProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch doctor profile');
  return data;
};

export const updateDoctorProfile = async (profileData, token) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(profileData)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update doctor profile');
  return data;
};

export const updateAppointmentStatusDoctor = async (id, status, token) => {
  const response = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ status })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update appointment status');
  return data;
};
