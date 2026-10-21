const API_KEY = "COLE_A_SUA_CHAVE_AQUI";


async function importarLivros() {
  console.log("1. A iniciar sessão como Admin...");
  
  const loginResposta = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@xopxe.com", password: "password" })
  });

  if (!loginResposta.ok) {
    console.error("Falha no login. O backend está ligado?");
    return;
  }

  const cookieSessao = loginResposta.headers.get("set-cookie");

  console.log("2. A buscar os 50 livros no Google Books...");
 
  const url1 = `https://www.googleapis.com/books/v1/volumes?q=literatura+brasileira&maxResults=40&key=${API_KEY}`;
  const url2 = `https://www.googleapis.com/books/v1/volumes?q=ficcao&maxResults=10&key=${API_KEY}`;

  const [resp1, resp2] = await Promise.all([fetch(url1), fetch(url2)]);
  const dados1 = await resp1.json();
  const dados2 = await resp2.json();

  if (dados1.error) 
    {
    console.log("Detalhe do Erro 1 (Google):", dados1.error.message);
    return;
  }
  if (dados2.error) 
    {
    console.log("Detalhe do Erro 2 (Google):", dados2.error.message);
    return;
  }

  const todosLivros = [...(dados1.items || []), ...(dados2.items || [])];
  console.log(`Encontrados ${todosLivros.length} livros. A iniciar importação...\n`);

  for (const item of todosLivros) {
    const info = item.volumeInfo;
    
    let dataFormatada = info.publishedDate || "2000-01-01";
    if (dataFormatada.length === 4) dataFormatada += "-01-01";
    if (dataFormatada.length === 7) dataFormatada += "-01";

    const isDominioPublico = item.accessInfo?.publicDomain === true;

    const livroXopxe = {
      title: info.title ? info.title.substring(0, 200) : "Sem título",
      author: info.authors ? info.authors[0].substring(0, 160) : "Autor Desconhecido",
      publisher: info.publisher ? info.publisher.substring(0, 160) : "Editora Independente",
      genre: info.categories ? info.categories[0].substring(0, 60) : "Literatura",
      publicationDate: dataFormatada,
      synopsis: info.description ? info.description : "Sinopse não disponível.",
      coverUrl: info.imageLinks?.thumbnail?.replace("http:", "https:") || null,
      accessType: isDominioPublico ? "FREE" : "PURCHASE",
      pdfUrl: isDominioPublico ? `https://www.dominiopublico.gov.br/download/texto/simulacao_${item.id}.pdf` : null,
      purchaseUrl: !isDominioPublico ? "https://www.amazon.com.br/s?k=" + encodeURIComponent(info.title || "livro") : null
    };

    const postResposta = await fetch("http://localhost:8080/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieSessao
      },
      body: JSON.stringify(livroXopxe)
    });

    if (postResposta.ok) {
      const tag = isDominioPublico ? "FREE" : "PURCHASE";
      console.log(` Sucesso [${tag}]: ${livroXopxe.title}`);
    } else {
      console.log(` Erro ao salvar "${livroXopxe.title}" no banco.`);
    }
  }

  console.log("\nImportação finalizada.");
}

importarLivros();