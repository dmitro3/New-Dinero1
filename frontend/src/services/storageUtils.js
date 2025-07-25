/* eslint-disable no-undef */
// /* eslint-disable no-undef */
import CryptoJS from 'crypto-js';

const FE_ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_APP_FE_ENCRYPTION_KEY || 'rb27cry2xn2ysh7823bqxry233x9rn3682323888888q8z66';

export const encryptCredentials = (data) =>
  CryptoJS.AES.encrypt(data, FE_ENCRYPTION_KEY).toString();

// export const decryptCredentials = (data) =>
//   CryptoJS.AES.decrypt(data, FE_ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)

export const decryptCredentials = (data) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(data, FE_ENCRYPTION_KEY);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedData) throw new Error('Decryption failed');
    return decryptedData;
  } catch (error) {
    console.log('Error decrypting credentials:', error);
    return '';
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined' && localStorage.getItem('access-token')) { return decryptCredentials(localStorage.getItem('access-token')); }
  // if (localStorage.getItem('access-token')) { return (localStorage.getItem('access-token')); }
  return '';
};

export const removeLoginToken = () => {
  localStorage.removeItem('access-token');
  window.location.reload();
  window.location.replace('/');
};

export const addLoginToken = (value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('access-token', encryptCredentials(value));
  }
};
