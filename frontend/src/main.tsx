import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error('index.html is missing the <div id="root"> element');
}

const queryClient = new QueryClient();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
