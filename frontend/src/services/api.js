const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const headers = (token) => {
  const headerData = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headerData.Authorization = `Bearer ${token}`;
  }
  return headerData;
};

const safeFetch = async (url, options = {}) => {
  const requestUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  try {
    const response = await fetch(requestUrl, options);
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return payload || { message: `Request failed with status ${response.status}` };
    }
    return payload;
  } catch (error) {
    return { message: error.message || 'Network request failed' };
  }
};

export const signup = async (data) => safeFetch(`${API_BASE}/auth/signup`, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data),
});

export const login = async (data) => safeFetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data),
});

export const forgotPassword = async (data) => safeFetch(`${API_BASE}/auth/forgot-password`, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data),
});

export const resetPassword = async (data) => safeFetch(`${API_BASE}/auth/reset-password`, {
  method: 'POST',
  headers: headers(),
  body: JSON.stringify(data),
});

export const getDashboard = async (token) => safeFetch(`${API_BASE}/dashboard`, {
  method: 'GET',
  headers: headers(token),
});

export const getDoctors = async (token) => safeFetch(`${API_BASE}/appointments/doctors`, {
  method: 'GET',
  headers: headers(token),
});

export const bookAppointment = async (token, data) => safeFetch(`${API_BASE}/appointments`, {
  method: 'POST',
  headers: headers(token),
  body: JSON.stringify(data),
});

export const getUserAppointments = async (token) => safeFetch(`${API_BASE}/appointments`, {
  method: 'GET',
  headers: headers(token),
});

export const getDoctorRequests = async (token) => safeFetch(`${API_BASE}/appointments/requests`, {
  method: 'GET',
  headers: headers(token),
});

export const acceptAppointment = async (token, appointmentId) => safeFetch(`${API_BASE}/appointments/${appointmentId}/accept`, {
  method: 'PUT',
  headers: headers(token),
});

export const rejectAppointment = async (token, appointmentId, data) => safeFetch(`${API_BASE}/appointments/${appointmentId}/reject`, {
  method: 'PUT',
  headers: headers(token),
  body: JSON.stringify(data),
});

export const cancelAppointment = async (token, appointmentId) => safeFetch(`${API_BASE}/appointments/${appointmentId}`, {
  method: 'DELETE',
  headers: headers(token),
});

export const getAdminUsers = async (token) => safeFetch(`${API_BASE}/admin/users`, {
  method: 'GET',
  headers: headers(token),
});

export const updateProfile = async (token, data) => safeFetch(`${API_BASE}/dashboard/profile`, {
  method: 'PUT',
  headers: headers(token),
  body: JSON.stringify(data),
});

export const deleteUser = async (token, userId) => safeFetch(`${API_BASE}/admin/users/${userId}`, {
  method: 'DELETE',
  headers: headers(token),
});
