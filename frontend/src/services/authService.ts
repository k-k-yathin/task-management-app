import { api } from '@/lib/api';
import type { User } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<{ user: User; token: string }>('/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async me() {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data.user;
  },
};
