'use client';

import { extendTheme } from "@chakra-ui/react";
import type { ThemeConfig, StyleFunctionProps } from "@chakra-ui/react";

// Theme configuration
export const chakraThemeConfig: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  disableTransitionOnChange: false,
};

// Colors
const colors = {
  brand: {
    50: "#f0e4ff",
    100: "#d1beff",
    200: "#b397ff",
    300: "#946fff",
    400: "#7547ff",
    500: "#5c2be6",
    600: "#4721b4",
    700: "#321882",
    800: "#1e0f52",
    900: "#0c0624",
  },
  bg: {
    light: "#f8f9fa",
    dark: "#0f1118",
  },
  card: {
    light: "#ffffff",
    dark: "#1a1d29",
  },
  text: {
    light: "#1a202c",
    dark: "#e2e8f0",
    secondary: {
      light: "#4a5568",
      dark: "#a0aec0",
    },
  },
  border: {
    light: "rgba(226, 232, 240, 0.8)",
    dark: "rgba(45, 55, 72, 0.8)",
  },
  gradient: {
    primary: "linear-gradient(to right, #5c2be6, #7547ff)",
    secondary: "linear-gradient(to right, #7547ff, #b397ff)",
    card: {
      light: "linear-gradient(145deg, #ffffff, #f0f0f0)",
      dark: "linear-gradient(145deg, #1a1d29, #141722)",
    },
  },
};

// Global styles
const styles = {
  global: (props: StyleFunctionProps) => ({
    html: {
      scrollBehavior: "smooth",
    },
    body: {
      bg: props.colorMode === "dark" ? "bg.dark" : "bg.light",
      color: props.colorMode === "dark" ? "text.dark" : "text.light",
      transitionProperty: "background-color, color",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease-in-out",
      lineHeight: 1.6,
    },
    "*::selection": {
      bg: props.colorMode === "dark" ? "brand.700" : "brand.200",
      color: props.colorMode === "dark" ? "white" : "brand.900",
    },
  }),
};

// Component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: "500",
      borderRadius: "lg",
      _focus: {
        boxShadow: "0 0 0 2px rgba(92, 43, 230, 0.4)",
      },
    },
    variants: {
      solid: (props: StyleFunctionProps) => ({
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: props.colorMode === "dark" ? "brand.400" : "brand.600",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(92, 43, 230, 0.3)",
        },
        _active: {
          transform: "translateY(0)",
          bg: props.colorMode === "dark" ? "brand.600" : "brand.400",
        },
      }),
      outline: (props: StyleFunctionProps) => ({
        color: props.colorMode === "dark" ? "brand.300" : "brand.600",
        borderColor: props.colorMode === "dark" ? "brand.700" : "brand.200",
        _hover: {
          bg: props.colorMode === "dark" ? "rgba(92, 43, 230, 0.15)" : "rgba(92, 43, 230, 0.08)",
          transform: "translateY(-2px)",
        },
      }),
      ghost: (props: StyleFunctionProps) => ({
        color: props.colorMode === "dark" ? "text.dark" : "text.light",
        _hover: {
          bg: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
        },
      }),
    },
  },
  Card: {
    baseStyle: (props: StyleFunctionProps) => ({
      container: {
        bg: props.colorMode === "dark" ? "card.dark" : "card.light",
        borderRadius: "xl",
        boxShadow: props.colorMode === "dark" 
          ? "0 4px 20px rgba(0, 0, 0, 0.25)" 
          : "0 4px 20px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease-in-out",
        borderWidth: "1px",
        borderColor: props.colorMode === "dark" ? "rgba(45, 55, 72, 0.5)" : "rgba(226, 232, 240, 0.8)",
        overflow: "hidden",
      },
    }),
  },
  Heading: {
    baseStyle: {
      fontWeight: "700",
      letterSpacing: "-0.01em",
    },
  },
  Link: {
    baseStyle: (props: StyleFunctionProps) => ({
      color: props.colorMode === "dark" ? "brand.300" : "brand.600",
      transition: "color 0.2s ease-in-out",
      _hover: {
        textDecoration: "none",
        color: props.colorMode === "dark" ? "brand.200" : "brand.700",
      },
    }),
  },
  Text: {
    variants: {
      secondary: (props: StyleFunctionProps) => ({
        color: props.colorMode === "dark" ? "text.secondary.dark" : "text.secondary.light",
      }),
    },
  },
  Menu: {
    baseStyle: (props: StyleFunctionProps) => ({
      list: {
        bg: props.colorMode === "dark" ? "card.dark" : "card.light",
        borderColor: props.colorMode === "dark" ? "rgba(45, 55, 72, 0.5)" : "rgba(226, 232, 240, 0.8)",
        boxShadow: props.colorMode === "dark" 
          ? "0 4px 20px rgba(0, 0, 0, 0.25)" 
          : "0 4px 20px rgba(0, 0, 0, 0.05)",
        borderRadius: "xl",
        backdrop: "blur(10px)",
      },
      item: {
        _hover: {
          bg: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
        },
        _focus: {
          bg: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
        },
      },
    }),
  },
};

// Create and export the theme
export const chakraTheme = extendTheme({
  config: chakraThemeConfig,
  colors,
  styles,
  components,
});

// Export for client components only
export const INITIAL_COLOR_MODE = "dark";
