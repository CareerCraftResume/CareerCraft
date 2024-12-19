import React, { useState, useEffect, memo, useCallback } from 'react';
import { TextField } from '@mui/material';

const TYPING_SPEED = 50; // ms per character

const AnimatedTextField = memo(({ value, finalValue, label, onChange, isAnimating, onAnimationComplete, ...props }) => {
  const [displayValue, setDisplayValue] = useState(value || '');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Reset animation state when finalValue changes
  useEffect(() => {
    if (finalValue && isAnimating) {
      setCurrentIndex(0);
      setDisplayValue('');
      setIsCompleting(false);
    }
  }, [finalValue, isAnimating]);

  // Memoize the animation step function
  const animateNextChar = useCallback(() => {
    if (!finalValue || currentIndex >= finalValue.length) {
      if (!isCompleting && finalValue) {
        setIsCompleting(true);
        onChange(finalValue);
        onAnimationComplete?.();
      }
      return;
    }
    
    const nextChar = finalValue.charAt(currentIndex);
    setDisplayValue(prev => prev + nextChar);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, finalValue, onChange, onAnimationComplete, isCompleting]);

  useEffect(() => {
    if (!isAnimating) {
      setDisplayValue(value || '');
      setCurrentIndex(0);
      setIsCompleting(false);
      return;
    }

    if (!finalValue) {
      return;
    }

    if (currentIndex < finalValue.length) {
      const timer = setTimeout(animateNextChar, TYPING_SPEED);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, finalValue, currentIndex, value, animateNextChar]);

  // Memoize the change handler
  const handleChange = useCallback((e) => {
    if (!isAnimating) {
      const newValue = e.target.value;
      setDisplayValue(newValue);
      onChange(newValue);
    }
  }, [isAnimating, onChange]);

  return (
    <TextField
      {...props}
      label={label}
      value={displayValue}
      onChange={handleChange}
    />
  );
});

AnimatedTextField.displayName = 'AnimatedTextField';

export default AnimatedTextField;
