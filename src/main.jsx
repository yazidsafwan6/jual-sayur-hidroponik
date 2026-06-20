import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { App } from "./App.jsx";
import "./styles.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const app = convexUrl ? (
  <ConvexProvider client={new ConvexReactClient(convexUrl)}>
    <App dataMode="convex" />
  </ConvexProvider>
) : (
  <App dataMode="local" />
);

createRoot(document.getElementById("root")).render(<StrictMode>{app}</StrictMode>);
