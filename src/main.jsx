import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Painel from "./pages/Painel.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }
  static getDerivedStateFromError(erro) {
    return { erro };
  }
  componentDidCatch(erro, info) {
    console.error("Erro capturado pelo ErrorBoundary:", erro, info);
  }
  render() {
    if (this.state.erro) {
      return (
        <pre
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#7f1d1d",
            color: "#fff",
            padding: 16,
            fontSize: 12,
            whiteSpace: "pre-wrap",
            zIndex: 99999,
            maxHeight: "100vh",
            overflow: "auto",
          }}
        >
          ERRO NO REACT:{"\n"}
          {String(this.state.erro && this.state.erro.stack ? this.state.erro.stack : this.state.erro)}
        </pre>
      );
    }
    return this.props.children;
  }
}

function Root() {
  const isPainel = window.location.hash.startsWith("#painel");
  return isPainel ? <Painel /> : <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
);
