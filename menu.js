(async function () {

  // 0) Se você deixou menu manual antigo em alguma página, mata ele aqui:
  document.querySelectorAll("nav.nav, nav#bottom-nav, footer.manual-footer, footer#footer, nav[aria-label='Menu Antigo']")
    .forEach(el => el.remove());

  // 1) Se tiver mais de um mount, mantém só o primeiro
  const mounts = Array.from(document.querySelectorAll("#app-menu"));
  if (mounts.length === 0) return;
  const mount = mounts[0];
  mounts.slice(1).forEach(m => m.remove());

  // 2) Remove qualquer menu automático anterior
  document.querySelectorAll(".auto-footer").forEach(el => el.remove());

  // 3) Injeta o CSS do menu
  if (!document.getElementById("menu-css")) {
    const link = document.createElement("link");
    link.id = "menu-css";
    link.rel = "stylesheet";
    link.href = "menu.css";
    document.head.appendChild(link);
  }

  // 4) Descobre página atual e marca ativo
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const pageMap = {
    "index.html": "index",
    "teoria.html": "teoria",
    "campo.html": "campo",
    "indice-predial.html": "protocolo",
    "quiz.html": "quiz",
    "laboratorio.html": "lab",
    "roteiro-professor.html": "prof",
  };
  const activeId = pageMap[path] || "index";

  // 5) Carrega menu.html
  const res = await fetch("menu.html", { cache: "no-store" });
  const html = await res.text();

  // 6) Insere menu
  mount.innerHTML = `<footer class="auto-footer compact">${html}</footer>`;

  // 7) Marca ativo
  mount.querySelectorAll("a[data-page]").forEach(a => {
    if (a.getAttribute("data-page") === activeId) a.classList.add("active");
  });

  // 8) Toggle por JS (não depende de onclick)
  const footer = mount.querySelector(".auto-footer");
  const btn = mount.querySelector(".menu-toggle");

  function setExpanded(expanded){
    btn?.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (expanded) footer?.classList.remove("compact");
    else footer?.classList.add("compact");
  }

  btn?.addEventListener("click", () => {
    const isCompact = footer.classList.contains("compact");
    setExpanded(isCompact);
  });

  // 9) Começa compacto no celular
  if (window.innerWidth < 900) setExpanded(false);

})();