import { useState, useEffect, useRef } from 'react';
import { analyzePassword, PasswordAnalysis } from '@/services/passanalyzer';

export function useDebouncedAnalysis(password: string, delay: number = 300) {
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!password || password.length === 0) {
      setAnalysis(null);
      setIsLoading(false);
      return;
    }

    // Set loading state immediately
    setIsLoading(true);

    // Debounce the analysis
    timeoutRef.current = setTimeout(() => {
      const result = analyzePassword(password);
      setAnalysis(result);
      setIsLoading(false);
    }, delay);

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [password, delay]);

  return { analysis, isLoading };
}
