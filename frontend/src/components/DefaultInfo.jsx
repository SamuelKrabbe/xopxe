// TODO: Julio
//
// Esqueleto só para visualizar o layout. Aparece quando nenhum livro está
// selecionado. Ajuste o texto como quiser (por exemplo, mostrar quantas
// obras existem no acervo). Estilos prontos em DefaultInfo.css.

import hero from "../assets/hero.png";
import "./DefaultInfo.css";

export function DefaultInfo() {
  return (
    <div className="default-info panel">
      <img className="default-info__image" src={hero} alt="Pilha de livros" />

      <h2 className="default-info__title">Escolha uma obra</h2>

      <p className="default-info__text">
        Clique em um livro da lista para ver a sinopse, as avaliações e dar a
        sua nota.
      </p>
    </div>
  );
}
