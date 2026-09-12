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
          page={page}
          onNavigate={setPage}
          onLogin={setUser}
          onLogout={() => setUser(null)}
        />
      </div>

      {page === "home" && <MainPage />}

      {page === "registration" && <BookRegistration />}
    </>
  );
}

export default App;
