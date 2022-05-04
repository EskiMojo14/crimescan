export const statusCodes: Record<string, string> = {
  OK: "No errors occurred",
  ZERO_RESULTS: "No results returned",
  OVER_QUERY_LIMIT: "Quota exceeded",
  REQUEST_DENIED: "Request denied",
  INVALID_REQUEST: "Query likely missing",
  UNKNOWN_ERROR: "Server error",
  ERROR: "Request timed out",
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
