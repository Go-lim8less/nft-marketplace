'use client';

import { chakraTheme, chakraThemeConfig } from '@/consts/chakra';
import { 
  ChakraProvider, 
  ColorModeScript 
} from '@chakra-ui/react';
import { createLocalStorageManager } from '@chakra-ui/system';
import { useEffect, useState, type ReactNode } from 'react';

// Create a color mode manager that uses localStorage
const colorModeManager = typeof window !== 'undefined' 
  ? createLocalStorageManager('marketplace-color-mode')
  : undefined;

export function ThemeWrapper({ children }: { children: ReactNode }) {
  // Add a no-flash wrapper to prevent color mode flash
  const [mounted, setMounted] = useState(false);
  
  // After the component is mounted, render the children
  useEffect(() => {
    setMounted(true);
    
    // Apply body class based on saved theme
    const savedTheme = localStorage.getItem('marketplace-color-mode');
    if (savedTheme) {
      document.body.classList.remove('dark-mode', 'light-mode');
      document.body.classList.add(`${savedTheme}-mode`);
    }
    
    // Create a mutation observer to watch for color mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'data-theme' || 
          mutation.attributeName === 'class'
        ) {
          const htmlEl = document.documentElement;
          const isDark = htmlEl.classList.contains('chakra-ui-dark');
          
          document.body.classList.remove('dark-mode', 'light-mode');
          document.body.classList.add(isDark ? 'dark-mode' : 'light-mode');
        }
      });
    });
    
    // Start observing the document for color mode changes
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <ColorModeScript initialColorMode={chakraThemeConfig.initialColorMode} />
      <ChakraProvider theme={chakraTheme} colorModeManager={colorModeManager}>
        {mounted ? children : 
          <div 
            style={{ 
              visibility: 'hidden', 
              height: '100vh', 
              background: chakraThemeConfig.initialColorMode === 'dark' ? '#0f1118' : '#f8f9fa' 
            }}
          />
        }
      </ChakraProvider>
    </>
  );
} 