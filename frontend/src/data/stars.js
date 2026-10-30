// Transforma a nota (de 1 a 5, a média pode ser quebrada) em estrelas cheias e vazias.
export function stars(rating) {
  const filled = Math.round(rating);
  return "★".repeat(filled) + "☆".repeat(5 - filled);
}
