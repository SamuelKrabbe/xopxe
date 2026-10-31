import { useEffect, useRef, useState } from "react";
import "../styles/PdfReader.css";

// Abre o PDF no leitor do próprio navegador, dentro de um <dialog>.
// Com showModal() o resto da página fica bloqueado e o Esc já fecha.
export function PdfReader({ book, onClose }) {
  const dialogRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dialog = dialogRef.current;
    // No StrictMode o efeito roda duas vezes. Abrir um dialog aberto dá erro.
    if (!dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="pdf-reader"
      aria-labelledby="pdf-reader-title"
      onClose={onClose}
      // Clique no próprio dialog é clique no fundo escuro.
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current.close();
      }}
    >
      <div className="pdf-reader__bar">
        <h2 id="pdf-reader-title" className="pdf-reader__title">
          {book.title}
        </h2>

        {/* No celular quase nunca dá para ver o PDF dentro da página. */}
        <a
          className="pdf-reader__button"
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir em nova aba
        </a>

        <button
          type="button"
          className="pdf-reader__close"
          aria-label="Fechar o livro"
          title="Fechar (Esc)"
          onClick={() => dialogRef.current.close()}
        >
          ×
        </button>
      </div>

      <div className="pdf-reader__body">
        {isLoading && (
          <p className="pdf-reader__loading" role="status">
            Carregando o livro…
            {/* Alguns navegadores baixam o PDF em vez de mostrar. */}
            <small>Se demorar, use "Abrir em nova aba".</small>
          </p>
        )}

        <iframe
          className="pdf-reader__frame"
          src={book.pdfUrl}
          title={`PDF de ${book.title}`}
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </dialog>
  );
}
