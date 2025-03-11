import { useCallback } from "react";

export function usePageUrl() {
  const changePageUrl = useCallback(
    (newPage: string, params: Record<string, string> = {}) => {
      const paramsString = new URLSearchParams(params).toString();
      const newState = { page: newPage, ...params };

      // Push new state and URL to history
      window.history.replaceState(
        newState,
        "",
        `${newPage}${paramsString ? `?${paramsString}` : ""}`
      );
    },
    []
  );

  return { changePageUrl };
}

export default usePageUrl;
