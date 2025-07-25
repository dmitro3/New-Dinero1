import { getAccessToken, removeLoginToken } from './storageUtils';

const METHODS = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
};

// Interceptor to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const { status } = response;
    if (status === 401 || status === 403) {
      if (getAccessToken()) {
        removeLoginToken();
      }
      // window.location.href = '/';
    }
    const errorData = await response.json();
    throw errorData.errors;
  }
  return response.json();
};

// Centralized request function
const makeRequest = async (url, method, data = {}, config = {}, params = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
    'Authorization': `Bearer ${getAccessToken()}`,
    ...config,
  };

  if (getAccessToken()) {
    headers.Authorization = `Bearer ${getAccessToken()}`;
  }

  if (data instanceof FormData) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }

  // Convert params object to query string
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';

  const options = {
    method,
    headers,
    credentials: 'include', // Include cookies in requests
    body: method !== METHODS.get ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
  };

  const response = await fetch(url + queryString, options);
  return handleResponse(response);
};

// Request shortcuts
const getRequest = (url, params, config) =>
  makeRequest(url, METHODS.get, {}, config, params);

const postRequest = (url, data, config) =>
  makeRequest(url, METHODS.post, data, config);

const putRequest = (url, data, config) =>
  makeRequest(url, METHODS.put, data, config);

const deleteRequest = (url, data) =>
  makeRequest(url, METHODS.delete, data);

export { getRequest, postRequest, putRequest, deleteRequest };