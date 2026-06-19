import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));

const appTree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Only render ClerkProvider when a publishable key is configured.
if (clerkPublishableKey) {
  root.render(
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {appTree}
    </ClerkProvider>
  );
} else {
  root.render(appTree);
}
