import { create } from 'zustand';
import { ToastState } from '@/types';

interface ToastStore extends ToastState {
  showToast: (message: string, type: ToastState['type']) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: '',
  type: 'info',
  visible: false,

  showToast: (message, type) => {
    set({ message, type, visible: true });
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      set((state) => {
        // Only hide if this is still the same toast
        if (state.message === message) {
          return { visible: false };
        }
        return state;
      });
    }, 3000);
  },

  hideToast: () => {
    set({ visible: false });
  }
}));