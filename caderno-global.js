/* CADERNO GLOBAL — Guardiãs da Vigilância
   Um único caderno, persistente, simples e confiável
*/

(function(){

  const KEY = "GV_CADERNO_GLOBAL";

  function ensureUI(){
    if(document.getElementById("gv-caderno-modal")) return;

    // Botão flutuante
    const fab = document.createElement("button");
    fab.innerText = "📓 Caderno";
    fab.style.cssText = `
      position:fixed;
      right:16px;
      bottom:96px;
      z-index:9999;
      padding:12px 16px;
      border-radius:16px;
      border:0;
      font-weight:900;
      cursor:pointer;
      color:white;
      background:linear-gradient(135deg,#db2777,#8b5cf6);
      box-shadow:0 16px 40px rgba(120,20,80,.35);
    `;
    fab.onclick = openCaderno;
    document.body.appendChild(fab);

    // Modal
    const modal = document.createElement("div");
    modal.id = "gv-caderno-modal";
    modal.innerHTML = `
      <div id="gv-backdrop" style="
        position:fixed; inset:0;
        background:rgba(0,0,0,.35);
        display:none; z-index:9998;"></div>

      <div id="gv-panel" style="
        position:fixed; left:50%; top:50%;
        transform:translate(-50%,-50%);
        width:min(900px,95vw);
        height:min(80vh,700px);
        background:#fff7fb;
        border-radius:20px;
        box-shadow:0 30px 90px rgba(120,20,80,.35);
        display:none;
        z-index:9999;
        overflow:hidden;
        font-family:system-ui;">
        
        <div style="
          display:flex; justify-content:space-between; align-items:center;
          padding:14px;
          border-bottom:1px solid #f3c6da;
          background:#ffe4f2;">
          <strong>📓 Meu Caderno — Guardiãs da Vigilância</strong>
          <div>
            <button id="gv-download" style="
              padding:8px 12px;
              border-radius:12px;
              border:0;
              font-weight:800;
              cursor:pointer;
              color:white;
              background:#db2777;">⬇️ Baixar TXT</button>
            <button id="gv-close" style="
              padding:8px 12px;
              border-radius:12px;
              border:1px solid #db2777;
              background:white;
              font-weight:800;
              cursor:pointer;">✖</button>
          </div>
        </div>

        <textarea id="gv-text" placeholder="Escreva aqui suas anotações..."
          style="
            width:100%; height:calc(100% - 64px);
            border:0; padding:16px;
            outline:none; resize:none;
            font-size:14px; line-height:1.6;
            background:#fff;">
        </textarea>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("gv-backdrop").onclick = closeCaderno;
    document.getElementById("gv-close").onclick = closeCaderno;
    document.getElementById("gv-download").onclick = downloadTXT;

    const ta = document.getElementById("gv-text");
    ta.value = localStorage.getItem(KEY) || "";
    ta.addEventListener("input", ()=> {
      localStorage.setItem(KEY, ta.value);
    });
  }

  function openCaderno(){
    document.getElementById("gv-backdrop").style.display="block";
    document.getElementById("gv-panel").style.display="block";
  }

  function closeCaderno(){
    document.getElementById("gv-backdrop").style.display="none";
    document.getElementById("gv-panel").style.display="none";
  }

  function downloadTXT(){
    const text = localStorage.getItem(KEY) || "";
    const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meu-caderno.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  document.addEventListener("DOMContentLoaded", ensureUI);

})();
