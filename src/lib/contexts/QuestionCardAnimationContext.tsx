import { createContext, FC, PropsWithChildren, useCallback, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  SharedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useQuestionStackAnimation } from './QuestionStackAnimationContext';

// QuestionCardAnimationContext
// Per-card gesture handling with Slack-style physics
// Based on Slack's ChannelAnimationProvider

const SPRING_CONFIG = {
  damping: 60,
  stiffness: 900,
};

type ContextValue = {
  // panX, panY are used to move the card along the screen
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  // absoluteYAnchor is used to handle rotation of the card based on where you start the gesture (top or bottom)
  absoluteYAnchor: SharedValue<number>;
  // panDistance is the distance you need to drag the card to swipe it left or right
  panDistance: number;
  // handleQuestionComplete/Skip callbacks for external button triggers
  handleQuestionComplete: () => void;
  handleQuestionSkip: () => void;
};

const QuestionCardAnimationContext = createContext<ContextValue>({} as ContextValue);

export const QuestionCardAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    isDragging,
    animatedQuestionIndex,
    currentQuestionIndex,
    prevQuestionIndex,
  } = useQuestionStackAnimation();

  const { width } = useWindowDimensions();
  // Threshold: quarter of screen width feels reachable yet deliberate
  const panDistance = width / 4;

  // panX, panY are used to move the card along the screen
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  // Anchor used downstream for rotation direction (top drag tilts one way, bottom the other)
  const absoluteYAnchor = useSharedValue(0);

  // Track if we've already triggered haptic for this gesture
  const hasTriggeredHaptic = useSharedValue(false);

  const handleQuestionComplete = useCallback(() => {
    // Move to next question
    prevQuestionIndex.value = currentQuestionIndex.value;
    currentQuestionIndex.value = currentQuestionIndex.value - 1;
    
    // Animate card off-screen to the right
    panX.value = withTiming(width * 2, { duration: 500 });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [currentQuestionIndex, prevQuestionIndex, panX, width]);

  const handleQuestionSkip = useCallback(() => {
    // Move to next question
    prevQuestionIndex.value = currentQuestionIndex.value;
    currentQuestionIndex.value = currentQuestionIndex.value - 1;
    
    // Animate card off-screen to the left
    panX.value = withTiming(-width * 2, { duration: 500 });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [currentQuestionIndex, prevQuestionIndex, panX, width]);

  // Main pan gesture: updates visual progress during drag and commits on release
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      'worklet';
      isDragging.value = true;
      absoluteYAnchor.value = event.absoluteY;
      hasTriggeredHaptic.value = false;
    })
    .onChange((event) => {
      'worklet';
      // Progress in "card index" space: 1.0 shift equals one card dismissed
      const progress = currentQuestionIndex.value - Math.abs(event.translationX) / panDistance;
      // Clamp progress to at most one card ahead to avoid skipping
      animatedQuestionIndex.value =
        progress < currentQuestionIndex.value - 1 ? currentQuestionIndex.value - 1 : progress;

      panX.value = event.translationX;
      panY.value = event.translationY;

      // Trigger haptic when crossing threshold
      if (Math.abs(event.translationX) > panDistance && !hasTriggeredHaptic.value) {
        hasTriggeredHaptic.value = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    })
    .onEnd((event) => {
      'worklet';
      isDragging.value = false;

      if (Math.abs(event.translationX) > panDistance) {
        // Commit: move to next card (left or right) and remember previous for undo logic
        prevQuestionIndex.value = Math.round(currentQuestionIndex.value);
        currentQuestionIndex.value = Math.round(currentQuestionIndex.value - 1);

        const sign = event.translationX > 0 ? 1 : -1;

        // Fling card off-screen horizontally
        panX.value = withTiming(sign * width * 2, { duration: 500 });
        panY.value = withTiming(0, { duration: 500 });
      } else {
        // Spring back feels snappy but controlled
        panX.value = withSpring(0, SPRING_CONFIG);
        panY.value = withSpring(0, SPRING_CONFIG);

        // Snap animated index to integer
        animatedQuestionIndex.value = withTiming(
          Math.ceil(currentQuestionIndex.value),
          { duration: 200 }
        );
      }
    });

  const value = {
    panX,
    panY,
    absoluteYAnchor,
    panDistance,
    handleQuestionComplete,
    handleQuestionSkip,
  };

  return (
    <QuestionCardAnimationContext.Provider value={value}>
      {/* We wrap children with GestureDetector to intercept pan gestures */}
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </QuestionCardAnimationContext.Provider>
  );
};

export const useQuestionCardAnimation = () => {
  const context = useContext(QuestionCardAnimationContext);

  if (!context) {
    throw new Error(
      'useQuestionCardAnimation must be used within a QuestionCardAnimationProvider'
    );
  }

  return context;
};

