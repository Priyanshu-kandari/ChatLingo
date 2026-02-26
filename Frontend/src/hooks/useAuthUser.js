import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';

const useAuthUser = () => {
  // Shared auth query used by route guards and pages.
  const authUser = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data };
};

export default useAuthUser;
