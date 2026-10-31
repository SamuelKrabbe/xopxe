import { useEffect, useState } from "react";
import { BookForm } from "../components/BookForm";
import { deleteBook, fetchBooks, loadSavedBooks, saveBooks } from "../api/books";
import "../styles/BookRegistration.css";
import "../styles/BookManagement.css";

export function BookManagement() {
  const [books, setBooks] = useState(loadSavedBooks);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    fetchBooks()
      .then(list => { if (active) { setBooks(list); saveBooks(list); } })
      .catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, []);

  const filtered = books.filter(book =>
    `${book.title} ${book.author}`.toLocaleLowerCase("pt-BR")
      .includes(query.toLocaleLowerCase("pt-BR").trim())
  );

  function onSaved(saved) {
    const updated = books.map(book => book.id === saved.id ? saved : book);
    setBooks(updated);
    saveBooks(updated);
    setEditing(null);
    setNotice(`Obra "${saved.title}" atualizada com sucesso.`);
    setError("");
  }

  async function onDelete(book) {
    if (!window.confirm(`Deseja excluir definitivamente a obra "${book.title}"?`)) return;
    setBusyId(book.id);
    setError("");
    setNotice("");
    try {
      await deleteBook(book.id);
      const updated = books.filter(item => item.id !== book.id);
      setBooks(updated);
      saveBooks(updated);
      setNotice(`Obra "${book.title}" excluída com sucesso.`);
    } catch (err) {
      setError(`Não foi possível excluir: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-paper">
        <header className="registration-header">
          <p className="registration-kicker">Administração do acervo</p>
          <h1 className="registration-title">Xopxe.</h1>
          <p className="registration-subtitle">{editing ? `Editando: ${editing.title}` : "Gerenciar obras cadastradas"}</p>
        </header>

        {error && <p className="management__error" role="alert">{error}</p>}
        {notice && <p className="management__notice" role="status">{notice}</p>}

        {editing ? (
          <BookForm key={editing.id} book={editing} onSaved={onSaved} onCancel={() => setEditing(null)} />
        ) : (
          <div className="management">
            <label htmlFor="management-search">Pesquisar obra por título ou autor</label>
            <input id="management-search" className="management__search" value={query}
              onChange={event => setQuery(event.target.value)} placeholder="Buscar no acervo..." />
            <p className="management__count">{filtered.length} obra(s) encontrada(s)</p>
            <ul className="management__list">
              {filtered.map(book => (
                <li className="management__item" key={book.id}>
                  <div className="management__book">
                    {book.coverUrl && <img src={book.coverUrl} alt="" loading="lazy" />}
                    <div><strong>{book.title}</strong><span>{book.author}</span></div>
                  </div>
                  <div className="management__actions">
                    <button type="button" aria-label={`Editar ${book.title}`} disabled={busyId !== null} onClick={() => { setEditing(book); setError(""); setNotice(""); }}>Editar</button>
                    <button type="button" className="management__delete" aria-label={`Excluir ${book.title}`} disabled={busyId !== null} onClick={() => onDelete(book)}>
                      {busyId === book.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}
