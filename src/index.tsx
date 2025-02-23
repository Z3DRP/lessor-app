import "react-app-polyfill/stable";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "chart.js/auto";
import "animate.css/animate.min.css";

import App from "./App";
import reportWebVitals from "@/utils/reportWebVitals";
import { ThemeProvider } from "@/contexts/ThemeContext";

import { SnackbarProvider } from "notistack";

// Note: Remove the following line if you want to disable the API mocks.
import "@/mocks";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <SnackbarProvider maxSnack={5} autoHideDuration={1500}>
        <App />
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
