import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle resend OTP timer logic
 * @param initialSeconds Number of seconds to count down
 */
export const useResendTimer = (initialSeconds: number = 30) => {
  const [timer, setTimer] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const resetTimer = useCallback(() => {
    setTimer(initialSeconds);
    setCanResend(false);
  }, [initialSeconds]);

  return { timer, canResend, resetTimer };
};
