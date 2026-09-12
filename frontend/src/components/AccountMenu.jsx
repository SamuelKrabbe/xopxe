import { useState } from "react";
import { login, register } from "../api/auth";
import "../styles/AccountMenu.css";

const EMPTY_FORM = { name: "", email: "", password: "" };

export function AccountMenu({ user, onLogin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  }

  function closeMenu() {
    setIsOpen(false);
    setForm(EMPTY_FORM);
    setError("");
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSending(true);
    setError("");

    try {
      const account =
        mode === "login"
          ? await login(form.email.trim(), form.password)
          : await register(form.name.trim(), form.email.trim(), form.password);

      onLogin(account);
      closeMenu();
    } catch (problem) {
      setError(problem.message);
    } finally {
      setIsSending(false);
    }
  }

  function handleLogout() {
    onLogout();
    closeMenu();
  }

  return (
    <div className="account">
      <button
        type="button"
        className="account__avatar"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? closeMenu() : setIsOpen(true))}
      >
        {user ? user.name.charAt(0).toUpperCase() : "?"}
      </button>

      {user && <span className="account__name">{user.name}</span>}

      {isOpen && (
        <div className="account__panel panel">
          {user ? (
            <>
              <h2 className="account__title">Minha conta</h2>

              <p className="account__row">{user.name}</p>

              <p className="account__row account__row--muted">{user.email}</p>

              <button
                type="button"
                className="account__submit"
                onClick={handleLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="account__title">
                {mode === "login" ? "Acesso" : "Cadastro"}
              </h2>

              {mode === "signup" && (
                <div className="account__field">
                  <label htmlFor="account-name">Nome</label>

                  <input
                    id="account-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="account__field">
                <label htmlFor="account-email">E-mail</label>

                <input
                  id="account-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account__field">
                <label htmlFor="account-password">Senha</label>

                <input
                  id="account-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="account__error">{error}</p>}

              <button
                type="submit"
                className="account__submit"
                disabled={isSending}
              >
                {isSending
                  ? "Enviando..."
                  : mode === "login"
                    ? "Entrar"
                    : "Cadastrar"}
              </button>

              <p className="account__switch">
                {mode === "login" ? (
                  <>
                    Ainda não tem conta?{" "}
                    <button type="button" onClick={() => changeMode("signup")}>
                      Cadastre-se
                    </button>
                  </>
                ) : (
                  <>
                    Já tem conta?{" "}
                    <button type="button" onClick={() => changeMode("login")}>
                      Entrar
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
