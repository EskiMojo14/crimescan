import React from "react";
import { Provider } from "react-redux";
import App from "/src/app";
import store from "/src/app/store";

export const Root = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default Root;
