(()=>{
  const btn=document.getElementById('mobileNavBtn');
  const nav=document.getElementById('mainNav');
  const navLinks=[...(nav?.querySelectorAll('a[href^="#"]')||[])];
  btn?.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',String(open));
    btn.innerHTML=open?'<i class="bi bi-x-lg"></i>':'<i class="bi bi-list"></i>';
  });
  navLinks.forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');btn?.setAttribute('aria-expanded','false');if(btn)btn.innerHTML='<i class="bi bi-list"></i>';
  }));

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  const sections=[...document.querySelectorAll('main section[id],header[id]')];
  const scrollSpy=()=>{
    const y=window.scrollY+130;let current='inicio';
    for(const s of sections){if(s.offsetTop<=y)current=s.id}
    navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${current}`));
  };
  window.addEventListener('scroll',scrollSpy,{passive:true});scrollSpy();
  document.getElementById('year').textContent=new Date().getFullYear();

  const monthNames=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const monthTitle=n=>n.charAt(0).toUpperCase()+n.slice(1);
  const grid=document.getElementById('calendarGrid');
  const title=document.getElementById('calendarTitle');
  const upcoming=document.getElementById('upcomingList');
  let events=[];
  let cursor=new Date(); cursor=new Date(cursor.getFullYear(),cursor.getMonth(),1);

  const parseLocalDate=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
  const eventColor=c=>c==='Juventud'?'green':c==='Convocatoria'?'orange':'';
  const renderCalendar=()=>{
    if(!grid||!title)return;
    const y=cursor.getFullYear(),m=cursor.getMonth();
    title.textContent=`${monthTitle(monthNames[m])} ${y}`;
    grid.innerHTML='';
    const first=new Date(y,m,1),last=new Date(y,m+1,0);
    const firstDow=(first.getDay()+6)%7;
    const start=new Date(y,m,1-firstDow);
    const today=new Date(); today.setHours(0,0,0,0);
    for(let i=0;i<42;i++){
      const d=new Date(start);d.setDate(start.getDate()+i);
      const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayEvents=events.filter(e=>e.date===iso);
      const cell=document.createElement('div');cell.className='calendar-day';
      if(d.getMonth()!==m)cell.classList.add('muted');
      if(+d===+today)cell.classList.add('today');
      const evHtml=dayEvents.slice(0,2).map(e=>`<div class="day-event ${eventColor(e.category)}" title="${escapeHtml(e.title)}">${escapeHtml(e.title)}</div>`).join('');
      cell.innerHTML=`<span class="day-num">${d.getDate()}</span><div class="day-events">${evHtml}</div>`;
      grid.appendChild(cell);
    }
    renderUpcoming();
  };
  const escapeHtml=s=>String(s||'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const renderUpcoming=()=>{
    if(!upcoming)return;
    const now=new Date();now.setHours(0,0,0,0);
    const next=events.filter(e=>parseLocalDate(e.date)>=now).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
    if(!next.length){
      upcoming.innerHTML='<div class="empty-events"><i class="bi bi-calendar2-plus"></i><b>Calendario listo para actualizar</b><p>Agrega actividades en <code>assets/data/activities.json</code> y aparecerán aquí automáticamente.</p></div>';
      return;
    }
    upcoming.innerHTML=next.map(e=>{const d=parseLocalDate(e.date);return `<article class="upcoming-item"><span class="upcoming-date">${d.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})}</span><b>${escapeHtml(e.title)}</b><small>${escapeHtml([e.time,e.location].filter(Boolean).join(' · '))}</small></article>`}).join('');
  };
  fetch('assets/data/activities.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(data=>{events=Array.isArray(data)?data:[];renderCalendar()}).catch(()=>renderCalendar());
  document.getElementById('prevMonth')?.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()-1,1);renderCalendar()});
  document.getElementById('nextMonth')?.addEventListener('click',()=>{cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1);renderCalendar()});
  document.getElementById('todayMonth')?.addEventListener('click',()=>{const n=new Date();cursor=new Date(n.getFullYear(),n.getMonth(),1);renderCalendar()});
  renderCalendar();
})();
