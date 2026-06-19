import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

interface TypewriterTextProps {
  text: string;
  className?: string;
  numberOfLines?: number;
  delay?: number;
  speed?: number;
}

export default function TypewriterText({
  text,
  className,
  numberOfLines,
  delay = 0,
  speed = 14,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <Text className={className} numberOfLines={numberOfLines}>
      {displayed}
    </Text>
  );
}
