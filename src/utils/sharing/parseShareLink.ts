// Parse thread ID from share link

export const parseShareLink = (url: string): string | null => {
  try {
    // Handle both deep link and web URLs
    // godeeperapp://question/[threadId]
    // https://godeeper.app/question/[threadId]
    
    const urlObj = new URL(url);
    
    // Extract path
    const path = urlObj.pathname || urlObj.host + urlObj.pathname;
    
    // Match pattern: /question/{threadId} or question/{threadId}
    const match = path.match(/question\/([a-f0-9-]+)/i);
    
    if (match && match[1]) {
      return match[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing share link:', error);
    return null;
  }
};

