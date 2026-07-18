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
   ⭐ CONFIGURAÇÃO DA PLANILHA ONLINE (Google Sheets) ⭐

   Cole abaixo o endereço da planilha publicada como CSV.
   Enquanto estiver vazio (""), o app usa os dados de exemplo
   ou a planilha importada pelo botão.

   COMO PEGAR ESSE ENDEREÇO:
   1) Abra a planilha no Google Sheets
   2) Menu: Arquivo > Compartilhar > Publicar na web
   3) Em "Vincular", escolha a ABA certa e o formato
      "Valores separados por vírgula (.csv)"
   4) Clique em Publicar e copie o endereço gerado
   5) Cole aqui dentro das aspas

   Fica algo assim:
   "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"
   ============================================================ */
const URL_PLANILHA = "";

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
/*
   ONDE OS DADOS FICAM SALVOS
   Quando uma planilha é importada, ela é guardada na memória do navegador
   deste aparelho. Assim, ao fechar e abrir o app de novo, os dados reais
   continuam lá — os dados de exemplo abaixo só aparecem enquanto nenhuma
   planilha tiver sido importada.
*/
const CHAVE_SALVA = "oficina_lancamentos";

// Dados de exemplo (usados só até a primeira importação)
const lancamentosExemplo = [
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

// Guarda a planilha importada na memória do navegador
function salvarNoNavegador(dados) {
  try {
    localStorage.setItem(CHAVE_SALVA, JSON.stringify(dados));
    return true;
  } catch (erro) {
    return false; // navegador sem permissão de salvar (modo anônimo, por ex.)
  }
}

// Busca a planilha salva. Devolve null se nunca importaram nada.
function lerDoNavegador() {
  try {
    const texto = localStorage.getItem(CHAVE_SALVA);
    if (!texto) return null;
    const dados = JSON.parse(texto);
    return Array.isArray(dados) && dados.length > 0 ? dados : null;
  } catch (erro) {
    return null;
  }
}

// Apaga a planilha salva e volta aos dados de exemplo
function apagarDoNavegador() {
  try { localStorage.removeItem(CHAVE_SALVA); } catch (erro) { /* ignora */ }
}

/*
   Lançamentos em uso agora.
   Se já existe planilha salva neste aparelho, ela tem prioridade
   sobre os dados de exemplo.
*/
let lancamentos = lerDoNavegador() || lancamentosExemplo;

/*
   BASE DE MATERIAIS — produtos reais de funilaria com preço médio de
   referência de mercado (aproximado). Ajuste os valores livremente.
   confianca: "confiavel" (etiqueta verde) ou "medio" (etiqueta amarela).
*/
const materiais = [
  { nome: "Massa Poliéster (Plástica)",    marca: "Maxi Rubber", categoria: "Massas", busca: "massa poliester automotiva maxi rubber" },
  { nome: "Massa Rápida Fina",             marca: "Sinteko",     categoria: "Massas", busca: "massa rapida fina automotiva" },
  { nome: "Verniz PU 900ml + Catalisador", marca: "Anjo",        categoria: "Vernizes", busca: "verniz pu automotivo anjo com catalisador" },
  { nome: "Verniz PU HS Alto Brilho",      marca: "Lazzuril",    categoria: "Vernizes",     busca: "verniz pu hs alto brilho automotivo" },
  { nome: "Tinta Poliéster Automotiva",    marca: "Wanda",       categoria: "Tintas", busca: "tinta poliester automotiva wanda" },
  { nome: "Primer PU (Fundo)",             marca: "Anjo",        categoria: "Tintas", busca: "primer pu automotivo fundo anjo" },
  { nome: "Lixa d'Água Grão 400",          marca: "Norton",      categoria: "Lixas", busca: "lixa dagua 400 norton" },
  { nome: "Lixa d'Água Grão 600",          marca: "3M",          categoria: "Lixas",     busca: "lixa dagua 600 3m" },
  { nome: "Disco de Lixa Hookit Grão 80",  marca: "3M",          categoria: "Lixas", busca: "disco de lixa hookit 80 3m" },
  { nome: "Catalisador para Verniz",       marca: "Anjo",        categoria: "Acessórios", busca: "catalisador para verniz automotivo" },
  { nome: "Thinner / Solvente 5L",         marca: "Baston",      categoria: "Acessórios",     busca: "thinner automotivo 5 litros" },
  { nome: "Fita Crepe Automotiva 18mm",    marca: "Adere",       categoria: "Acessórios", busca: "fita crepe automotiva 18mm" },
  { nome: "Pistola de Pintura HVLP 1.4mm", marca: "Steula",      categoria: "Ferramentas", busca: "pistola de pintura hvlp 1.4 automotiva" },
  { nome: "Lixadeira Roto-Orbital",        marca: "Vonder",      categoria: "Ferramentas",     busca: "lixadeira roto orbital automotiva" },
  { nome: "Máscara Respiratória + Filtros",marca: "3M",          categoria: "Ferramentas", busca: "mascara respiratoria 3m com filtro pintura" },
];

/*
   LOJAS ONDE PROCURAR
   Cada loja monta o endereço de busca a partir do termo do produto.
   Usamos a PÁGINA DE BUSCA da loja (e não o link de um anúncio específico)
   porque anúncio sai do ar e o link quebra — a busca funciona sempre.

   Para adicionar outra loja, é só copiar um bloco abaixo e ajustar o endereço.
*/
const lojas = [
  {
    nome: "Mercado Livre",
    montarLink: function (termo) {
      return "https://lista.mercadolivre.com.br/" + termo.replace(/\s+/g, "-");
    },
  },
  {
    nome: "Loja do Mecânico",
    montarLink: function (termo) {
      return "https://www.lojadomecanico.com.br/buscar/" + termo.replace(/\s+/g, "-");
    },
  },
  {
    nome: "Amazon",
    montarLink: function (termo) {
      return "https://www.amazon.com.br/s?k=" + encodeURIComponent(termo);
    },
  },
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
  return (
    '<article class="cartao-produto">' +
      '<div class="produto-topo">' +
        '<div>' +
          '<p class="produto-nome">' + p.nome + '</p>' +
          '<p class="produto-marca">Marca: ' + p.marca + '</p>' +
        '</div>' +
        '<span class="produto-categoria">' + p.categoria + '</span>' +
      '</div>' +
      '<div class="produto-lojas">' +
        '<p class="produto-lojas-titulo">Ver preço de hoje nas lojas:</p>' +
        lojas.map(function (loja) {
          return (
            '<a class="botao-loja" target="_blank" rel="noopener noreferrer" href="' +
              loja.montarLink(p.busca) + '">' +
              '<span aria-hidden="true">🛒</span> ' + loja.nome +
              '<span class="seta" aria-hidden="true">↗</span>' +
            '</a>'
          );
        }).join("") +
      '</div>' +
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

/*
   Busca a planilha online e atualiza o app.
   Se der erro (sem internet, link errado), mantém o que já estava
   na tela em vez de deixar o app vazio.
*/
function buscarPlanilhaOnline(avisarNaTela) {
  if (!URL_PLANILHA) return; // não configurada ainda

  const faixa = document.getElementById("origem-dados");
  faixa.className = "origem origem-carregando";
  faixa.innerHTML = '<span class="origem-texto">⏳ Buscando dados da planilha...</span>';

  // O "?t=" com a hora evita que o navegador entregue uma versão velha
  fetch(URL_PLANILHA + (URL_PLANILHA.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now())
    .then(function (resposta) {
      if (!resposta.ok) throw new Error("resposta " + resposta.status);
      return resposta.text();
    })
    .then(function (texto) {
      const novos = mapearLinhas(lerCSV(texto));
      if (novos.length === 0) throw new Error("planilha vazia");

      lancamentos = novos;
      salvarNoNavegador(novos); // guarda uma cópia para funcionar sem internet

      preencherSeletorMeses();
      const seletor = document.getElementById("seletor-mes");
      if (seletor.value) mostrarMes(seletor.value);
      atualizarOrigemDados();

      if (avisarNaTela) mostrarAviso("Dados atualizados!");
    })
    .catch(function () {
      atualizarOrigemDados();
      mostrarAviso("Não consegui buscar a planilha agora. Mostrando os últimos dados salvos.", true);
    });
}

/*
   Mostra na tela de onde vêm os dados que estão aparecendo:
   da planilha da oficina ou dos exemplos.
*/
function atualizarOrigemDados() {
  const area = document.getElementById("origem-dados");
  const temDados = lerDoNavegador() !== null;

  // MODO ONLINE: planilha do Google configurada
  if (URL_PLANILHA) {
    area.className = "origem origem-real";
    area.innerHTML =
      '<span class="origem-texto">✅ Dados da planilha da oficina</span>' +
      '<button id="botao-atualizar" class="botao-limpar">🔄 Atualizar agora</button>';
    document.getElementById("botao-atualizar").addEventListener("click", function () {
      buscarPlanilhaOnline(true);
    });
    return;
  }

  // MODO IMPORTAÇÃO: planilha enviada pelo botão
  if (temDados) {
    area.className = "origem origem-real";
    area.innerHTML =
      '<span class="origem-texto">✅ Mostrando os dados da sua planilha</span>' +
      '<button id="botao-limpar" class="botao-limpar">Voltar aos dados de exemplo</button>';
    document.getElementById("botao-limpar").addEventListener("click", function () {
      if (!confirm("Apagar a planilha importada e voltar aos dados de exemplo?")) return;
      apagarDoNavegador();
      lancamentos = lancamentosExemplo;
      preencherSeletorMeses();
      const seletor = document.getElementById("seletor-mes");
      if (seletor.value) mostrarMes(seletor.value);
      atualizarOrigemDados();
      mostrarAviso("Voltamos aos dados de exemplo.");
    });
    return;
  }

  // MODO EXEMPLO: nada configurado ainda
  area.className = "origem origem-exemplo";
  area.innerHTML =
    '<span class="origem-texto">ℹ️ Estes são dados de exemplo. ' +
    'Importe a planilha para ver os números reais.</span>';
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

        // Substitui os dados em uso pelos dados reais da planilha
        lancamentos = novos;

        // Guarda no aparelho para continuar valendo nas próximas aberturas
        const salvou = salvarNoNavegador(novos);

        // Redesenha tudo com os dados novos
        preencherSeletorMeses();
        const seletor = document.getElementById("seletor-mes");
        if (seletor.value) mostrarMes(seletor.value);
        atualizarOrigemDados();

        if (salvou) {
          mostrarAviso("Planilha importada e salva! (" + novos.length + " lançamentos)");
        } else {
          mostrarAviso("Planilha importada, mas este navegador não permitiu salvar.", true);
        }
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
  atualizarOrigemDados();

  // Se a planilha online estiver configurada, busca os dados mais recentes
  buscarPlanilhaOnline(false);
});
