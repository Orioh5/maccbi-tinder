// Utility functions for anonymous token management

export function generateAnonymousToken(): string {
  // Generate a unique anonymous token using timestamp + random string
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomString}`;
}

export function getOrCreateAnonymousToken(): string {
  if (typeof window === 'undefined') {
    return generateAnonymousToken();
  }

  // Check if token exists in localStorage
  let token = localStorage.getItem('anonymous_token');
  
  if (!token) {
    // Generate new token and store it
    token = generateAnonymousToken();
    localStorage.setItem('anonymous_token', token);
  }
  
  return token;
}

export function clearAnonymousToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('anonymous_token');
  }
}

