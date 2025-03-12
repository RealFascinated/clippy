"use client";

import Logger from "@/lib/logger";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchInterval: 1000 * 60, // 1 minutes
      refetchIntervalInBackground: false,
      retry: 8, // 8 retries
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

// Add global error handler
queryClient.setDefaultOptions({
  mutations: {
    onError: (error, variables, context) => {
      toast.error("An error occurred whilst performing an action.", {
        description: error.message,
      });
      Logger.error(error);
    },
  },
});

export function QueryProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
