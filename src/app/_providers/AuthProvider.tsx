'use client';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';

type User = {
  name: string;
  email: string;
  apiKey: string;
  accessToken: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(false);
        setUser({
          name: 'User',
          email: '123',
          accessToken: '123',
          apiKey: '123',
        });
      } catch (error) {
        setError('Failed to fetch user');
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, error } = await handleLoginApi(email, password);

    if (error) {
      setError(error);
      return;
    }

    console.log('user', user);

    if (user) {
      setUser({ ...user });
    }
  };

  const logout = async () => {
    // Implement logout logic
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

type HandleLoginApiReturn =
  | {
      user: z.infer<typeof loginApiResponseSchema>;
      error: null;
    }
  | {
      user: null;
      error: string;
    };

async function handleLoginApi(
  email: string,
  password: string
): Promise<HandleLoginApiReturn> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { user: null, error: 'Incorrect email or password' };
  }

  const data = await res.json();

  const validation = loginApiResponseSchema.safeParse(data);

  if (!validation.success) {
    return { user: null, error: 'Failed to parse response' };
  }

  return { user: validation.data, error: null };
}

const loginApiResponseSchema = z.object({
  name: z.string(),
  email: z.string(),
  apiKey: z.string(),
  accessToken: z.string(),
});
