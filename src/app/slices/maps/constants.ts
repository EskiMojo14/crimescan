export const statusCodes: Record<string, string> = {
  OK: "No errors occurred",
  ZERO_RESULTS: "No results returned",
  OVER_QUERY_LIMIT: "Quota exceeded",
  REQUEST_DENIED: "Request denied",
  INVALID_REQUEST: "Query likely missing",
  UNKNOWN_ERROR: "Server error",
  ERROR: "Request timed out",
};
