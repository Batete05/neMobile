import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BudgetState, Budget } from '@/types';

interface BudgetStore extends BudgetState {
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  updateSpent: (category: string, amount: number) => void;
  isBudgetExceeded: (category: string) => boolean;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [],
      isLoading: false,
      error: null,

      addBudget: (budget) => {
        const newBudget: Budget = {
          ...budget,
          id: Date.now().toString(),
          spent: 0,
        };
        
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }));
      },

      updateBudget: (id, budget) => {
        set((state) => ({
          budgets: state.budgets.map(b => 
            b.id === id ? { ...b, ...budget } : b
          )
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }));
      },

      updateSpent: (category, amount) => {
        set((state) => ({
          budgets: state.budgets.map(b => 
            b.category === category 
              ? { ...b, spent: b.spent + amount } 
              : b
          )
        }));
      },

      isBudgetExceeded: (category) => {
        const budget = get().budgets.find(b => b.category === category);
        if (!budget) return false;
        return budget.spent > budget.limit;
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);