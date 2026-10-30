import { useCallback, useState } from "react";
import { createBook } from "../api/books";
import { GENRES } from "../data/genres";
import { Toast } from "./Toast";
import "../styles/BookForm.css";

const EMPTY_FORM = {
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
};

export function BookForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [toast, setToast] = useState(null);
  const [isSending, setIsSending] = useState(false);
  // useCallback para a função não mudar a cada render, senão o Toast reinicia o timer.
  const closeToast = useCallback(() => setToast(null), []);
  const [coverFailed, setCoverFailed] = useState(false);
  // Usado no max do campo de data, para não deixar escolher data futura.
  const today = new Date().toISOString().slice(0, 10);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "coverUrl") setCoverFailed(false);
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSending(true);
    setToast(null);

    try {
      const livroParaSalvar = {
        ...formData,
        pdfUrl: formData.accessType === "FREE" ? formData.pdfUrl : null,
        purchaseUrl: formData.accessType === "PURCHASE" ? formData.purchaseUrl : null,
      };

      await createBook(livroParaSalvar);
      setFormData(EMPTY_FORM);
      setToast({ kind: "success", message: `Obra "${livroParaSalvar.title}" cadastrada no acervo.` });
    } catch (error) {
      setToast({ kind: "error", message: `Não foi possível cadastrar a obra: ${error.message}` });
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <div className="book-form__main">
        {/* BOOK COVER */}
        <div className="book-cover-section">
          <label htmlFor="coverUrl" className="book-cover-title">Capa do livro (Link)</label>
          
          <div className="book-cover-preview">
            {formData.coverUrl && !coverFailed ? (
              <img
                src={formData.coverUrl}
                alt="Pré-visualização da capa"
                onError={() => setCoverFailed(true)}
              />
            ) : coverFailed ? (
              <span>Não foi possível<br />abrir essa imagem</span>
            ) : (
              <span>Cole o link<br />da imagem</span>
            )}
          </div>

          <input
            id="coverUrl"
            name="coverUrl"
            type="url"
            className="book-cover-input"
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
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="book-field">
            <label htmlFor="publicationDate">Data de publicação</label>
            <input
              id="publicationDate"
              name="publicationDate"
              type="date"
              max={today}
              value={formData.publicationDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* TIPO DE ACESSO E LINKS */}
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
        <button type="submit" className="book-form__button" disabled={isSending}>
          {isSending ? "Cadastrando..." : "Cadastrar obra"}
        </button>
      </div>

      {toast && <Toast kind={toast.kind} message={toast.message} onClose={closeToast} />}
    </form>
  );
}