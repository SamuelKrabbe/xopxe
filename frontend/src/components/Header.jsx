import { AccountMenu } from "./AccountMenu";
import "../styles/Header.css";

const PAGES = [
  { id: "home", label: "Acervo" },
  { id: "registration", label: "Cadastrar obra" },
];

export function Header({ user, page, onNavigate, onLogin, onLogout }) {
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
        {PAGES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={
              id === page
                ? "masthead__nav-item masthead__nav-item--active"
                : "masthead__nav-item"
            }
            aria-current={id === page ? "page" : undefined}
            onClick={() => onNavigate(id)}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
