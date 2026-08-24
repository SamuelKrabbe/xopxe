import { useState } from "react";
import "./App.css";

import { MainPage, BookRegistration } from "./pages";

function App() {
  const [pagina, setPagina] = useState("inicio");

  return (
    <>
      {pagina === "inicio" && (
        <>
          <MainPage />

          <button
            className="open-registration-button"
            onClick={() => setPagina("cadastro")}
          >
            Cadastrar nova obra
          </button>
        </>
      )}

      {pagina === "cadastro" && (
        <>
          <BookRegistration />

          <button
            className="back-home-button"
            onClick={() => setPagina("inicio")}
          >
            Voltar para o acervo
          </button>
        </>
      )}
    </>
  );
}

export default App;