import React from 'react';
import { motion } from 'framer-motion';

// Fade in from bottom with slight bounce
export const FadeInUp = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay,
      type: "spring",
      damping: 15
    }}
  >
    {children}
  </motion.div>
);

// Fade in from left
export const SlideInLeft = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.5,
      delay,
      ease: "easeOut"
    }}
  >
    {children}
  </motion.div>
);

// Scale up with fade
export const ScaleIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      delay,
      ease: "easeOut"
    }}
  >
    {children}
  </motion.div>
);

// Stagger children animations
export const StaggerChildren = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    variants={{
      show: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
    initial="hidden"
    animate="show"
  >
    {children}
  </motion.div>
);

// Hover scale effect
export const HoverScale = ({ children, scale = 1.05 }) => (
  <motion.div
    whileHover={{ scale }}
    transition={{
      type: "spring",
      stiffness: 300
    }}
  >
    {children}
  </motion.div>
);

// Floating animation
export const FloatingElement = ({ children, duration = 3, y = 15 }) => (
  <motion.div
    animate={{
      y: [-y, y],
    }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
  >
    {children}
  </motion.div>
);

// Gradient text reveal
export const GradientTextReveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, backgroundPosition: "200% 0" }}
    animate={{ opacity: 1, backgroundPosition: "0% 0" }}
    transition={{
      duration: 0.8,
      delay,
      ease: "easeOut"
    }}
    style={{
      background: "linear-gradient(45deg, #6366F1, #EC4899)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundSize: "200% 100%"
    }}
  >
    {children}
  </motion.div>
);

// Particle effect button
export const ParticleButton = ({ children }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="particle-button"
    style={{
      position: 'relative',
      overflow: 'hidden',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '30px',
      background: 'linear-gradient(45deg, #6366F1, #EC4899)',
      color: 'white',
      cursor: 'pointer'
    }}
  >
    {children}
  </motion.button>
);

// Loading spinner
export const LoadingSpinner = () => (
  <motion.div
    animate={{
      rotate: 360
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
    style={{
      width: '30px',
      height: '30px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #6366F1',
      borderRadius: '50%'
    }}
  />
);
