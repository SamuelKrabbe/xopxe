import { useState } from "react";
import { createBook } from "../api/books"; 
import "../styles/BookForm.css";

export function BookForm() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    publicationDate: "",
    synopsis: "",
    coverUrl: "",
    accessType: "PURCHASE", 
    pdfUrl: "",
    purchaseUrl: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const livroParaSalvar = {
        ...formData,
        pdfUrl: formData.accessType === "FREE" ? formData.pdfUrl : null,
        purchaseUrl: formData.accessType === "PURCHASE" ? formData.purchaseUrl : null,
      };

      await createBook(livroParaSalvar);
      alert("Obra cadastrada com sucesso!");
      window.location.reload(); 
    } catch (error) {
      alert("Falha ao salvar o livro: " + error.message);
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form__main">
        {/* BOOK COVER */}
        <div className="book-cover-section">
          <label htmlFor="coverUrl" className="book-cover-title">Capa do livro (Link)</label>
          
          <div className="book-cover-preview">
            {formData.coverUrl ? (
              <img
                src={formData.coverUrl}
                alt="Pré-visualização da capa"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Link+Inválido"; }}
              />
            ) : (
              <span>Cole o link<br />da imagem</span>
            )}
          </div>

          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            className="book-field"
            style={{ width: "100%", marginTop: "10px" }}
            value={formData.coverUrl}
            onChange={handleChange}
            placeholder="http://..."
            required
          />
        </div>

        {/* BOOK INFORMATION */}
        <div className="book-form__fields">
          <div className="book-field">
            <label htmlFor="title">Título da obra</label>
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
            <label htmlFor="author">Autor</label>
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
            <label htmlFor="publisher">Editora</label>
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
            <label htmlFor="genre">Gênero</label>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              <option value="Romance">Romance</option>
              <option value="Fiction">Ficção</option>
              <option value="Fantasy">Fantasia</option>
              <option value="Thriller">Suspense</option>
              <option value="Horror">Terror</option>
              <option value="Biography">Biografia</option>
              <option value="History">História</option>
              <option value="Technology">Tecnologia</option>
            </select>
          </div>

          <div className="book-field">
            <label htmlFor="publicationDate">Data de publicação</label>
            <input
              id="publicationDate"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* NOVOS CAMPOS: Tipo de Acesso e Links Dinâmicos */}
          <div className="book-field">
            <label htmlFor="accessType">Tipo de Acesso</label>
            <select
              id="accessType"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
              required
            >
              <option value="PURCHASE">Pago</option>
              <option value="FREE">Gratuito</option>
            </select>
          </div>

          {formData.accessType === "PURCHASE" && (
            <div className="book-field">
              <label htmlFor="purchaseUrl">Link de Compra</label>
              <input
                id="purchaseUrl"
                name="purchaseUrl"
                type="url"
                value={formData.purchaseUrl}
                onChange={handleChange}
                placeholder="https://amazon.com.br/..."
                required
              />
            </div>
          )}

          {formData.accessType === "FREE" && (
            <div className="book-field">
              <label htmlFor="pdfUrl">Link do PDF</label>
              <input
                id="pdfUrl"
                name="pdfUrl"
                type="url"
                value={formData.pdfUrl}
                onChange={handleChange}
                placeholder="https://meusite.com/livro.pdf"
                required
              />
            </div>
          )}

          <div className="book-field book-field--full">
            <label htmlFor="synopsis">Sinopse</label>
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
        <button type="submit" className="book-form__button">
          Cadastrar obra
        </button>
      </div>
    </form>
  );
}