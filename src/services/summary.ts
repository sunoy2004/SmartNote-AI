/**
 * Summary Generation Service
 * 
 * MVP: Client-side summarization using simple algorithms
 * Future: Server-side LLM-based summarization via Firebase Cloud Functions
 */

/**
 * Simple sentence scoring algorithm (TextRank-inspired)
 * Scores sentences based on word frequency and position
 */
const scoreSentence = (sentence: string, wordFreq: Map<string, number>): number => {
  const words = sentence.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let score = 0;
  
  words.forEach(word => {
    score += wordFreq.get(word) || 0;
  });
  
  // Boost score for sentences at the beginning (often contain key info)
  return score / words.length;
};

/**
 * Generate a summary using simple TextRank-like algorithm
 * @param text - Full transcript text
 * @param maxLength - Maximum summary length in characters
 * @returns Generated summary
 */
export const generateSummary = (text: string, maxLength: number = 200): string => {
  if (!text || text.trim().length === 0) {
    return "";
  }

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  if (sentences.length <= 2) {
    return text.substring(0, maxLength);
  }

  // Calculate word frequencies (excluding common stop words)
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can']);
  const wordFreq = new Map<string, number>();
  
  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
  });

  // Score sentences
  const scoredSentences = sentences.map(sentence => ({
    text: sentence.trim(),
    score: scoreSentence(sentence, wordFreq),
  }));

  // Sort by score and take top sentences
  scoredSentences.sort((a, b) => b.score - a.score);
  
  // Select sentences until we reach maxLength
  const summary: string[] = [];
  let currentLength = 0;
  
  for (const sentence of scoredSentences) {
    if (currentLength + sentence.text.length <= maxLength) {
      summary.push(sentence.text);
      currentLength += sentence.text.length;
    } else {
      break;
    }
  }

  // If no summary generated, return first sentence
  if (summary.length === 0 && sentences.length > 0) {
    return sentences[0].trim().substring(0, maxLength);
  }

  return summary.join(' ').trim();
};

/**
 * Generate personalized summary based on user preference
 * @param text - Full transcript text
 * @param preference - "Beginner", "Intermediate", or "Advanced"
 * @returns Personalized summary
 */
export const generatePersonalizedSummary = (
  text: string,
  preference: "Beginner" | "Intermediate" | "Advanced" = "Intermediate"
): string => {
  let maxLength = 200;
  
  if (preference === "Beginner") {
    maxLength = 300; // Longer, more detailed
  } else if (preference === "Advanced") {
    maxLength = 150; // Shorter, more concise
  }

  return generateSummary(text, maxLength);
};

/**
 * Mark summary as pending server-side generation
 * This flag indicates that a higher-quality LLM summary should be generated
 */
export const markPendingServerSummary = (): boolean => {
  return true;
};

/**
 * TODO: Server-side summarization
 * 
 * Future implementation:
 * - Call Firebase Cloud Function with transcript
 * - Use OpenAI API or similar LLM service
 * - Return high-quality summary
 * - Update note document with serverSummary field
 */
export const generateServerSummary = async (
  transcript: string,
  noteId: string
): Promise<string> => {
  // Placeholder for server-side implementation
  // This should call a Firebase Cloud Function
  throw new Error("Server-side summarization not yet implemented");
};

