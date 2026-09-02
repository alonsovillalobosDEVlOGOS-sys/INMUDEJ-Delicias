(()=>{
  const list=document.getElementById('fractionsList');const input=document.getElementById('fractionSearch');let rows=[];
  const esc=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const draw=()=>{
    const q=(input?.value||'').toLowerCase().trim();const filtered=rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q));
    if(!filtered.length){list.innerHTML='<div class="fraction-empty"><i class="bi bi-list-check"></i><h3>'+(rows.length?'Sin coincidencias':'Sin documentos publicados')+'</h3><p>'+(rows.length?'Prueba con otra búsqueda.':'Cuando existan obligaciones disponibles para consulta aparecerán organizadas en esta sección.')+'</p></div>';return}
    list.innerHTML='<div style="display:flex;flex-direction:column;gap:12px">'+filtered.map(r=>`<article style="border:1px solid #e0e8f0;border-radius:14px;padding:17px;display:grid;grid-template-columns:90px 1fr auto;gap:15px;align-items:center"><span style="font-weight:800;color:#1557a6">${esc(r.fraccion)}</span><div><b>${esc(r.titulo)}</b><small style="display:block;color:#6b7c8f">${esc(r.periodo||'')} ${r.descripcion?'· '+esc(r.descripcion):''}</small></div>${r.archivo?`<a class="btn btn-outline" href="${esc(r.archivo)}" target="_blank" rel="noopener"><i class="bi bi-file-earmark-arrow-down"></i> Abrir</a>`:''}</article>`).join('')+'</div>';
  };
  fetch('assets/data/fracciones.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(d=>{rows=Array.isArray(d)?d:[];draw()}).catch(draw);input?.addEventListener('input',draw);
})();
