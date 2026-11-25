/* Tambahan papan: timeline satu kolom dan tab Proposal. Dimuat setelah skrip utama. */
(function(){
try{
const css=document.createElement("style");
css.textContent=[
".tl2{border-left:1px solid var(--rule);margin-left:6px;padding-left:28px}",
".s2{position:relative;padding:0 0 40px}",
".s2:before{content:'';position:absolute;left:-33px;top:7px;width:9px;height:9px;border-radius:50%;background:var(--fg)}",
".s2.now:before{background:var(--gold);box-shadow:0 0 0 4px var(--bg),0 0 0 5px var(--gold)}",
".s2k{font:500 12px var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--gold);margin:0}",
".s2 h3{font:400 24px/1.2 var(--head);letter-spacing:.14em;text-transform:uppercase;margin:2px 0 6px}",
".s2l{font-size:14px;color:var(--muted);margin:0 0 8px;max-width:70ch}",
".s2p{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--muted);margin:0 0 10px}",
".s2p b{flex:0 0 120px;height:3px;background:var(--line);display:block}",
".s2p b i{display:block;height:100%;background:var(--done)}",
".s2r{display:grid;grid-template-columns:56px 10px minmax(0,1fr) auto;gap:0 10px;align-items:baseline;padding:7px 0;border-top:1px solid var(--line);font-size:15px}",
".s2r .d{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}",
".s2r i{width:8px;height:8px;border-radius:50%;align-self:center}",
".s2r .v{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);text-align:right}",
".s2r.done .n{color:var(--muted);text-decoration:line-through}",
".s2r.late .v,.s2r.late .d{color:var(--late);font-weight:700}",
".s2e{font-size:14px;color:var(--muted);margin:0;border-top:1px solid var(--line);padding-top:8px}",
"@media (max-width:640px){.s2r{grid-template-columns:48px 10px 1fr}.s2r .v{grid-column:3;text-align:left;text-transform:none;letter-spacing:0}}",
".pf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 24px;margin:0 0 8px}",
".pf label{display:block;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}",
".pf label.w{grid-column:1/-1}",
".pf input,.pf select{margin-top:4px;font-size:15px}",
".pf input[type=file]{border-bottom:0;padding:6px 0}",
".pf .go{grid-column:1/-1}",
".pf button{font:500 12px var(--body);letter-spacing:.16em;text-transform:uppercase;padding:9px 20px;border:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer}",
".pf button:hover:not(:disabled){background:var(--fg);color:var(--bg)}",
".pf button:disabled{opacity:.5;cursor:wait}",
".pm{font-size:14px;color:var(--muted);margin:0 0 36px;min-height:1.4em}",
".pr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)}",
".pr a{color:var(--fg);overflow-wrap:anywhere;font-size:16px}",
".pr small{grid-column:1;color:var(--muted);font-size:13px}",
".pr .x{grid-column:2;grid-row:1/3}",
".pr .x.ask{color:var(--late);font-size:13px;font-weight:700}",
"@media (max-width:640px){.pf{grid-template-columns:1fr}}"
].join("\n");
document.head.append(css);

/* Timeline satu kolom */
window.renderTimeline=function(){
  const box=$("#timeline"); if(!box)return; box.replaceChildren();
  const t0=today();
  const stageOf=t=>{if(!t.due)return 0;for(let i=0;i<STAGES.length;i++)if(t.due<=STAGES[i][1])return i;return STAGES.length-1};
  const nowIdx=(()=>{for(let i=0;i<STAGES.length;i++)if(t0<=STAGES[i][1])return i;return -1})();
  const wrap=el("div",{class:"tl2"});
  STAGES.forEach((s,i)=>{
    const items=tasks.filter(t=>stageOf(t)===i).sort((a,b)=>(a.due||"")<(b.due||"")?-1:(a.due||"")>(b.due||"")?1:0);
    const done=items.filter(t=>t.status==="selesai").length;
    const pct=items.length?Math.round(done/items.length*100):0;
    const rows=items.map(t=>{
      const late=t.status!=="selesai"&&t.due&&t.due<t0;
      const dv=DIVS.find(v=>v.id===t.division);
      const col=t.status==="selesai"?"var(--done)":t.status==="jalan"?"var(--run)":"var(--todo)";
      return el("div",{class:"s2r"+(t.status==="selesai"?" done":"")+(late?" late":"")},
        el("span",{class:"d",text:fmt(t.due)||"-"}),el("i",{style:"background:"+col}),
        el("span",{class:"n",text:t.title}),el("span",{class:"v",text:(dv?dv.name:"")+(late?" · terlambat":"")}));
    });
    wrap.append(el("section",{class:"s2"+(i===nowIdx?" now":"")},
      el("p",{class:"s2k",text:"Tahap "+(i+1)+" · "+s[2]+(i===nowIdx?" · sedang berjalan":"")}),
      el("h3",{text:s[3]}),
      el("p",{class:"s2l",text:s[4]}),
      el("div",{class:"s2p"},el("b",{},el("i",{style:"width:"+pct+"%"})),el("span",{text:items.length?done+" dari "+items.length+" tugas selesai":"Belum ada tugas"})),
      ...(rows.length?rows:[el("p",{class:"s2e",text:"Belum ada tugas bertenggat di tahap ini."})])));
  });
  box.append(el("p",{class:"tlkey",text:"Tugas masuk ke tahap sesuai tenggatnya. Titik hijau selesai, emas sedang dikerjakan, abu-abu belum. Tahap ikut berubah saat panitia mengubah tenggat."}),wrap);
};
renderTimeline();

/* Tab Proposal */
const BUCKET="proposal";
const sb2=window.supabase.createClient(SB_URL,SB_KEY);
const GROUPS=DIVS.map(v=>({id:v.id,name:v.name})).concat([{id:"umum",name:"Proposal pameran (umum)"}]);
const tabs=$(".tabs");
const tabBtn=el("button",{class:"tab",id:"tab-proposal","aria-pressed":"false",type:"button",text:"Proposal"});
tabs.append(tabBtn);
const sel=el("select",{id:"pf-div","aria-label":"Seksi"},...GROUPS.map(g=>el("option",{value:g.id,text:g.name})));
const inTitle=el("input",{type:"text",id:"pf-title",maxlength:"160",placeholder:"Contoh: Draf proposal sponsor, versi 1"});
const inBy=el("input",{type:"text",id:"pf-by",maxlength:"80",placeholder:"Nama kamu"});
try{inBy.value=localStorage.getItem("pf-by")||""}catch(e){}
const inFile=el("input",{type:"file",id:"pf-file",accept:".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"});
const btn=el("button",{type:"submit",text:"Unggah"});
const msgEl=el("p",{class:"pm",role:"status"});
const form=el("form",{class:"pf"},
  el("label",{},"Seksi",sel),el("label",{},"Nama pengirim",inBy),
  el("label",{class:"w"},"Judul atau keterangan",inTitle),
  el("label",{class:"w"},"Berkas (PDF, Word, PowerPoint, Excel, gambar, atau ZIP, maksimal 50 MB)",inFile),
  el("div",{class:"go"},btn));
const list2=el("div",{id:"pl"});
const panel=el("div",{id:"proposal",hidden:""},
  el("p",{class:"sub2",text:"Kumpulkan proposal"}),form,msgEl,list2);
$("#timeline").after(panel);
const msg=m=>{msgEl.textContent=m};
let subs=[];
const size=n=>n>=1048576?(n/1048576).toFixed(1)+" MB":Math.max(1,Math.round(n/1024))+" KB";
const dfmt=s=>new Date(s).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
function renderSubs(){
  list2.replaceChildren();
  const any=GROUPS.some(g=>subs.some(x=>x.division===g.id));
  if(!any){list2.append(el("div",{class:"empty",text:"Belum ada berkas yang dikirim."}));return}
  GROUPS.forEach(g=>{
    const rows=subs.filter(x=>x.division===g.id); if(!rows.length)return;
    const sec=el("section",{class:"div"},el("div",{class:"dh"},el("h2",{text:g.name}),el("div",{class:"pic",text:rows.length+" berkas"})));
    rows.forEach(x=>{
      const url=sb2.storage.from(BUCKET).getPublicUrl(x.file_path).data.publicUrl;
      let armed=false;
      const del=el("button",{type:"button",class:"x","aria-label":"Hapus berkas",title:"Hapus berkas",text:"×"});
      del.addEventListener("click",async()=>{
        if(!armed){armed=true;del.textContent="Yakin hapus?";del.classList.add("ask");setTimeout(()=>{armed=false;del.textContent="×";del.classList.remove("ask")},4000);return}
        await sb2.storage.from(BUCKET).remove([x.file_path]);
        const r=await sb2.from("submissions").delete().eq("id",x.id);
        if(r.error)toast("Gagal menghapus. Coba lagi."); else loadSubs();
      });
      sec.append(el("div",{class:"pr"},
        el("a",{href:url,target:"_blank",rel:"noopener",text:x.title||x.file_name}),del,
        el("small",{text:x.file_name+" · "+size(x.size)+" · "+(x.uploader||"tanpa nama")+" · "+dfmt(x.created_at)})));
    });
    list2.append(sec);
  });
}
async function loadSubs(){
  const r=await sb2.from("submissions").select("*").order("created_at",{ascending:false});
  if(r.error){msg("Gagal memuat daftar berkas.");return}
  subs=r.data; renderSubs();
}
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const f=inFile.files[0];
  if(!f){msg("Pilih berkas dulu.");return}
  if(f.size>50*1024*1024){msg("Berkas lebih dari 50 MB.");return}
  btn.disabled=true; msg("Mengunggah…");
  const path=sel.value+"/"+Date.now()+"-"+f.name.replace(/[^\w.\-]+/g,"_");
  const up=await sb2.storage.from(BUCKET).upload(path,f,{contentType:f.type||"application/octet-stream"});
  if(up.error){msg("Gagal mengunggah: "+up.error.message);btn.disabled=false;return}
  const ins=await sb2.from("submissions").insert({division:sel.value,title:inTitle.value.trim(),uploader:inBy.value.trim(),file_name:f.name,file_path:path,size:f.size});
  if(ins.error){await sb2.storage.from(BUCKET).remove([path]);msg("Gagal menyimpan data: "+ins.error.message);btn.disabled=false;return}
  try{localStorage.setItem("pf-by",inBy.value.trim())}catch(x){}
  inFile.value=""; inTitle.value=""; msg("Terkirim. Terima kasih."); btn.disabled=false; loadSubs();
});
const baseSet=window.setView;
window.setView=function(v){
  const p=v==="proposal";
  baseSet(p?"daftar":v);
  panel.hidden=!p;
  if(p){$("#chips").hidden=true;$("#list").hidden=true;$("#timeline").hidden=true;$("#tab-daftar").setAttribute("aria-pressed","false")}
  tabBtn.setAttribute("aria-pressed",String(p));
};
tabBtn.addEventListener("click",()=>setView("proposal"));
loadSubs();
sb2.channel("subs-live").on("postgres_changes",{event:"*",schema:"public",table:"submissions"},loadSubs).subscribe();
}catch(err){console.error("tambahan.js",err)}
})();
/* Progres hanya di halaman awal, dan klik tim menggulir ke seksinya. */
(function(){
try{
const homeSel=["#sum","#bar","#teams"];
function showHome(show){
  homeSel.forEach(s=>{const e=$(s);if(e)e.hidden=!show});
  const t=$("#teams"); const h=t&&t.previousElementSibling; if(h)h.hidden=!show;
}
const sv=window.setView;
window.setView=function(v){sv(v);showHome(v==="daftar"||!v)};
const rd=window.render;
window.render=function(){
  rd();
  const ids=(filter!=="semua")?[filter]:DIVS.map(d=>d.id);
  [...document.querySelectorAll("#list section.div")].forEach((s,i)=>{if(ids[i])s.id="div-"+ids[i]});
  [...document.querySelectorAll("#teams .team")].forEach((b,i)=>{
    const nb=b.cloneNode(true); b.replaceWith(nb);
    nb.addEventListener("click",()=>{
      filter="semua"; setView("daftar"); window.render();
      const target=document.getElementById("div-"+DIVS[i].id);
      if(target)target.scrollIntoView({behavior:"smooth",block:"start"});
    });
  });
};
window.render();
}catch(err){console.error("tambahan.js bagian 2",err)}
})();
