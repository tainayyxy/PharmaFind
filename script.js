/* =========================================================
   PharmaFind — script.js
   Funcionalidades compartilhadas entre todas as páginas:
   - menu mobile (hambúrguer)
   - popup de CEP (abrir, validar, formatar, salvar, carregar)
   - popup de localização (consentimento antes de geolocation)
   - fechar popups com Escape / clique fora
   - toast de feedback
========================================================= */
(function () {
  "use strict";

  const CEP_STORAGE_KEY = "pharmafind:cep";

  /* ---------------------------------------------------
     Utilitários
  --------------------------------------------------- */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function showToast(message) {
    const toast = qs("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /* ---------------------------------------------------
     Menu mobile
  --------------------------------------------------- */
  function initMobileMenu() {
    const btn = qs("#hamburgerBtn");
    const nav = qs("#mobileNav");
    if (!btn || !nav) return;

    function closeMenu() {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openMenu() {
      nav.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      expanded ? closeMenu() : openMenu();
    });

    qsa("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) closeMenu();
    });
  }

  /* ---------------------------------------------------
     Diálogos genéricos (overlay) — abrir/fechar/escape/clique fora
  --------------------------------------------------- */
  function setupOverlay(overlayEl) {
    if (!overlayEl) return;
    const closeButtons = qsa("[data-close-dialog]", overlayEl);

    function close() {
      overlayEl.classList.remove("open");
      document.body.style.overflow = "";
    }
    function open() {
      overlayEl.classList.add("open");
      document.body.style.overflow = "hidden";
      const firstField = qs("input, button", overlayEl);
      if (firstField) setTimeout(() => firstField.focus(), 60);
    }

    closeButtons.forEach((b) => b.addEventListener("click", close));

    overlayEl.addEventListener("click", (e) => {
      if (e.target === overlayEl) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlayEl.classList.contains("open")) close();
    });

    overlayEl._open = open;
    overlayEl._close = close;
  }

  /* ---------------------------------------------------
     CEP: validação, formatação, storage
  --------------------------------------------------- */
  function formatCep(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return digits.slice(0, 5) + "-" + digits.slice(5);
  }

  function isValidCep(value) {
    return /^\d{5}-\d{3}$/.test(value);
  }

  function saveCep(cep) {
    try {
      localStorage.setItem(CEP_STORAGE_KEY, cep);
    } catch (err) {
      /* localStorage indisponível — segue sem persistir */
    }
  }

  function loadCep() {
    try {
      return localStorage.getItem(CEP_STORAGE_KEY);
    } catch (err) {
      return null;
    }
  }

  function updateCepDisplay(cep) {
    qsa("[data-cep-display]").forEach((el) => {
      el.textContent = cep ? cep : "Informe seu CEP";
    });
    qsa("[data-cep-display]").forEach((el) => {
      el.classList.toggle("utility-cep-value", Boolean(cep));
    });
  }

  function initCepFlow() {
    const overlay = qs("#cepOverlay");
    if (overlay) setupOverlay(overlay);

    const openTriggers = qsa("[data-open-cep]");
    openTriggers.forEach((btn) =>
      btn.addEventListener("click", () => overlay && overlay._open())
    );

    const input = qs("#cepInput");
    const error = qs("#cepError");
    const success = qs("#cepSuccess");
    const form = qs("#cepForm");

    const savedCep = loadCep();
    updateCepDisplay(savedCep);
    if (input && savedCep) input.value = savedCep;

    if (input) {
      input.addEventListener("input", () => {
        input.value = formatCep(input.value);
        if (error) error.textContent = "";
        if (success) success.textContent = "";
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (!isValidCep(value)) {
          if (error) error.textContent = "Digite um CEP válido no formato 00000-000.";
          if (success) success.textContent = "";
          return;
        }
        saveCep(value);
        updateCepDisplay(value);
        if (error) error.textContent = "";
        if (success) success.textContent = "CEP salvo com sucesso.";
        showToast("CEP " + value + " salvo para suas buscas.");
        setTimeout(() => overlay && overlay._close(), 700);
      });
    }
  }

  /* ---------------------------------------------------
     Localização: popup de consentimento antes de geolocation
  --------------------------------------------------- */
  function initLocationFlow() {
    const overlay = qs("#locationOverlay");
    if (overlay) setupOverlay(overlay);

    const openTriggers = qsa("[data-open-location]");
    openTriggers.forEach((btn) =>
      btn.addEventListener("click", () => overlay && overlay._open())
    );

    const allowBtn = qs("#locationAllow");
    const denyBtn = qs("#locationDeny");

    if (allowBtn) {
      allowBtn.addEventListener("click", () => {
        if (!("geolocation" in navigator)) {
          showToast("Seu navegador não suporta localização automática.");
          overlay && overlay._close();
          return;
        }
        allowBtn.disabled = true;
        allowBtn.textContent = "Localizando…";
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude.toFixed(2);
            const lng = position.coords.longitude.toFixed(2);
            showToast("Localização detectada. Simulando ofertas próximas a você.");
            updateCepDisplay("Localização ativa");
            allowBtn.disabled = false;
            allowBtn.textContent = "Permitir localização";
            overlay && overlay._close();
            console.info("PharmaFind: coordenadas aproximadas", lat, lng);
          },
          () => {
            showToast("Não foi possível acessar sua localização. Você pode informar o CEP.");
            allowBtn.disabled = false;
            allowBtn.textContent = "Permitir localização";
            overlay && overlay._close();
          },
          { timeout: 8000 }
        );
      });
    }

    if (denyBtn) {
      denyBtn.addEventListener("click", () => {
        overlay && overlay._close();
      });
    }
  }

  /* ---------------------------------------------------
     Init geral
  --------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initCepFlow();
    initLocationFlow();
  });

  // Expõe helpers usados por consulta.js
  window.PharmaFind = window.PharmaFind || {};
  window.PharmaFind.showToast = showToast;
  window.PharmaFind.setupOverlay = setupOverlay;
})();
