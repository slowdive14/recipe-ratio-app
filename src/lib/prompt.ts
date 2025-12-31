/**
 * Prompt engineering utility for generating high-quality food images
 */

export function buildFoodImagePrompt(title: string, description?: string): string {
  // Truncate description to avoid token limits
  const descSnippet = description ? description.slice(0, 100) : '';

  // Build enhanced prompt with professional photography style
  const prompt = `${title}. Professional food photography, culinary magazine style, 4k resolution, appetizing, studio lighting, beautifully plated on elegant dishware, shallow depth of field, warm color tones, garnished professionally${descSnippet ? `. Context: ${descSnippet}` : ''}`;

  return prompt;
}

export function buildKoreanFoodPrompt(title: string, description?: string): string {
  // Korean food specific prompt for better results
  const descSnippet = description ? description.slice(0, 100) : '';

  const prompt = `A beautiful photograph of ${title}, Korean cuisine style, traditional Korean plating on a ceramic dish, side dishes (banchan) visible, warm lighting, top-down or 45-degree angle shot, high resolution food photography, appetizing and delicious looking${descSnippet ? `. Description: ${descSnippet}` : ''}`;

  return prompt;
}

// Detect if the recipe name contains Korean characters
export function isKoreanRecipe(title: string): boolean {
  const koreanRegex = /[\u3131-\u3163\uac00-\ud7a3]/;
  return koreanRegex.test(title);
}

// Main function to generate the appropriate prompt
export function generateRecipePrompt(title: string, description?: string): string {
  if (isKoreanRecipe(title)) {
    return buildKoreanFoodPrompt(title, description);
  }
  return buildFoodImagePrompt(title, description);
}
