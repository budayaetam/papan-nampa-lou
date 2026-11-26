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
/* Hitung mundur besar */
(function(){try{
var css=document.createElement('style');
css.textContent='.cd{margin:22px 0 10px;padding:22px 0 20px;border-top:3px solid var(--red,#b3261e);border-bottom:1px solid var(--rule,#ddd)}.cd .k{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--red,#b3261e);font-weight:700;margin:0 0 10px}.cd .big{display:flex;align-items:flex-end;gap:clamp(14px,4vw,36px);flex-wrap:wrap}.cd .u{display:flex;flex-direction:column}.cd .n{font-family:"EB Garamond",serif;font-weight:500;line-height:.9;font-variant-numeric:tabular-nums;font-size:clamp(34px,8vw,64px);color:var(--fg)}.cd .u.d .n{font-size:clamp(88px,26vw,170px);color:var(--red,#b3261e);font-weight:600}.cd .l{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted);margin-top:8px}.cd .urg{font-style:italic;color:var(--red,#b3261e);font-size:clamp(17px,3.8vw,24px);margin:18px 0 4px}.cd .sb{color:var(--muted);font-size:14px;margin:0}';
document.head.appendChild(css);
var box=document.createElement('div');box.className='cd';
box.innerHTML='<p class="k">Menuju pembukaan</p><div class="big"><div class="u d"><span class="n" id="cd-d">0</span><span class="l">Hari</span></div><div class="u"><span class="n" id="cd-j">00</span><span class="l">Jam</span></div><div class="u"><span class="n" id="cd-m">00</span><span class="l">Menit</span></div><div class="u"><span class="n" id="cd-s">00</span><span class="l">Detik</span></div></div><p class="urg" id="cd-u"></p><p class="sb" id="cd-b"></p>';
var note=document.querySelector('.note');
if(note&&note.parentNode){note.parentNode.insertBefore(box,note);note.style.display='none';}else{document.body.insertBefore(box,document.body.firstChild);}
function p2(n){return (n<10?'0':'')+n}
function tick(){var ms=Math.max(0,OPEN-new Date());var d=Math.floor(ms/864e5),j=Math.floor(ms%864e5/36e5),m=Math.floor(ms%36e5/6e4),s=Math.floor(ms%6e4/1e3);
document.getElementById('cd-d').textContent=d;document.getElementById('cd-j').textContent=p2(j);document.getElementById('cd-m').textContent=p2(m);document.getElementById('cd-s').textContent=p2(s);
var t=(typeof tasks!=='undefined'&&tasks)?tasks:[];var sisa=t.filter(function(x){return x.status!=='selesai'}).length;var now=new Date();var iso=now.getFullYear()+'-'+p2(now.getMonth()+1)+'-'+p2(now.getDate());var tel=t.filter(function(x){return x.status!=='selesai'&&x.due&&x.due<iso}).length;
document.getElementById('cd-u').textContent=t.length?('Tinggal '+d+' hari. Masih '+sisa+' dari '+t.length+' tugas belum selesai.'):('Tinggal '+d+' hari.');
document.getElementById('cd-b').textContent=(tel?tel+' tugas sudah lewat tenggat. ':'')+'Pembukaan: Kamis, 7 Januari 2027.';}
tick();setInterval(tick,1000);
}catch(e){console.error('countdown',e)}})();
/* Bagian 4: timeline zigzag, tengah hitung mundur, tambah dan hapus tugas, pratinjau proposal */
(function(){try{
var css=document.createElement('style');
css.textContent='.cd{text-align:center}.cd .big{justify-content:center}.pvb{font:500 11px var(--body);letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--fg);background:transparent;color:var(--fg);padding:3px 10px;margin:0 8px;cursor:pointer}.pvb:hover{background:var(--fg);color:var(--bg)}.pv{margin:8px 0 18px}.pv iframe{width:100%;height:72vh;border:1px solid var(--rule);background:#fff}.pv img{max-width:100%;border:1px solid var(--rule)}.row .xx{font-size:22px;padding:0 6px;color:var(--fg)}.row .xx.arm{font-size:12px;font-weight:700;letter-spacing:.06em;white-space:nowrap;margin-left:-44px;color:var(--late,#b3261e)}';
document.head.appendChild(css);
window.renderTimeline=function(){
  var box=$('#timeline'); if(!box)return; box.replaceChildren();
  var t0=today();
  var stageOf=function(t){if(!t.due)return 0;for(var i=0;i<STAGES.length;i++)if(t.due<=STAGES[i][1])return i;return STAGES.length-1};
  var nowIdx=(function(){for(var i=0;i<STAGES.length;i++)if(t0<=STAGES[i][1])return i;return -1})();
  var tl=el('div',{class:'tl'});
  STAGES.forEach(function(s,i){
    var items=tasks.filter(function(t){return stageOf(t)===i}).sort(function(a,b){return (a.due||'')<(b.due||'')?-1:(a.due||'')>(b.due||'')?1:0});
    var done=items.filter(function(t){return t.status==='selesai'}).length;
    var ul=el('ul',{},...items.map(function(t){
      var late=t.status!=='selesai'&&t.due&&t.due<t0;
      var dv=DIVS.find(function(v){return v.id===t.division});
      var col=t.status==='selesai'?'var(--done)':t.status==='jalan'?'var(--run)':'var(--todo)';
      return el('li',{class:(t.status==='selesai'?'done':'')+(late?' late':'')},el('i',{style:'background:'+col}),el('span',{},document.createTextNode(t.title+' '),el('small',{text:(dv?dv.name:'')+(t.due?' · '+fmt(t.due):'')+(late?' · terlambat':'')})));
    }));
    tl.append(el('div',{class:'it '+(i%2===0?'r':'l')+(i===nowIdx?' now':'')},el('div',{class:'when',text:s[2].toUpperCase()}),el('div',{class:'body'},el('p',{class:'sub',text:'Tahap '+(i+1)+(i===nowIdx?' · sedang berjalan':'')}),el('h3',{text:s[3]}),el('p',{class:'lead',text:s[4]}),el('p',{class:'prog',text:items.length?done+' dari '+items.length+' tugas selesai':'Belum ada tugas bertenggat di tahap ini.'}),ul)));
  });
  box.append(el('p',{class:'tlkey',text:'Tugas masuk ke tahap sesuai tenggatnya. Titik hijau selesai, emas sedang dikerjakan, abu-abu belum. Tahap ikut berubah saat panitia mengubah tenggat.'}),tl);
};
window.renderTimeline();
}catch(e){console.error('bagian4 timeline',e)}
try{
var sb4=window.supabase.createClient(SB_URL,SB_KEY);var tm=null;
var refresh=function(){clearTimeout(tm);tm=setTimeout(function(){sb4.from('tasks').select('*').then(function(r){if(r.error||!r.data)return;tasks=r.data;window.render()})},350)};
var c0=db.collection,d0=db.doc;
db.collection=function(){var c=c0.apply(db,arguments);var a=c.add;if(a)c.add=function(o){return a(o).then(function(){toast('Tugas ditambahkan.');refresh()},function(e){toast('Gagal menambah tugas.');throw e})};return c};
db.doc=function(){var d=d0.apply(db,arguments);var u=d.update,x=d.delete;d.update=function(q){return u(q).then(refresh)};d.delete=function(){return x().then(function(){toast('Tugas dihapus.');refresh()},function(e){toast('Gagal menghapus tugas.');throw e})};return d};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.row .xx');if(!b)return;if(b.getAttribute('data-arm')!=='1'){e.stopImmediatePropagation();e.preventDefault();b.setAttribute('data-arm','1');b.classList.add('arm');b.textContent='Hapus?';setTimeout(function(){b.removeAttribute('data-arm');b.classList.remove('arm');b.textContent='×'},3000)}},true);
}catch(e){console.error('bagian4 tugas',e)}
try{
var pvAll=function(){var pl=document.getElementById('pl');if(!pl)return;pl.querySelectorAll('.pr').forEach(function(pr){if(pr.getAttribute('data-pv'))return;pr.setAttribute('data-pv','1');var a=pr.querySelector('a');if(!a)return;var url=a.href;var ext=(url.split('?')[0].split('.').pop()||'').toLowerCase();var kind=ext==='pdf'?'pdf':/^(png|jpe?g)$/.test(ext)?'img':/^(docx?|pptx?|xlsx?)$/.test(ext)?'off':'';if(!kind)return;var b=document.createElement('button');b.type='button';b.className='pvb';b.textContent='Pratinjau';a.insertAdjacentElement('afterend',b);b.addEventListener('click',function(){var nx=pr.nextElementSibling;if(nx&&nx.classList.contains('pv')){nx.remove();b.textContent='Pratinjau';return}var box=document.createElement('div');box.className='pv';if(kind==='img'){var im=document.createElement('img');im.src=url;im.alt='Pratinjau';box.appendChild(im)}else{var fr=document.createElement('iframe');fr.src=kind==='pdf'?url:'https://docs.google.com/viewer?embedded=true&url='+encodeURIComponent(url);fr.title='Pratinjau berkas';box.appendChild(fr)}pr.insertAdjacentElement('afterend',box);b.textContent='Tutup'})})};
var pp=document.getElementById('proposal');if(pp){new MutationObserver(pvAll).observe(pp,{childList:true,subtree:true});pvAll()}
}catch(e){console.error('bagian4 proposal',e)}
})();
/* Bagian 5: tugas selesai turun ke bawah, peta hubungan antar tim */
(function(){try{
var st=document.createElement('style');
st.textContent='.row.s-selesai .ti{text-decoration:line-through;color:var(--muted)}.row.s-selesai{opacity:.75}';
document.head.appendChild(st);
var r0=window.render;
window.render=function(){var o=r0.apply(this,arguments);try{document.querySelectorAll('#list section.div').forEach(function(sec){var add=sec.querySelector('.add');if(!add)return;sec.querySelectorAll('.row.s-selesai').forEach(function(r){sec.insertBefore(r,add)})})}catch(e){console.error('sink',e)}return o};
window.render();
}catch(e){console.error('bagian5 sink',e)}
try{
var N={inti:'Inti',kurasi:'Kurasi',pdd:'PDD',desain:'Desain',humas:'Humas',perkap:'Perkap',keamanan:'Keamanan',registrasi:'Registrasi',talkshow:'Talkshow',workshop:'Workshop'};
var L=[['humas','pdd','Publikasi media sosial, teaser comingsoon, dan testimoni pameran'],['humas','desain','Poster, undangan, dan materi publikasi'],['humas','registrasi','Konfirmasi kehadiran sekolah dan data pendaftar'],['humas','workshop','Data jumlah siswa SMK yang ikut workshop'],['humas','talkshow','Undangan dan ucapan terima kasih untuk narasumber'],['pdd','desain','Konten comingsoon, key visual, dan dekorasi Domain'],['pdd','kurasi','Link submission karya dan dokumentasi karya'],['kurasi','desain','Label karya, kode karya, dan katalog'],['kurasi','perkap','Mapping Domain dan pemasangan karya di panel'],['perkap','desain','Banner dan backdrop yang dipasang di Domain'],['perkap','keamanan','Kunci Domain dan penjagaan peralatan'],['perkap','talkshow','Sound, mikrofon, dan layar'],['perkap','workshop','Proyektor dan perangkat kerja workshop'],['registrasi','keamanan','Alur masuk pengunjung dan aturan kunjungan'],['registrasi','workshop','Daftar hadir peserta workshop'],['registrasi','talkshow','Daftar hadir peserta talkshow'],['registrasi','desain','Name tag panitia dan sertifikat peserta'],['talkshow','workshop','Jadwal 8 dan 9 Januari, pembagian ruang dan waktu']];
var ord=['humas','pdd','desain','kurasi','perkap','keamanan','registrasi','workshop','talkshow'];
var pc=document.createElement('style');
pc.textContent='#peta{margin-bottom:28px}#peta .pk{font-size:14px;color:var(--muted);text-align:center;margin:0 auto 18px;max-width:62ch}#peta svg{display:block;width:100%;max-width:640px;margin:0 auto}#peta .ln{stroke:var(--rule);stroke-width:1.2}#peta .sp{stroke:var(--line);stroke-width:1;stroke-dasharray:3 4}#peta .nd{cursor:pointer}#peta .nd circle{fill:var(--bg);stroke:var(--fg);stroke-width:1.2}#peta .nd text{font:500 11px var(--body);letter-spacing:.08em;text-transform:uppercase;fill:var(--fg);text-anchor:middle;dominant-baseline:central;pointer-events:none}#peta line.on{stroke:var(--gold);stroke-width:2.4}#peta .nd.on circle{stroke:var(--gold);stroke-width:2.4}#peta .dim{opacity:.18}#peta .mp{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:26px 40px;margin-top:30px}#peta .mp h3{font:400 20px var(--head);letter-spacing:.14em;text-transform:uppercase;margin:0 0 6px}#peta .mp ul{list-style:none;margin:0;padding:0;font-size:14px}#peta .mp li{padding:5px 0;border-top:1px solid var(--line)}#peta .mp li span{color:var(--muted)}#peta .mp section.on{outline:1px solid var(--gold);outline-offset:8px}';
document.head.appendChild(pc);
var NS='http://www.w3.org/2000/svg';
function pos(id){if(id==='inti')return[320,320];var i=ord.indexOf(id),a=(-90+i*360/9)*Math.PI/180;return[320+240*Math.cos(a),320+240*Math.sin(a)]}
function se(n,at){var e=document.createElementNS(NS,n);for(var k in at)e.setAttribute(k,at[k]);return e}
var peta=document.createElement('div');peta.id='peta';peta.hidden=true;
var k=document.createElement('p');k.className='pk';k.textContent='Klik satu tim untuk melihat tim mana saja yang berkaitan dengannya. Hubungan ini disusun dari isi tugas. Garis putus-putus berarti Inti mengoordinasi semua seksi.';peta.appendChild(k);
var svg=se('svg',{viewBox:'0 0 640 640',role:'img','aria-label':'Peta hubungan antar tim panitia'});
var lines=[];
ord.forEach(function(id){var p=pos(id),q=pos('inti');var l=se('line',{x1:q[0],y1:q[1],x2:p[0],y2:p[1],class:'sp'});l.setAttribute('data-a','inti');l.setAttribute('data-b',id);svg.appendChild(l);lines.push(l)});
L.forEach(function(x){var p=pos(x[0]),q=pos(x[1]);var l=se('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1],class:'ln'});l.setAttribute('data-a',x[0]);l.setAttribute('data-b',x[1]);svg.appendChild(l);lines.push(l)});
var nodes={};
['inti'].concat(ord).forEach(function(id){var p=pos(id);var g=se('g',{class:'nd'});g.appendChild(se('circle',{cx:p[0],cy:p[1],r:id==='inti'?52:46}));var t=se('text',{x:p[0],y:p[1]});t.textContent=N[id];g.appendChild(t);g.addEventListener('click',function(){hl(cur===id?null:id)});svg.appendChild(g);nodes[id]=g});
peta.appendChild(svg);
var mp=document.createElement('div');mp.className='mp';var secs={};
['inti'].concat(ord).forEach(function(id){var s=document.createElement('section');var h=document.createElement('h3');h.textContent=N[id];s.appendChild(h);var ul=document.createElement('ul');
if(id==='inti'){var li=document.createElement('li');li.innerHTML='<b>Semua seksi</b> <span>Rapat koordinasi tiap pekan, izin Domain, dan anggaran Rp15 juta</span>';ul.appendChild(li)}else{var li0=document.createElement('li');li0.innerHTML='<b>Inti</b> <span>Koordinasi, anggaran, dan izin</span>';ul.appendChild(li0)}
L.forEach(function(x){if(x[0]!==id&&x[1]!==id)return;var o=x[0]===id?x[1]:x[0];var li=document.createElement('li');var b=document.createElement('b');b.textContent=N[o];var sp=document.createElement('span');sp.textContent=' '+x[2];li.appendChild(b);li.appendChild(sp);ul.appendChild(li)});
s.appendChild(ul);mp.appendChild(s);secs[id]=s});
peta.appendChild(mp);
var cur=null;
function hl(id){cur=id;lines.forEach(function(l){var a=l.getAttribute('data-a'),b=l.getAttribute('data-b');var on=id&&(a===id||b===id);l.classList.toggle('on',!!on);l.classList.toggle('dim',!!id&&!on)});var rel={};if(id){rel[id]=1;lines.forEach(function(l){var a=l.getAttribute('data-a'),b=l.getAttribute('data-b');if(a===id)rel[b]=1;if(b===id)rel[a]=1})}for(var n in nodes){nodes[n].classList.toggle('on',n===id);nodes[n].classList.toggle('dim',!!id&&!rel[n])}for(var s in secs){secs[s].classList.toggle('on',s===id)}if(id&&secs[id])secs[id].scrollIntoView({behavior:'smooth',block:'nearest'})}
var pr=document.getElementById('proposal')||document.getElementById('timeline');pr.parentNode.insertBefore(peta,pr.nextSibling);
var tp=document.getElementById('tab-proposal')||document.getElementById('tab-timeline');
var btn=document.createElement('button');btn.type='button';btn.id='tab-peta';btn.className=tp.className;btn.textContent='Peta tim';btn.setAttribute('aria-pressed','false');tp.insertAdjacentElement('afterend',btn);
var tabs=['tab-daftar','tab-timeline','tab-proposal'];
btn.addEventListener('click',function(){window.setView('timeline');var tb=document.getElementById('timeline');if(tb)tb.hidden=true;var p=document.getElementById('proposal');if(p)p.hidden=true;peta.hidden=false;tabs.forEach(function(i){var e=document.getElementById(i);if(e)e.setAttribute('aria-pressed','false')});btn.setAttribute('aria-pressed','true')});
tabs.forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('click',function(){peta.hidden=true;btn.setAttribute('aria-pressed','false')})});
}catch(e){console.error('bagian5 peta',e)}
})();
/* Bagian 6: timeline grid per minggu */
(function(){try{
var zig=window.renderTimeline;var mode='grid';
var css=document.createElement('style');
css.textContent='.tsw{display:flex;gap:8px;justify-content:center;margin:0 0 16px}.tlg-k{font-size:13px;color:var(--muted);text-align:center;margin:0 auto 16px;max-width:70ch}.gt{overflow-x:auto;border-top:1px solid var(--rule);margin-bottom:24px}.gt-in{min-width:860px;display:grid;grid-template-columns:minmax(220px,1.6fr) 70px repeat(8,minmax(66px,1fr))}.gt .c{border-bottom:1px solid var(--line);border-left:1px solid var(--line);min-height:32px;display:flex;align-items:center}.gt .n{padding:6px 10px 6px 0;font-size:13.5px;position:sticky;left:0;background:var(--bg);z-index:1;border-left:0}.gt .n.dn{color:var(--muted);text-decoration:line-through}.gt .ph{text-align:center;font:500 11px var(--body);letter-spacing:.16em;text-transform:uppercase;padding:8px 0;color:#fff;border-left:1px solid var(--bg)}.gt .wk{justify-content:center;text-align:center;font-size:11px;color:var(--muted);padding:6px 2px;min-height:36px}.gt .wk0{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);padding-left:0;position:sticky;left:0;background:var(--bg);z-index:1;border-left:0}.gt .wk.now{color:var(--gold);font-weight:700;box-shadow:inset 0 -2px 0 var(--gold)}.gt .nowc{background:rgba(192,138,82,.08)}.gt .dv{grid-column:1/-1;font:400 15px var(--head);letter-spacing:.14em;text-transform:uppercase;padding:18px 0 6px;border-bottom:1px solid var(--rule);position:sticky;left:0}.gt .dv small{font:400 12px var(--body);letter-spacing:.04em;text-transform:none;color:var(--muted)}.gt .bar{flex:1;height:16px;margin:0 4px;border-radius:2px}.gt .bar.dn{opacity:.35}.gt .bar.und{opacity:.45;border:1px dashed var(--fg)}.gt .bar.lt{background:var(--late)!important}';
document.head.appendChild(css);
var MO=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
var COL=['#6e625a','#5b8bb5','#5f9588','#b88f2e','#c06a3a','#8a7a8f','#4f7f9a','#9a8a4a','#a65f55','#6b8f5e'];
var PH=[['Fondasi',2,'#6e625a'],['Putuskan',2,'#5b8bb5'],['Siapkan',2,'#5f9588'],['Pasang dan Acara',1,'#b88f2e'],['Penutup',1,'#c06a3a']];
var S0=new Date('2026-11-23T00:00:00');var NW=8;
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function wl(i){var a=new Date(S0.getTime()+i*6048e5),b=new Date(a.getTime()+6*864e5);return a.getDate()+(a.getMonth()!==b.getMonth()?' '+MO[a.getMonth()]:'')+'-'+b.getDate()+' '+MO[b.getMonth()]}
function sw(){var d=h('div','tsw');[['grid','Grid per minggu'],['tahap','Per tahap']].forEach(function(m){var b=h('button','chip',m[1]);b.type='button';b.setAttribute('aria-pressed',String(mode===m[0]));b.addEventListener('click',function(){mode=m[0];window.renderTimeline()});d.appendChild(b)});return d}
function grid(){
 var t0=today();var wrap=h('div','gt');var g=h('div','gt-in');
 var nowW=Math.floor((new Date(t0+'T00:00:00')-S0)/6048e5);
 g.appendChild(h('div','c n',''));g.appendChild(h('div','c',''));
 PH.forEach(function(p){var e=h('div','ph',p[0]);e.style.gridColumn='span '+p[1];e.style.background=p[2];g.appendChild(e)});
 g.appendChild(h('div','c wk0','Tugas'));g.appendChild(h('div','c wk','Tanpa tenggat'));
 for(var i=0;i<NW;i++)g.appendChild(h('div','c wk'+(i===nowW?' now':''),wl(i)));
 DIVS.forEach(function(v,vi){
  var items=tasks.filter(function(t){return t.division===v.id}).sort(function(a,b){var x=a.due||'9',y=b.due||'9';return x<y?-1:x>y?1:0});
  var done=items.filter(function(t){return t.status==='selesai'}).length;
  var d=h('div','dv',v.name);d.appendChild(h('small',null,'   '+done+' dari '+items.length+' selesai'));g.appendChild(d);
  items.forEach(function(t){
   var late=t.status!=='selesai'&&t.due&&t.due<t0;
   g.appendChild(h('div','c n'+(t.status==='selesai'?' dn':''),t.title));
   var idx=t.due?Math.min(NW-1,Math.max(0,Math.floor((new Date(t.due+'T00:00:00')-S0)/6048e5))):-1;
   for(var k=-1;k<NW;k++){var c=h('div','c'+(k===nowW?' nowc':''));
    if(k===idx){var b=h('div','bar'+(t.status==='selesai'?' dn':'')+(t.due?'':' und')+(late?' lt':''));b.style.background=COL[vi%COL.length];b.title=(t.due?fmt(t.due):'Belum ada tenggat')+' · '+(t.status==='selesai'?'selesai':t.status==='jalan'?'dikerjakan':'belum')+(late?' · terlambat':'');c.appendChild(b)}
    g.appendChild(c)}
  });
 });
 wrap.appendChild(g);return wrap}
window.renderTimeline=function(){var box=$('#timeline');if(!box)return;
 if(mode==='tahap'){zig();box.insertBefore(sw(),box.firstChild);return}
 box.replaceChildren(sw(),h('p','tlg-k','Setiap batang menandai minggu tenggat tugas. Merah berarti terlambat, pudar berarti selesai, garis putus-putus berarti belum ada tenggat. Ubah tenggat di tab Daftar tugas.'),grid())};
window.renderTimeline();
}catch(e){console.error('bagian6 grid',e)}
})();
/* Bagian 7: papan pameran (whiteboard) */
(function(){try{
var sb=window.supabase.createClient(SB_URL,SB_KEY);var BK='proposal';var items=[];var busy=false;
var css=document.createElement('style');
css.textContent='#wb{margin-bottom:28px}#wb .tb{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;margin:0 0 12px}#wb .tb p{flex:1 1 100%;text-align:center;font-size:14px;color:var(--muted);margin:0 0 4px}#wb .tb button,#wb .tb label{font:500 12px var(--body);letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border:1px solid var(--fg);background:transparent;color:var(--fg);cursor:pointer}#wb .tb button:hover,#wb .tb label:hover{background:var(--fg);color:var(--bg)}#wb .tb input[type=file]{display:none}#wb .st2{width:100%;text-align:center;font-size:13px;color:var(--muted);min-height:18px}.wbv{overflow:auto;height:72vh;min-height:420px;border:1px solid var(--rule);background:var(--bg)}.wbc{position:relative;width:3200px;height:2200px;background-image:radial-gradient(var(--rule) 1px,transparent 1px);background-size:24px 24px}.wbi{position:absolute;border:1px solid var(--rule);background:var(--bg);box-shadow:0 2px 10px rgba(0,0,0,.12)}.wbi .hd{height:20px;cursor:move;background:var(--line);display:flex;justify-content:flex-end;align-items:center;touch-action:none}.wbi .hd b{margin-right:auto;padding-left:8px;font:700 11px var(--body);letter-spacing:.1em;color:var(--muted)}.wbi .hd button{border:0;background:none;color:var(--fg);cursor:pointer;font-size:15px;line-height:1;padding:0 8px}.wbi .hd button.arm{font-size:11px;font-weight:700;color:var(--late,#b3261e)}.wbi img{display:block;width:100%;height:auto;pointer-events:none;user-select:none}.wbi .nt{padding:10px;min-height:90px;background:#f3e7c9;color:#2B2B2B;font-size:14px;outline:none;white-space:pre-wrap;overflow-wrap:anywhere}.wbi .rz{position:absolute;right:0;bottom:0;width:16px;height:16px;cursor:nwse-resize;touch-action:none;background:linear-gradient(135deg,transparent 50%,var(--fg) 50%);opacity:.5}';
document.head.appendChild(css);
var panel=document.createElement('div');panel.id='wb';panel.hidden=true;
panel.innerHTML='<div class="tb"><p>Tempel gambar dengan Ctrl+V (Cmd+V di Mac), seret berkas ke papan, atau pilih dari perangkat. Geser lewat bilah abu-abu di atas gambar, ubah ukuran lewat sudut kanan bawah.</p><label>Pilih gambar<input type="file" id="wb-f" accept="image/*" multiple></label><button type="button" id="wb-n">Tambah catatan</button><div class="st2" id="wb-s" role="status"></div></div><div class="wbv" id="wb-v"><div class="wbc" id="wb-c"></div></div>';
var anchor=document.getElementById('peta')||document.getElementById('proposal');anchor.parentNode.insertBefore(panel,anchor.nextSibling);
var cv=panel.querySelector('#wb-c'),vw=panel.querySelector('#wb-v'),stt=panel.querySelector('#wb-s');
function say(t){stt.textContent=t||''}
function who(){try{return localStorage.getItem('pf-by')||''}catch(e){return ''}}
function nextZ(){var m=0;items.forEach(function(o){if(o.z>m)m=o.z});return m+1}
function load(){if(busy)return;sb.from('wb_items').select('*').order('created_at').then(function(r){if(busy||r.error||!r.data)return;items=r.data;draw()})}
function draw(){cv.replaceChildren();items.forEach(mk)}
function drag(h,d,it,mode){h.addEventListener('pointerdown',function(e){if(e.button>0)return;e.preventDefault();busy=true;var sx=e.clientX,sy=e.clientY,ox=it.x,oy=it.y,ow=it.w;it.z=nextZ();d.style.zIndex=String(it.z);try{h.setPointerCapture(e.pointerId)}catch(x){}
 function mv(ev){var dx=ev.clientX-sx,dy=ev.clientY-sy;if(mode==='move'){it.x=Math.max(0,Math.round(ox+dx));it.y=Math.max(0,Math.round(oy+dy));d.style.left=it.x+'px';d.style.top=it.y+'px'}else{it.w=Math.max(100,Math.round(ow+dx));d.style.width=it.w+'px'}}
 function up(){h.removeEventListener('pointermove',mv);h.removeEventListener('pointerup',up);h.removeEventListener('pointercancel',up);busy=false;sb.from('wb_items').update({x:it.x,y:it.y,w:it.w,z:it.z}).eq('id',it.id).then(function(r){if(r.error)say('Gagal menyimpan posisi.')})}
 h.addEventListener('pointermove',mv);h.addEventListener('pointerup',up);h.addEventListener('pointercancel',up)})}
function mk(it){
 var d=document.createElement('div');d.className='wbi';d.style.left=it.x+'px';d.style.top=it.y+'px';d.style.width=it.w+'px';d.style.zIndex=String(it.z);
 var hd=document.createElement('div');hd.className='hd';var lb=document.createElement('b');lb.textContent=it.by||'';hd.appendChild(lb);
 var x=document.createElement('button');x.type='button';x.textContent='×';x.title='Hapus';hd.appendChild(x);d.appendChild(hd);
 var body;
 if(it.kind==='note'){body=document.createElement('div');body.className='nt';body.contentEditable='true';body.textContent=it.body;body.addEventListener('focus',function(){busy=true});body.addEventListener('blur',function(){busy=false;var v=body.textContent;if(v!==it.body){it.body=v;sb.from('wb_items').update({body:v}).eq('id',it.id).then(function(){})}})}
 else{body=document.createElement('img');body.src=it.url;body.alt='Gambar pameran';body.draggable=false}
 d.appendChild(body);
 var rz=document.createElement('div');rz.className='rz';d.appendChild(rz);
 x.addEventListener('pointerdown',function(e){e.stopPropagation()});
 x.addEventListener('click',function(){if(x.getAttribute('data-a')!=='1'){x.setAttribute('data-a','1');x.classList.add('arm');x.textContent='Hapus?';setTimeout(function(){x.removeAttribute('data-a');x.classList.remove('arm');x.textContent='×'},3000);return}
  sb.from('wb_items').delete().eq('id',it.id).then(function(r){if(r.error){say('Gagal menghapus.');return}if(it.path)sb.storage.from(BK).remove([it.path]);items=items.filter(function(o){return o.id!==it.id});draw();say('Dihapus.')})});
 drag(hd,d,it,'move');drag(rz,d,it,'size');
 cv.appendChild(d)}
function addRow(o){var n=items.length%8;o.x=vw.scrollLeft+40+n*28;o.y=vw.scrollTop+40+n*28;o.z=nextZ();o.by=who();return sb.from('wb_items').insert(o).select().then(function(r){if(r.error||!r.data){say('Gagal menyimpan ke papan.');return}items.push(r.data[0]);draw();say('Ditambahkan ke papan.')})}
function prep(file){return new Promise(function(ok,no){var u=URL.createObjectURL(file);var im=new Image();im.onload=function(){var s=Math.min(1,1600/Math.max(im.width,im.height));if(s===1&&file.size<900000&&['image/png','image/jpeg','image/webp','image/gif'].indexOf(file.type)>-1){URL.revokeObjectURL(u);ok({blob:file,ext:file.type.split('/')[1].replace('jpeg','jpg'),w:im.width});return}var c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);var g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(function(b){b?ok({blob:b,ext:'jpg',w:c.width}):no(new Error('gagal diproses'))},'image/jpeg',0.86)};im.onerror=function(){no(new Error('bukan gambar'))};im.src=u})}
function up1(file){say('Mengunggah gambar...');return prep(file).then(function(p){var path='wb/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+p.ext;return sb.storage.from(BK).upload(path,p.blob,{contentType:p.blob.type||'image/jpeg'}).then(function(r){if(r.error)throw r.error;var url=sb.storage.from(BK).getPublicUrl(path).data.publicUrl;return addRow({kind:'img',url:url,path:path,w:Math.min(360,p.w)})})}).catch(function(e){say('Gagal mengunggah: '+((e&&e.message)||'coba lagi'))})}
function many(files){var a=[].filter.call(files,function(f){return f.type.indexOf('image/')===0});if(!a.length){say('Berkas itu bukan gambar.');return}a.reduce(function(pr,f){return pr.then(function(){return up1(f)})},Promise.resolve())}
panel.querySelector('#wb-f').addEventListener('change',function(e){many(e.target.files);e.target.value=''});
panel.querySelector('#wb-n').addEventListener('click',function(){addRow({kind:'note',body:'Tulis catatan di sini',w:220})});
document.addEventListener('paste',function(e){if(panel.hidden)return;var t=e.target;if(t&&(t.isContentEditable||/INPUT|TEXTAREA/.test(t.tagName)))return;var fs=e.clipboardData&&e.clipboardData.files;if(fs&&fs.length){e.preventDefault();many(fs)}});
vw.addEventListener('dragover',function(e){e.preventDefault()});
vw.addEventListener('drop',function(e){e.preventDefault();if(e.dataTransfer&&e.dataTransfer.files.length)many(e.dataTransfer.files)});
sb.channel('wb-live').on('postgres_changes',{event:'*',schema:'public',table:'wb_items'},function(){load()}).subscribe();
setInterval(function(){if(!panel.hidden)load()},20000);
var tp=document.getElementById('tab-peta')||document.getElementById('tab-proposal');
var btn=document.createElement('button');btn.type='button';btn.id='tab-wb';btn.className=tp.className;btn.textContent='Papan pameran';btn.setAttribute('aria-pressed','false');tp.insertAdjacentElement('afterend',btn);
var all=['tab-daftar','tab-timeline','tab-proposal','tab-peta'];
btn.addEventListener('click',function(){window.setView('timeline');['timeline','proposal','peta'].forEach(function(i){var e=document.getElementById(i);if(e)e.hidden=true});panel.hidden=false;all.forEach(function(i){var e=document.getElementById(i);if(e)e.setAttribute('aria-pressed','false')});btn.setAttribute('aria-pressed','true');load()});
all.forEach(function(i){var e=document.getElementById(i);if(e)e.addEventListener('click',function(){panel.hidden=true;btn.setAttribute('aria-pressed','false')})});
}catch(e){console.error('bagian7 papan pameran',e)}
})();
/* Bagian 8: baca PDF seperti buku */
(function(){try{
var css=document.createElement('style');
css.textContent='.pr .pvb{width:auto;justify-self:start;align-self:flex-start;display:inline-block}.bk{position:fixed;inset:0;z-index:9999;background:rgba(20,18,16,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:56px 16px 16px}.bk .bt{position:absolute;top:10px;right:14px;display:flex;gap:8px}.bk .bt button{font:500 12px var(--body);letter-spacing:.14em;text-transform:uppercase;padding:7px 14px;border:1px solid #ddd;background:transparent;color:#eee;cursor:pointer}.bk .bt button:hover{background:#eee;color:#222}.bk .st{color:#ddd;font-size:13px;margin-top:12px;min-height:18px;text-align:center}.bk .stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;width:100%}.bk .pg{background:#fff}.bk .pg img{width:100%;height:100%;display:block;object-fit:contain}';
document.head.appendChild(css);
function ld(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=function(){no(new Error('gagal memuat pustaka'))};document.head.appendChild(s)})}
var libs=null;
function need(){if(libs)return libs;libs=ld('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js').then(function(){return ld('https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js')}).then(function(){return fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js').then(function(r){return r.text()})}).then(function(t){pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([t],{type:'text/javascript'}))});libs.catch(function(){libs=null});return libs}
function openBook(url){
 var ov=document.createElement('div');ov.className='bk';
 ov.innerHTML='<div class="bt"><button type="button" data-a="p">Sebelumnya</button><button type="button" data-a="n">Berikutnya</button><button type="button" data-a="x">Tutup</button></div><div class="stage"><div id="bk-s"></div></div><div class="st"></div>';
 document.body.appendChild(ov);var st=ov.querySelector('.st');var pf=null;
 function close(){document.removeEventListener('keydown',kd);ov.remove();if(pf){try{pf.destroy()}catch(e){}}}
 function kd(e){if(e.key==='Escape')close();if(pf&&e.key==='ArrowRight')pf.flipNext();if(pf&&e.key==='ArrowLeft')pf.flipPrev()}
 document.addEventListener('keydown',kd);
 ov.querySelector('.bt').addEventListener('click',function(e){var a=e.target.getAttribute&&e.target.getAttribute('data-a');if(a==='x')close();if(a==='n'&&pf)pf.flipNext();if(a==='p'&&pf)pf.flipPrev()});
 st.textContent='Menyiapkan buku...';
 need().then(function(){return pdfjsLib.getDocument(url).promise}).then(function(pdf){
  var n=pdf.numPages;var imgs=[];var ratio=1.4;
  function pg(i){if(!ov.isConnected)return Promise.reject(new Error('ditutup'));return pdf.getPage(i).then(function(p){var v0=p.getViewport({scale:1});if(i===1)ratio=v0.height/v0.width;var v=p.getViewport({scale:900/v0.width});var c=document.createElement('canvas');c.width=Math.round(v.width);c.height=Math.round(v.height);return p.render({canvasContext:c.getContext('2d'),viewport:v}).promise.then(function(){imgs.push(c.toDataURL('image/jpeg',0.8));st.textContent='Memuat halaman '+i+' dari '+n})})}
  var pr=Promise.resolve();for(var i=1;i<=n;i++){(function(k){pr=pr.then(function(){return pg(k)})})(i)}
  return pr.then(function(){
   var mob=innerWidth<800;var maxH=innerHeight-130;var maxW=innerWidth-32;var w=Math.floor(Math.min(700,mob?maxW:maxW/2,maxH/ratio));var h=Math.round(w*ratio);
   var host=ov.querySelector('#bk-s');host.style.width=(mob?w:w*2)+'px';host.style.height=h+'px';
   var pages=imgs.map(function(u){var d=document.createElement('div');d.className='pg';var im=document.createElement('img');im.src=u;im.alt='Halaman';d.appendChild(im);return d});
   pf=new St.PageFlip(host,{width:w,height:h,size:'stretch',minWidth:150,maxWidth:w,minHeight:200,maxHeight:h,showCover:true,usePortrait:mob,drawShadow:true,maxShadowOpacity:0.4,mobileScrollSupport:false});
   pf.loadFromHTML(pages);
   st.textContent='Halaman 1 dari '+n+'. Klik sudut halaman atau pakai tombol panah untuk membalik.';
   pf.on('flip',function(e){st.textContent='Halaman '+(e.data+1)+' dari '+n+'.'});
  })
 }).catch(function(e){if(ov.isConnected)st.textContent='Gagal membuka buku: '+((e&&e.message)||'coba lagi')});
}
function addBtns(){var pl=document.getElementById('pl');if(!pl)return;pl.querySelectorAll('.pr').forEach(function(pr){if(pr.getAttribute('data-bk'))return;pr.setAttribute('data-bk','1');var a=pr.querySelector('a');if(!a)return;if(a.href.split('?')[0].toLowerCase().slice(-4)!=='.pdf')return;var b=document.createElement('button');b.type='button';b.className='pvb';b.textContent='Baca seperti buku';var an=pr.querySelector('.pvb')||a;an.insertAdjacentElement('afterend',b);b.addEventListener('click',function(){openBook(a.href)})})}
var pp=document.getElementById('proposal');if(pp){new MutationObserver(addBtns).observe(pp,{childList:true,subtree:true});addBtns()}
}catch(e){console.error('bagian8 buku',e)}
})();
