const API_URL = 'http://127.0.0.1:5000/api';

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}