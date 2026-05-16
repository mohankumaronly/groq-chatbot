import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  seconds: number;
  onExpire?: () => void;
}

export const CountdownTimer = ({ seconds, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (timeLeft <= 0) {
    return <span className="text-red-500">Expired</span>;
  }

  return <span className="text-yellow-500">{formatTime(timeLeft)}</span>;
};