import { useState, useEffect, useCallback } from 'react';

/**
 * Parse mock time from URL parameter.
 * Usage: Add ?mockTime=2024-12-25T09:00:00 to the URL
 */
function getMockTimeFromUrl(): Date | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const mockTime = params.get('mockTime');
  
  if (mockTime) {
    const parsed = new Date(mockTime);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
}

export function useMockTime(updateIntervalMs: number = 60000) {
  const [mockOffset, setMockOffset] = useState<number | null>(() => {
    const urlMockTime = getMockTimeFromUrl();
    if (urlMockTime) {
      return urlMockTime.getTime() - Date.now();
    }
    return null;
  });

  const [currentTime, setCurrentTime] = useState(() => {
    if (mockOffset !== null) {
      return new Date(Date.now() + mockOffset);
    }
    return new Date();
  });

  // Update time at interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (mockOffset !== null) {
        setCurrentTime(new Date(Date.now() + mockOffset));
      } else {
        setCurrentTime(new Date());
      }
    }, updateIntervalMs);

    return () => clearInterval(interval);
  }, [mockOffset, updateIntervalMs]);

  // Set mock time to a specific date
  const setMockTime = useCallback((date: Date | null) => {
    if (date) {
      const offset = date.getTime() - Date.now();
      setMockOffset(offset);
      setCurrentTime(date);
    } else {
      setMockOffset(null);
      setCurrentTime(new Date());
    }
  }, []);

  // Advance mock time by minutes
  const advanceTime = useCallback((minutes: number) => {
    const newTime = new Date(currentTime.getTime() + minutes * 60 * 1000);
    setMockTime(newTime);
  }, [currentTime, setMockTime]);

  return {
    currentTime,
    isMocked: mockOffset !== null,
    setMockTime,
    advanceTime,
  };
}


