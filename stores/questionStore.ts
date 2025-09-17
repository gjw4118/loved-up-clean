// Question State Store using Zustand
// Manages current question session, navigation, and UI state

import { InteractionType, Question, QuestionDeck } from '@/types/questions';
import { MMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// MMKV storage for persistence
const storage = new MMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

// Question session state
interface QuestionSession {
  id: string;
  deckId: string;
  startedAt: string;
  questionsCompleted: number;
  questionsSkipped: number;
  currentQuestionIndex: number;
  questions: Question[];
}

// Question store interface
interface QuestionStore {
  // Current session
  currentSession: QuestionSession | null;
  currentDeck: QuestionDeck | null;
  currentQuestion: Question | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  showQuestionActions: boolean;
  
  // Navigation state
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Actions
  startSession: (deck: QuestionDeck, questions: Question[]) => void;
  endSession: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  recordInteraction: (type: InteractionType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleQuestionActions: () => void;
  
  // Computed getters
  getProgress: () => { completed: number; total: number; percentage: number };
  getCurrentQuestionNumber: () => number;
  hasMoreQuestions: () => boolean;
}

export const useQuestionStore = create<QuestionStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      currentDeck: null,
      currentQuestion: null,
      isLoading: false,
      error: null,
      showQuestionActions: true,
      canGoNext: false,
      canGoPrevious: false,

      // Start a new question session
      startSession: (deck: QuestionDeck, questions: Question[]) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const newSession: QuestionSession = {
          id: sessionId,
          deckId: deck.id,
          startedAt: new Date().toISOString(),
          questionsCompleted: 0,
          questionsSkipped: 0,
          currentQuestionIndex: 0,
          questions,
        };

        set({
          currentSession: newSession,
          currentDeck: deck,
          currentQuestion: questions[0] || null,
          canGoNext: questions.length > 1,
          canGoPrevious: false,
          error: null,
        });
      },

      // End current session
      endSession: () => {
        set({
          currentSession: null,
          currentDeck: null,
          currentQuestion: null,
          canGoNext: false,
          canGoPrevious: false,
          error: null,
        });
      },

      // Navigate to next question
      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const nextIndex = currentSession.currentQuestionIndex + 1;
        if (nextIndex >= currentSession.questions.length) return;

        const nextQuestion = currentSession.questions[nextIndex];
        
        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: nextIndex,
          },
          currentQuestion: nextQuestion,
          canGoNext: nextIndex < currentSession.questions.length - 1,
          canGoPrevious: true,
        });
      },

      // Navigate to previous question
      previousQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;

        const prevIndex = currentSession.currentQuestionIndex - 1;
        if (prevIndex < 0) return;

        const prevQuestion = currentSession.questions[prevIndex];
        
        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: prevIndex,
          },
          currentQuestion: prevQuestion,
          canGoNext: true,
          canGoPrevious: prevIndex > 0,
        });
      },

      // Go to specific question by index
      goToQuestion: (index: number) => {
        const { currentSession } = get();
        if (!currentSession || index < 0 || index >= currentSession.questions.length) return;

        const question = currentSession.questions[index];
        
        set({
          currentSession: {
            ...currentSession,
            currentQuestionIndex: index,
          },
          currentQuestion: question,
          canGoNext: index < currentSession.questions.length - 1,
          canGoPrevious: index > 0,
        });
      },

      // Record user interaction with current question
      recordInteraction: (type: InteractionType) => {
        const { currentSession } = get();
        if (!currentSession) return;

        const updatedSession = {
          ...currentSession,
          questionsCompleted: type === InteractionType.COMPLETED 
            ? currentSession.questionsCompleted + 1 
            : currentSession.questionsCompleted,
          questionsSkipped: type === InteractionType.SKIPPED 
            ? currentSession.questionsSkipped + 1 
            : currentSession.questionsSkipped,
        };

        set({
          currentSession: updatedSession,
        });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Toggle question actions visibility
      toggleQuestionActions: () => {
        set(state => ({ showQuestionActions: !state.showQuestionActions }));
      },

      // Get progress information
      getProgress: () => {
        const { currentSession } = get();
        if (!currentSession) {
          return { completed: 0, total: 0, percentage: 0 };
        }

        const completed = currentSession.questionsCompleted + currentSession.questionsSkipped;
        const total = currentSession.questions.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        return { completed, total, percentage };
      },

      // Get current question number (1-based)
      getCurrentQuestionNumber: () => {
        const { currentSession } = get();
        if (!currentSession) return 0;
        return currentSession.currentQuestionIndex + 1;
      },

      // Check if there are more questions available
      hasMoreQuestions: () => {
        const { currentSession } = get();
        if (!currentSession) return false;
        return currentSession.currentQuestionIndex < currentSession.questions.length - 1;
      },
    }),
    {
      name: 'question-store',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist essential session data
      partialize: (state) => ({
        currentSession: state.currentSession,
        currentDeck: state.currentDeck,
      }),
    }
  )
);
