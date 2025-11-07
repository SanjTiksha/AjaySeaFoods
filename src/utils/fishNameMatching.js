// Utility functions for smart fish name matching

// Calculate similarity between two strings (0-1, where 1 is identical)
const calculateSimilarity = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple Levenshtein distance calculation
  const matrix = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  const distance = matrix[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - (distance / maxLength);
};

// Find best matching fish names
export const findMatchingFish = (inputText, allFish) => {
  if (!inputText || !allFish) return [];
  
  const inputNames = inputText.split(',').map(name => name.trim()).filter(name => name);
  const results = [];
  
  inputNames.forEach(inputName => {
    const matches = allFish.map(fish => ({
      fish,
      similarity: calculateSimilarity(inputName, fish.name),
      exactMatch: fish.name.toLowerCase() === inputName.toLowerCase()
    }))
    .filter(match => match.similarity > 0.3) // Only show matches with >30% similarity
    .sort((a, b) => b.similarity - a.similarity);
    
    if (matches.length > 0) {
      results.push({
        input: inputName,
        bestMatch: matches[0],
        allMatches: matches.slice(0, 3) // Top 3 matches
      });
    } else {
      results.push({
        input: inputName,
        bestMatch: null,
        allMatches: []
      });
    }
  });
  
  return results;
};

// Validate fish names and return corrected list
export const validateAndCorrectFishNames = (inputText, allFish) => {
  const matches = findMatchingFish(inputText, allFish);
  const correctedNames = [];
  const warnings = [];
  
  matches.forEach(match => {
    if (match.bestMatch && match.bestMatch.exactMatch) {
      // Exact match found
      correctedNames.push(match.bestMatch.fish.name);
    } else if (match.bestMatch && match.bestMatch.similarity > 0.7) {
      // High similarity match found
      correctedNames.push(match.bestMatch.fish.name);
      warnings.push(`"${match.input}" → "${match.bestMatch.fish.name}" (${Math.round(match.bestMatch.similarity * 100)}% match)`);
    } else if (match.bestMatch && match.bestMatch.similarity > 0.5) {
      // Medium similarity match found
      correctedNames.push(match.bestMatch.fish.name);
      warnings.push(`"${match.input}" → "${match.bestMatch.fish.name}" (${Math.round(match.bestMatch.similarity * 100)}% match) - Please verify`);
    } else {
      // No good match found
      warnings.push(`"${match.input}" - No matching fish found`);
    }
  });
  
  return {
    correctedNames,
    warnings,
    hasErrors: warnings.some(w => w.includes('No matching fish found'))
  };
};

// Get all available fish names for suggestions
export const getAllFishNames = (allFish) => {
  return allFish.map(fish => fish.name);
};
