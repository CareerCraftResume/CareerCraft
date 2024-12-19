import React from 'react';
import { motion } from 'framer-motion';

export const GradientBackground = () => (
  <motion.div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: 'linear-gradient(45deg, #F8FAFC, #EFF6FF)',
      opacity: 0.8
    }}
    animate={{
      background: [
        'linear-gradient(45deg, #F8FAFC, #EFF6FF)',
        'linear-gradient(45deg, #EFF6FF, #F8FAFC)',
        'linear-gradient(45deg, #F8FAFC, #EFF6FF)'
      ]
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  />
);

export const FloatingShapes = () => (
  <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 100 + 50,
          height: Math.random() * 100 + 50,
          borderRadius: '50%',
          background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 241, 0.1)`,
          filter: 'blur(5px)',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`
        }}
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          scale: [1, Math.random() * 0.5 + 1]
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

export const GridPattern = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: `
        linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
        linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px'
    }}
  >
    <motion.div
      style={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
);

export const AnimatedBackground = ({ children, type = 'gradient' }) => {
  const backgrounds = {
    gradient: <GradientBackground />,
    shapes: <FloatingShapes />,
    grid: <GridPattern />
  };

  return (
    <>
      {backgrounds[type]}
      {children}
    </>
  );
};
