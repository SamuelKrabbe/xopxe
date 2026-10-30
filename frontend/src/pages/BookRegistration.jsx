import { BookForm } from "../components";
import "../styles/BookRegistration.css";

export function BookRegistration() {
  return (
    <main className="registration-page">
      <section className="registration-paper">

        <header className="registration-header">
          <p className="registration-kicker">
            Cadastro de nova obra
          </p>

          <h1 className="registration-title">
            Xopxe.
          </h1>

          <p className="registration-subtitle">
            Adicione uma nova obra ao acervo
          </p>
        </header>

        <BookForm />

      </section>
    </main>
  );
}
