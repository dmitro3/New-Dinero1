import { deleteRequest } from './axios';
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const removeFav = (data) =>
  deleteRequest(`${API_URL}/casino/favorite`, data);
