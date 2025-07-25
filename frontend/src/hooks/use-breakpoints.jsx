'use client';
/* eslint-disable no-undef */
import * as React from 'react';

const BREAKPOINTS = {
  small: 534, // Small: 320px - 534px
  medium: 768, // Medium: 534px - 768px
  large: 1024, // Large: 768px - 1024px
  xlarge: 1440, // Extra Large: 1024px - 1440px
  doubleXLarge: 6000,
};

export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = React.useState({
    isMobile: false,
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
    doubleXLarge: false,
  });

  React.useEffect(() => {
    const onChange = () => {
      const width = window.innerWidth;

      setBreakpoints({
        isMobile: width < BREAKPOINTS.medium, // Mobile < 768px
        isSmall: width >= 320 && width < BREAKPOINTS.small, // 320px - 534px
        isMedium: width >= BREAKPOINTS.small && width < BREAKPOINTS.medium, // 534px - 768px
        isLarge: width >= BREAKPOINTS.medium && width < BREAKPOINTS.large, // 768px - 1024px
        isXLarge: width >= BREAKPOINTS.large && width < BREAKPOINTS.xlarge, // 1024px - 1440px
        doubleXLarge: width >= BREAKPOINTS.xlarge, // More than 1440px
      });
    };

    window.addEventListener('resize', onChange);
    onChange(); // Initialize on mount

    return () => window.removeEventListener('resize', onChange);
  }, []);

  return breakpoints;
}
