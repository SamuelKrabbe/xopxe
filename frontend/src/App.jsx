import { useEffect, useState } from "react";
import "./styles/App.css";
import { fetchCurrentUser } from "./api/auth";

import { Header } from "./components";
import { MainPage, BookRegistration } from "./pages";

function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);

  // Ao abrir a página, pergunta ao backend se já existe sessão (login
  // anterior ou volta do Google). Assim o F5 não desloga ninguém.
  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch((problem) => console.error(problem));
  }, []);

  function handleLogout() {
    setUser(null);
    setPage("home");
  }

  return (
    <>
      <div className="app-top">
        <Header
          user={user}
          page={page}
          onNavigate={setPage}
          onLogin={setUser}
          onLogout={handleLogout}
        />
      </div>

      {page === "home" && <MainPage user={user} />}

      {page === "registration" && user?.role === "ADMIN" && <BookRegistration />}

      <footer className="app-footer">
        <p>Xopxe · Trabalho de Programação Web · UFMS 2026</p>
      </footer>
    </>
  );
}

export default App;
