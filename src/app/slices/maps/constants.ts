export const statusCodes: Record<string, string> = {
  ERROR: "Request timed out",
  INVALID_REQUEST: "Query likely missing",
  OK: "No errors occurred",
  OVER_QUERY_LIMIT: "Quota exceeded",
  REQUEST_DENIED: "Request denied",
  UNKNOWN_ERROR: "Server error",
  ZERO_RESULTS: "No results returned",
};

export const pinColors = {
  dark: {
    green: "AED581",
    red: "EF5350",
  },
  light: {
    green: "689F38",
    red: "D32F2F",
  },
} as const;
