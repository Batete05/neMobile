import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthState, User } from '@/types';

const API_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1/users';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, we would send credentials to a backend
          // For this mock API, we'll just fetch users and find a match
          const response = await axios.get(API_URL);
          const users = response.data as User[];
          
          // Find user with matching username (in a real app, we'd check password hash)
          const user = users.find(u => u.username === username);
          
          if (user) {
            // Simulate password check (in a real app this would be done securely on the server)
            // For demo purposes, let's assume password is valid if it's at least 6 chars
            if (password.length >= 6) {
              set({ user, isAuthenticated: true, isLoading: false, error: null });
            } else {
              set({ isLoading: false, error: "Invalid password" });
            }
          } else {
            set({ isLoading: false, error: "User not found" });
          }
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "An error occurred during login" 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);