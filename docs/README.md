# docs

| Arquivo | O que é |
|---|---|
| `arquitetura.md` | o documento, e a fonte do diagrama (bloco ```mermaid) |
| `diagrama-de-classes.png` | o diagrama renderizado, usado no `.docx` |
| `arquitetura.docx` | a versão para entregar |

O `.md` é o original. Depois de editá-lo, gere os outros dois de novo.

## Regerar o diagrama

Só é preciso quando o bloco ```mermaid do `arquitetura.md` muda. O GitHub já
mostra o diagrama direto do Markdown; o PNG existe para entrar no `.docx`.

```bash
cd docs
npm install          # baixa mermaid e playwright (só na primeira vez)
node render-diagrama.cjs
```

Se der erro dizendo que o navegador não existe, falta baixar o Chromium que o
Playwright usa:

```bash
node node_modules/playwright/cli.js install chromium
```

## Regerar o .docx

```bash
pip install python-docx   # só na primeira vez
cd docs
python3 gerar-docx.py
```

Rode o diagrama antes do `.docx`, porque o `.docx` usa o PNG.
