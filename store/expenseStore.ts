import { create } from 'zustand';
import axios from 'axios';
import { ExpenseState, Expense } from '@/types';

const API_URL = 'https://67ac71475853dfff53dab929.mockapi.io/api/v1/expenses';

interface ExpenseStore extends ExpenseState {
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ expenses: response.data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch expenses" 
      });
    }
  },

  addExpense: async (expense) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, {
        ...expense,
        createdAt: new Date().toISOString(),
      });
      
      set((state) => ({
        expenses: [...state.expenses, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to add expense" 
      });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        expenses: state.expenses.filter(expense => expense.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to delete expense" 
      });
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));

