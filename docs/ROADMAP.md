# Connect App - Development Roadmap

## 🎯 Project Status: Foundation Complete, Core Features Needed

**Current Phase**: Foundation → Core Features  
**Target Launch**: 6-8 weeks  
**MVP Goal**: Functional question browsing with 4 decks and sharing

---

## 📊 Progress Overview

### ✅ **Completed (Foundation)**
- [x] Project setup with Expo Router v6 + SDK 54
- [x] Hybrid design system (HeroUI + iOS 26 glass)
- [x] Database schema design (PostgreSQL/Supabase)
- [x] Authentication system (Google/Apple)
- [x] Navigation structure with glass tab bar
- [x] TypeScript configuration with strict mode
- [x] Development standards (ESLint, Prettier, Jest)

### 🚧 **Critical Gaps (Blocking MVP)**
- [ ] Question browsing functionality (CORE FEATURE)
- [ ] Deck selection and management
- [ ] User interaction tracking (completed/skipped)
- [ ] Question sharing (iMessage, in-app)
- [ ] Onboarding flow integration
- [ ] Question data seeding

---

## 🗓️ **Phase-by-Phase Roadmap**

### **Phase 1: Core Question System** (Weeks 1-2)
*Priority: CRITICAL - This is the main app functionality*

#### Week 1: Question Infrastructure
- [ ] **Question Data Seeding**
  - Populate database with sample questions from `constants/decks.ts`
  - Create data migration scripts
  - Set up question management utilities

- [ ] **Question Card Component**
  - Build swipeable question cards with glass morphism
  - Add question text display with proper typography
  - Implement card animations and transitions
  - Add accessibility support

- [ ] **Question Navigation**
  - Swipe gestures (left/right for next/previous)
  - Question progress indicator
  - End-of-deck handling

#### Week 2: Question Interactions
- [ ] **User Interaction System**
  - Complete/Skip button functionality
  - Database interaction tracking
  - Session management
  - Progress persistence

- [ ] **Question Browsing Flow**
  - Question detail view
  - Question filtering by difficulty
  - Random question selection
  - Question history tracking

### **Phase 2: Deck Management** (Week 3)
*Priority: HIGH - Core navigation and organization*

- [ ] **Deck Selection Screen**
  - Replace "Coming Soon" placeholder
  - Interactive deck cards with gradients
  - Deck progress visualization
  - Deck statistics display

- [ ] **Deck Navigation**
  - Deck-to-questions flow
  - Deck switching functionality
  - Deck completion tracking
  - Favorite decks system

- [ ] **User Progress**
  - Per-deck progress tracking
  - Overall completion statistics
  - Streak tracking
  - Achievement system (basic)

### **Phase 3: Sharing & Social** (Week 4)
*Priority: HIGH - Key PRD requirement*

- [ ] **iMessage Sharing**
  - Native iOS sharing integration
  - Question text formatting for messages
  - Share tracking analytics
  - Deep linking back to app

- [ ] **In-App Sharing**
  - Share question with other users
  - Generate shareable links
  - Social sharing to other platforms
  - Share history tracking

- [ ] **Question Actions**
  - Favorite questions system
  - Share button on question cards
  - Copy question text
  - Report inappropriate content

### **Phase 4: User Experience** (Week 5)
*Priority: MEDIUM - Polish and retention*

- [ ] **Onboarding Integration**
  - Connect existing onboarding components
  - User preference collection
  - Deck selection during onboarding
  - Tutorial walkthrough

- [ ] **Profile & Settings**
  - User profile completion
  - Notification preferences
  - Privacy settings
  - Account management

- [ ] **Enhanced UX**
  - Loading states and skeletons
  - Error handling and retry logic
  - Offline support for questions
  - Pull-to-refresh functionality

### **Phase 5: Performance & Analytics** (Week 6)
*Priority: MEDIUM - Optimization and insights*

- [ ] **Performance Optimization**
  - Question caching with React Query
  - Image optimization
  - Bundle size optimization
  - Memory leak prevention

- [ ] **Analytics Implementation**
  - User interaction tracking
  - Question popularity metrics
  - Session duration tracking
  - Retention analytics

- [ ] **Quality Assurance**
  - Comprehensive testing suite
  - Performance benchmarking
  - Accessibility audit
  - iOS compatibility testing

---

## 🎯 **MVP Definition (Launch Ready)**

### **Must-Have Features**
1. ✅ User authentication (Google/Apple)
2. ⏳ Browse questions from 4 decks (200+ questions total)
3. ⏳ Mark questions as completed/skipped
4. ⏳ Share questions via iMessage
5. ⏳ Track user progress per deck
6. ⏳ Basic onboarding flow
7. ⏳ iOS-native glass design

### **Success Metrics**
- App launch time < 2 seconds
- Question loading < 500ms
- 60fps smooth animations
- 4.5+ App Store rating potential
- < 2% crash rate

---

## 🚨 **Immediate Next Steps (This Week)**

### **Priority 1: Question Data & Infrastructure**
```bash
# 1. Install development dependencies
npm install

# 2. Set up database with sample data
# Create migration script for question seeding

# 3. Build QuestionCard component
# Start with basic question display
```

### **Priority 2: Question Browsing**
- Create `components/cards/QuestionCard.tsx`
- Implement swipe gestures with React Native Gesture Handler
- Add question state management with Zustand
- Connect to Supabase question queries

### **Priority 3: Deck Integration**
- Update `app/(tabs)/decks.tsx` with real deck data
- Create deck-to-questions navigation
- Implement deck progress tracking

---

## 🔧 **Technical Debt & Improvements**

### **Code Quality**
- [ ] Set up pre-commit hooks with Husky
- [ ] Add comprehensive unit tests
- [ ] Implement E2E testing with Detox
- [ ] Set up CI/CD pipeline

### **Performance**
- [ ] Implement question preloading
- [ ] Add image lazy loading
- [ ] Optimize bundle size
- [ ] Add performance monitoring

### **User Experience**
- [ ] Add haptic feedback throughout
- [ ] Implement dark mode support
- [ ] Add accessibility improvements
- [ ] Create user feedback system

---

## 📈 **Post-MVP Roadmap (Phase 2)**

### **Advanced Features**
- [ ] AI-powered question recommendations
- [ ] Custom question creation
- [ ] Social features (friends, groups)
- [ ] Premium subscription model
- [ ] Advanced analytics dashboard

### **Platform Expansion**
- [ ] iPad optimization
- [ ] Apple Watch companion
- [ ] Widget support
- [ ] Siri Shortcuts integration

---

## 🎯 **Success Criteria**

### **Technical**
- [ ] All PRD requirements implemented
- [ ] Performance targets met
- [ ] 90%+ test coverage
- [ ] Zero critical security issues

### **Product**
- [ ] 1,000+ downloads in first month
- [ ] 4.5+ App Store rating
- [ ] 60%+ 7-day retention
- [ ] < 2% crash rate

### **Business**
- [ ] User engagement metrics positive
- [ ] Sharing feature adoption > 30%
- [ ] Question completion rate > 70%
- [ ] Sustainable growth trajectory

---

**Last Updated**: January 2025  
**Next Review**: Weekly during development  
**Owner**: Connect Development Team
