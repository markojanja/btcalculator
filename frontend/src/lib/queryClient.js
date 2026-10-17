import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { notifyError } from "./api";

// Failed requests show a toast everywhere, so pages don't need their own catch blocks.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: notifyError }),
  mutationCache: new MutationCache({ onError: notifyError }),
  defaultOptions: {
    queries: {
      // Only network failures are worth retrying; 4xx/5xx answers won't change.
      retry: (failureCount, error) => !error.response && failureCount < 2,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});
