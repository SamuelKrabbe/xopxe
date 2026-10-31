// Gera o arquivo backend/src/main/resources/seed/books.json, que o BookSeeder
// usa para preencher o banco quando não tem nenhum livro. Para rodar:
//
//   GOOGLE_BOOKS_API_KEY=sua-chave node importador.js
//
// Os livros gratuitos vêm do Internet Archive (não precisa de chave). Os pagos
// vêm do Google Books e só entram se tiver a chave.
import { writeFile } from "node:fs/promises";

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const ARQUIVO_SEED = new URL("../backend/src/main/resources/seed/books.json", import.meta.url);

// Livros em domínio público do Internet Archive, escolhidos à mão.
// Só PDFs com texto digital, não escaneados.
const LIVROS_GRATUITOS = [
  { arquivo: "memorias-postumas-de-bras-cubas_202503", titulo: "Memórias Póstumas de Brás Cubas", autor: "Machado de Assis", ano: 1881, genero: "Romance" },
  { arquivo: "dom-casmurro_202503", titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, genero: "Romance" },
  { arquivo: "quincas-borba", titulo: "Quincas Borba", autor: "Machado de Assis", ano: 1891, genero: "Romance" },
  { arquivo: "helena_202503", titulo: "Helena", autor: "Machado de Assis", ano: 1876, genero: "Romance" },
  { arquivo: "o-alienista_202503", titulo: "O Alienista", autor: "Machado de Assis", ano: 1882, genero: "Literatura" },
  { arquivo: "varias-historias", titulo: "Várias Histórias", autor: "Machado de Assis", ano: 1896, genero: "Literatura" },
  { arquivo: "iracema_202503", titulo: "Iracema", autor: "José de Alencar", ano: 1865, genero: "Romance" },
  { arquivo: "senhora_202503", titulo: "Senhora", autor: "José de Alencar", ano: 1875, genero: "Romance" },
  { arquivo: "o-cortico_202503", titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, genero: "Romance" },
  { arquivo: "o-mulato", titulo: "O Mulato", autor: "Aluísio Azevedo", ano: 1881, genero: "Romance" },
  { arquivo: "a-casa-de-pensao", titulo: "Casa de Pensão", autor: "Aluísio Azevedo", ano: 1884, genero: "Romance" },
  { arquivo: "a-escrava-isaura-bernardo-guimaraes", titulo: "A Escrava Isaura", autor: "Bernardo Guimarães", ano: 1875, genero: "Romance" },
  { arquivo: "lira-dos-vinte-anos", titulo: "Lira dos Vinte Anos", autor: "Álvares de Azevedo", ano: 1853, genero: "Poesia" },
  { arquivo: "noite-na-taverna-alvares-de-azevedo", titulo: "Noite na Taverna", autor: "Álvares de Azevedo", ano: 1855, genero: "Terror" },
  { arquivo: "as-primaveras", titulo: "As Primaveras", autor: "Casimiro de Abreu", ano: 1859, genero: "Poesia" },
  { arquivo: "clara-dos-anjos", titulo: "Clara dos Anjos", autor: "Lima Barreto", ano: 1948, genero: "Romance" },
  { arquivo: "o-homem-que-sabia-javanes", titulo: "O Homem que Sabia Javanês", autor: "Lima Barreto", ano: 1911, genero: "Literatura" },
  { arquivo: "reinacoes-de-narizinho", titulo: "Reinações de Narizinho", autor: "Monteiro Lobato", ano: 1931, genero: "Infantojuvenil" },
  { arquivo: "o-saci", titulo: "O Saci", autor: "Monteiro Lobato", ano: 1921, genero: "Infantojuvenil" },
  { arquivo: "vidas-secas-graciliano-ramos", titulo: "Vidas Secas", autor: "Graciliano Ramos", ano: 1938, genero: "Romance" },
];

// Converte as categorias do Google (em inglês) para os gêneros de src/data/genres.js.
function mapearGenero(categorias) {
  const g = (categorias?.[0] || "").toLowerCase();

  if (g.includes("juvenile")) return "Infantojuvenil";
  if (g.includes("fantasy")) return "Fantasia";
  if (g.includes("romance")) return "Romance";
  if (g.includes("thriller") || g.includes("mystery")) return "Suspense";
  if (g.includes("horror")) return "Terror";
  if (g.includes("fiction")) return "Ficção";
  if (g.includes("poetry")) return "Poesia";
  if (g.includes("biography")) return "Biografia";
  if (g.includes("history")) return "História";
  if (g.includes("philosophy")) return "Filosofia";
  if (g.includes("business") || g.includes("economics")) return "Economia";
  if (g.includes("computers") || g.includes("technology")) return "Tecnologia";

  return "Literatura";
}

async function buscarJson(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`${resposta.status} ao buscar ${url}`);
  }
  return resposta.json();
}

function limparHtml(texto) {
  return texto.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function buscarLivrosGratuitos() {
  const livros = [];

  for (const livro of LIVROS_GRATUITOS) {
    const item = await buscarJson(`https://archive.org/metadata/${livro.arquivo}`);
    const pdf = item.files?.find((arquivo) => arquivo.name.toLowerCase().endsWith(".pdf"));
    if (!pdf) {
      throw new Error(`${livro.arquivo} não tem PDF no Internet Archive`);
    }

    const descricao = limparHtml(String(item.metadata.description || ""));

    livros.push({
      title: livro.titulo,
      author: livro.autor,
      publisher: "Domínio público",
      genre: livro.genero,
      publicationDate: `${livro.ano}-01-01`,
      synopsis: descricao ? descricao.substring(0, 1500) : `${livro.titulo}, de ${livro.autor}. Obra em domínio público.`,
      coverUrl: `https://archive.org/services/img/${livro.arquivo}`,
      accessType: "FREE",
      pdfUrl: `https://archive.org/download/${livro.arquivo}/${encodeURIComponent(pdf.name)}`,
      purchaseUrl: null,
    });
    console.log(` ${livro.titulo}`);
  }

  return livros;
}

async function buscarLivrosDeCompra() {
  if (!API_KEY) {
    console.log(" GOOGLE_BOOKS_API_KEY não definida: os livros de compra ficam de fora.");
    return [];
  }

  const url1 = `https://www.googleapis.com/books/v1/volumes?q=literatura+brasileira&maxResults=40&key=${API_KEY}`;
  const url2 = `https://www.googleapis.com/books/v1/volumes?q=ficcao&maxResults=10&key=${API_KEY}`;
  const [dados1, dados2] = await Promise.all([buscarJson(url1), buscarJson(url2)]);

  // Tira os de domínio público, que já vêm do Internet Archive.
  const itens = [...(dados1.items || []), ...(dados2.items || [])].filter(
    (item) => !item.accessInfo?.publicDomain
  );

  return itens.map((item) => {
    const info = item.volumeInfo;

    let dataFormatada = info.publishedDate || "2000-01-01";
    if (dataFormatada.length === 4) dataFormatada += "-01-01";
    if (dataFormatada.length === 7) dataFormatada += "-01";

    return {
      title: info.title ? info.title.substring(0, 200) : "Sem título",
      author: info.authors ? info.authors[0].substring(0, 160) : "Autor Desconhecido",
      publisher: info.publisher ? info.publisher.substring(0, 160) : "Editora Independente",
      genre: mapearGenero(info.categories),
      publicationDate: dataFormatada,
      synopsis: info.description ? info.description : "Sinopse não disponível.",
      coverUrl: info.imageLinks?.thumbnail?.replace("http:", "https:") || null,
      accessType: "PURCHASE",
      pdfUrl: null,
      purchaseUrl: item.saleInfo?.buyLink || "https://www.amazon.com.br/s?k=" + encodeURIComponent(info.title || "livro"),
    };
  });
}

async function gerarSeed() {
  console.log("1. A buscar livros gratuitos no Internet Archive...");
  const gratuitos = await buscarLivrosGratuitos();

  console.log("2. A buscar livros de compra no Google Books...");
  const deCompra = await buscarLivrosDeCompra();

  // Buscas diferentes às vezes trazem a mesma obra.
  const vistos = new Set();
  const livros = [...gratuitos, ...deCompra].filter((livro) => {
    const chave = `${livro.title}|${livro.author}`.toLowerCase();
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });

  await writeFile(ARQUIVO_SEED, JSON.stringify(livros, null, 2) + "\n");
  console.log(`\n${livros.length} livros gravados em ${ARQUIVO_SEED.pathname}`);
}

gerarSeed().catch((erro) => {
  console.error("Falha ao gerar o seed:", erro.message);
  process.exitCode = 1;
});
