import create from 'zustand';

const useChatStore = create((set) => ({
  messages: [],  // { role: 'user' | 'assistant', content: string }
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;