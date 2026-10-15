import { useState } from "react";
import "../styles/BookForm.css";

export function BookForm({ coverPreview, onCoverChange }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    publicationDate: "",
    synopsis: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Dados do livro:", formData);

    alert("Obra cadastrada com sucesso!");
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>

      <div className="book-form__main">

        {/* BOOK COVER */}

        <div className="book-cover-section">

          <p className="book-cover-title">
            Capa do livro
          </p>

          <div className="book-cover-preview">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Pré-visualização da capa"
              />
            ) : (
              <span>
                Pré-visualização<br />
                da capa
              </span>
            )}
          </div>

          <input
            className="book-cover-input"
            type="file"
            accept="image/*"
            onChange={onCoverChange}
          />

        </div>

        {/* BOOK INFORMATION */}

        <div className="book-form__fields">

          <div className="book-field">
            <label htmlFor="title">
              Título da obra
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="author">
              Autor
            </label>

            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              placeholder="Digite o autor"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="publisher">
              Editora
            </label>

            <input
              id="publisher"
              name="publisher"
              type="text"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="Digite a editora"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="genre">
              Gênero
            </label>

            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">
                Selecione
              </option>

              <option value="Romance">
                Romance
              </option>

              <option value="Ficção">
                Ficção
              </option>

              <option value="Fantasia">
                Fantasia
              </option>

              <option value="Suspense">
                Suspense
              </option>

              <option value="Terror">
                Terror
              </option>

              <option value="Biografia">
                Biografia
              </option>

              <option value="História">
                História
              </option>

              <option value="Tecnologia">
                Tecnologia
              </option>
            </select>
          </div>

          <div className="book-field">
            <label htmlFor="publicationDate">
              Data de publicação
            </label>

            <input
              id="publicationDate"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="book-field book-field--full">
            <label htmlFor="synopsis">
              Sinopse
            </label>

            <textarea
              id="synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleChange}
              placeholder="Digite a sinopse da obra"
              rows="6"
              required
            />
          </div>

        </div>

      </div>

      <div className="book-form__actions">

        <button
          type="submit"
          className="book-form__button"
        >
          Cadastrar obra
        </button>

      </div>

    </form>
  );
}
