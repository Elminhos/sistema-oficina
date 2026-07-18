/* ============================================================
   OFICINA · FINANCEIRO E PREÇOS  —  script.js
   Tudo em JavaScript puro (vanilla). Sem bibliotecas.

   ORGANIZAÇÃO DESTE ARQUIVO:
   1. Dados fictícios (financeiro) e base de materiais
   2. Utilidades (formatar dinheiro etc.)
   3. Troca de abas
   4. Aba Financeiro (mês, cartões, gráficos, gastos)
   5. Aba Buscar Preços (busca + filtros)
   6. IMPORTAÇÃO DE PLANILHA CSV  <-- ajuste os nomes das colunas aqui
   7. Mensagens de aviso na tela
   8. Início do programa
   ============================================================ */


/* ============================================================
   1. DADOS
   ============================================================ */

/*
   FINANCEIRO — cada linha é um lançamento (uma movimentação).
   tipo: "Entrada" = dinheiro que entrou (faturamento / serviço)
         "Saida"   = dinheiro que saiu (gasto com material, mão de obra...)

   Já vem preenchido com 3 meses de exemplo para o app abrir cheio.
   Quando a planilha real chegar, esta lista será substituída pela
   importação do CSV (ver seção 6).
*/
let lancamentos = [
  // ---------- MARÇO 2025 ----------
  { mes: "Março 2025",  tipo: "Entrada", categoria: "Serviços",   descricao: "Pintura completa Gol",     valor: 3800 },
  { mes: "Março 2025",  tipo: "Entrada", categoria: "Serviços",   descricao: "Funilaria porta Corolla",  valor: 1500 },
  { mes: "Março 2025",  tipo: "Saida",   categoria: "Tinta",      descricao: "Tinta poliéster prata",    valor: 620 },
  { mes: "Março 2025",  tipo: "Saida",   categoria: "Verniz",     descricao: "Verniz PU + catalisador",  valor: 240 },
  { mes: "Março 2025",  tipo: "Saida",   categoria: "Lixa",       descricao: "Lixas variadas",           valor: 90 },
  { mes: "Março 2025",  tipo: "Saida",   categoria: "Mão de Obra",descricao: "Ajudante diária",          valor: 800 },

  // ---------- ABRIL 2025 ----------
  { mes: "Abril 2025",  tipo: "Entrada", categoria: "Serviços",   descricao: "Pintura geral Onix",       valor: 4200 },
  { mes: "Abril 2025",  tipo: "Entrada", categoria: "Serviços",   descricao: "Polimento técnico",        valor: 700 },
  { mes: "Abril 2025",  tipo: "Entrada", categoria: "Serviços",   descricao: "Reparo para-choque",       valor: 950 },
  { mes: "Abril 2025",  tipo: "Saida",   categoria: "Tinta",      descricao: "Tinta preto brilhante",    valor: 580 },
  { mes: "Abril 2025",  tipo: "Saida",   categoria: "Verniz",     descricao: "Verniz HS",                valor: 330 },
  { mes: "Abril 2025",  tipo: "Saida",   categoria: "Massa",      descricao: "Massa poliéster (3 latas)",valor: 120 },
  { mes: "Abril 2025",  tipo: "Saida",   categoria: "Lixa",       descricao: "Discos de lixa 3M",        valor: 140 },
  { mes: "Abril 2025",  tipo: "Saida",   categoria: "Mão de Obra",descricao: "Ajudante quinzena",        valor: 900 },

  // ---------- MAIO 2025 ----------
  { mes: "Maio 2025",   tipo: "Entrada", categoria: "Serviços",   descricao: "Pintura completa HB20",    valor: 4500 },
  { mes: "Maio 2025",   tipo: "Entrada", categoria: "Serviços",   descricao: "Funilaria capô",           valor: 1200 },
  { mes: "Maio 2025",   tipo: "Saida",   categoria: "Tinta",      descricao: "Tinta branca perolizada",  valor: 690 },
  { mes: "Maio 2025",   tipo: "Saida",   categoria: "Verniz",     descricao: "Verniz PU premium",        valor: 280 },
  { mes: "Maio 2025",   tipo: "Saida",   categoria: "Massa",      descricao: "Massa rápida fina",        valor: 84 },
  { mes: "Maio 2025",   tipo: "Saida",   categoria: "Lixa",       descricao: "Lixas d'água variadas",    valor: 70 },
  { mes: "Maio 2025",   tipo: "Saida",   categoria: "Solvente",   descricao: "Thinner 5L",               valor: 62 },
];

/*
   BASE DE MATERIAIS — produtos reais de funilaria com preço médio de
   referência de mercado (aproximado). Ajuste os valores livremente.
   confianca: "confiavel" (etiqueta verde) ou "medio" (etiqueta amarela).
*/
const materiais = [
  { nome: "Massa Poliéster (Plástica)",     marca: "Maxi Rubber",    categoria: "Massas",      preco: 34.00,  unidade: "lata 900g", confianca: "confiavel", loja: "Auto lojas / Casa da Tinta" },
  { nome: "Massa Rápida Fina",              marca: "Sinteko",        categoria: "Massas",      preco: 42.00,  unidade: "kit",       confianca: "confiavel", loja: "Distribuidora automotiva" },
  { nome: "Verniz PU 900ml + Catalisador",  marca: "Anjo",           categoria: "Vernizes",    preco: 119.00, unidade: "kit",       confianca: "confiavel", loja: "Casa da Tinta" },
  { nome: "Verniz PU HS Alto Brilho",       marca: "Lazzuril",       categoria: "Vernizes",    preco: 165.00, unidade: "kit",       confianca: "medio",     loja: "Loja especializada" },
  { nome: "Tinta Poliéster Automotiva",     marca: "Wanda",          categoria: "Tintas",      preco: 145.00, unidade: "litro",     confianca: "confiavel", loja: "Distribuidora de tintas" },
  { nome: "Primer PU (Fundo)",              marca: "Anjo",           categoria: "Tintas",      preco: 98.00,  unidade: "kit",       confianca: "confiavel", loja: "Casa da Tinta" },
  { nome: "Lixa d'Água Grão 400",           marca: "Norton",         categoria: "Lixas",       preco: 3.50,   unidade: "folha",     confianca: "confiavel", loja: "Ferragens / Auto center" },
  { nome: "Lixa d'Água Grão 600",           marca: "3M",             categoria: "Lixas",       preco: 4.20,   unidade: "folha",     confianca: "medio",     loja: "Ferragens" },
  { nome: "Disco de Lixa Hookit Grão 80",   marca: "3M",             categoria: "Lixas",       preco: 6.90,   unidade: "disco",     confianca: "confiavel", loja: "Distribuidora automotiva" },
  { nome: "Catalisador para Verniz",        marca: "Anjo",           categoria: "Acessórios",  preco: 28.00,  unidade: "frasco",    confianca: "confiavel", loja: "Casa da Tinta" },
  { nome: "Thinner / Solvente 5L",          marca: "Baston",         categoria: "Acessórios",  preco: 62.00,  unidade: "galão 5L",  confianca: "medio",     loja: "Distribuidora" },
  { nome: "Fita Crepe Automotiva 18mm",     marca: "Adere",          categoria: "Acessórios",  preco: 9.90,   unidade: "rolo",      confianca: "confiavel", loja: "Auto center" },
  { nome: "Pistola de Pintura HVLP 1.4mm",  marca: "Steula",         categoria: "Ferramentas", preco: 189.00, unidade: "unidade",   confianca: "confiavel", loja: "Loja de ferramentas" },
  { nome: "Lixadeira Roto-Orbital",         marca: "Vonder",         categoria: "Ferramentas", preco: 320.00, unidade: "unidade",   confianca: "medio",     loja: "Loja de ferramentas" },
  { nome: "Máscara Respiratória + Filtros",  marca: "3M",             categoria: "Ferramentas", preco: 145.00, unidade: "kit",       confianca: "confiavel", loja: "EPI / Segurança" },
];


/* ============================================================
   2. UTILIDADES
   ============================================================ */

// Formata número como dinheiro brasileiro: 1234.5 -> "R$ 1.234,50"
function formatarDinheiro(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Ícone simples para cada categoria de gasto
function iconeCategoria(categoria) {
  const mapa = {
    "Tinta": "🎨", "Verniz": "✨", "Massa": "🪣", "Lixa": "🧽",
    "Solvente": "🧴", "Mão de Obra": "👷", "Serviços": "🚗",
  };
  return mapa[categoria] || "📦";
}

// Devolve a lista de meses na ordem em que aparecem nos lançamentos (sem repetir)
function listarMeses() {
  const vistos = [];
  lancamentos.forEach(function (l) {
    if (!vistos.includes(l.mes)) vistos.push(l.mes);
  });
  return vistos;
}


/* ============================================================
   3. TROCA DE ABAS
   ============================================================ */

function iniciarAbas() {
  const botoesAba = document.querySelectorAll(".aba");

  botoesAba.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const alvo = botao.dataset.aba; // "financeiro" ou "materiais"

      // Atualiza botões
      botoesAba.forEach(function (b) {
        const ativo = b === botao;
        b.classList.toggle("aba-ativa", ativo);
        b.setAttribute("aria-pressed", ativo ? "true" : "false");
      });

      // Mostra o painel certo
      document.getElementById("painel-financeiro")
        .classList.toggle("painel-ativo", alvo === "financeiro");
      document.getElementById("painel-materiais")
        .classList.toggle("painel-ativo", alvo === "materiais");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}


/* ============================================================
   4. ABA FINANCEIRO
   ============================================================ */

// Preenche o seletor de meses com base nos dados atuais
function preencherSeletorMeses() {
  const seletor = document.getElementById("seletor-mes");
  const meses = listarMeses();

  seletor.innerHTML = "";
  meses.forEach(function (mes) {
    const opcao = document.createElement("option");
    opcao.value = mes;
    opcao.textContent = mes;
    seletor.appendChild(opcao);
  });

  // Começa mostrando o último mês (mais recente da lista)
  if (meses.length > 0) seletor.value = meses[meses.length - 1];
}

// Calcula os totais de um mês
function calcularMes(mes) {
  const doMes = lancamentos.filter(function (l) { return l.mes === mes; });

  let faturamento = 0;
  let gastos = 0;
  const gastosPorCategoria = {};

  doMes.forEach(function (l) {
    if (l.tipo === "Entrada") {
      faturamento += l.valor;
    } else {
      gastos += l.valor;
      gastosPorCategoria[l.categoria] = (gastosPorCategoria[l.categoria] || 0) + l.valor;
    }
  });

  return {
    faturamento: faturamento,
    gastos: gastos,
    lucro: faturamento - gastos,
    gastosPorCategoria: gastosPorCategoria,
  };
}

// Desenha todo o painel financeiro para o mês escolhido
function mostrarMes(mes) {
  const d = calcularMes(mes);

  // Cartões de destaque
  document.getElementById("valor-faturamento").textContent = formatarDinheiro(d.faturamento);
  document.getElementById("valor-gastos").textContent = formatarDinheiro(d.gastos);
  document.getElementById("valor-lucro").textContent = formatarDinheiro(d.lucro);

  // Porcentagem de lucro sobre o faturamento
  let percLucro = 0;
  if (d.faturamento > 0 && d.lucro > 0) {
    percLucro = Math.round((d.lucro / d.faturamento) * 100);
  }

  // Rosquinha
  const rosquinha = document.getElementById("rosquinha");
  rosquinha.style.setProperty("--porcentagem", percLucro);
  document.getElementById("rosquinha-numero").textContent = percLucro + "%";

  // Barra
  document.getElementById("barra-lucro").style.width = percLucro + "%";

  // Lista de gastos
  const lista = document.getElementById("lista-gastos");
  lista.innerHTML = "";

  const categorias = Object.keys(d.gastosPorCategoria);
  if (categorias.length === 0) {
    lista.innerHTML = '<li class="lista-vazia">Nenhum gasto registrado neste mês.</li>';
    return;
  }

  // Ordena do maior gasto para o menor
  categorias.sort(function (a, b) {
    return d.gastosPorCategoria[b] - d.gastosPorCategoria[a];
  });

  categorias.forEach(function (cat) {
    const li = document.createElement("li");
    li.className = "item-gasto";
    li.innerHTML =
      '<span class="item-gasto-nome">' +
        '<span class="item-gasto-icone">' + iconeCategoria(cat) + '</span>' +
        cat +
      '</span>' +
      '<span class="item-gasto-valor">' + formatarDinheiro(d.gastosPorCategoria[cat]) + '</span>';
    lista.appendChild(li);
  });
}

function iniciarFinanceiro() {
  preencherSeletorMeses();
  const seletor = document.getElementById("seletor-mes");

  // Mostra o mês inicial
  if (seletor.value) mostrarMes(seletor.value);

  // Troca de mês
  seletor.addEventListener("change", function () {
    mostrarMes(seletor.value);
  });
}


/* ============================================================
   5. ABA BUSCAR PREÇOS
   ============================================================ */

let categoriaAtiva = "Todos";

// Monta o HTML de um cartão de produto
function cartaoProduto(p) {
  const confiavel = p.confianca === "confiavel";
  const tagClasse = confiavel ? "tag-confiavel" : "tag-medio";
  const tagTexto = confiavel ? "✅ Preço Confiável" : "👍 Bom Custo-Benefício";

  return (
    '<article class="cartao-produto">' +
      '<div class="produto-topo">' +
        '<div>' +
          '<p class="produto-nome">' + p.nome + '</p>' +
          '<p class="produto-marca">Marca: ' + p.marca + '</p>' +
        '</div>' +
        '<span class="produto-categoria">' + p.categoria + '</span>' +
      '</div>' +
      '<p class="produto-preco">' + formatarDinheiro(p.preco) +
        ' <small>/ ' + p.unidade + '</small></p>' +
      '<span class="tag-confianca ' + tagClasse + '">' + tagTexto + '</span>' +
      '<p class="produto-fornecedor">Onde comprar: <b>' + p.loja + '</b></p>' +
    '</article>'
  );
}

// Filtra por texto digitado + categoria ativa e redesenha os resultados
function atualizarResultados() {
  const texto = document.getElementById("campo-busca").value.trim().toLowerCase();
  const area = document.getElementById("resultados");

  const filtrados = materiais.filter(function (p) {
    const bateCategoria = categoriaAtiva === "Todos" || p.categoria === categoriaAtiva;
    const bateTexto =
      texto === "" ||
      p.nome.toLowerCase().includes(texto) ||
      p.marca.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto);
    return bateCategoria && bateTexto;
  });

  if (filtrados.length === 0) {
    area.innerHTML =
      '<p class="lista-vazia">Nenhum produto encontrado. Tente outra palavra ou categoria.</p>';
    return;
  }

  area.innerHTML = filtrados.map(cartaoProduto).join("");
}

function iniciarBusca() {
  // Botão buscar e tecla Enter
  document.getElementById("botao-buscar").addEventListener("click", atualizarResultados);
  document.getElementById("campo-busca").addEventListener("input", atualizarResultados);
  document.getElementById("campo-busca").addEventListener("keydown", function (e) {
    if (e.key === "Enter") atualizarResultados();
  });

  // Filtros de categoria
  document.querySelectorAll(".filtro").forEach(function (botao) {
    botao.addEventListener("click", function () {
      categoriaAtiva = botao.dataset.categoria;
      document.querySelectorAll(".filtro").forEach(function (b) {
        b.classList.toggle("filtro-ativo", b === botao);
      });
      atualizarResultados();
    });
  });

  // Mostra todos ao abrir
  atualizarResultados();
}


/* ============================================================
   6. IMPORTAÇÃO DE PLANILHA CSV   ⭐ AJUSTE AQUI ⭐
   ============================================================

   COMO USAR QUANDO A PLANILHA REAL CHEGAR:
   1) Exporte a planilha da cliente como CSV (no Excel/Google Sheets:
      "Salvar como" > "CSV").
   2) Abra o CSV e veja o NOME EXATO de cada coluna (a primeira linha).
   3) Ajuste o objeto COLUNAS abaixo para casar com esses nomes.
      Nada mais precisa mudar: o app passa a ler a planilha nova.

   O QUE O SISTEMA ESPERA:
   Cada linha do CSV = um lançamento (uma movimentação de dinheiro).
   Precisamos de 5 informações por linha:
     - o mês
     - se é entrada ou saída
     - a categoria (ex: Tinta, Verniz, Mão de Obra)
     - uma descrição
     - o valor em reais
*/

// >>> Troque os textos à direita pelos nomes das colunas do SEU CSV <<<
const COLUNAS = {
  mes:       "Mes",        // coluna com o mês (ex: "Maio 2025")
  tipo:      "Tipo",       // coluna com "Entrada" ou "Saida"
  categoria: "Categoria",  // coluna com a categoria do gasto/serviço
  descricao: "Descricao",  // coluna com a descrição
  valor:     "Valor",      // coluna com o valor (ex: 1234,50 ou 1234.50)
};

/*
   Se na planilha da cliente o "tipo" vier escrito de outro jeito
   (ex: "Receita" em vez de "Entrada", ou "Despesa" em vez de "Saida"),
   adicione a tradução aqui. Qualquer coisa não listada é tratada como saída.
*/
const TRADUZIR_TIPO = {
  "entrada":  "Entrada",
  "receita":  "Entrada",
  "venda":    "Entrada",
  "servico":  "Entrada",
  "serviço":  "Entrada",
  "saida":    "Saida",
  "saída":    "Saida",
  "despesa":  "Saida",
  "gasto":    "Saida",
  "compra":   "Saida",
};

// Converte texto de valor ("1.234,50" ou "1234.50") em número
function textoParaNumero(texto) {
  if (texto === undefined || texto === null) return 0;
  let limpo = String(texto).replace(/[R$\s]/g, ""); // tira "R$" e espaços
  // Se tem vírgula, assumimos padrão brasileiro: ponto = milhar, vírgula = decimal
  if (limpo.indexOf(",") > -1) {
    limpo = limpo.replace(/\./g, "").replace(",", ".");
  }
  const n = parseFloat(limpo);
  return isNaN(n) ? 0 : n;
}

/*
   Leitor de CSV simples e seguro.
   Entende vírgula (,) OU ponto e vírgula (;) como separador,
   e respeita textos entre aspas.
*/
function lerCSV(texto) {
  const linhas = texto.split(/\r?\n/).filter(function (l) { return l.trim() !== ""; });
  if (linhas.length < 2) return [];

  // Descobre o separador olhando o cabeçalho
  const separador = linhas[0].split(";").length > linhas[0].split(",").length ? ";" : ",";

  function quebrarLinha(linha) {
    const resultado = [];
    let atual = "";
    let dentroAspas = false;
    for (let i = 0; i < linha.length; i++) {
      const c = linha[i];
      if (c === '"') {
        dentroAspas = !dentroAspas;
      } else if (c === separador && !dentroAspas) {
        resultado.push(atual);
        atual = "";
      } else {
        atual += c;
      }
    }
    resultado.push(atual);
    return resultado.map(function (v) { return v.trim(); });
  }

  const cabecalho = quebrarLinha(linhas[0]);
  const dados = [];
  for (let i = 1; i < linhas.length; i++) {
    const valores = quebrarLinha(linhas[i]);
    const objeto = {};
    cabecalho.forEach(function (nomeColuna, idx) {
      objeto[nomeColuna] = valores[idx] !== undefined ? valores[idx] : "";
    });
    dados.push(objeto);
  }
  return dados;
}

// Transforma as linhas do CSV em lançamentos que o app entende
function mapearLinhas(linhasCSV) {
  return linhasCSV.map(function (linha) {
    const tipoBruto = String(linha[COLUNAS.tipo] || "").toLowerCase().trim();
    const tipo = TRADUZIR_TIPO[tipoBruto] || "Saida"; // padrão: saída

    return {
      mes:       linha[COLUNAS.mes]       || "Sem mês",
      tipo:      tipo,
      categoria: linha[COLUNAS.categoria] || "Outros",
      descricao: linha[COLUNAS.descricao] || "",
      valor:     textoParaNumero(linha[COLUNAS.valor]),
    };
  });
}

// Liga o botão "Importar Planilha (.CSV)"
function iniciarImportacao() {
  const botao = document.getElementById("botao-importar");
  const input = document.getElementById("arquivo-csv");

  botao.addEventListener("click", function () { input.click(); });

  input.addEventListener("change", function (evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function (e) {
      try {
        const linhasCSV = lerCSV(e.target.result);
        const novos = mapearLinhas(linhasCSV);

        if (novos.length === 0) {
          mostrarAviso("A planilha parece estar vazia. Confira o arquivo.", true);
          return;
        }

        // Substitui os dados de exemplo pelos dados reais da planilha
        lancamentos = novos;

        // Redesenha tudo com os dados novos
        preencherSeletorMeses();
        const seletor = document.getElementById("seletor-mes");
        if (seletor.value) mostrarMes(seletor.value);

        mostrarAviso("Planilha importada com sucesso! (" + novos.length + " lançamentos)");
      } catch (erro) {
        mostrarAviso("Não consegui ler este arquivo. Verifique se é um CSV.", true);
      }
    };
    leitor.readAsText(arquivo, "UTF-8");

    // Permite importar o mesmo arquivo de novo depois
    input.value = "";
  });
}


/* ============================================================
   7. MENSAGENS DE AVISO NA TELA
   ============================================================ */

let avisoTimer = null;

function mostrarAviso(texto, erro) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.classList.toggle("aviso-erro", erro === true);
  aviso.hidden = false;

  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(function () {
    aviso.hidden = true;
  }, 4000);

  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ============================================================
   8. INÍCIO DO PROGRAMA
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  iniciarAbas();
  iniciarFinanceiro();
  iniciarBusca();
  iniciarImportacao();
});
