(async()=>{
  const CMS=window.INMUDEJCMS;
  const esc=CMS?.escapeHtml||((s)=>String(s||''));
  let data=CMS?.seed||{site:{},sections:[],carousel:[],announcements:[],tournaments:[],services:[],calls:[],forms:[],events:[],docs:[]};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const btn=$('#mobileNavBtn'),nav=$('#mainNav'),navLinks=[...(nav?.querySelectorAll('a[href^="#"]')||[])];
  btn?.addEventListener('click',()=>{const open=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));btn.innerHTML=open?'<i class="bi bi-x-lg"></i>':'<i class="bi bi-list"></i>'});
  navLinks.forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn?.setAttribute('aria-expanded','false');if(btn)btn.innerHTML='<i class="bi bi-list"></i>'}));
  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08,rootMargin:'0px 0px -30px 0px'}):null;
  const observe=()=>document.querySelectorAll('.reveal:not(.in)').forEach(el=>io?io.observe(el):el.classList.add('in'));observe();
  const sectionsEls=[...document.querySelectorAll('main section[id]')];
  const scrollSpy=()=>{const y=window.scrollY+140;let current='inicio';for(const s of sectionsEls){if(!s.hidden&&s.offsetTop<=y)current=s.id}navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`))};
  const siteNav=$('.nav');
  const syncNav=()=>{scrollSpy();siteNav?.classList.toggle('scrolled',window.scrollY>24)};
  window.addEventListener('scroll',syncNav,{passive:true});syncNav();
  const year=$('#year');if(year)year.textContent=new Date().getFullYear();

  const fmtDate=s=>{if(!s)return '';const d=new Date(`${s}T12:00:00`);return Number.isNaN(+d)?'':d.toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})};
  const fmtShort=s=>{if(!s)return '';const d=new Date(`${s}T12:00:00`);return Number.isNaN(+d)?'':d.toLocaleDateString('es-MX',{day:'numeric',month:'short'})};
  const externalAttr=url=>/^https?:/i.test(url||'')?'target="_blank" rel="noopener"':'';
  const formById=id=>(data.forms||[]).find(f=>String(f.id)===String(id));

  function renderSiteText(){
    const map={heroTitlePrefix:'heroTitlePrefix',heroTitleAccent:'heroTitleAccent',heroLead:'heroLead',missionTitle:'missionTitle',missionText:'missionText',visionTitle:'visionTitle',visionText:'visionText'};
    Object.entries(map).forEach(([k,id])=>{const el=document.getElementById(id);if(el&&data.site?.[k])el.textContent=data.site[k]});
    $$('[data-facebook-link]').forEach(a=>{if(data.site?.facebook)a.href=data.site.facebook});
    const address=$('#footerAddress');if(address&&data.site?.address)address.textContent=data.site.address;
  }
  function renderSectionCopy(){
    const merged=new Map((CMS.seed.sections||[]).map(x=>[x.id,x]));
    (data.sections||[]).forEach(x=>merged.set(x.id,{...(merged.get(x.id)||{}),...x}));
    merged.forEach((x,key)=>{
      const section=$(`[data-managed-section="${key}"]`);if(section)section.hidden=x.active===false;
      $$(`[data-section-eyebrow="${key}"]`).forEach(el=>{if(x.eyebrow)el.textContent=x.eyebrow});
      $$(`[data-section-title="${key}"]`).forEach(el=>{if(x.title)el.textContent=x.title});
      $$(`[data-section-description="${key}"]`).forEach(el=>{if(x.description)el.textContent=x.description});
    });
  }

  let slide=0,timer=null;
  function renderCarousel(){
    const track=$('#heroCarouselTrack'),dots=$('#heroDots');if(!track||!dots)return;
    const items=[...(data.carousel||[])].filter(x=>x.active!==false).sort((a,b)=>(a.order||0)-(b.order||0));
    if(!items.length)items.push({image:'assets/img/natacion-inmudej.jpg',title:'Más actividad. Más comunidad.',subtitle:'Deporte, juventud e inclusión para Delicias.'});
    slide=Math.min(slide,items.length-1);
    track.innerHTML=items.map((x,i)=>`<article class="hero-slide ${i===slide?'active':''}" aria-hidden="${i===slide?'false':'true'}"><img src="${esc(x.image)}" alt="${esc(x.title||'Actividad INMUDEJ')}" loading="${i===0?'eager':'lazy'}"><div class="hero-photo-shade"></div><div class="hero-photo-label"><i class="bi bi-people-fill"></i><div><b>${esc(x.title||'INMUDEJ Delicias')}</b><span>${esc(x.subtitle||'')}</span></div></div></article>`).join('');
    dots.innerHTML=items.length>1?items.map((_,i)=>`<button type="button" class="${i===slide?'active':''}" aria-label="Ir a imagen ${i+1}" data-slide="${i}"></button>`).join(''):'';
    const prev=$('#heroPrev'),next=$('#heroNext');if(prev)prev.hidden=items.length<2;if(next)next.hidden=items.length<2;
    const restart=()=>{clearInterval(timer);if(items.length>1)timer=setInterval(()=>go(slide+1),6500)};
    const go=n=>{slide=(n+items.length)%items.length;[...track.children].forEach((el,i)=>{el.classList.toggle('active',i===slide);el.setAttribute('aria-hidden',i===slide?'false':'true')});[...dots.children].forEach((el,i)=>el.classList.toggle('active',i===slide));restart()};
    dots.querySelectorAll('button').forEach(b=>b.onclick=()=>go(+b.dataset.slide));if(prev)prev.onclick=()=>go(slide-1);if(next)next.onclick=()=>go(slide+1);restart();
  }

  function renderAnnouncements(){
    const section=$('#avisos'),grid=$('#announcementsGrid');if(!grid)return;
    const items=[...(data.announcements||[])].filter(x=>x.active!==false).sort((a,b)=>(b.priority||0)-(a.priority||0)||String(b.date||'').localeCompare(String(a.date||'')));
    if(section)section.hidden=!items.length;
    grid.innerHTML=items.map(x=>`<article class="announcement-card reveal ${Number(x.priority)>0?'featured':''}">${x.image?`<div class="announcement-media"><img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy"></div>`:''}<div class="announcement-copy"><span class="announcement-kicker"><i class="bi bi-bell-fill"></i>${x.date?esc(fmtDate(x.date)):'Aviso INMUDEJ'}</span><h3>${esc(x.title)}</h3><p>${esc(x.summary||'')}</p>${x.link?`<a href="${esc(x.link)}" ${externalAttr(x.link)}>Consultar aviso <i class="bi bi-arrow-right"></i></a>`:''}</div></article>`).join('');
    observe();
  }
  function renderServices(){
    const grid=$('#servicesGrid');if(!grid)return;const items=(data.services||[]).filter(x=>x.active!==false);
    grid.innerHTML=items.length?items.map(x=>`<article class="service-card reveal ${x.image?'has-image':''}">${x.image?`<div class="service-card-image"><img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy"></div>`:''}<div class="service-card-inner"><span class="service-icon ${esc(x.tone||'blue')}"><i class="bi ${esc(x.icon||'bi-stars')}"></i></span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${x.price?`<div class="service-price"><span>Cuota / costo</span><b>${esc(x.price)}</b></div>`:''}${x.details?`<small class="service-details">${esc(x.details)}</small>`:''}<a href="#convocatorias">Consultar opciones <i class="bi bi-arrow-right"></i></a></div></article>`).join(''):'<div class="public-empty"><i class="bi bi-grid"></i><b>Servicios en actualización</b><p>Próximamente encontrarás aquí la oferta vigente del Instituto.</p></div>';observe();
  }
  function renderTournaments(){
    const grid=$('#tournamentsGrid');if(!grid)return;const items=[...(data.tournaments||[])].filter(x=>x.active!==false).sort((a,b)=>String(a.startDate||'').localeCompare(String(b.startDate||'')));
    grid.innerHTML=items.length?items.map(x=>{const f=formById(x.formId),dateRange=x.startDate?(x.endDate&&x.endDate!==x.startDate?`${fmtShort(x.startDate)} – ${fmtShort(x.endDate)}`:fmtDate(x.startDate)):'Fecha por confirmar';return `<article class="tournament-card reveal ${x.featured?'featured':''}"><div class="tournament-media">${x.image?`<img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy">`:'<div class="tournament-placeholder"><i class="bi bi-trophy-fill"></i></div>'}<span class="tournament-sport">${esc(x.sport||'Deporte')}</span>${x.featured?'<span class="tournament-featured"><i class="bi bi-star-fill"></i> Destacado</span>':''}</div><div class="tournament-body"><div class="tournament-meta"><span><i class="bi bi-calendar3"></i>${esc(dateRange)}</span>${x.location?`<span><i class="bi bi-geo-alt"></i>${esc(x.location)}</span>`:''}</div><h3>${esc(x.title)}</h3><p>${esc(x.summary||'')}</p><div class="tournament-actions">${x.link?`<a class="btn btn-outline" href="${esc(x.link)}" ${externalAttr(x.link)}>Información</a>`:''}${f?.url?`<a class="btn btn-primary" href="${esc(f.url)}" ${externalAttr(f.url)}>Inscribirme <i class="bi bi-arrow-right"></i></a>`:''}</div></div></article>`}).join(''):'<div class="public-empty reveal"><i class="bi bi-trophy"></i><b>Torneos en actualización</b><p>Las próximas competencias aparecerán aquí cuando sean publicadas.</p></div>';observe();
  }
  function renderCalls(){
    const grid=$('#convocatoriasGrid');if(!grid)return;const items=[...(data.calls||[])].filter(x=>x.active!==false).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    grid.innerHTML=items.length?items.map(x=>{const f=formById(x.formId);return `<article class="opportunity-card reveal"><div class="opportunity-image">${x.image?`<img src="${esc(x.image)}" alt="${esc(x.title)}" loading="lazy">`:'<div class="opportunity-placeholder"><i class="bi bi-megaphone"></i></div>'}<span class="opportunity-tag">${esc(x.category||'Convocatoria')}</span></div><div class="opportunity-body"><small>${x.date?esc(fmtDate(x.date)):'Vigente'}</small><h3>${esc(x.title)}</h3><p>${esc(x.summary||'')}</p><div class="opportunity-actions">${x.link?`<a class="btn btn-outline" href="${esc(x.link)}" ${externalAttr(x.link)}>Más información</a>`:''}${f?.url?`<a class="btn btn-primary" href="${esc(f.url)}" ${externalAttr(f.url)}>Inscripción <i class="bi bi-arrow-right"></i></a>`:''}</div></div></article>`}).join(''):'<div class="public-empty reveal"><i class="bi bi-megaphone"></i><b>No hay convocatorias publicadas en este momento</b><p>Las nuevas convocatorias aparecerán aquí cuando estén disponibles.</p></div>';observe();
  }
  function renderForms(){const grid=$('#formsGrid');if(!grid)return;const items=(data.forms||[]).filter(x=>x.active!==false);grid.innerHTML=items.length?items.map(x=>`<a class="form-download" href="${esc(x.url||'#')}" ${externalAttr(x.url)}><span><i class="bi ${x.type==='online'?'bi-ui-checks-grid':'bi-file-earmark-pdf'}"></i></span><div><b>${esc(x.title)}</b><small>${esc(x.description||'Formulario de inscripción')}</small></div><i class="bi bi-arrow-up-right"></i></a>`).join(''):'<div class="forms-empty"><i class="bi bi-file-earmark-plus"></i><span>Los formularios de inscripción disponibles aparecerán aquí.</span></div>'}
  function renderDocs(){const grid=$('#transparencyGrid');if(!grid)return;const items=(data.docs||[]).filter(x=>x.active!==false);grid.innerHTML=items.length?items.map(x=>`<a class="document-card reveal" href="${esc(x.url||'#')}" ${externalAttr(x.url)}><span class="doc-icon ${x.type==='Privacidad'?'privacy':x.type==='Obligaciones'?'access':x.type==='Organización'?'org':'rules'}"><i class="bi ${esc(x.icon||'bi-file-earmark-text')}"></i></span><div><span class="doc-type">${esc(x.type||'Documento')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p></div><span class="doc-action">Consultar <i class="bi bi-arrow-up-right"></i></span></a>`).join(''):'<div class="public-empty"><i class="bi bi-folder2-open"></i><b>Documentos en actualización</b></div>';observe()}

  const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const monthTitle=n=>n.charAt(0).toUpperCase()+n.slice(1),grid=$('#calendarGrid'),title=$('#calendarTitle'),upcoming=$('#upcomingList');let events=[];let cursor=new Date();cursor=new Date(cursor.getFullYear(),cursor.getMonth(),1);
  const parseLocalDate=s=>{const [y,m,d]=String(s).split('-').map(Number);return new Date(y,m-1,d)},eventColor=c=>c==='Juventud'?'green':c==='Convocatoria'?'orange':c==='Torneo'?'purple':'';
  const renderCalendar=()=>{if(!grid||!title)return;const y=cursor.getFullYear(),m=cursor.getMonth();title.textContent=`${monthTitle(monthNames[m])} ${y}`;grid.innerHTML='';const firstDow=(new Date(y,m,1).getDay()+6)%7,start=new Date(y,m,1-firstDow),today=new Date();today.setHours(0,0,0,0);for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,dayEvents=events.filter(e=>e.date===iso),cell=document.createElement('div');cell.className='calendar-day';if(d.getMonth()!==m)cell.classList.add('muted');if(+d===+today)cell.classList.add('today');cell.innerHTML=`<span class="day-num">${d.getDate()}</span><div class="day-events">${dayEvents.slice(0,2).map(e=>`<div class="day-event ${eventColor(e.category)}" title="${esc(e.title)}">${esc(e.title)}</div>`).join('')}</div>${dayEvents.length>2?`<span class="more-events">+${dayEvents.length-2}</span>`:''}`;grid.appendChild(cell)}renderUpcoming()};
  const renderUpcoming=()=>{if(!upcoming)return;const now=new Date();now.setHours(0,0,0,0);const next=events.filter(e=>e.date&&parseLocalDate(e.date)>=now).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,6);upcoming.innerHTML=next.length?next.map(e=>{const d=parseLocalDate(e.date);return `<article class="upcoming-item"><span class="upcoming-date">${d.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})}</span><b>${esc(e.title)}</b><small>${esc([e.time,e.location].filter(Boolean).join(' · '))}</small></article>`}).join(''):'<div class="empty-events"><i class="bi bi-calendar2-plus"></i><b>Sin actividades próximas</b><p>Consulta nuevamente para conocer la agenda actualizada.</p></div>'};
  $('#prevMonth')?.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);renderCalendar()});$('#nextMonth')?.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);renderCalendar()});$('#todayMonth')?.addEventListener('click',()=>{const n=new Date();cursor=new Date(n.getFullYear(),n.getMonth(),1);renderCalendar()});

  function renderAll(){events=data.events||[];renderSiteText();renderSectionCopy();renderCarousel();renderAnnouncements();renderServices();renderTournaments();renderCalls();renderForms();renderDocs();renderCalendar();scrollSpy()}

  const loginModal=$('#loginModal'),loginBtn=$('#loginBtn'),closeLogin=$('#closeLogin'),cancelLogin=$('#cancelLogin'),loginForm=$('#publicLoginForm'),loginMessage=$('#loginMessage');
  const openLogin=()=>{if(loginModal){loginModal.hidden=false;document.body.style.overflow='hidden';setTimeout(()=>loginForm?.elements?.identifier?.focus(),50)}};
  const hideLogin=()=>{if(loginModal){loginModal.hidden=true;document.body.style.overflow=''}};
  loginBtn?.addEventListener('click',async e=>{e.preventDefault();const session=await CMS?.getSession?.();if(session){location.href='admin.html';return}openLogin()});
  closeLogin?.addEventListener('click',hideLogin);cancelLogin?.addEventListener('click',hideLogin);loginModal?.addEventListener('click',e=>{if(e.target===loginModal)hideLogin()});
  loginForm?.addEventListener('submit',async e=>{e.preventDefault();loginMessage.textContent='';const f=new FormData(loginForm),submit=loginForm.querySelector('button[type="submit"]');submit.disabled=true;submit.innerHTML='<span class="spinner"></span> Ingresando…';try{await CMS.signIn(f.get('identifier'),f.get('password'));location.href='admin.html'}catch(err){loginMessage.textContent='Usuario o contraseña incorrectos.';submit.disabled=false;submit.innerHTML='<i class="bi bi-box-arrow-in-right"></i> Ingresar'}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&loginModal&&!loginModal.hidden)hideLogin()});
  try{const session=await CMS?.getSession?.();if(session&&loginBtn){loginBtn.innerHTML='<i class="bi bi-speedometer2"></i><span>Administrar</span>';loginBtn.title='Abrir panel administrativo'}}catch(_){ }

  renderAll();
  try{data=await CMS.loadPublic();renderAll()}catch(e){console.warn(e)}
})();
