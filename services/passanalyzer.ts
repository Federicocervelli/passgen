export interface PasswordAnalysis {
  characterSets: {
    lowercase: boolean;
    uppercase: boolean;
    digits: boolean;
    symbols: boolean;
  };
  totalCombinations: number;
  attemptsPerSecond: number;
  timeToCrack: {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
    years: number;
  };
  strength: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  recommendations: string[];
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password || password.length === 0) {
    return {
      characterSets: { lowercase: false, uppercase: false, digits: false, symbols: false },
      totalCombinations: 0,
      attemptsPerSecond: 1000000000, // 1 billion attempts per second
      timeToCrack: { seconds: 0, minutes: 0, hours: 0, days: 0, years: 0 },
      strength: 'very-weak',
      recommendations: ['Enter a password to analyze']
    };
  }

  // Analyze character sets used
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigits = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  // Calculate character set size
  let charsetSize = 0;
  if (hasLowercase) charsetSize += 26;
  if (hasUppercase) charsetSize += 26;
  if (hasDigits) charsetSize += 10;
  if (hasSymbols) charsetSize += 32; // Common symbols

  // Calculate total possible combinations
  const totalCombinations = Math.pow(charsetSize, password.length);

  // Assume 1 billion attempts per second (modern GPU)
  const attemptsPerSecond = 1000000000;

  // Calculate time to crack
  const secondsToCrack = totalCombinations / attemptsPerSecond;
  const minutesToCrack = secondsToCrack / 60;
  const hoursToCrack = minutesToCrack / 60;
  const daysToCrack = hoursToCrack / 24;
  const yearsToCrack = daysToCrack / 365.25;

  // Determine strength
  let strength: PasswordAnalysis['strength'];
  if (yearsToCrack >= 1000) strength = 'very-strong';
  else if (yearsToCrack >= 1) strength = 'strong';
  else if (daysToCrack >= 1) strength = 'medium';
  else if (hoursToCrack >= 1) strength = 'weak';
  else strength = 'very-weak';

  // Generate recommendations
  const recommendations: string[] = [];
  
  if (password.length < 12) {
    recommendations.push('Increase password length to at least 12 characters');
  }
  
  if (!hasLowercase) {
    recommendations.push('Add lowercase letters (a-z)');
  }
  
  if (!hasUppercase) {
    recommendations.push('Add uppercase letters (A-Z)');
  }
  
  if (!hasDigits) {
    recommendations.push('Add numbers (0-9)');
  }
  
  if (!hasSymbols) {
    recommendations.push('Add special characters (!@#$%^&*)');
  }

  if (recommendations.length === 0) {
    recommendations.push('Excellent password strength!');
  }

  return {
    characterSets: {
      lowercase: hasLowercase,
      uppercase: hasUppercase,
      digits: hasDigits,
      symbols: hasSymbols
    },
    totalCombinations,
    attemptsPerSecond,
    timeToCrack: {
      seconds: secondsToCrack,
      minutes: minutesToCrack,
      hours: hoursToCrack,
      days: daysToCrack,
      years: yearsToCrack
    },
    strength,
    recommendations
  };
}

export function formatTime(time: number): string {
  if (time >= 1e12) {
    return `${(time / 1e12).toFixed(1)} trillion`;
  } else if (time >= 1e9) {
    return `${(time / 1e9).toFixed(1)} billion`;
  } else if (time >= 1e6) {
    return `${(time / 1e6).toFixed(1)} million`;
  } else if (time >= 1e3) {
    return `${(time / 1e3).toFixed(1)} thousand`;
  } else {
    return Math.round(time).toString();
  }
}

export function getTimeToCrackString(timeToCrack: PasswordAnalysis['timeToCrack']): string {
  if (timeToCrack.years >= 1) {
    return `${formatTime(timeToCrack.years)} years`;
  } else if (timeToCrack.days >= 1) {
    return `${formatTime(timeToCrack.days)} days`;
  } else if (timeToCrack.hours >= 1) {
    return `${formatTime(timeToCrack.hours)} hours`;
  } else if (timeToCrack.minutes >= 1) {
    return `${formatTime(timeToCrack.minutes)} minutes`;
  } else {
    return `${formatTime(timeToCrack.seconds)} seconds`;
  }
}
