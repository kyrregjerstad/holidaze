import { AuthContext } from '@/app/_providers/AuthProvider';
import { useContext } from 'react';

export const useUser = () => {
  return useContext(AuthContext);
};
