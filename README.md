# Oficina · Financeiro e Preços

Mini sistema (Web App) para uma oficina de **funilaria e pintura**, com duas áreas:

1. **Financeiro** — painel do mês com faturamento, gastos com materiais e lucro líquido, gráfico visual de lucro, seletor de meses e lista de gastos por categoria.
2. **Buscar Preços** — pesquisa de materiais e ferramentas (tintas, vernizes, massas, lixas, etc.) com filtros por categoria e cartões mostrando preço de referência e confiabilidade.

Feito com **HTML, CSS e JavaScript puro** (sem bibliotecas). Interface pensada para ser **simples e acessível** (fontes grandes, alto contraste, botões grandes), funcionando bem no **celular e no computador**.

## Como abrir

Abra o arquivo `index.html` no navegador. É só isso — não precisa instalar nada.

## Importar planilha real (CSV)

O app já abre preenchido com dados de exemplo. Para usar os dados reais:

1. Exporte a planilha da oficina como **CSV**.
2. Clique em **Importar Planilha (.CSV)** dentro do app.
3. Se os nomes das colunas forem diferentes, ajuste o objeto `COLUNAS` no `script.js` (seção 6, bem comentada) para casar com o seu arquivo.

Há um arquivo `exemplo-planilha.csv` para testar a importação.

## Estrutura

```
funilaria-app/
├── index.html          # estrutura da página
├── style.css           # visual e responsividade
├── script.js           # dados, lógica das abas, busca e importação de CSV
├── exemplo-planilha.csv # planilha de teste
└── README.md
```

## Publicação

Por ser um site estático, pode ser publicado de graça no **GitHub Pages**
(Settings → Pages → Branch `main`). O app fica acessível por um link, ideal
para abrir direto no celular.
