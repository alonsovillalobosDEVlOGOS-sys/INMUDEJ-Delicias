(()=>{
  const cfg=window.INMUDEJ_CONFIG||{};
  const legacyKey='inmudej_cms_v2';
  const cacheKey='inmudej_cms_v4_cache';
  const seed={
    version:4,updatedAt:null,mode:'fallback',
    site:{
      heroTitlePrefix:'Deporte y juventud que',heroTitleAccent:'mueven a Delicias.',
      heroLead:'Un espacio para acercar actividades, servicios, programas y oportunidades que fortalecen la activación física, la convivencia y el desarrollo integral de niñas, niños, jóvenes y familias del municipio.',
      facebook:'https://www.facebook.com/INMUDEJDelicias',address:'Delicias, Chihuahua',
      missionTitle:'Promover una vida activa y un desarrollo integral',
      missionText:'Planear, promover, desarrollar, vigilar, fomentar y estimular la práctica y enseñanza del deporte, la cultura física y el desarrollo integral de la población del Municipio de Delicias, acercando programas y acciones con sentido comunitario.',
      visionTitle:'Un Delicias con más oportunidades para activarse y crecer',
      visionText:'Consolidar un instituto cercano, incluyente y dinámico, reconocido por fortalecer el deporte municipal y generar espacios, programas y experiencias que impulsen el talento, la participación juvenil, la convivencia y hábitos saludables.'
    },
    sections:[
      {id:'conocenos',eyebrow:'Conócenos',title:'Impulsamos el deporte, la cultura física y el desarrollo de la juventud',description:'INMUDEJ es el organismo municipal que articula acciones para acercar el deporte y oportunidades de desarrollo a la población de Delicias.',active:true,order:10},
      {id:'announcements',eyebrow:'Avisos destacados',title:'Información importante para nuestra comunidad',description:'Consulta anuncios, cambios, recordatorios y comunicados relevantes del Instituto.',active:true,order:20},
      {id:'services',eyebrow:'Servicios',title:'Atención y programas para una comunidad activa',description:'Consulta servicios, cursos, instalaciones, horarios, requisitos y cuotas vigentes.',active:true,order:30},
      {id:'tournaments',eyebrow:'Torneos y competencias',title:'Compite, participa y representa a Delicias',description:'Encuentra torneos, competencias y encuentros deportivos con fechas, sedes e información de inscripción.',active:true,order:40},
      {id:'calls',eyebrow:'Convocatorias e inscripciones',title:'Participa en las próximas actividades de INMUDEJ',description:'Consulta convocatorias vigentes, requisitos y formularios de inscripción para competencias, cursos, torneos y programas.',active:true,order:50},
      {id:'calendar',eyebrow:'Calendario de actividades',title:'Encuentra eventos, torneos, cursos y convocatorias',description:'Consulta la agenda actualizada de actividades del Instituto.',active:true,order:60},
      {id:'transparency',eyebrow:'Transparencia',title:'Información pública y normatividad',description:'Consulta avisos de privacidad, reglamentos, manuales y demás documentos institucionales del INMUDEJ.',active:true,order:70},
      {id:'social',eyebrow:'INMUDEJ en Facebook',title:'Publicaciones, convocatorias y resultados',description:'Consulta las publicaciones de la página oficial de INMUDEJ Delicias.',active:true,order:80}
    ],
    carousel:[
      {id:'car-1',title:'Más actividad. Más comunidad.',subtitle:'Deporte, juventud e inclusión para Delicias.',image:'assets/img/natacion-inmudej.jpg',active:true,order:1},
      {id:'car-2',title:'INMUDEJ Delicias',subtitle:'Programas y oportunidades para nuestra comunidad.',image:'assets/img/identidad-institucional.jpg',active:true,order:2}
    ],
    announcements:[],tournaments:[],calls:[],forms:[],events:[],
    services:[
      {id:'srv-1',title:'Ligas, torneos y competencias',description:'Organización y acompañamiento de actividades deportivas municipales, escolares y comunitarias.',icon:'bi-trophy',tone:'blue',price:'',details:'',image:'',active:true},
      {id:'srv-2',title:'Activación física y escuelas deportivas',description:'Programas para fomentar hábitos saludables, iniciación deportiva y práctica constante en distintas disciplinas.',icon:'bi-person-running',tone:'green',price:'',details:'',image:'',active:true},
      {id:'srv-3',title:'Impulso a deportistas y entrenadores',description:'Orientación y vinculación para fortalecer procesos de formación, participación y representación deportiva.',icon:'bi-award',tone:'orange',price:'',details:'',image:'',active:true},
      {id:'srv-4',title:'Programas para juventudes',description:'Actividades de participación, integración, reconocimiento y desarrollo para jóvenes de Delicias.',icon:'bi-people-fill',tone:'purple',price:'',details:'',image:'',active:true},
      {id:'srv-5',title:'Espacios e instalaciones deportivas',description:'Información sobre actividades y servicios que se desarrollan en instalaciones deportivas municipales.',icon:'bi-building',tone:'cyan',price:'',details:'',image:'',active:true},
      {id:'srv-6',title:'Integración e inclusión',description:'Acciones que utilizan el deporte como herramienta para convivencia, inclusión, bienestar y fortalecimiento comunitario.',icon:'bi-hearts',tone:'amber',price:'',details:'',image:'',active:true}
    ],
    docs:[
      {id:'doc-1',type:'Privacidad',title:'Aviso Simplificado de Privacidad',description:'Documento de información básica sobre el tratamiento de datos personales.',url:'assets/pdfs/privacidad/aviso-privacidad-simplificado.pdf',icon:'bi-shield-check',active:true},
      {id:'doc-2',type:'Privacidad',title:'Aviso de Privacidad Integral',description:'Información completa sobre finalidades, derechos y tratamiento de datos.',url:'assets/pdfs/privacidad/aviso-privacidad-integral.pdf',icon:'bi-file-lock2',active:true},
      {id:'doc-3',type:'Obligaciones',title:'Fracciones ICHITAIP',description:'Consulta las obligaciones de transparencia aplicables al Instituto.',url:'fracciones-ichitaip.html',icon:'bi-list-check',active:true},
      {id:'doc-4',type:'Normatividad',title:'Reglamento Interior del INMUDEJ',description:'Bases de regulación, funcionamiento, atribuciones y facultades del Instituto.',url:'visor-pdf.html?file=assets/pdfs/normatividad/reglamento-interior-inmudej.pdf&title=Reglamento%20Interior%20del%20INMUDEJ',icon:'bi-journal-bookmark-fill',active:true},
      {id:'doc-5',type:'Normatividad',title:'Acuerdo de Creación del INMUDEJ',description:'Instrumento de creación y fundamento del organismo público descentralizado.',url:'visor-pdf.html?file=assets/pdfs/normatividad/acuerdo-creacion-inmudej.pdf&title=Acuerdo%20de%20Creación%20del%20INMUDEJ',icon:'bi-bank',active:true},
      {id:'doc-6',type:'Organización',title:'Manual de Organización',description:'Estructura, funciones, responsabilidades y organización administrativa del Instituto.',url:'visor-pdf.html?file=assets/pdfs/normatividad/manual-organizacion-inmudej.pdf&title=Manual%20de%20Organización%20del%20INMUDEJ',icon:'bi-diagram-3',active:true}
    ]
  };
  const clone=o=>JSON.parse(JSON.stringify(o));
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const uid=(p='item')=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const sb=(window.supabase&&cfg.supabaseUrl&&cfg.supabasePublishableKey)?window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
  const tableMap={carousel:'carousel_items',announcements:'announcements',tournaments:'tournaments',services:'services',forms:'forms',calls:'calls',events:'events',docs:'documents',sections:'page_sections'};
  const permissionMap={carousel:'content',announcements:'content',tournaments:'content',calls:'content',forms:'content',events:'events',services:'services',docs:'docs',sections:'institutional',institutional:'institutional'};

  const dbToSite=r=>r?({heroTitlePrefix:r.hero_title_prefix,heroTitleAccent:r.hero_title_accent,heroLead:r.hero_lead,facebook:r.facebook,address:r.address,missionTitle:r.mission_title,missionText:r.mission_text,visionTitle:r.vision_title,visionText:r.vision_text}):clone(seed.site);
  const siteToDb=s=>({id:'main',hero_title_prefix:s.heroTitlePrefix||'',hero_title_accent:s.heroTitleAccent||'',hero_lead:s.heroLead||'',facebook:s.facebook||'',address:s.address||'',mission_title:s.missionTitle||'',mission_text:s.missionText||'',vision_title:s.visionTitle||'',vision_text:s.visionText||''});
  const dbToItem=(type,r)=>{
    if(type==='carousel')return {id:r.id,title:r.title,subtitle:r.subtitle||'',image:r.image_url||'',order:r.sort_order||0,active:r.active!==false};
    if(type==='announcements')return {id:r.id,title:r.title,summary:r.summary||'',image:r.image_url||'',link:r.link_url||'',date:r.published_at||'',priority:r.priority||0,formId:r.form_id||'',active:r.active!==false};
    if(type==='tournaments')return {id:r.id,title:r.title,sport:r.sport||'Deporte',startDate:r.start_date||'',endDate:r.end_date||'',location:r.location||'',summary:r.summary||'',image:r.image_url||'',link:r.link_url||'',formId:r.form_id||'',featured:!!r.featured,active:r.active!==false};
    if(type==='calls')return {id:r.id,title:r.title,category:r.category,date:r.event_date||'',summary:r.summary||'',image:r.image_url||'',link:r.link_url||'',formId:r.form_id||'',active:r.active!==false};
    if(type==='events')return {id:r.id,title:r.title,date:r.event_date||'',time:(r.event_time||'').slice(0,5),location:r.location||'',category:r.category||'Deporte',description:r.description||'',formId:r.form_id||'',active:r.active!==false};
    if(type==='services')return {...r,image:r.image_url||''};
    if(type==='sections')return {id:r.section_key,eyebrow:r.eyebrow||'',title:r.title||'',description:r.description||'',active:r.active!==false,order:r.sort_order||0};
    return {...r};
  };
  const itemToDb=(type,x)=>{
    if(type==='carousel')return {id:x.id,title:x.title,subtitle:x.subtitle||'',image_url:x.image||'',sort_order:Number(x.order||0),active:x.active!==false};
    if(type==='announcements')return {id:x.id,title:x.title,summary:x.summary||'',image_url:x.image||'',link_url:x.link||'',published_at:x.date||null,priority:Number(x.priority||0),form_id:x.formId||null,active:x.active!==false};
    if(type==='tournaments')return {id:x.id,title:x.title,sport:x.sport||'Deporte',start_date:x.startDate||null,end_date:x.endDate||null,location:x.location||'',summary:x.summary||'',image_url:x.image||'',link_url:x.link||'',form_id:x.formId||null,featured:!!x.featured,active:x.active!==false};
    if(type==='calls')return {id:x.id,title:x.title,category:x.category||'Convocatoria',event_date:x.date||null,summary:x.summary||'',image_url:x.image||'',link_url:x.link||'',form_id:x.formId||null,active:x.active!==false};
    if(type==='events')return {id:x.id,title:x.title,event_date:x.date,event_time:x.time||null,location:x.location||'',category:x.category||'Deporte',description:x.description||'',form_id:x.formId||null,active:x.active!==false};
    if(type==='services')return {id:x.id,title:x.title,description:x.description||'',icon:x.icon||'bi-stars',tone:x.tone||'blue',price:x.price||'',details:x.details||'',image_url:x.image||'',active:x.active!==false};
    if(type==='sections')return {section_key:x.id,eyebrow:x.eyebrow||'',title:x.title||'',description:x.description||'',active:x.active!==false,sort_order:Number(x.order||0)};
    return {...x};
  };
  function localFallback(){try{const c=JSON.parse(localStorage.getItem(cacheKey)||'null');if(c)return {...clone(seed),...c,site:{...seed.site,...(c.site||{})},mode:'cache'};const l=JSON.parse(localStorage.getItem(legacyKey)||'null');if(l)return {...clone(seed),...l,site:{...seed.site,...(l.site||{})},mode:'legacy'}}catch(_){ }return clone(seed)}
  function cache(d){try{localStorage.setItem(cacheKey,JSON.stringify({...d,mode:'cache'}))}catch(_){}}
  async function q(table,select='*',opts={}){let query=sb.from(table).select(select);if(opts.order)query=query.order(opts.order.column,{ascending:opts.order.ascending!==false});if(opts.eq)for(const [k,v] of Object.entries(opts.eq))query=query.eq(k,v);return await query}
  async function loadPublic(){
    if(!sb)return localFallback();
    try{
      const [siteR,sectionsR,carR,annR,tourR,srvR,formsR,callsR,eventsR,docsR]=await Promise.all([
        sb.from('site_settings').select('*').eq('id','main').maybeSingle(),q('page_sections','*',{order:{column:'sort_order',ascending:true}}),q('carousel_items','*',{eq:{active:true},order:{column:'sort_order',ascending:true}}),q('announcements','*',{eq:{active:true},order:{column:'priority',ascending:false}}),q('tournaments','*',{eq:{active:true},order:{column:'start_date',ascending:true}}),q('services','*',{eq:{active:true},order:{column:'created_at',ascending:true}}),q('forms','*',{eq:{active:true},order:{column:'created_at',ascending:false}}),q('calls','*',{eq:{active:true},order:{column:'event_date',ascending:false}}),q('events','*',{eq:{active:true},order:{column:'event_date',ascending:true}}),q('documents','*',{eq:{active:true},order:{column:'created_at',ascending:true}})
      ]);
      const results=[siteR,sectionsR,carR,annR,tourR,srvR,formsR,callsR,eventsR,docsR],err=results.find(r=>r.error)?.error;if(err)throw err;
      const d={version:4,mode:'online',updatedAt:new Date().toISOString(),site:dbToSite(siteR.data),sections:(sectionsR.data||[]).map(r=>dbToItem('sections',r)),carousel:(carR.data||[]).map(r=>dbToItem('carousel',r)),announcements:(annR.data||[]).map(r=>dbToItem('announcements',r)),tournaments:(tourR.data||[]).map(r=>dbToItem('tournaments',r)),services:(srvR.data||[]).map(r=>dbToItem('services',r)),forms:formsR.data||[],calls:(callsR.data||[]).map(r=>dbToItem('calls',r)),events:(eventsR.data||[]).map(r=>dbToItem('events',r)),docs:docsR.data||[]};cache(d);return d;
    }catch(e){console.warn('INMUDEJ: se mostrará la última versión disponible.',e);return localFallback()}
  }
  async function getSession(){if(!sb)return null;return (await sb.auth.getSession()).data.session||null}
  async function signIn(identifier,password){if(!sb)throw new Error('El servicio de acceso no está disponible en este momento.');let email=String(identifier||'').trim();if(!email.includes('@')){const {data,error}=await sb.rpc('lookup_login_email',{p_identifier:email});if(error)throw error;if(!data)throw new Error('Usuario no encontrado.');email=data}const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;return data}
  async function requestPasswordReset(identifier){
    if(!sb)throw new Error('El servicio de acceso no está disponible en este momento.');
    let email=String(identifier||'').trim();
    if(!email)throw new Error('Indica el correo o usuario de la cuenta.');
    if(!email.includes('@')){
      const {data,error}=await sb.rpc('lookup_login_email',{p_identifier:email});
      if(error)throw error;
      if(!data)throw new Error('No se encontró una cuenta con ese usuario.');
      email=data;
    }
    const redirectTo=cfg.siteUrl||new URL('index.html',window.location.href).href;
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo});
    if(error)throw error;
  }
  async function signOut(){if(sb)await sb.auth.signOut()}
  async function bootstrapStatus(){if(!sb)return false;const {data,error}=await sb.rpc('bootstrap_status');if(error)throw error;return !!data}
  async function setupAdmin({name,email,password}){if(!sb)throw new Error('El servicio de acceso no está disponible en este momento.');const {data,error}=await sb.auth.signUp({email:String(email).trim().toLowerCase(),password,options:{data:{username:'admin',full_name:name}}});if(error)throw error;if(data.session){try{await claimFirstAdmin()}catch(_){}}return data}
  async function claimFirstAdmin(){if(!sb)return false;const {data,error}=await sb.rpc('claim_first_admin');if(error)throw error;return !!data}
  async function getProfile(){if(!sb)return null;const s=await getSession();if(!s)return null;const {data,error}=await sb.from('profiles').select('id,username,full_name,email,active,role_id,roles(id,code,name,permissions)').eq('id',s.user.id).maybeSingle();if(error)throw error;return data}
  const permissionsOf=p=>p?.roles?.permissions||{};const can=(p,key)=>!!permissionsOf(p)?.[key];
  async function loadAdmin(){
    if(!sb)throw new Error('El panel no está disponible en este momento.');const profile=await getProfile();if(!profile)throw new Error('No existe una sesión administrativa.');
    const [siteR,sectionsR,carR,annR,tourR,srvR,formsR,callsR,eventsR,docsR]=await Promise.all([sb.from('site_settings').select('*').eq('id','main').maybeSingle(),q('page_sections','*',{order:{column:'sort_order',ascending:true}}),q('carousel_items','*',{order:{column:'sort_order',ascending:true}}),q('announcements','*',{order:{column:'priority',ascending:false}}),q('tournaments','*',{order:{column:'start_date',ascending:true}}),q('services'),q('forms'),q('calls'),q('events','*',{order:{column:'event_date',ascending:true}}),q('documents')]);
    const err=[siteR,sectionsR,carR,annR,tourR,srvR,formsR,callsR,eventsR,docsR].find(r=>r.error)?.error;if(err)throw err;
    return {version:4,mode:'online',updatedAt:new Date().toISOString(),site:dbToSite(siteR.data),sections:(sectionsR.data||[]).map(r=>dbToItem('sections',r)),carousel:(carR.data||[]).map(r=>dbToItem('carousel',r)),announcements:(annR.data||[]).map(r=>dbToItem('announcements',r)),tournaments:(tourR.data||[]).map(r=>dbToItem('tournaments',r)),services:(srvR.data||[]).map(r=>dbToItem('services',r)),forms:formsR.data||[],calls:(callsR.data||[]).map(r=>dbToItem('calls',r)),events:(eventsR.data||[]).map(r=>dbToItem('events',r)),docs:docsR.data||[]};
  }
  async function saveItem(type,item){const table=tableMap[type];if(!table)throw new Error('Tipo de contenido no válido.');const row=itemToDb(type,item);let query=sb.from(table).upsert(row);const {data,error}=await query.select().single();if(error)throw error;return dbToItem(type,data)}
  async function deleteItem(type,id){const table=tableMap[type],key=type==='sections'?'section_key':'id';const {error}=await sb.from(table).delete().eq(key,id);if(error)throw error}
  async function submitRegistration({formId,contentType,contentId,data}){if(!sb)throw new Error('El registro requiere conexión con el sitio.');const {error}=await sb.from('form_registrations').insert({form_id:formId,content_type:contentType,content_id:contentId,data});if(error)throw error}
  async function listRegistrations(formId){if(!sb)throw new Error('El panel requiere conexión con el sitio.');const {data,error}=await sb.from('form_registrations').select('id,form_id,content_type,content_id,data,submitted_at').eq('form_id',formId).order('submitted_at',{ascending:false});if(error)throw error;return data||[]}
  async function toggleItem(type,id,active){const table=tableMap[type],key=type==='sections'?'section_key':'id';const {error}=await sb.from(table).update({active}).eq(key,id);if(error)throw error}
  async function saveSite(site){const {data,error}=await sb.from('site_settings').upsert(siteToDb(site)).select().single();if(error)throw error;return dbToSite(data)}
  async function uploadFile(file,folder='general'){if(!file)return '';if(!sb)throw new Error('No fue posible cargar el archivo.');const clean=(file.name||'archivo').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9._-]+/g,'-').toLowerCase(),path=`${folder}/${Date.now()}-${crypto.randomUUID().slice(0,8)}-${clean}`;const {error}=await sb.storage.from(cfg.storageBucket||'inmudej-public').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type||undefined});if(error)throw error;return sb.storage.from(cfg.storageBucket||'inmudej-public').getPublicUrl(path).data.publicUrl}
  async function listUsers(){const {data,error}=await sb.from('profiles').select('id,username,full_name,email,active,created_at,updated_at,role_id,roles(id,code,name,permissions)').order('created_at',{ascending:true});if(error)throw error;return data||[]}
  async function updateUser(id,patch){const allowed={};for(const k of ['username','full_name','role_id','active'])if(k in patch)allowed[k]=patch[k];const {data,error}=await sb.from('profiles').update(allowed).eq('id',id).select('id,username,full_name,email,active,role_id,roles(id,code,name,permissions)').single();if(error)throw error;return data}
  async function listRoles(){const {data,error}=await sb.from('roles').select('*').order('name',{ascending:true});if(error)throw error;return data||[]}
  async function saveRole(role){const row={...role};if(!row.id)delete row.id;const query=row.id?sb.from('roles').update(row).eq('id',row.id):sb.from('roles').insert(row);const {data,error}=await query.select().single();if(error)throw error;return data}
  async function deleteRole(id){const {error}=await sb.from('roles').delete().eq('id',id);if(error)throw error}
  async function listInvites(){const {data,error}=await sb.from('user_invites').select('id,email,username,token,expires_at,accepted_at,created_at,role_id,roles(id,code,name)').order('created_at',{ascending:false});if(error)throw error;return data||[]}
  async function createInvite({email,username,role_id,days=7}){const expires=new Date(Date.now()+Number(days||7)*86400000).toISOString(),session=await getSession();const {data,error}=await sb.from('user_invites').insert({email:String(email).trim().toLowerCase(),username:String(username).trim(),role_id,expires_at:expires,invited_by:session?.user?.id||null}).select('id,email,username,token,expires_at,accepted_at,role_id,roles(id,code,name)').single();if(error)throw error;return data}
  async function getInvite(token){const {data,error}=await sb.rpc('get_invite',{p_token:token});if(error)throw error;return Array.isArray(data)?data[0]:data}
  async function registerInvite({token,email,username,fullName,password}){const {data,error}=await sb.auth.signUp({email,password,options:{data:{username,full_name:fullName,invite_token:token}}});if(error)throw error;return data}
  async function migrateLegacyLocal(){let legacy;try{legacy=JSON.parse(localStorage.getItem(legacyKey)||'null')}catch(_){legacy=null}if(!legacy)return {migrated:false,message:'No se encontraron datos anteriores.'};if(legacy.site)await saveSite({...seed.site,...legacy.site});for(const type of ['carousel','services','forms','calls','events','docs'])for(const item of (legacy[type]||[]))await saveItem(type,{...item,id:item.id||uid(type)});return {migrated:true,message:'Contenido recuperado correctamente.'}}
  window.INMUDEJCMS={cfg,supabase:sb,seed:clone(seed),escapeHtml:esc,uid,loadPublic,loadAdmin,getSession,signIn,signOut,requestPasswordReset,bootstrapStatus,setupAdmin,claimFirstAdmin,getProfile,permissionsOf,can,saveItem,deleteItem,toggleItem,saveSite,uploadFile,submitRegistration,listRegistrations,listUsers,updateUser,listRoles,saveRole,deleteRole,listInvites,createInvite,getInvite,registerInvite,migrateLegacyLocal,legacyKey,permissionMap};
})();
