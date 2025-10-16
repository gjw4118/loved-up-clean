import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

// QuestionStackAnimationContext
// Global animation coordination for the question card stack
// Inspired by Slack's CatchUpAnimationProvider

type ContextValue = {
  isDragging: SharedValue<boolean>;
  // Separate animated index (with float) from current index (integer) for smooth visual progress
  animatedQuestionIndex: SharedValue<number>;
  currentQuestionIndex: SharedValue<number>;
  prevQuestionIndex: SharedValue<number>;
  // Button actions (complete/skip) triggered outside of card gestures
  isCompletePressed: SharedValue<boolean>;
  isSkipPressed: SharedValue<boolean>;
};

const QuestionStackAnimationContext = createContext<ContextValue>({} as ContextValue);

export const QuestionStackAnimationProvider: FC<
  PropsWithChildren<{ totalQuestions: number }>
> = ({ children, totalQuestions }) => {
  const lastItemIndex = totalQuestions - 1;

  // Shared state driving cross-component animations:
  // - isDragging gates UI reactions to avoid fighting with gesture springs
  // - animatedQuestionIndex allows fractional indices while swiping (visual progress)
  // - current/prev indices are integers for business logic and post-gesture settling
  const isDragging = useSharedValue(false);
  const animatedQuestionIndex = useSharedValue(0);
  const currentQuestionIndex = useSharedValue(0);
  const prevQuestionIndex = useSharedValue(0);
  
  // Button actions set these flags; cards listen and animate off-screen
  const isCompletePressed = useSharedValue(false);
  const isSkipPressed = useSharedValue(false);

  const value = {
    isDragging,
    animatedQuestionIndex,
    currentQuestionIndex,
    prevQuestionIndex,
    isCompletePressed,
    isSkipPressed,
  };

  return (
    <QuestionStackAnimationContext.Provider value={value}>
      {children}
    </QuestionStackAnimationContext.Provider>
  );
};

export const useQuestionStackAnimation = () => {
  const context = useContext(QuestionStackAnimationContext);

  if (!context) {
    throw new Error(
      'useQuestionStackAnimation must be used within a QuestionStackAnimationProvider'
    );
  }

  return context;
};

