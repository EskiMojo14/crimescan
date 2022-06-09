import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "/src/app/store";
import "src/app.scss";

export const Root = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>CrimeScan</title>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    </Head>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  </>
);

export default Root;
