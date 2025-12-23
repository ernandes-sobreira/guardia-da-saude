/* caderno.js — Guardiãs da Vigilância
   Salva automaticamente inputs/checkboxes/textareas em localStorage
   e oferece Caderno (modal) + Baixar TXT.
*/
(function(){
  const PREFIX = "GV:";

  function keyFor(el){
    // precisa de id fixo. Se não tiver, tenta name. Se não tiver, não salva.
    const id = el.id || el.name;
    if(!id) return null;
    const page = (location.pathname.split("/").pop() || "index.html").replace(/\?.*$/,"");
    return `${PREFIX}${page}::${id}`;
  }

  function saveEl(el){
    const k = keyFor(el);
    if(!k) return;
    const type = (el.type || "").toLowerCase();
    let v = "";
    if(type === "checkbox" || type === "radio"){
      v = el.checked ? "1" : "0";
    } else {
      v = el.value ?? "";
    }
    localStorage.setItem(k, v);
  }

  function loadEl(el){
    const k = keyFor(el);
    if(!k) return;
    const saved = localStorage.getItem(k);
    if(saved === null) return;

    const type = (el.type || "").toLowerCase();
    if(type === "checkbox" || type === "radio"){
      el.checked = saved === "1";
    } else {
      el.value = saved;
    }
  }

  function bindContainer(container){
    if(!container) return;
    const els = container.querySelectorAll("input, textarea, select");
    els.forEach(el=>{
      // só salva se tiver id ou name
      if(!(el.id || el.name)) return;

      loadEl(el);

      // evitar duplicar listener
      if(el.__gvBound) return;
      el.__gvBound = true;

      el.addEventListener("input", ()=>saveEl(el));
      el.addEventListener("change", ()=>saveEl(el));
    });
  }

  function allEntriesText(){
    const keys = Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).sort();
    if(keys.length === 0) return "CADERNO — GUARDIÃS DA VIGILÂNCIA\n\n(sem registros ainda)\n";

    let out = "CADERNO — GUARDIÃS DA VIGILÂNCIA\n\n";
    let currentPage = "";
    keys.forEach(k=>{
      const v = localStorage.getItem(k) ?? "";
      const rest = k.slice(PREFIX.length);
      const [page, field] = rest.split("::");

      if(page !== currentPage){
        currentPage = page;
        out += `\n==============================\nPÁGINA: ${page}\n==============================\n`;
      }
      const prettyVal = (v === "1") ? "✅ marcado" : (v === "0") ? "⬜ não marcado" : v;
      out += `• ${field}: ${prettyVal}\n`;
    });
    return out.trim() + "\n";
  }

  function downloadTXT(){
    const text = allEntriesText();
    const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meu-caderno.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function ensureModal(){
    if(document.getElementById("gv-caderno-modal")) return;

    const modal = document.createElement("div");
    modal.id = "gv-caderno-modal";
    modal.innerHTML = `
      <div id="gv-caderno-backdrop" style="
        position:fixed; inset:0; background:rgba(0,0,0,.35);
        display:none; z-index:9998;
      "></div>

      <div id="gv-caderno-panel" style="
        position:fixed; left:50%; top:50%;
        transform:translate(-50%,-50%);
        width:min(900px, 92vw);
        height:min(80vh, 700px);
        background:rgba(255,255,255,.92);
        border:1px solid rgba(120,20,80,.18);
        border-radius:18px;
        box-shadow:0 24px 80px rgba(120,20,80,.25);
        display:none;
        z-index:9999;
        overflow:hidden;
        backdrop-filter: blur(10px);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
      ">
        <div style="padding:12px 14px; display:flex; gap:10px; align-items:center; justify-content:space-between;
                    border-bottom:1px solid rgba(120,20,80,.12); background:rgba(255,240,248,.8);">
          <div style="font-weight:900; color:#3b0a2a;">📓 Meu Caderno</div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button id="gv-btn-download" style="
              border:0; cursor:pointer; font-weight:900;
              padding:10px 12px; border-radius:12px;
              background:linear-gradient(135deg,#db2777,#8b5cf6);
              color:white;
            ">⬇️ Baixar TXT</button>
            <button id="gv-btn-close" style="
              border:1px solid rgba(120,20,80,.18); cursor:pointer; font-weight:900;
              padding:10px 12px; border-radius:12px;
              background:white; color:#3b0a2a;
            ">✖ Fechar</button>
          </div>
        </div>
        <textarea id="gv-caderno-text" readonly style="
          width:100%; height:calc(100% - 56px);
          border:0; outline:none; padding:14px;
          background:transparent; color:#2a0f22;
          font-size:13px; line-height:1.5;
        "></textarea>
      </div>
    `;
    document.body.appendChild(modal);

    const backdrop = document.getElementById("gv-caderno-backdrop");
    const panel = document.getElementById("gv-caderno-panel");
    const close = document.getElementById("gv-btn-close");
    const dl = document.getElementById("gv-btn-download");

    function hide(){
      backdrop.style.display = "none";
      panel.style.display = "none";
    }
    backdrop.addEventListener("click", hide);
    close.addEventListener("click", hide);
    dl.addEventListener("click", downloadTXT);
  }

  function openCaderno(){
    ensureModal();
    const backdrop = document.getElementById("gv-caderno-backdrop");
    const panel = document.getElementById("gv-caderno-panel");
    const ta = document.getElementById("gv-caderno-text");
    ta.value = allEntriesText();
    backdrop.style.display = "block";
    panel.style.display = "block";
  }

  function installFloatingButton(){
    if(document.getElementById("gv-caderno-fab")) return;

    const btn = document.createElement("button");
    btn.id = "gv-caderno-fab";
    btn.innerHTML = "📓 Caderno";
    btn.style.cssText = `
      position:fixed;
      right:14px;
      bottom:92px; /* acima do seu menu */
      z-index:9997;
      border:0;
      cursor:pointer;
      font-weight:900;
      padding:12px 14px;
      border-radius:14px;
      color:white;
      background:linear-gradient(135deg,#db2777,#8b5cf6);
      box-shadow:0 16px 50px rgba(120,20,80,.28);
    `;
    btn.addEventListener("click", openCaderno);
    document.body.appendChild(btn);
  }

  // API pública (se você quiser usar botão manual)
  window.GV = {
    bind: bindContainer,
    openCaderno,
    downloadTXT
  };

  // Auto: salva tudo que existe na página
  document.addEventListener("DOMContentLoaded", ()=>{
    bindContainer(document);
    installFloatingButton();
  });

})();
