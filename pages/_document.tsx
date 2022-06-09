import { Head, Html, Main, NextScript } from "next/document";

export const Document = () => (
  <Html className="dark" lang="en">
    <Head>
      <meta charSet="UTF-8" />
      <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
      <link href="./favicon.ico" rel="icon" />
      <meta content="App displaying the statistics of crime in a specific area." name="description" />
      <meta content="#0f0f0f" name="theme-color" />
      <meta content="CrimeScan" property="og:title" />

      <meta content="App displaying the statistics of crime in a specific area." property="og:description" />

      <meta content="CrimeScan" property="og:site_name" />

      <meta content="./logo512.png" property="og:image" />
      <link href="./logo192.png" rel="apple-touch-icon" />
      <link href="./manifest.json" rel="manifest" />
      <link href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Icons+Sharp&family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Nova+Flat&family=Arvo:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <body className="mdc-typography">
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
