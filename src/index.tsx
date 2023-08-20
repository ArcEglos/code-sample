import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./components/app";

const element = document.getElementById("root");

if (element != null) {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <Router>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Router>
    </React.StrictMode>
  );
}
