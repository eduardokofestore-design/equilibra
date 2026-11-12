# Equilibra

Site de bem-estar e saúde mental feito com HTML, CSS e JavaScript puros, sem back-end e sem bibliotecas externas.

## Como abrir

Abra o arquivo `index.html` no navegador (duplo clique). Não precisa de servidor.

## Estrutura

```
equilibra/
├── index.html            Início (dashboard)
├── pages/
│   ├── humor.html        Meu humor (diário emocional)
│   ├── rotina.html       Minha rotina (hábitos)
│   ├── biblioteca.html   Biblioteca do bem-estar
│   └── apoio.html        Apoio e acolhimento
├── css/
│   ├── style.css         Base: cores, layout, menu, rodapé, botões, cards
│   └── pages.css         Estilos de cada tela
├── js/
│   ├── storage.js        Dados no localStorage, exportar/importar/apagar
│   ├── main.js           Menu, rodapé, avisos e backup (todas as páginas)
│   ├── inicio.js         Dashboard
│   ├── humor.js          Registro, gráfico semanal e histórico
│   ├── rotina.js         Hábitos, progresso e histórico
│   ├── artigos.js        Lista de conteúdos da biblioteca (editar aqui)
│   └── biblioteca.js     Busca, filtros e favoritos
└── assets/               images/ e icons/ (vazios por enquanto)
```

## Dados e privacidade

Tudo fica no `localStorage` do navegador, neste aparelho. Nada é enviado a servidor algum.
O rodapé de todas as páginas tem **Exportar** (gera um arquivo `.json`), **Importar** e **Apagar tudo**.
Limpar os dados do navegador apaga os registros: exporte um backup de vez em quando.

## Ordem de carregamento dos scripts

`storage.js` → `main.js` → script da página. Cada página declara no `<body>`:

- `data-root=""` (index) ou `data-root="../"` (pasta pages)
- `data-page="inicio | humor | rotina | biblioteca | apoio"`

## Editar o menu ou o rodapé

Estão em `js/main.js` (constante `NAV` e função `buildFooter`). Mudando ali, muda em todas as páginas.

## Adicionar conteúdo à biblioteca

Em `js/artigos.js`, copie um item de `EQUILIBRA_ARTIGOS` e preencha. Use sempre a URL oficial da fonte e resumos com suas próprias palavras.
Links de instituições mudam de endereço com o tempo: revise de vez em quando.

## Página de apoio

Os números e serviços foram conferidos em canais oficiais em 11/11/2026. Revise periodicamente.
O site é educativo: não faz diagnóstico nem substitui acompanhamento profissional.
