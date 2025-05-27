export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: string;
  description: string;
  createdAt: string;
  category?: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}