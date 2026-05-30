const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const userInfo = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;
  return userInfo && userInfo.token
    ? { Authorization: `Bearer ${userInfo.token}` }
    : {};
};

export const apiCall = async (method, endpoint, data = null) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    };

    const config = {
      method,
      url,
      headers,
      data,
    };

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }

    return responseData;
  } catch (error) {
    console.error('API Call Error:', error.message);
    throw error;
  }
};

export default apiCall;
