/**
 * Subject Detection Service
 * 
 * MVP: Keyword-based subject detection
 * Future: ML-based classification via serverless function
 */

/**
 * Detect subject from transcript using keyword matching
 * @param transcript - Full transcript text
 * @param userSubjects - Array of user's subjects
 * @returns Object with detected subject and confidence score
 */
export const detectSubject = (
  transcript: string,
  userSubjects: string[]
): { subject: string; confidence: number } => {
  if (!transcript || transcript.trim().length === 0) {
    return {
      subject: userSubjects[0] || "General",
      confidence: 0,
    };
  }

  if (userSubjects.length === 0) {
    return {
      subject: "General",
      confidence: 0,
    };
  }

  // Normalize transcript to lowercase
  const normalizedTranscript = transcript.toLowerCase();

  // Subject keyword mappings
  // These can be expanded with more sophisticated keyword lists
  const subjectKeywords: Record<string, string[]> = {
    mathematics: ["math", "calculus", "algebra", "equation", "formula", "derivative", "integral", "matrix", "theorem", "proof"],
    physics: ["physics", "quantum", "mechanics", "force", "energy", "momentum", "wave", "particle", "electron", "atom", "molecule"],
    "computer science": ["programming", "algorithm", "code", "software", "data structure", "database", "function", "variable", "loop", "array"],
    chemistry: ["chemistry", "chemical", "molecule", "atom", "reaction", "compound", "element", "bond", "solution"],
    biology: ["biology", "cell", "organism", "dna", "protein", "gene", "evolution", "ecosystem", "species"],
    history: ["history", "historical", "ancient", "civilization", "war", "empire", "revolution", "century"],
    literature: ["literature", "poem", "novel", "author", "character", "theme", "metaphor", "narrative"],
    psychology: ["psychology", "behavior", "cognitive", "mental", "emotion", "personality", "memory", "learning"],
  };

  // Score each subject based on keyword matches
  const subjectScores: Record<string, number> = {};

  userSubjects.forEach(subject => {
    const normalizedSubject = subject.toLowerCase();
    const keywords = subjectKeywords[normalizedSubject] || [normalizedSubject];
    
    let score = 0;
    keywords.forEach(keyword => {
      // Count occurrences of keyword in transcript
      const regex = new RegExp(keyword, "gi");
      const matches = normalizedTranscript.match(regex);
      if (matches) {
        score += matches.length;
      }
    });
    
    // Also check if subject name appears directly
    if (normalizedTranscript.includes(normalizedSubject)) {
      score += 5; // Boost for direct mention
    }
    
    subjectScores[subject] = score;
  });

  // Find subject with highest score
  let bestSubject = userSubjects[0];
  let maxScore = subjectScores[bestSubject] || 0;

  Object.entries(subjectScores).forEach(([subject, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestSubject = subject;
    }
  });

  // Calculate confidence (0-1)
  // Higher score = higher confidence, but cap at reasonable level
  const totalWords = normalizedTranscript.split(/\s+/).length;
  const confidence = Math.min(maxScore / Math.max(totalWords * 0.1, 1), 0.95);
  
  // If confidence is very low, default to first subject
  if (confidence < 0.1) {
    return {
      subject: userSubjects[0],
      confidence: 0.1,
    };
  }

  return {
    subject: bestSubject,
    confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
  };
};

/**
 * TODO: Server-side ML-based subject detection
 * 
 * Future implementation:
 * - Send transcript to Firebase Cloud Function
 * - Use ML model or LLM to classify subject
 * - Return subject with confidence score
 * - More accurate than keyword matching
 */
export const detectSubjectServer = async (
  transcript: string,
  userSubjects: string[]
): Promise<{ subject: string; confidence: number }> => {
  // Placeholder for server-side implementation
  throw new Error("Server-side subject detection not yet implemented");
};

