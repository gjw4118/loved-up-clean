// Generate share link for question thread

export const generateShareLink = (threadId: string): string => {
  // Deep link URL for app
  return `godeeperapp://question/${threadId}`;
};

export const generateWebFallbackLink = (threadId: string): string => {
  // Web fallback URL (will need to be set up)
  return `https://godeeper.app/question/${threadId}`;
};

export const generateShareMessage = (questionText: string, threadId: string): string => {
  const shareLink = generateShareLink(threadId);
  
  // Truncate question if too long
  const maxLength = 100;
  const truncatedQuestion = questionText.length > maxLength 
    ? `${questionText.substring(0, maxLength)}...` 
    : questionText;
  
  return `Hey! I'd love to hear your thoughts on this:\n\n"${truncatedQuestion}"\n\nOpen in GoDeeper: ${shareLink}`;
};

