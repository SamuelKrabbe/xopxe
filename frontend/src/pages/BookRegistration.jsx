import { useState } from "react";
import { BookForm } from "../components";
import "./BookRegistration.css";

export function BookRegistration() {
  const [coverPreview, setCoverPreview] = useState(null);

  function handleCoverChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setCoverPreview(null);
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setCoverPreview(imageUrl);
  }

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

        <BookForm
          coverPreview={coverPreview}
          onCoverChange={handleCoverChange}
        />

      </section>
    </main>
  );
}