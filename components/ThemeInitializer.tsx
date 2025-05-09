// components/ThemeEnforcer.tsx
'use client';

import { useEffect } from 'react';

export default function ThemeEnforcer() {
  useEffect(() => {
    const html = document.documentElement;
    // Force all theme-related attributes
    html.setAttribute('data-theme', 'customDark');
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
    
    // Optional: Remove any conflicting theme classes
    html.classList.remove('light');
  }, []);

  return null;
}