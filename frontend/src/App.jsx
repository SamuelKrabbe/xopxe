import { useState } from "react";
import "./App.css";

import { AccountMenu } from "./components";
import { MainPage, BookRegistration } from "./pages";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  return (
    <>
      {/* Quando a Jenniffer terminar o Header, o AccountMenu vai para dentro dele. */}
      <div className="app-top">
        <AccountMenu
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
