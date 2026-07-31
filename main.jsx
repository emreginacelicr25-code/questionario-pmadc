import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Painel from "./pages/Painel.jsx";
import "./index.css";

function Root() {
  const isPainel = window.location.hash.startsWith("#painel");
  return isPainel ? <Painel /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
