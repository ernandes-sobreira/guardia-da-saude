// caderno.js — Guardiãs da Vigilância
// 1) Auto-salva campos marcados com data-save="1" data-key="..."
// 2) Gera um TXT único com tudo e baixa no celular

const GV = {
  prefix: "GV_CADERNO_V1__",

  // chave final no localStorage
  K(page, key){ return `${this.prefix}${page}__${key}`; },

  pageName(){
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  },

  // salva 1 campo
  saveField(el){
    const page = this.pageName();
    const key = el.getAttribute("data-key");
    if(!key) return;

    const label = el.getAttribute("data-label") || key;

    const payload = {
      page,
      key,
      label,
      type: el.type === "checkbox" ? "checkbox" : "text",
      value: el.type === "checkbox" ? (el.checked ? "1" : "0") : (el.value || ""),
      ts: new Date().toISOString()
    };

    localStorage.setItem(this.K(page, key), JSON.stringify(payload));
  },

  // restaura tudo da página atual
  restorePage(){
    const page = this.pageName();

    document.querySelectorAll('[data-save="1"]').forEach(el=>{
      const key = el.getAttribute("data-key");
      if(!key) return;

      const raw = localStorage.getItem(this.K(page, key));
      if(!raw) return;

      try{
        const payload = JSON.parse(raw);
        if(payload.type === "checkbox") el.checked = payload.value === "1";
        else el.value = payload.value || "";
      }catch(e){}
    });
  },

  // liga autosave nos campos
  bindPage(){
    document.querySelectorAll('[data-save="1"]').forEach(el=>{
      const handler = ()=>this.saveField(el);
      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
  },

  // você chama isso depois de trocar innerHTML (Teoria/Campo etc.)
  attach(){
    this.restorePage();
    this.bindPage();
  },

  // pega tudo salvo (todas as páginas)
  getAllSaved(){
    const out = [];
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(!k || !k.startsWith(this.prefix)) continue;
      const raw = localStorage.getItem(k);
      if(!raw) continue;
      try{ out.push(JSON.parse(raw)); }catch(e){}
    }
    // ordena por página e rótulo
    out.sort((a,b)=>{
      if(a.page !== b.page) return a.page.localeCompare(b.page);
      return (a.label||"").localeCompare(b.label||"");
    });
    return out;
  },

  // cria TXT bonitão
  buildTXT(){
    const all = this.getAllSaved();
    if(all.length === 0) return "Caderno vazio (nenhuma anotação salva ainda).";

    const now = new Date();
    let txt = `GUARDIÃS DA VIGILÂNCIA — CADERNO ÚNICO\n`;
    txt += `Gerado em: ${now.toLocaleString()}\n`;
    txt += `Obs.: Este caderno foi salvo no seu dispositivo (navegador).\n`;
    txt += `------------------------------------------------------------\n\n`;

    let currentPage = null;

    for(const item of all){
      if(item.page !== currentPage){
        currentPage = item.page;
        txt += `\n### PÁGINA: ${currentPage}\n`;
        txt += `------------------------------------------------------------\n`;
      }

      const mark = (item.type === "checkbox")
        ? (item.value === "1" ? "[X]" : "[ ]")
        : "";

      const value = (item.type === "checkbox")
        ? ""
        : (item.value || "").trim();

      if(item.type === "checkbox"){
        txt += `${mark} ${item.label}\n`;
      }else{
        txt += `- ${item.label}:\n${value}\n\n`;
      }
    }

    return txt.trim();
  },

  // baixa TXT
  downloadTXT(filename="caderno-guardiãs.txt"){
    const txt = this.buildTXT();
    const blob = new Blob([txt], {type:"text/plain;charset=utf-8"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(()=>URL.revokeObjectURL(url), 500);
  }
};

// expõe no navegador
window.GV = GV;

// liga automático ao abrir a página
document.addEventListener("DOMContentLoaded", ()=>GV.attach());
