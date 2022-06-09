import { useEffect, useState } from "react";
import AppComponent from "/src/app";

const App = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <AppComponent />;
};

export default App;
