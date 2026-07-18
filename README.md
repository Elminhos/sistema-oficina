# Oficina · Financeiro e Preços

Mini sistema (Web App) para uma oficina de **funilaria e pintura**, com duas áreas:

1. **Financeiro** — painel do mês com faturamento, gastos com materiais e lucro líquido, gráfico visual de lucro, seletor de meses e lista de gastos por categoria.
2. **Buscar Preços** — pesquisa de materiais e ferramentas com filtros por categoria. Cada resultado tem botões que abrem a busca daquele produto no Mercado Livre, Loja do Mecânico e Amazon, com o preço real do dia.

Feito com **HTML, CSS e JavaScript puro** (sem bibliotecas). Interface pensada para ser simples e acessível (fontes grandes, alto contraste, botões grandes), funcionando no celular e no computador.

Site no ar: https://elminhos.github.io/sistema-oficina/

## De onde vêm os dados financeiros

O app aceita três origens, nesta ordem de prioridade:

1. **Planilha online (recomendado)** — Google Sheets publicado como CSV. O app busca os dados a cada abertura, então basta editar a planilha para o app atualizar.
2. **Planilha importada** — o botão "Importar Planilha (.CSV)" carrega um arquivo e o salva na memória do navegador daquele aparelho.
3. **Dados de exemplo** — três meses fictícios, usados enquanto nada foi configurado.

Uma faixa no topo do painel sempre indica qual origem está em uso.

### Configurar a planilha online

1. Suba o arquivo `Planilha-Padrao-Oficina.xlsx` para o Google Drive e abra com Planilhas Google.
2. Menu **Arquivo → Compartilhar → Publicar na web**.
3. Escolha a aba **Lancamentos** e o formato **CSV**. Publique e copie o link.
4. No `script.js`, cole o link na constante `URL_PLANILHA`, no topo do arquivo.

Observações: a planilha publicada fica acessível a quem tiver o link, e o Google pode levar alguns minutos para propagar edições.

### Estrutura esperada da planilha

Cinco colunas, com estes nomes exatos:

| Mes | Tipo | Categoria | Descricao | Valor |
|---|---|---|---|---|
| Agosto 2025 | Entrada | Servicos | Pintura completa Gol | 3800 |
| Agosto 2025 | Saida | Tinta | Tinta poliester prata | 620 |

- `Tipo`: **Entrada** (dinheiro que entrou) ou **Saida** (gasto). O código também entende Receita, Despesa, Venda e Compra.
- `Mes`: escrito igual em todas as linhas do mesmo mês.
- `Valor`: apenas números. Aceita `1.234,50` e `1234.50`.

Se os nomes das colunas forem diferentes, ajuste o objeto `COLUNAS` no `script.js` (seção 6, comentada).

## Estrutura dos arquivos

```
sistema-oficina/
├── index.html                    # estrutura da página
├── style.css                     # visual e responsividade
├── script.js                     # dados, abas, busca, planilha
├── Planilha-Padrao-Oficina.xlsx  # modelo para preencher
├── exemplo-planilha.csv          # arquivo de teste
└── README.md
```

## Publicação

Site estático publicado via **GitHub Pages** (Settings → Pages → branch `main`).
Após cada `git push`, o site atualiza em cerca de um minuto.
