import { axiosInstance } from './axios';

// Create a new user account.
export const signup = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  return response.data;
};

// Fetch the authenticated user session details.
export const getAuthUser = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data.user;
};

export const completeOnboarding = async (formState) => {
  const res = await axiosInstance.post('/auth/onboarding', formState);
  return res.data;
};
