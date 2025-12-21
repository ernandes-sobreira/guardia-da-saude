(async function () {
  // 1) Se tiver mais de um app-menu, mantém só o primeiro
  const mounts = Array.from(document.querySelectorAll("#app-menu"));
  if (mounts.length === 0) return;
  const mount = mounts[0];
  mounts.slice(1).forEach(m => m.remove());

  // 2) Remove qualquer footer/menu automático já inserido (evita duplicar)
  document.querySelectorAll(".auto-footer").forEach(el => el.remove());

  // 3) Injeta menu.css automaticamente (se você estiver usando)
  if (!document.getElementById("menu-css")) {
    const link = document.createElement("link");
    link.id = "menu-css";
    link.rel = "stylesheet";
    link.href = "menu.css";
    document.head.appendChild(link);
  }

  // 4) Página atual
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
  let html = "";
  const res = await fetch("menu.html", { cache: "no-store" });
  html = await res.text();

  // 6) Insere
  mount.innerHTML = `<footer class="auto-footer compact">${html}</footer>`;

  // 7) Marca ativo
  mount.querySelectorAll("a[data-page]").forEach(a => {
    if (a.getAttribute("data-page") === activeId) a.classList.add("active");
  });

  // 8) Toggle global (se menu.html tiver o botão)
  window.toggleMenu = function () {
    const f = document.querySelector(".auto-footer");
    if (f) f.classList.toggle("compact");
  };
})();