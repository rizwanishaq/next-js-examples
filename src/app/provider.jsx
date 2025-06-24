'use client';

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import UserDetailContext from '@/context/UserDetailContext';

export const Provider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      createOrFetchUser();
    }
  }, [isLoaded, user]);

  const createOrFetchUser = async () => {
    try {
      const result = await axios.post('/api/users');
      setUserDetail(result.data);
      console.log(result.data)
    } catch (error) {
      console.error('Failed to fetch/create user:', error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};
