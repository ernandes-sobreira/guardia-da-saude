/* menu.js — injeta menu.html e marca a aba ativa */
(async function () {
  const mount = document.getElementById("app-menu");
  if (!mount) return;

  // Descobre qual página está aberta
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  // Mapeie aqui os nomes dos seus arquivos → "page id"
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

  // Carrega o template
  let html = "";
  try {
    const res = await fetch("menu.html", { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao buscar menu.html");
    html = await res.text();
  } catch (e) {
    // fallback caso o fetch falhe
    html = `
      <nav class="foot" aria-label="Menu">
        <a data-page="index" href="index.html">🏠 Início</a>
        <a data-page="teoria" href="teoria.html">🧠 Teoria</a>
        <a data-page="campo" href="campo.html">🌱 Campo</a>
        <a data-page="protocolo" href="indice-predial.html">🏢 Protocolo</a>
        <a data-page="quiz" href="quiz.html">🎯 Desafio</a>
        <a data-page="lab" href="laboratorio.html">🧬 Lab</a>
        <a data-page="prof" href="roteiro-professor.html">👩‍🏫 Prof</a>
      </nav>
    `;
  }

  // Injeta dentro de um footer fixo
  mount.innerHTML = `
    <footer class="auto-footer">
      ${html}
    </footer>
  `;

  // Marca item ativo
  const links = mount.querySelectorAll("a[data-page]");
  links.forEach(a => {
    const id = a.getAttribute("data-page");
    if (id === activeId) a.classList.add("active");
  });

  // Acessibilidade: marca página atual
  const activeLink = mount.querySelector("a.active");
  if (activeLink) activeLink.setAttribute("aria-current", "page");
})();