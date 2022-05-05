import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "https://data.police.uk/api/" }),
  endpoints: () => ({}),
});

export default baseApi;
