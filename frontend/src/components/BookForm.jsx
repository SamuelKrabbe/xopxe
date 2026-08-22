import { useState } from "react";

export function BookForm({ coverPreview, onCoverChange }) {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editora: "",
    genero: "",
    dataPublicacao: "",
    sinopse: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((dadosAnteriores) => ({
      ...dadosAnteriores,
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

        {/* CAPA DO LIVRO */}

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

        {/* INFORMAÇÕES DO LIVRO */}

        <div className="book-form__fields">

          <div className="book-field">
            <label htmlFor="titulo">
              Título da obra
            </label>

            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Digite o título"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="autor">
              Autor
            </label>

            <input
              id="autor"
              name="autor"
              type="text"
              value={formData.autor}
              onChange={handleChange}
              placeholder="Digite o autor"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="editora">
              Editora
            </label>

            <input
              id="editora"
              name="editora"
              type="text"
              value={formData.editora}
              onChange={handleChange}
              placeholder="Digite a editora"
              required
            />
          </div>

          <div className="book-field">
            <label htmlFor="genero">
              Gênero
            </label>

            <select
              id="genero"
              name="genero"
              value={formData.genero}
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
            <label htmlFor="dataPublicacao">
              Data de publicação
            </label>

            <input
              id="dataPublicacao"
              name="dataPublicacao"
              type="date"
              value={formData.dataPublicacao}
              onChange={handleChange}
              required
            />
          </div>

          <div className="book-field book-field--full">
            <label htmlFor="sinopse">
              Sinopse
            </label>

            <textarea
              id="sinopse"
              name="sinopse"
              value={formData.sinopse}
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