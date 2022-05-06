import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://data.police.uk/api/" }),
  endpoints: () => ({}),
  reducerPath: "api",
});

export default baseApi;
