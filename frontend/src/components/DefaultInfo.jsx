import hero from "../assets/hero.png";
import { books } from "../data/books-mock";
import "../styles/DefaultInfo.css";

export function DefaultInfo() {
  const topBooks = [...books]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  return (
    <div className="default-info panel">

      <img
        className="default-info__image"
        src={hero}
        alt="Pilha de livros"
      />

      <div className="default-info__ranking">

        <ol className="default-info__ranking-list">
          {topBooks.map((book) => (
            <li key={book.id} className="default-info__ranking-item">
              <span className="default-info__ranking-book">
                {book.title}
              </span>

              <span className="default-info__ranking-rating">
                ★ {book.rating.toFixed(1).replace(".", ",")}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="default-info__hint">
        Clique em uma obra para ver mais detalhes.
      </p>
    </div>
  );
}
