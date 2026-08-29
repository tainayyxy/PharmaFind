/* =========================================================
   PharmaFind — consulta.js
   Lógica da página de consulta: dataset local, renderização,
   pesquisa, filtros, ordenação e modal de oferta.
========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------
     Dataset local de medicamentos (protótipo, sem backend)
  --------------------------------------------------- */
  const MEDICAMENTOS = [
    {
      nome: "Dipirona Sódica 500 mg",
      descricao: "Caixa com 20 comprimidos",
      tipo: "Genérico",
      farmacia: "Farmácia Vida",
      preco: 8.49,
      imagem:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Dipirona Sódica 500 mg",
      descricao: "Caixa com 20 comprimidos",
      tipo: "Similar",
      farmacia: "Saúde Popular",
      preco: 9.9,
      imagem:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Paracetamol 750 mg",
      descricao: "Caixa com 20 comprimidos",
      tipo: "Genérico",
      farmacia: "Bem Estar",
      preco: 11.2,
      imagem:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Paracetamol 750 mg",
      descricao: "Caixa com 20 comprimidos",
      tipo: "Referência",
      farmacia: "Farmácia Vida",
      preco: 15.75,
      imagem:
        "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Ibuprofeno 400 mg",
      descricao: "Caixa com 20 comprimidos revestidos",
      tipo: "Genérico",
      farmacia: "Saúde Popular",
      preco: 13.3,
      imagem:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Loratadina 10 mg",
      descricao: "Caixa com 12 comprimidos",
      tipo: "Genérico",
      farmacia: "Bem Estar",
      preco: 10.49,
      imagem:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Omeprazol 20 mg",
      descricao: "Caixa com 28 cápsulas",
      tipo: "Genérico",
      farmacia: "Farmácia Vida",
      preco: 14.9,
      imagem:
        "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Omeprazol 20 mg",
      descricao: "Caixa com 28 cápsulas",
      tipo: "Similar",
      farmacia: "Saúde Popular",
      preco: 17.4,
      imagem:
        "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Simeticona 40 mg",
      descricao: "Frasco gotas 15 ml",
      tipo: "Referência",
      farmacia: "Bem Estar",
      preco: 22.6,
      imagem:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Cetirizina 10 mg",
      descricao: "Caixa com 10 comprimidos",
      tipo: "Genérico",
      farmacia: "Farmácia Vida",
      preco: 9.15,
      imagem:
        "https://images.unsplash.com/photo-1585435557343-3b092031d4fc?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "AAS 100 mg",
      descricao: "Caixa com 30 comprimidos",
      tipo: "Referência",
      farmacia: "Saúde Popular",
      preco: 12.85,
      imagem:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Dramin B6 50 mg",
      descricao: "Caixa com 10 comprimidos",
      tipo: "Referência",
      farmacia: "Bem Estar",
      preco: 18.3,
      imagem:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80",
    },
    {
      nome: "Vitamina C 500 mg",
      descricao: "Frasco com 30 comprimidos efervescentes",
      tipo: "Similar",
      farmacia: "Farmácia Vida",
      preco: 16.6,
      imagem:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    },
  ];

  /* ---------------------------------------------------
     Estado da página
  --------------------------------------------------- */
  const state = {
    termo: "",
    tipos: new Set(),
    farmacias: new Set(),
    ordenacao: "relevancia",
  };

  /* ---------------------------------------------------
     Utilitários
  --------------------------------------------------- */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* ---------------------------------------------------
     Construção dinâmica dos filtros (tipo e farmácia)
  --------------------------------------------------- */
  function popularFiltros() {
    const tipos = Array.from(new Set(MEDICAMENTOS.map((m) => m.tipo)));
    const farmacias = Array.from(new Set(MEDICAMENTOS.map((m) => m.farmacia)));

    const tipoWrap = qs("#filtroTipo");
    const farmaciaWrap = qs("#filtroFarmacia");

    if (tipoWrap) {
      tipoWrap.innerHTML = tipos
        .map(
          (tipo, i) => `
        <label class="filter-option">
          <input type="checkbox" name="tipo" value="${tipo}" id="tipo-${i}">
          ${tipo}
        </label>`
        )
        .join("");
    }

    if (farmaciaWrap) {
      farmaciaWrap.innerHTML = farmacias
        .map(
          (farmacia, i) => `
        <label class="filter-option">
          <input type="checkbox" name="farmacia" value="${farmacia}" id="farmacia-${i}">
          ${farmacia}
        </label>`
        )
        .join("");
    }
  }

  /* ---------------------------------------------------
     Aplicar busca + filtros + ordenação
  --------------------------------------------------- */
  function obterResultados() {
    let lista = MEDICAMENTOS.slice();

    if (state.termo) {
      const termoNormalizado = normalizar(state.termo);
      lista = lista.filter((m) => normalizar(m.nome).includes(termoNormalizado));
    }

    if (state.tipos.size > 0) {
      lista = lista.filter((m) => state.tipos.has(m.tipo));
    }

    if (state.farmacias.size > 0) {
      lista = lista.filter((m) => state.farmacias.has(m.farmacia));
    }

    if (state.ordenacao === "menor-preco") {
      lista.sort((a, b) => a.preco - b.preco);
    } else if (state.ordenacao === "maior-preco") {
      lista.sort((a, b) => b.preco - a.preco);
    }

    return lista;
  }

  /* ---------------------------------------------------
     Renderização dos cards
  --------------------------------------------------- */
  function criarCard(med) {
    return `
      <article class="med-card">
        <div class="med-thumb">
          <img src="${med.imagem}" alt="Embalagem de ${med.nome}" loading="lazy">
          <span class="med-type">${med.tipo}</span>
        </div>
        <div class="med-body">
          <h3 class="med-name">${med.nome}</h3>
          <p class="med-desc">${med.descricao}</p>
          <p class="med-pharmacy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            ${med.farmacia}
          </p>
          <div class="med-footer">
            <p class="med-price"><small>Preço</small>${formatarMoeda(med.preco)}</p>
            <button class="btn btn-primary btn-sm" data-ver-oferta>Ver oferta</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderizar() {
    const grid = qs("#resultadosGrid");
    const contador = qs("#contadorResultados");
    const vazio = qs("#estadoVazio");
    if (!grid) return;

    const resultados = obterResultados();

    grid.innerHTML = resultados.map(criarCard).join("");

    if (contador) {
      contador.innerHTML =
        "<b>" + resultados.length + "</b> medicamento" + (resultados.length === 1 ? "" : "s") + " encontrado" + (resultados.length === 1 ? "" : "s");
    }

    if (vazio) {
      vazio.classList.toggle("show", resultados.length === 0);
    }
    grid.style.display = resultados.length === 0 ? "none" : "grid";

    qsa("[data-ver-oferta]", grid).forEach((btn, index) => {
      btn.addEventListener("click", () => abrirOferta(resultados[index]));
    });
  }

  /* ---------------------------------------------------
     Modal "Ver oferta"
  --------------------------------------------------- */
  function abrirOferta(med) {
    const overlay = qs("#offerOverlay");
    if (!overlay) return;

    qs("#offerImg").src = med.imagem;
    qs("#offerImg").alt = "Embalagem de " + med.nome;
    qs("#offerNome").textContent = med.nome;
    qs("#offerDescricao").textContent = med.descricao;
    qs("#offerTipo").textContent = med.tipo;
    qs("#offerFarmacia").textContent = med.farmacia;
    qs("#offerPreco").textContent = formatarMoeda(med.preco);

    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function initOfferModal() {
    const overlay = qs("#offerOverlay");
    if (!overlay) return;
    const close = () => {
      overlay.classList.remove("open");
      document.body.style.overflow = "";
    };
    qsa("[data-close-dialog]", overlay).forEach((b) => b.addEventListener("click", close));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) close();
    });
    const cta = qs("#offerCta");
    if (cta) {
      cta.addEventListener("click", () => {
        window.PharmaFind && window.PharmaFind.showToast
          ? window.PharmaFind.showToast("Protótipo: nenhuma loja real foi aberta.")
          : alert("Protótipo: nenhuma loja real foi aberta.");
        close();
      });
    }
  }

  /* ---------------------------------------------------
     Eventos: busca, filtros, ordenação, limpar
  --------------------------------------------------- */
  function initEventos() {
    const busca = qs("#buscaInput");
    if (busca) {
      busca.addEventListener("input", (e) => {
        state.termo = e.target.value;
        renderizar();
      });
    }

    const tipoWrap = qs("#filtroTipo");
    if (tipoWrap) {
      tipoWrap.addEventListener("change", (e) => {
        const { value, checked } = e.target;
        checked ? state.tipos.add(value) : state.tipos.delete(value);
        renderizar();
      });
    }

    const farmaciaWrap = qs("#filtroFarmacia");
    if (farmaciaWrap) {
      farmaciaWrap.addEventListener("change", (e) => {
        const { value, checked } = e.target;
        checked ? state.farmacias.add(value) : state.farmacias.delete(value);
        renderizar();
      });
    }

    qsa("select[name='ordenacao']").forEach((sel) => {
      sel.addEventListener("change", (e) => {
        state.ordenacao = e.target.value;
        qsa("select[name='ordenacao']").forEach((s) => (s.value = state.ordenacao));
        renderizar();
      });
    });

    const limparBtn = qs("#limparFiltros");
    if (limparBtn) {
      limparBtn.addEventListener("click", () => {
        state.tipos.clear();
        state.farmacias.clear();
        state.ordenacao = "relevancia";
        state.termo = "";
        if (busca) busca.value = "";
        qsa("input[type='checkbox']", tipoWrap).forEach((c) => (c.checked = false));
        qsa("input[type='checkbox']", farmaciaWrap).forEach((c) => (c.checked = false));
        qsa("select[name='ordenacao']").forEach((s) => (s.value = "relevancia"));
        renderizar();
      });
    }

    // Filtros mobile: abrir/fechar painel lateral
    const filtrosToggle = qs("#filtrosToggle");
    const filtrosPanel = qs("#filtrosPanel");
    const filtrosBackdrop = qs("#filtrosBackdrop");
    const filtrosFechar = qs("#filtrosFechar");
    function abrirFiltros() {
      filtrosPanel && filtrosPanel.classList.add("open");
      filtrosBackdrop && filtrosBackdrop.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function fecharFiltros() {
      filtrosPanel && filtrosPanel.classList.remove("open");
      filtrosBackdrop && filtrosBackdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
    filtrosToggle && filtrosToggle.addEventListener("click", abrirFiltros);
    filtrosFechar && filtrosFechar.addEventListener("click", fecharFiltros);
    filtrosBackdrop && filtrosBackdrop.addEventListener("click", fecharFiltros);
  }

  /* ---------------------------------------------------
     Suporte a ?busca= vindo da Home
  --------------------------------------------------- */
  function initTermoDaUrl() {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get("busca");
    if (termo) {
      state.termo = termo;
      const busca = qs("#buscaInput");
      if (busca) busca.value = termo;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!qs("#resultadosGrid")) return; // não está na página de consulta
    popularFiltros();
    initTermoDaUrl();
    initEventos();
    initOfferModal();
    renderizar();
  });
})();
