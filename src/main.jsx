import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router";
import ChatProvider from "./context/ChatProvider.jsx"
import "./index.css"
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
  <ChatProvider>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </ChatProvider>
    </BrowserRouter>
);