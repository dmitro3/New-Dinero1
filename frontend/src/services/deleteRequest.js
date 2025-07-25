import { deleteRequest } from './axios';
const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`;

export const removeFav = (data) =>
  deleteRequest(`${API_URL}/casino/favorite`, data);
