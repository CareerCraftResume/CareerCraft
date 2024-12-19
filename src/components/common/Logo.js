import React from 'react';
import { Box, Typography } from '@mui/material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

const Logo = ({ size = 'medium', onClick }) => {
  const sizes = {
    small: { icon: 24, text: 'h6', spacing: 1 },
    medium: { icon: 32, text: 'h5', spacing: 1.5 },
    large: { icon: 48, text: 'h3', spacing: 2 }
  };

  const { icon: iconSize, text: textVariant, spacing } = sizes[size];

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        cursor: onClick ? 'pointer' : 'default',
        padding: 1,
        '&:hover': onClick ? { transform: 'scale(1.05)' } : {},
        '&:active': onClick ? { transform: 'scale(0.95)' } : {},
        transition: 'transform 0.2s ease'
      }}
    >
      <Box sx={{ position: 'relative', width: iconSize + 16, height: iconSize + 16 }}>
        <Box
          sx={{
            position: 'absolute',
            left: -4,
            top: -4,
            width: iconSize + 24,
            height: iconSize + 24,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            filter: 'blur(8px)',
            opacity: 0.3
          }}
        />
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            borderRadius: '50%',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: iconSize, color: 'white' }} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(99, 102, 241, 0.2))'
          }}
        >
          Career
        </Typography>
        <Typography
          variant={textVariant}
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(45deg, #EC4899 30%, #6366F1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(236, 72, 153, 0.2))'
          }}
        >
          Craft
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
