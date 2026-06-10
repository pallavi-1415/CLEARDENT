import { API_BASE_URL } from '../config';
const API_URL = `${API_BASE_URL}/api/admin`;

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getAdminStats = async (token) => {
  const response = await fetch(`${API_URL}/stats`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch admin stats');
  return data;
};

export const getAllDoctors = async (token) => {
  const response = await fetch(`${API_URL}/doctors`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch doctors');
  return data;
};

export const approveDoctor = async (id, token) => {
  const response = await fetch(`${API_URL}/doctors/${id}/approve`, {
    method: 'PUT',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to approve doctor');
  return data;
};

export const rejectDoctor = async (id, token) => {
  const response = await fetch(`${API_URL}/doctors/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to reject doctor');
  return data;
};

export const getAllPatients = async (token) => {
  const response = await fetch(`${API_URL}/patients`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch patients');
  return data;
};

export const getAllAppointmentsAdmin = async (token) => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch appointments');
  return data;
};
