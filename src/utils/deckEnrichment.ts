// Deck Enrichment Utility
// Maps database decks to UI-ready decks with gradients, images, icons, and colors


interface UIMetadata {
  gradient: string[];
  image: any;
  icon: string;
  color: string;
}

// Map deck categories to UI metadata
export function getDeckUIMetadata(category: string): UIMetadata {
  const categoryMap: Record<string, UIMetadata> = {
    friends: {
      gradient: ['#FF6B35', '#F7931E'],
      image: require('../../assets/images/onboarding/friends.jpg'),
      icon: 'F',
      color: '#FF6B35',
    },
    family: {
      gradient: ['#4ECDC4', '#44A08D'],
      image: require('../../assets/images/onboarding/family.jpg'),
      icon: 'H',
      color: '#4ECDC4',
    },
    romantic: {
      gradient: ['#E74C3C', '#C0392B'],
      image: require('../../assets/images/onboarding/dating.jpg'),
      icon: 'D',
      color: '#E74C3C',
    },
    dating: {
      gradient: ['#E74C3C', '#C0392B'],
      image: require('../../assets/images/onboarding/dating.jpg'),
      icon: 'D',
      color: '#E74C3C',
    },
    professional: {
      gradient: ['#3498DB', '#2980B9'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: 'G',
      color: '#3498DB',
    },
    growing: {
      gradient: ['#3498DB', '#2980B9'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: 'G',
      color: '#3498DB',
    },
    spice: {
      gradient: ['#FF1493', '#DC143C'],
      image: require('../../assets/images/onboarding/spicy.jpg'),
      icon: '🔥',
      color: '#FF1493',
    },
  };

  // Return metadata or default
  return categoryMap[category.toLowerCase()] || {
    gradient: ['#667eea', '#764ba2'],
    image: null,
    icon: 'Q',
    color: '#667eea',
  };
}

// Enrich a database deck with UI metadata
export function enrichDeck(dbDeck: any): any {
  const uiMetadata = getDeckUIMetadata(dbDeck.category);
  
  return {
    ...dbDeck,
    gradient: uiMetadata.gradient,
    image: uiMetadata.image,
    icon: uiMetadata.icon,
    color: uiMetadata.color,
    // Use DB is_premium if available, otherwise fallback to checking category
    isPremium: dbDeck.is_premium ?? (dbDeck.category === 'spice'),
  };
}

// Enrich multiple decks
export function enrichDecks(dbDecks: any[]): any[] {
  return dbDecks.map(enrichDeck);
}

