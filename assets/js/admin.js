(async()=>{
  'use strict';
  const CMS=window.INMUDEJCMS;
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=CMS.escapeHtml;
  let data=null,profile=null,roles=[],users=[],invites=[],currentType=null,currentId=null;
  const permissionLabels={content:'Contenido y publicaciones',events:'Calendario',services:'Servicios y costos',docs:'Transparencia',institutional:'Información institucional',users:'Usuarios',roles:'Roles y permisos'};
  const titles={dashboard:'Panel de control',carousel:'Portada y carrousel',announcements:'Avisos y anuncios',tournaments:'Torneos y competencias',calls:'Convocatorias',forms:'Formularios',events:'Calendario de actividades',services:'Servicios y costos',sections:'Textos de secciones',institutional:'Información institucional',docs:'Transparencia',users:'Usuarios',roles:'Roles y permisos'};
  const sectionNames={conocenos:'Conócenos',announcements:'Avisos destacados',services:'Servicios',tournaments:'Torneos y competencias',calls:'Convocatorias e inscripciones',calendar:'Calendario de actividades',transparency:'Transparencia',social:'Publicaciones'};

  function toast(msg){const el=$('#adminToast');el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),3000)}
  function showError(msg=''){const el=$('#authError');el.textContent=msg;el.hidden=!msg}
  function setBusy(btn,on,text='Guardando…'){if(!btn)return;btn.disabled=on;if(on){btn.dataset.old=btn.innerHTML;btn.innerHTML=`<span class="spinner"></span>${text}`}else if(btn.dataset.old){btn.innerHTML=btn.dataset.old;delete btn.dataset.old}}
  function resetModalSubmit(){const b=$('#modalSubmit'),c=$('#cancelModal'),x=$('#closeModal');if(b){b.disabled=false;if(b.dataset.old){b.innerHTML=b.dataset.old;delete b.dataset.old}}if(c)c.disabled=false;if(x)x.disabled=false}
  function showModal(mode){const back=$('#modalBackdrop'),body=$('#modalFields');resetModalSubmit();$('#modalForm').dataset.mode=mode;back.hidden=false;document.body.classList.add('modal-open');if(body)body.scrollTop=0;requestAnimationFrame(()=>{const first=$('#modalFields input:not([type=hidden]):not([disabled]), #modalFields select:not([disabled]), #modalFields textarea:not([disabled])');first?.focus({preventScroll:true})})}
  function can(key){return key?CMS.can(profile,key):true}
  function status(active){return `<span class="status-chip ${active===false?'off':''}">${active===false?'Oculto':'Publicado'}</span>`}
  function fmtDate(v){if(!v)return 'Sin fecha';const d=new Date(v+'T12:00:00');return Number.isNaN(d.getTime())?v:new Intl.DateTimeFormat('es-MX',{day:'2-digit',month:'short',year:'numeric'}).format(d)}
  function fmtDateTime(v){if(!v)return '—';const d=new Date(v);return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('es-MX',{dateStyle:'medium',timeStyle:'short'}).format(d)}
  function empty(icon,title,text='Aún no hay elementos publicados.') {return `<div class="empty-admin"><i class="bi ${icon}"></i><b>${esc(title)}</b><span>${esc(text)}</span></div>`}
  function itemActions(type,item,{toggle=true,remove=true}={}){return `<div class="row-actions"><button data-edit="${type}" data-id="${esc(item.id)}" title="Editar"><i class="bi bi-pencil"></i></button>${toggle?`<button data-toggle="${type}" data-id="${esc(item.id)}" data-active="${item.active!==false}" title="${item.active!==false?'Ocultar':'Publicar'}"><i class="bi ${item.active!==false?'bi-eye-slash':'bi-eye'}"></i></button>`:''}${remove?`<button data-delete="${type}" data-id="${esc(item.id)}" title="Eliminar"><i class="bi bi-trash3"></i></button>`:''}</div>`}

  function applyPermissions(){
    $$('[data-permission]').forEach(el=>{el.hidden=!can(el.dataset.permission)});
    const active=$('.side-nav button.active[data-permission]');if(active?.hidden)switchView('dashboard');
  }
  function switchView(name){
    $$('.admin-view').forEach(v=>v.classList.toggle('active',v.dataset.panel===name));
    $$('.side-nav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    $('#viewTitle').textContent=titles[name]||'Administración';
    $('#sidebar').classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function fillInstitutional(){const s=data.site||{};const f=$('#institutionalForm');if(!f)return;for(const k of ['heroTitlePrefix','heroTitleAccent','heroLead','facebook','address','missionTitle','missionText','visionTitle','visionText'])if(f.elements[k])f.elements[k].value=s[k]||''}

  function renderStats(){
    const stats=[
      ['bi-images','blue',(data.carousel||[]).length,'Fotos de portada'],
      ['bi-bell-fill','orange',(data.announcements||[]).length,'Avisos'],
      ['bi-trophy-fill','green',(data.tournaments||[]).length,'Torneos'],
      ['bi-megaphone-fill','purple',(data.calls||[]).length,'Convocatorias'],
      ['bi-calendar-event','blue',(data.events||[]).length,'Eventos'],
      ['bi-stars','green',(data.services||[]).length,'Servicios'],
      ['bi-ui-checks-grid','orange',(data.forms||[]).length,'Formularios'],
      ['bi-file-earmark-text','purple',(data.docs||[]).length,'Documentos']
    ];
    $('#statsGrid').innerHTML=stats.map(([i,c,n,t])=>`<article class="stat-card"><span class="stat-icon ${c}"><i class="bi ${i}"></i></span><div><b>${n}</b><span>${t}</span></div></article>`).join('');
    $('#lastUpdate').textContent=fmtDateTime(data.updatedAt);
    $('#currentRole').textContent=profile?.roles?.name||'—';
  }

  function renderCarousel(){const root=$('#carouselList'),items=data.carousel||[];root.innerHTML=items.length?items.map(x=>`<article class="manage-card"><div class="manage-media"><img src="${esc(x.image||'assets/img/natacion-inmudej.jpg')}" alt=""><span class="status-chip ${x.active===false?'off':''}">${x.active===false?'Oculta':'Visible'}</span></div><div class="manage-card-body"><h3>${esc(x.title||'Fotografía')}</h3><p>${esc(x.subtitle||'Sin texto secundario')}</p><span class="price-pill">Orden ${Number(x.order||0)}</span><div class="card-actions">${itemActions('carousel',x).replace('<div class="row-actions">','').replace('</div>','')}</div></div></article>`).join(''):empty('bi-images','Sin fotografías','Agrega una fotografía para la portada.')}

  function renderAnnouncements(q=''){const items=(data.announcements||[]).filter(x=>(x.title+' '+x.summary).toLowerCase().includes(q.toLowerCase()));$('#announcementsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main">${x.image?`<img class="list-thumb" src="${esc(x.image)}" alt="">`:`<span class="list-thumb"><i class="bi bi-bell"></i></span>`}<div><b>${esc(x.title)}</b><small>${esc(x.summary||'Sin descripción')}</small></div></div><span class="list-meta">${fmtDate(x.date)}</span><span class="list-meta hide-sm">Prioridad ${Number(x.priority||0)} · ${status(x.active)}</span>${itemActions('announcements',x)}</div>`).join(''):empty('bi-bell','Sin avisos','Crea el primer aviso destacado.')}

  function renderTournaments(q=''){const items=(data.tournaments||[]).filter(x=>(x.title+' '+x.sport+' '+x.location).toLowerCase().includes(q.toLowerCase()));$('#tournamentsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main">${x.image?`<img class="list-thumb" src="${esc(x.image)}" alt="">`:`<span class="list-thumb"><i class="bi bi-trophy"></i></span>`}<div><b>${esc(x.title)}</b><small>${esc(x.sport||'Deporte')} · ${esc(x.location||'Sede por definir')}</small></div></div><span class="list-meta">${fmtDate(x.startDate)}${x.endDate&&x.endDate!==x.startDate?' — '+fmtDate(x.endDate):''}</span><span class="list-meta hide-sm">${x.featured?'Destacado · ':''}${status(x.active)}</span>${itemActions('tournaments',x)}</div>`).join(''):empty('bi-trophy','Sin torneos','Registra el primer torneo o competencia.')}

  function renderCalls(q=''){const items=(data.calls||[]).filter(x=>(x.title+' '+x.category+' '+x.summary).toLowerCase().includes(q.toLowerCase()));$('#callsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main">${x.image?`<img class="list-thumb" src="${esc(x.image)}" alt="">`:`<span class="list-thumb"><i class="bi bi-megaphone"></i></span>`}<div><b>${esc(x.title)}</b><small>${esc(x.category||'Convocatoria')}</small></div></div><span class="list-meta">${fmtDate(x.date)}</span><span class="list-meta hide-sm">${status(x.active)}</span>${itemActions('calls',x)}</div>`).join(''):empty('bi-megaphone','Sin convocatorias','Publica la primera convocatoria.')}

  function renderForms(){const items=data.forms||[];const uses=id=>[['Convocatorias',(data.calls||[]).filter(x=>x.formId===id).length],['Torneos',(data.tournaments||[]).filter(x=>x.formId===id).length],['Avisos',(data.announcements||[]).filter(x=>x.formId===id).length],['Eventos',(data.events||[]).filter(x=>x.formId===id).length]].filter(([,n])=>n).map(([name,n])=>`${name}: ${n}`).join(' · ')||'Sin publicaciones vinculadas';$('#formsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main"><span class="list-thumb"><i class="bi bi-ui-checks-grid"></i></span><div><b>${esc(x.title)}</b><small>${esc(x.description||'Formulario de inscripción')}</small></div></div><span class="list-meta">${esc(x.type||'Enlace')}<br><small>${esc(uses(x.id))}</small></span><span class="list-meta hide-sm">${status(x.active)}</span>${x.type==='Registro interno'?`<div class="row-actions"><button data-form-records="${esc(x.id)}" title="Ver y exportar registros"><i class="bi bi-download"></i></button></div>`:''}${itemActions('forms',x)}</div>`).join(''):empty('bi-ui-checks-grid','Sin formularios','Agrega un formato o enlace de inscripción.')}

  function renderEvents(q=''){const items=(data.events||[]).filter(x=>(x.title+' '+x.location+' '+x.category).toLowerCase().includes(q.toLowerCase()));$('#eventsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main"><span class="list-thumb"><i class="bi bi-calendar-event"></i></span><div><b>${esc(x.title)}</b><small>${esc(x.category||'Actividad')} · ${esc(x.location||'Sede por definir')}</small></div></div><span class="list-meta">${fmtDate(x.date)}${x.time?' · '+esc(x.time):''}</span><span class="list-meta hide-sm">${status(x.active)}</span>${itemActions('events',x)}</div>`).join(''):empty('bi-calendar-event','Sin eventos','Registra la primera actividad del calendario.')}

  function renderServices(){const items=data.services||[];$('#servicesList').innerHTML=items.length?items.map(x=>`<article class="manage-card">${x.image?`<div class="manage-media"><img src="${esc(x.image)}" alt=""></div>`:''}<div class="manage-card-body"><div class="mini-heading"><span class="service-admin-icon ${esc(x.tone||'blue')}"><i class="bi ${esc(x.icon||'bi-stars')}"></i></span>${status(x.active)}</div><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${x.price?`<span class="price-pill">${esc(x.price)}</span>`:''}<div class="card-actions">${itemActions('services',x).replace('<div class="row-actions">','').replace('</div>','')}</div></div></article>`).join(''):empty('bi-stars','Sin servicios','Agrega un servicio, curso o instalación.')}

  function renderSections(){const items=[...(data.sections||[])].sort((a,b)=>(a.order||0)-(b.order||0));$('#sectionsList').innerHTML=items.length?items.map(x=>`<article class="manage-card section-manage-card"><div class="manage-card-body"><div class="section-card-top"><span class="section-number">${String(Number(x.order||0)).padStart(2,'0')}</span>${status(x.active)}</div><span class="view-kicker">${esc(x.eyebrow||sectionNames[x.id]||x.id)}</span><h3>${esc(x.title||sectionNames[x.id]||x.id)}</h3><p>${esc(x.description||'Sin descripción')}</p><div class="card-actions"><button data-edit="sections" data-id="${esc(x.id)}" title="Editar"><i class="bi bi-pencil"></i></button><button data-toggle="sections" data-id="${esc(x.id)}" data-active="${x.active!==false}" title="${x.active!==false?'Ocultar':'Publicar'}"><i class="bi ${x.active!==false?'bi-eye-slash':'bi-eye'}"></i></button></div></div></article>`).join(''):empty('bi-layout-text-window','Sin secciones')}

  function renderDocs(){const items=data.docs||[];$('#docsList').innerHTML=items.length?items.map(x=>`<div class="list-row"><div class="list-main"><span class="list-thumb"><i class="bi ${esc(x.icon||'bi-file-earmark-text')}"></i></span><div><b>${esc(x.title)}</b><small>${esc(x.description||'Documento institucional')}</small></div></div><span class="list-meta">${esc(x.type||'Documento')}</span><span class="list-meta hide-sm">${status(x.active)}</span>${itemActions('docs',x)}</div>`).join(''):empty('bi-folder2-open','Sin documentos','Agrega un documento de consulta pública.')}

  function renderUsers(){if(!$('#usersList'))return;$('#usersList').innerHTML=users.length?users.map(u=>`<div class="list-row user-row"><div class="list-main"><span class="user-avatar">${esc((u.full_name||u.username||'U').charAt(0).toUpperCase())}</span><div><b>${esc(u.full_name||u.username||'Usuario')}</b><small>${esc(u.email||'')}</small></div></div><span class="role-chip">${esc(u.roles?.name||'Sin rol')}</span>${status(u.active)}<div class="row-actions"><button data-user-password="${u.id}" title="Enviar enlace para restablecer contraseña" aria-label="Enviar enlace para restablecer contraseña a ${esc(u.full_name||u.username||'usuario')}"><i class="bi bi-key"></i></button><button data-user-edit="${u.id}" title="Editar"><i class="bi bi-pencil"></i></button></div></div>`).join(''):empty('bi-people','Sin usuarios')}
  function renderInvites(){if(!$('#invitesList'))return;$('#invitesList').innerHTML=invites.length?invites.map(i=>{const state=i.accepted_at?'Aceptada':new Date(i.expires_at)<new Date()?'Vencida':'Pendiente';return `<div class="list-row"><div class="list-main"><span class="list-thumb"><i class="bi bi-envelope"></i></span><div><b>${esc(i.username||i.email)}</b><small>${esc(i.email)}</small></div></div><span class="role-chip">${esc(i.roles?.name||'Rol')}</span><span class="status-chip ${state==='Pendiente'?'':'off'}">${state}</span><div class="row-actions">${state==='Pendiente'?`<button data-copy-invite="${esc(i.token)}" title="Copiar enlace"><i class="bi bi-link-45deg"></i></button>`:''}</div></div>`}).join(''):empty('bi-envelope','Sin invitaciones')}
  function renderRoles(){if(!$('#rolesList'))return;roles.length?$('#rolesList').innerHTML=roles.map(r=>`<article class="manage-card role-card"><div class="manage-card-body"><div class="role-head"><span class="role-icon"><i class="bi bi-person-badge"></i></span><div><h3>${esc(r.name)}</h3><small>${esc(r.code)}</small></div></div><p>${esc(r.description||'')}</p><div class="permission-chips">${Object.entries(permissionLabels).map(([k,v])=>`<span class="${r.permissions?.[k]?'':'muted'}">${esc(v)}</span>`).join('')}</div><div class="card-actions"><button data-role-edit="${r.id}" title="Editar"><i class="bi bi-pencil"></i></button>${r.is_system?'':`<button data-role-delete="${r.id}" title="Eliminar"><i class="bi bi-trash3"></i></button>`}</div></div></article>`).join(''):$('#rolesList').innerHTML=empty('bi-person-lock','Sin roles')}

  function renderAll(){renderStats();renderCarousel();renderAnnouncements();renderTournaments();renderCalls();renderForms();renderEvents();renderServices();renderSections();renderDocs();fillInstitutional();renderUsers();renderInvites();renderRoles();bindActions()}

  async function reloadAll(){data=await CMS.loadAdmin();if(can('users'))users=await CMS.listUsers();if(can('roles')||can('users'))roles=await CMS.listRoles();if(can('users'))invites=await CMS.listInvites();renderAll()}

  const schemas={
    carousel:{permission:'content',folder:'carousel',kicker:'Portada',title:'Fotografía',fields:[['title','Título','text',true],['subtitle','Texto secundario','textarea'],['image','Fotografía','image',true],['order','Orden','number'],['active','Mostrar en portada','checkbox']]},
    announcements:{permission:'content',folder:'avisos',kicker:'Avisos',title:'Aviso',fields:[['title','Título','text',true],['date','Fecha de publicación','date'],['summary','Bases e información','textarea',true],['image','Fotografía','image'],['link','Enlace con más información','url'],['formId','Formulario de inscripción','formselect'],['priority','Prioridad','number'],['active','Publicar en el sitio','checkbox']]},
    tournaments:{permission:'content',folder:'torneos',kicker:'Torneos',title:'Torneo',fields:[['title','Nombre del torneo o competencia','text',true],['sport','Disciplina / deporte','text',true],['startDate','Fecha de inicio','date'],['endDate','Fecha de término','date'],['location','Sede / ubicación','text'],['summary','Descripción','textarea',true],['image','Fotografía o cartel','image'],['link','Enlace con más información','url'],['formId','Formulario de inscripción','formselect'],['featured','Destacar en la landing','checkbox'],['active','Publicar en el sitio','checkbox']]},
    calls:{permission:'content',folder:'convocatorias',kicker:'Convocatorias',title:'Convocatoria',fields:[['title','Título','text',true],['category','Categoría','text'],['date','Fecha límite o fecha principal','date'],['summary','Descripción','textarea',true],['image','Fotografía o cartel','image'],['link','Enlace con más información','url'],['formId','Formulario de inscripción','formselect'],['active','Publicar en el sitio','checkbox']]},
    forms:{permission:'content',folder:'formularios',kicker:'Formularios',title:'Formulario',fields:[['title','Nombre','text',true],['description','Descripción','textarea'],['type','Tipo','select',false,['PDF','Formulario en línea','Enlace externo','Registro interno']],['fields','Campos del registro','formfields'],['url','Enlace o archivo actual','url'],['file','Subir archivo','file'],['active','Publicar','checkbox']]},
    events:{permission:'events',folder:'eventos',kicker:'Calendario',title:'Evento',fields:[['title','Nombre de la actividad','text',true],['date','Fecha','date',true],['time','Hora','time'],['location','Lugar','text'],['category','Categoría','select',false,['Deporte','Juventud','Torneo','Curso','Convocatoria','Comunidad']],['description','Información del evento','textarea'],['formId','Formulario de inscripción','formselect'],['active','Mostrar en calendario','checkbox']]},
    services:{permission:'services',folder:'servicios',kicker:'Servicios',title:'Servicio',fields:[['title','Nombre del servicio, curso o instalación','text',true],['description','Descripción','textarea',true],['image','Fotografía','image'],['price','Costo / cuota','text'],['details','Horario, requisitos o notas','textarea'],['icon','Ícono','text'],['tone','Color','select',false,['blue','green','orange','purple','cyan','amber']],['active','Mostrar en el sitio','checkbox']]},
    docs:{permission:'docs',folder:'transparencia',kicker:'Transparencia',title:'Documento',fields:[['title','Título','text',true],['type','Categoría','select',false,['Privacidad','Normatividad','Organización','Transparencia','Convocatoria']],['description','Descripción','textarea'],['url','Enlace o archivo actual','url'],['file','Subir PDF / documento','file'],['icon','Ícono','text'],['active','Publicar','checkbox']]},
    sections:{permission:'institutional',folder:'',kicker:'Secciones',title:'Sección',fields:[['eyebrow','Etiqueta superior','text'],['title','Título de la sección','text',true],['description','Descripción','textarea'],['order','Orden','number'],['active','Mostrar sección','checkbox']]}
  };

  const registrationFieldTypes=[['text','Respuesta corta'],['textarea','Texto largo'],['email','Correo electrónico'],['tel','Teléfono'],['age','Edad'],['number','Número'],['date','Fecha'],['select','Lista desplegable'],['radio','Opción múltiple']];
  const fieldTypeOptions=selected=>registrationFieldTypes.map(([value,label])=>`<option value="${value}" ${value===selected?'selected':''}>${label}</option>`).join('');
  const normalizedField=field=>({label:field?.label||'',type:registrationFieldTypes.some(([value])=>value===field?.type)?field.type:'text',options:Array.isArray(field?.options)?field.options:[],required:field?.required===true});
  const defaultRegistrationFields=()=>[{label:'Nombre completo',type:'text',options:[],required:true},{label:'Correo electrónico',type:'email',options:[],required:true},{label:'Teléfono',type:'tel',options:[],required:true}];
  function builderFieldHtml(field,index){const current=normalizedField(field),needsOptions=['select','radio'].includes(current.type);return `<article class="builder-field" data-builder-field><span class="builder-number">${index+1}</span><div class="builder-field-main"><label>Pregunta<input data-builder-key="label" value="${esc(current.label)}" placeholder="Ej. Nombre completo"></label><label>Tipo<select data-builder-key="type">${fieldTypeOptions(current.type)}</select></label>${needsOptions?`<label class="builder-options">Opciones <input data-builder-key="options" value="${esc(current.options.join(', '))}" placeholder="Ej. Infantil, Juvenil, Libre"></label>`:''}<label class="checkline builder-required"><input type="checkbox" data-builder-key="required" ${current.required?'checked':''}> Obligatorio</label></div><button class="builder-remove" type="button" data-remove-form-field title="Eliminar campo" aria-label="Eliminar campo"><i class="bi bi-trash3"></i></button></article>`}
  function readRegistrationBuilder(root){const builder=$('[data-form-builder]',root);if(!builder)return [];return $$('[data-builder-field]',builder).map(row=>{const label=$('[data-builder-key="label"]',row)?.value.trim()||'',type=$('[data-builder-key="type"]',row)?.value||'text',rawOptions=$('[data-builder-key="options"]',row)?.value||'';return {name:label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')||CMS.uid('field'),label,type,options:['select','radio'].includes(type)?rawOptions.split(',').map(x=>x.trim()).filter(Boolean):[],required:!!$('[data-builder-key="required"]',row)?.checked}}).filter(field=>field.label)}
  function renderRegistrationBuilder(builder,fields){builder.querySelector('.builder-list').innerHTML=fields.map(builderFieldHtml).join('')}
  function mountRegistrationBuilder(fields){const builder=$('[data-form-builder]');if(!builder)return;let current=(Array.isArray(fields)&&fields.length?fields:defaultRegistrationFields()).map(normalizedField);renderRegistrationBuilder(builder,current);builder.onclick=e=>{if(e.target.closest('[data-add-form-field]')){current=readRegistrationBuilder($('#modalForm'));current.push({label:'',type:'text',options:[],required:false});renderRegistrationBuilder(builder,current)}if(e.target.closest('[data-remove-form-field]')){const index=$$('[data-builder-field]',builder).indexOf(e.target.closest('[data-builder-field]'));current=readRegistrationBuilder($('#modalForm'));current.splice(index,1);renderRegistrationBuilder(builder,current)}};builder.onchange=e=>{if(e.target.matches('[data-builder-key="type"]')){current=readRegistrationBuilder($('#modalForm'));renderRegistrationBuilder(builder,current)}}}
  function syncFormEditor(){if(currentType!=='forms')return;const mode=$('[name="type"]')?.value||'',internal=mode==='Registro interno',external=mode==='Formulario en línea'||mode==='Enlace externo',builder=$('[data-form-builder]')?.closest('.form-builder-wrap'),url=$('[name="url"]')?.closest('label'),upload=$('[name="urlFile"]')?.closest('label');if(builder)builder.hidden=!internal;if(url){url.hidden=internal;const label=url.firstChild;if(label)label.textContent=external?'Enlace de Google Forms u otro formulario':'Enlace o archivo actual'}if(upload)upload.hidden=internal||external}

  function fieldHtml(f,val){
    const [name,label,type,required,opts]=f,req=required?'required':'';
    if(type==='textarea')return `<label class="wide">${label}<textarea name="${name}" rows="4" ${req}>${esc(val||'')}</textarea></label>`;
    if(type==='select')return `<label>${label}<select name="${name}" ${req}>${(opts||[]).map(o=>`<option value="${esc(o)}" ${String(val)===o?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`;
    if(type==='formselect')return `<label>${label}<select name="${name}"><option value="">Sin formulario</option>${(data.forms||[]).map(o=>`<option value="${esc(o.id)}" ${String(val)===o.id?'selected':''}>${esc(o.title)}</option>`).join('')}</select></label>`;
    if(type==='formfields')return `<section class="wide form-builder-wrap"><div class="form-builder" data-form-builder><div class="form-builder-head"><div><b>Campos del registro</b><span>Crea las preguntas que verán las personas al inscribirse.</span></div><button type="button" class="secondary-btn builder-add" data-add-form-field><i class="bi bi-plus-lg"></i> Agregar campo</button></div><div class="builder-list"></div></div></section>`
    if(type==='checkbox')return `<label class="wide checkline"><input type="checkbox" name="${name}" ${val!==false?'checked':''}> ${label}</label>`;
    if(type==='image')return `<label class="wide preview-upload">${label}<input type="file" name="${name}File" accept="image/jpeg,image/png,image/webp" ${required&&!val?'required':''}><span class="field-hint">JPG, PNG o WEBP. La imagen se optimiza automáticamente antes de publicarse.</span>${val?`<img src="${esc(val)}" alt="Vista previa">`:''}<input type="hidden" name="${name}" value="${esc(val||'')}"></label>`;
    if(type==='file')return `<label class="wide preview-upload">${label}<input type="file" name="${name}File" accept="application/pdf,.doc,.docx"><span class="field-hint">Opcional si ya indicaste un enlace.</span></label>`;
    return `<label>${label}<input name="${name}" type="${type}" value="${esc(val??'')}" ${req}></label>`;
  }

  function openContentModal(type,id=null){
    const sch=schemas[type];if(!sch||!can(sch.permission))return toast('Tu rol no tiene permiso para este módulo.');
    currentType=type;currentId=id;const item=id?(data[type]||[]).find(x=>x.id===id)||{}:{};
    $('#modalKicker').textContent=sch.kicker;$('#modalTitle').textContent=`${id?'Editar':'Nuevo'} ${sch.title.toLowerCase()}`;$('#modalFields').innerHTML=sch.fields.map(f=>fieldHtml(f,item[f[0]])).join('');
    if(type==='forms'){mountRegistrationBuilder(item.fields);$('[name="type"]')?.addEventListener('change',syncFormEditor);syncFormEditor()}
    showModal('content');
  }
  function closeModal(){currentType=null;currentId=null;const back=$('#modalBackdrop'),form=$('#modalForm');back.hidden=true;document.body.classList.remove('modal-open');form.reset();$('#modalFields').innerHTML='';delete form.dataset.mode;resetModalSubmit()}
  async function compressImage(file){if(!file||!file.type.startsWith('image/'))return file;return await new Promise((resolve,reject)=>{const img=new Image(),r=new FileReader();r.onload=()=>{img.onload=()=>{const max=1800,scale=Math.min(1,max/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(blob=>blob?resolve(new File([blob],file.name.replace(/\.[^.]+$/,'.jpg'),{type:'image/jpeg'})):reject(new Error('No fue posible preparar la imagen.')),'image/jpeg',.86)};img.onerror=reject;img.src=r.result};r.onerror=reject;r.readAsDataURL(file)})}

  function bindActions(){
    $$('[data-edit]').forEach(b=>b.onclick=()=>openContentModal(b.dataset.edit,b.dataset.id));
    $$('[data-form-records]').forEach(b=>b.onclick=()=>openRecordsModal(b.dataset.formRecords));
    $$('[data-toggle]').forEach(b=>b.onclick=async()=>{try{await CMS.toggleItem(b.dataset.toggle,b.dataset.id,b.dataset.active!=='true');await reloadAll();toast('Visibilidad actualizada')}catch(e){toast(e.message||'No fue posible actualizar')}});
    $$('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar este elemento? Esta acción no se puede deshacer.'))return;try{await CMS.deleteItem(b.dataset.delete,b.dataset.id);await reloadAll();toast('Elemento eliminado')}catch(e){toast(e.message||'No fue posible eliminar')}});
    $$('[data-user-edit]').forEach(b=>b.onclick=()=>openUserModal(b.dataset.userEdit));
    $$('[data-user-password]').forEach(b=>b.onclick=async()=>{
      const u=users.find(x=>x.id===b.dataset.userPassword);
      if(!u?.email)return toast('Este usuario no tiene un correo de recuperación.');
      if(!confirm(`¿Enviar un enlace de restablecimiento a ${u.email}?`))return;
      const original=b.innerHTML;b.disabled=true;b.innerHTML='<span class="spinner dark"></span>';
      try{await CMS.requestPasswordReset(u.email);toast('Enlace de recuperación enviado. Solo puede usarse una vez.')}catch(e){toast(e.message||'No fue posible enviar el enlace. Intenta en unos minutos.')}finally{b.disabled=false;b.innerHTML=original}
    });
    $$('[data-role-edit]').forEach(b=>b.onclick=()=>openRoleModal(b.dataset.roleEdit));
    $$('[data-role-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('¿Eliminar este rol?'))return;try{await CMS.deleteRole(b.dataset.roleDelete);roles=await CMS.listRoles();renderRoles();bindActions();toast('Rol eliminado')}catch(e){toast(e.message||'No fue posible eliminar')}});
    $$('[data-copy-invite]').forEach(b=>b.onclick=async()=>{const u=new URL('register.html',location.href);u.searchParams.set('token',b.dataset.copyInvite);await navigator.clipboard.writeText(u.href).catch(()=>{});toast('Enlace de invitación copiado')});
  }

  $('#modalForm').addEventListener('submit',async e=>{
    e.preventDefault();
    // Conservar una referencia estable al formulario. Event.currentTarget sólo está
    // garantizado durante la fase síncrona del evento y puede quedar en null tras un await.
    const form=e.currentTarget,mode=form.dataset.mode,submit=$('#modalSubmit'),controls=form.elements;
    setBusy(submit,true);$('#cancelModal').disabled=true;$('#closeModal').disabled=true;
    try{
      if(mode==='content'){
        const type=currentType,sch=schemas[type];
        if(!sch)throw new Error('No fue posible identificar el módulo a guardar.');
        const fd=new FormData(form),existing=currentId?(data[type]||[]).find(x=>x.id===currentId):null,obj=existing?{...existing}:{id:CMS.uid(type)};
        for(const f of sch.fields){
          const [name,,kind]=f;
          if(kind==='checkbox'){
            obj[name]=!!controls[name]?.checked;
          }else if(kind==='image'){
            const file=controls[name+'File']?.files?.[0];
            obj[name]=file?await CMS.uploadFile(await compressImage(file),sch.folder):fd.get(name)||'';
          }else if(kind==='file'){
            const file=controls[name+'File']?.files?.[0];
            if(file)obj.url=await CMS.uploadFile(file,sch.folder);
          }else if(kind==='formfields'){
            obj[name]=readRegistrationBuilder(form);
          }else if(kind==='number'){
            obj[name]=Number(fd.get(name)||0);
          }else{
            obj[name]=fd.get(name)||'';
          }
        }
        if((type==='forms'&&obj.type!=='Registro interno'||type==='docs')&&!obj.url)throw new Error('Indica un enlace o sube un archivo.');
        if(type==='forms'&&obj.type==='Registro interno'&&!obj.fields?.length)throw new Error('Agrega al menos un campo para el registro interno.');
        if(type==='tournaments'&&obj.endDate&&obj.startDate&&obj.endDate<obj.startDate)throw new Error('La fecha de término no puede ser anterior a la fecha de inicio.');
        await CMS.saveItem(type,obj);toast(`${sch.title} guardado`);closeModal();await reloadAll();
      }else if(mode==='records'){exportRegistrations(JSON.parse(form.dataset.registrations||'[]'),form.dataset.formTitle||'registros');toast('CSV descargado')}
      else if(mode==='user'){await saveUserFromModal(form);closeModal();[users,invites]=await Promise.all([CMS.listUsers(),CMS.listInvites()]);renderUsers();renderInvites();bindActions();toast('Usuario actualizado')}
      else if(mode==='invite'){await saveInviteFromModal(form);closeModal();invites=await CMS.listInvites();renderInvites();bindActions()}
      else if(mode==='role'){await saveRoleFromModal(form);closeModal();roles=await CMS.listRoles();renderRoles();bindActions();toast('Rol guardado')}
    }catch(err){toast(err.message||'No fue posible guardar')}finally{setBusy(submit,false);$('#cancelModal').disabled=false;$('#closeModal').disabled=false}
  });

  function csvCell(value){return `"${String(value??'').replaceAll('"','""')}"`}
  function exportRegistrations(records,title){const keys=[...new Set(records.flatMap(r=>Object.keys(r.data||{})))],header=['Fecha de registro','Actividad','ID de actividad',...keys],rows=records.map(r=>[fmtDateTime(r.submitted_at),r.content_type,r.content_id,...keys.map(k=>r.data?.[k]||'')]);const csv='\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${String(title).toLowerCase().replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')||'registros'}-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url)}
  async function openRecordsModal(formId){const formItem=(data.forms||[]).find(x=>x.id===formId);if(!formItem)return;try{const records=await CMS.listRegistrations(formId);showModal('records');$('#modalKicker').textContent='Inscripciones';$('#modalTitle').textContent=`Registros: ${formItem.title}`;$('#modalFields').innerHTML=`<div class="wide modal-info"><i class="bi bi-people-fill"></i><span><b>${records.length} registro${records.length===1?'':'s'}</b><br>La descarga incluye todos los campos y la actividad vinculada.</span></div>${records.length?`<div class="wide registration-preview">${records.slice(0,8).map(r=>`<article><b>${esc(fmtDateTime(r.submitted_at))}</b><span>${esc(Object.values(r.data||{}).filter(Boolean).slice(0,3).join(' · ')||'Sin datos')}</span></article>`).join('')}${records.length>8?`<small>Mostrando 8 de ${records.length}; el CSV contiene todos.</small>`:''}</div>`:'<div class="wide modal-info"><i class="bi bi-inbox"></i><span>Aún no hay registros para este formulario.</span></div>'}`;const modalForm=$('#modalForm'),submit=$('#modalSubmit');modalForm.dataset.registrations=JSON.stringify(records);modalForm.dataset.formTitle=formItem.title;submit.disabled=!records.length;submit.innerHTML='<i class="bi bi-download"></i> Exportar CSV'}catch(err){toast(err.message||'No fue posible cargar los registros')}}

  function openUserModal(id){const u=users.find(x=>x.id===id);if(!u)return;currentId=id;$('#modalKicker').textContent='Usuarios';$('#modalTitle').textContent='Editar usuario';$('#modalFields').innerHTML=`<label>Nombre<input name="full_name" value="${esc(u.full_name||'')}"></label><label>Usuario<input name="username" value="${esc(u.username||'')}" required></label><label class="wide">Correo<input value="${esc(u.email||'')}" disabled></label><label>Rol<select name="role_id" required>${roles.map(r=>`<option value="${r.id}" ${r.id===u.role_id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label><label class="checkline"><input type="checkbox" name="active" ${u.active!==false?'checked':''}> Acceso activo</label>`;showModal('user')}
  async function saveUserFromModal(form){const fd=new FormData(form);await CMS.updateUser(currentId,{full_name:fd.get('full_name')||'',username:fd.get('username')||'',role_id:fd.get('role_id'),active:form.elements.active.checked})}
  function openInviteModal(){currentId=null;$('#modalKicker').textContent='Usuarios';$('#modalTitle').textContent='Invitar usuario';$('#modalFields').innerHTML=`<label>Correo<input name="email" type="email" required></label><label>Usuario<input name="username" required placeholder="nombre.apellido"></label><label>Rol<select name="role_id" required>${roles.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></label><label>Vigencia<select name="days"><option value="3">3 días</option><option value="7" selected>7 días</option><option value="14">14 días</option><option value="30">30 días</option></select></label><div class="wide modal-info"><i class="bi bi-link-45deg"></i><span>Se generará un enlace único para que la persona invitada configure su acceso.</span></div>`;showModal('invite')}
  async function saveInviteFromModal(form){const fd=new FormData(form),invite=await CMS.createInvite({email:fd.get('email'),username:fd.get('username'),role_id:fd.get('role_id'),days:fd.get('days')});const u=new URL('register.html',location.href);u.searchParams.set('token',invite.token);await navigator.clipboard.writeText(u.href).catch(()=>{});toast('Invitación creada y enlace copiado')}

  function openRoleModal(id=null){const r=id?roles.find(x=>x.id===id):null;currentId=id;$('#modalKicker').textContent='Roles y permisos';$('#modalTitle').textContent=id?'Editar rol':'Nuevo rol';$('#modalFields').innerHTML=`<label>Nombre<input name="name" value="${esc(r?.name||'')}" required></label><label>Código<input name="code" value="${esc(r?.code||'')}" ${r?.is_system?'readonly':''} placeholder="ej. comunicacion" required></label><label class="wide">Descripción<textarea name="description" rows="3">${esc(r?.description||'')}</textarea></label><div class="wide permission-editor"><b>Permisos del rol</b><p>Selecciona los módulos que podrá modificar.</p>${Object.entries(permissionLabels).map(([k,v])=>`<label><input type="checkbox" name="perm_${k}" ${r?.permissions?.[k]?'checked':''}> <span>${v}</span></label>`).join('')}</div>`;showModal('role')}
  async function saveRoleFromModal(form){const fd=new FormData(form),existing=currentId?roles.find(x=>x.id===currentId):null,permissions={};Object.keys(permissionLabels).forEach(k=>permissions[k]=!!form.elements['perm_'+k]?.checked);const role={id:existing?.id,code:String(fd.get('code')||'').trim().toLowerCase().replace(/[^a-z0-9_-]+/g,'-'),name:fd.get('name'),description:fd.get('description')||'',permissions,is_system:existing?.is_system||false};await CMS.saveRole(role)}

  async function openPanel(){
    profile=await CMS.getProfile();if(!profile||profile.active===false){await CMS.signOut();throw new Error('Tu acceso no está activo.');}
    $('#authLoading').hidden=true;$('#setupView').hidden=true;$('#loginView').hidden=true;$('#authShell').hidden=true;$('#adminShell').hidden=false;document.body.classList.remove('modal-open');$('#adminName').textContent=profile.full_name||profile.username||'Administrador';$('#adminEmail').textContent=profile.email||'';$('#adminAvatar').textContent=(profile.full_name||profile.username||'A').charAt(0).toUpperCase();
    applyPermissions();
    data=await CMS.loadAdmin();
    if(can('users'))users=await CMS.listUsers();
    if(can('users')||can('roles'))roles=await CMS.listRoles();
    if(can('users'))invites=await CMS.listInvites();
    renderAll();
  }

  async function initAuth(){
    $('#adminShell').hidden=true;$('#authShell').hidden=false;$('#setupView').hidden=true;$('#loginView').hidden=true;$('#authLoading').hidden=false;showError('');
    try{
      const session=await CMS.getSession();
      if(session){try{if(await CMS.bootstrapStatus())await CMS.claimFirstAdmin()}catch(_){}await openPanel();return;}
      const first=await CMS.bootstrapStatus();$('#setupView').hidden=!first;$('#loginView').hidden=first;
    }catch(e){showError('No fue posible iniciar el panel. Intenta nuevamente.')}finally{$('#authLoading').hidden=true}
  }

  $('#setupForm')?.addEventListener('submit',async e=>{e.preventDefault();showError('');const f=e.currentTarget,p=f.elements.password.value,c=f.elements.confirm.value,b=f.querySelector('button[type=submit]');if(p!==c)return showError('Las contraseñas no coinciden.');setBusy(b,true,'Creando…');try{const r=await CMS.setupAdmin({name:f.elements.name.value,email:f.elements.email.value,password:p});if(r.session){try{await CMS.claimFirstAdmin()}catch(_){}await openPanel();toast('Administrador creado')}else{showError('Cuenta creada. Revisa tu correo y completa la verificación para ingresar.');$('#setupView').hidden=true;$('#loginView').hidden=false}}catch(err){showError(err.message||'No fue posible crear el administrador.')}finally{setBusy(b,false)}});
  $('#loginForm')?.addEventListener('submit',async e=>{e.preventDefault();showError('');const f=e.currentTarget,b=f.querySelector('button[type=submit]');setBusy(b,true,'Ingresando…');try{await CMS.signIn(f.elements.identifier.value,f.elements.password.value);try{if(await CMS.bootstrapStatus())await CMS.claimFirstAdmin()}catch(_){}await openPanel()}catch(err){showError(err.message==='Invalid login credentials'?'Usuario o contraseña incorrectos.':err.message||'No fue posible ingresar.')}finally{setBusy(b,false)}});
  $('#forgotPasswordBtn')?.addEventListener('click',async()=>{const identifier=$('#loginForm')?.elements?.identifier?.value?.trim()||window.prompt('Escribe tu usuario o correo de acceso:')?.trim();if(!identifier)return;const b=$('#forgotPasswordBtn');setBusy(b,true,'Enviando…');showError('');try{await CMS.requestPasswordReset(identifier);showError('Revisa tu correo: enviamos un enlace de recuperación de un solo uso.')}catch(err){showError(err.message||'No fue posible enviar el enlace. Intenta en unos minutos.')}finally{setBusy(b,false)}});
  $('#togglePassword')?.addEventListener('click',()=>{const i=$('#loginPassword'),show=i.type==='password';i.type=show?'text':'password';$('#togglePassword i').className=`bi ${show?'bi-eye-slash':'bi-eye'}`});
  $('#logoutBtn')?.addEventListener('click',async()=>{await CMS.signOut();location.reload()});
  $('#adminMenuBtn')?.addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $$('.side-nav button[data-view]').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));
  $$('[data-add]').forEach(b=>b.addEventListener('click',()=>openContentModal(b.dataset.add)));
  $$('[data-quick]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.quick;switchView(type);setTimeout(()=>openContentModal(type),80)}));
  $$('[data-search]').forEach(i=>i.addEventListener('input',()=>{const q=i.value,type=i.dataset.search;if(type==='announcements')renderAnnouncements(q);if(type==='tournaments')renderTournaments(q);if(type==='calls')renderCalls(q);if(type==='events')renderEvents(q);bindActions()}));
  $('#closeModal').onclick=closeModal;$('#cancelModal').onclick=closeModal;$('#modalBackdrop').addEventListener('click',e=>{if(e.target===$('#modalBackdrop')&&!$('#modalSubmit').disabled)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modalBackdrop').hidden&&!$('#modalSubmit').disabled)closeModal()});
  $('#inviteUserBtn')?.addEventListener('click',openInviteModal);$('#addRoleBtn')?.addEventListener('click',()=>openRoleModal());
  $('#institutionalForm')?.addEventListener('submit',async e=>{e.preventDefault();const b=e.submitter,fd=new FormData(e.currentTarget),site={...data.site};['heroTitlePrefix','heroTitleAccent','heroLead','facebook','address','missionTitle','missionText','visionTitle','visionText'].forEach(k=>site[k]=fd.get(k)||'');setBusy(b,true);try{data.site=await CMS.saveSite(site);data.updatedAt=new Date().toISOString();renderStats();toast('Información institucional actualizada')}catch(err){toast(err.message||'No fue posible guardar')}finally{setBusy(b,false)}});

  await initAuth();
})();
