// TODO: Julio
//
// Só a estrutura das caixas, para dar para ver o layout. O conteúdo é todo
// seu: receber o livro selecionado por props, mostrar nota, sinopse e dados,
// listar as avaliações e enviar a nota do usuário.
// Estilos prontos em BooksInfo.css e a classe .panel no App.css.

import "./BooksInfo.css";

export function BooksInfo() {
  return (
    <div className="book-info">
      <section className="panel">
        <div className="book-info__rating">
          <h2 className="panel__title">Classificação</h2>
        </div>

        <h3 className="book-info__label">Sinopse</h3>

        <dl className="book-info__meta" />
      </section>

      <div className="book-info__columns">
        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Avaliações recentes
          </h3>

          <ul className="review-list" />
        </section>

        <section className="panel">
          <h3 className="panel__title panel__title--small">
            Faça sua avaliação
          </h3>

          <div className="star-picker" />
        </section>
      </div>
    </div>
  );
}
