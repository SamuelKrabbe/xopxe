/*
 * Gera o diagrama-de-classes.png a partir do bloco ```mermaid do
 * arquitetura.md, que é a única fonte da verdade do diagrama.
 *
 *   cd docs && npm install && node render-diagrama.cjs
 *
 * O Mermaid roda dentro de um Chromium sem interface (Playwright); nada é
 * enviado para fora da máquina.
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const AQUI = __dirname;
const MARKDOWN = path.join(AQUI, "arquitetura.md");
const SAIDA = path.join(AQUI, "diagrama-de-classes.png");

function extrairMermaid(markdown) {
  const bloco = markdown.match(/```mermaid\n([\s\S]*?)```/);

  if (!bloco) {
    throw new Error("Nenhum bloco ```mermaid encontrado em arquitetura.md.");
  }

  return bloco[1];
}

(async () => {
  const codigo = extrairMermaid(fs.readFileSync(MARKDOWN, "utf8"));
  const mermaidJs = require.resolve("mermaid/dist/mermaid.min.js");
  const biblioteca = fs.readFileSync(mermaidJs, "utf8");

  const navegador = await chromium.launch();

  try {
    // deviceScaleFactor: 2 deixa o PNG nítido no Word e na impressão.
    const pagina = await navegador.newPage({
      viewport: { width: 2400, height: 1600 },
      deviceScaleFactor: 2,
    });

    await pagina.setContent(
      `<html><body style="margin:0;background:#fff">` +
        `<div id="saida"></div><script>${biblioteca}</script></body></html>`,
    );

    await pagina.evaluate(async (fonte) => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        themeVariables: { fontFamily: "Georgia, serif", fontSize: "15px" },
      });

      const { svg } = await mermaid.render("diagrama", fonte);
      document.getElementById("saida").innerHTML = svg;
    }, codigo);

    await pagina.locator("#saida svg").screenshot({ path: SAIDA });
    console.log("gerado", path.relative(process.cwd(), SAIDA));
  } finally {
    await navegador.close();
  }
})();
