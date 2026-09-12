import { AccountMenu } from "./AccountMenu";
import "../styles/Header.css";

export function Header({ user, onLogin, onLogout }) {
  const today = new Date();

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  return (
    <header className="masthead">
      <AccountMenu user={user} onLogin={onLogin} onLogout={onLogout} />

      <h1 className="masthead__title">Xopxe.</h1>

      <p className="masthead__date">{formattedDate}</p>

      <nav className="masthead__nav">
        <button className="masthead__nav-item masthead__nav-item--active">
          Acervo
        </button>

        <button className="masthead__nav-item">Cadastrar obra</button>
      </nav>
    </header>
  );
}
