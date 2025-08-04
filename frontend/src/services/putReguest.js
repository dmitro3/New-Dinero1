import { objectToFormData } from '@/lib/utils';
import { putRequest } from './axios';
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const updateUser = (data) =>
  putRequest(`${API_URL}/user/update-user`, objectToFormData(data));

export const cancelBonus = (data) =>
  putRequest(`${API_URL}/user/cancel-bonus`, data);

export const verifyOtp = (data) =>
  putRequest(`${API_URL}/user/verify-otp`, data);

export const updateSelfExclusion = (data) =>
  putRequest(`${API_URL}/user/self-exclusion`, data);

export const updatePassword= (data) =>
  putRequest(`${API_URL}/user/change-password`, data);
