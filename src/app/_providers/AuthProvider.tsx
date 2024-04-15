'use client';
import { createContext, useState } from 'react';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [name, setName] = useState('John Doe');

  const value = {
    state: { name },
    actions: { setName },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthContext = createContext({ state: {}, actions: {} });
