import { useState } from "react";
import "./styles/App.css";

import { Header } from "./components";
import { MainPage, BookRegistration } from "./pages";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  return (
    <>
      <div className="app-top">
        <Header
          user={user}
          onLogin={setUser}
          onLogout={() => setUser(null)}
        />
      </div>

      {page === "home" && (
        <>
          <MainPage />

          <button
            className="open-registration-button"
            onClick={() => setPage("registration")}
          >
            Cadastrar nova obra
          </button>
        </>
      )}

      {page === "registration" && (
        <>
          <BookRegistration />

          <button
            className="back-home-button"
            onClick={() => setPage("home")}
          >
            Voltar para o acervo
          </button>
        </>
      )}
    </>
  );
}

export default App;
