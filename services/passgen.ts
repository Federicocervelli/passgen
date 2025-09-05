// Simple service to generate a password using several strategies

export function genPw(length: number, useDigits: boolean, useSymbols: boolean, useUppercase: boolean, useLowercase: boolean): string {
  // Character sets
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  
  // Build character pool based on options
  let chars = '';
  if (useDigits) chars += digits;
  if (useSymbols) chars += symbols;
  if (useUppercase) chars += uppercase;
  if (useLowercase) chars += lowercase;
  
  // Return empty string if no character types selected or invalid length
  if (chars.length === 0 || length <= 0) return '';
  
  // Generate password with crypto.getRandomValues
  let password = '';
  for (let i = 0; i < length; i++) {
    // Generate a single random value for each character
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomIndex = array[0] % chars.length;
    password += chars[randomIndex];
  }
  
  return password;
}