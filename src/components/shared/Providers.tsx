"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeWrapper } from "./ThemeWrapper";
import { Suspense } from "react";
import { Box, Spinner } from "@chakra-ui/react";

// Create QueryClient with optimized configuration for performance
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes stale time
      retry: 1, // Only retry once to avoid extra network calls
      networkMode: "offlineFirst", // Prioritize cached data
    },
  },
});

// Loading fallback component for Suspense
function LoadingFallback() {
  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      <Spinner size="xl" color="brand.500" thickness="4px" />
    </Box>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  // Create a client-side only QueryClient instance
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeWrapper>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <ThirdwebProvider>
            {children}
          </ThirdwebProvider>
        </Suspense>
      </QueryClientProvider>
    </ThemeWrapper>
  );
}
