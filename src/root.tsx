import { Provider } from "react-redux";
import App from "/src/app";
import store from "/src/app/store";

export const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Root;
