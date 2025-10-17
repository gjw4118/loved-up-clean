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
    family: {
      gradient: ['#4ECDC4', '#44A08D'],
      image: require('../../assets/images/onboarding/family.jpg'),
      icon: '🏠',
      color: '#4ECDC4',
    },
    dating: {
      gradient: ['#FF69B4', '#FF1493'],
      image: require('../../assets/images/onboarding/dating.jpg'),
      icon: '💕',
      color: '#FF69B4',
    },
    lovers: {
      gradient: ['#E74C3C', '#C0392B'],
      image: require('../../assets/images/onboarding/dating.jpg'),
      icon: '❤️',
      color: '#E74C3C',
    },
    work: {
      gradient: ['#5B7C99', '#34495E'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: '💼',
      color: '#5B7C99',
    },
    friends: {
      gradient: ['#FF6B35', '#F7931E'],
      image: require('../../assets/images/onboarding/friends.jpg'),
      icon: '🍷',
      color: '#FF6B35',
    },
    growth: {
      gradient: ['#27AE60', '#229954'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: '🌱',
      color: '#27AE60',
    },
    spice: {
      gradient: ['#FF1493', '#DC143C'],
      image: require('../../assets/images/onboarding/spicy.jpg'),
      icon: '🔥',
      color: '#FF1493',
    },
    // Legacy fallbacks for backwards compatibility
    romantic: {
      gradient: ['#E74C3C', '#C0392B'],
      image: require('../../assets/images/onboarding/dating.jpg'),
      icon: '❤️',
      color: '#E74C3C',
    },
    professional: {
      gradient: ['#5B7C99', '#34495E'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: '💼',
      color: '#5B7C99',
    },
    growing: {
      gradient: ['#27AE60', '#229954'],
      image: require('../../assets/images/onboarding/growing.jpg'),
      icon: '🌱',
      color: '#27AE60',
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

