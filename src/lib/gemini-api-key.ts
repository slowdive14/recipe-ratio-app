const STORAGE_KEY = 'gemini-api-key';

export function getGeminiApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function setGeminiApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, apiKey);
}

export function removeGeminiApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey();
}

export const GOOGLE_AI_STUDIO_URL = 'https://aistudio.google.com/apikey';
