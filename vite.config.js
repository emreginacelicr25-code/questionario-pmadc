import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "base" precisa ser "/NOME-DO-REPOSITORIO/" para funcionar no GitHub Pages
// (páginas de projeto ficam em usuario.github.io/NOME-DO-REPOSITORIO/).
// Ajuste aqui se o nome do repositório for diferente de "questionario-pmadc".
export default defineConfig({
  plugins: [react()],
  base: "/questionario-pmadc/",
});
