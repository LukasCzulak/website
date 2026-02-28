import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </MantineProvider>,
);
