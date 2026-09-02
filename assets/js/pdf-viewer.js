(async()=>{
  const q=new URLSearchParams(location.search);
  const file=q.get('file')||'';
  const title=q.get('title')||'Documento INMUDEJ';
  const safe=file.startsWith('assets/pdfs/') && file.toLowerCase().endsWith('.pdf');
  document.getElementById('docTitle').textContent=title;
  document.title=`${title} | INMUDEJ Delicias`;
  const frame=document.getElementById('pdfFrame'),missing=document.getElementById('missingDoc');
  const open=document.getElementById('openBtn'),download=document.getElementById('downloadBtn');
  if(!safe){frame.style.display='none';missing.classList.add('show');open.style.display=download.style.display='none';return}
  open.href=file;download.href=file;
  try{
    let r=await fetch(file,{method:'HEAD',cache:'no-store'});
    if(!r.ok)throw new Error('missing');
    frame.src=file+'#view=FitH';
  }catch(e){frame.style.display='none';missing.classList.add('show');open.style.display=download.style.display='none'}
})();
