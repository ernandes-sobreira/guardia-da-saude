// salvar.js — Guardiãs da Vigilância (autosave simples)
// Salva checkbox e textarea com data-save="1" e data-key="..."

function gvPrefix(){
  const page = location.pathname.split("/").pop() || "index.html";
  return "gv_v1__" + page + "__";
}
function gvKey(key){ return gvPrefix() + key; }

function gvRestore(){
  document.querySelectorAll('[data-save="1"]').forEach(el=>{
    const key = el.getAttribute("data-key");
    if(!key) return;

    const v = localStorage.getItem(gvKey(key));
    if(v === null) return;

    if(el.type === "checkbox") el.checked = (v === "1");
    else el.value = v;
  });
}

function gvBind(){
  document.querySelectorAll('[data-save="1"]').forEach(el=>{
    const key = el.getAttribute("data-key");
    if(!key) return;

    const save = ()=>{
      if(el.type === "checkbox"){
        localStorage.setItem(gvKey(key), el.checked ? "1" : "0");
      }else{
        localStorage.setItem(gvKey(key), el.value || "");
      }
    };

    el.addEventListener("input", save);
    el.addEventListener("change", save);
  });
}

// Função que você pode chamar depois que trocar o conteúdo com innerHTML
window.gvAttachAutosave = function(){
  gvRestore();
  gvBind();
};

// Rodar ao abrir a página
document.addEventListener("DOMContentLoaded", ()=>{
  window.gvAttachAutosave();
});
