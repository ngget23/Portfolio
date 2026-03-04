async function loadSite() {
  const res = await fetch("./site.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Missing site.json");
  return res.json();
}

function setText(id, txt){ const el=document.getElementById(id); if(el) el.textContent=txt; }
function setHTML(id, html){ const el=document.getElementById(id); if(el) el.innerHTML=html; }

function money(n){ return `$${Number(n).toFixed(0)}`; }

function renderFAQ(faq){
  return faq.map((q,i)=>`
    <div class="item">
      <button type="button" data-i="${i}">${escapeHtml(q.q)}</button>
      <div class="ans" id="ans-${i}">${escapeHtml(q.a)}</div>
    </div>
  `).join("");
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function hookFAQ(){
  document.querySelectorAll(".faq button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const i = btn.getAttribute("data-i");
      const ans = document.getElementById(`ans-${i}`);
      const open = ans.style.display === "block";
      ans.style.display = open ? "none" : "block";
    });
  });
}

function saveLead(payload){
  const key="nova_demo_leads";
  const prev = JSON.parse(localStorage.getItem(key) || "[]");
  prev.push({ ...payload, at: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(prev));
}

function hookForm(formId, onSubmit){
  const form = document.getElementById(formId);
  const msg = document.getElementById(`${formId}Msg`);
  if(!form) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    msg.className="";
    msg.hidden=false;
    try{
      const data = Object.fromEntries(new FormData(form).entries());
      onSubmit(data);
      form.reset();
      msg.className="ok";
      msg.textContent="Saved. This demo stores requests locally. In a real build, it emails you or sends to a server.";
    }catch(err){
      msg.className="err";
      msg.textContent="Something failed. Try again.";
    }
  });
}

export { loadSite, setText, setHTML, money, renderFAQ, hookFAQ, saveLead, hookForm };