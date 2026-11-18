// JYPER Digicam Rental Gensan — Cloudflare Pages frontend
const API_BASE = "https://withered-haze-287e.jypersapparel1.workers.dev/";

const cameraAssets = {
  KODAK_PINK: {photo:"kodak-pink.png", inclusions:"KODAK FZ55 - INCLUSION.jpg"},
  KODAK_CHERRY: {photo:"kodak-cherry.png", inclusions:"KODAK FZ55 - INCLUSION.jpg"},
  CANON_285_BLACK: {photo:"canon-ixus-black.png", inclusions:"CANON 285 - INCLUSION.jpg"},
  CANON_285_BROWN: {photo:"canon-ixus-brown.png", inclusions:"CANON 285 - INCLUSION.jpg"},
  CANON_M200: {photo:"canon-m200.png", inclusions:"CANON M200 - INCLUSION.jpg"},
  CANON_SX740: {photo:"canon-sx740.png", inclusions:"CANON SX740 HS - INCLUSION.jpg"},
  OLYMPUS_SZ31MR: {photo:"olympus-sz31mr.png", inclusions:"OLYMPUS SZ-31MR - INCLUSION.jpg"},
  DJI_POCKET_4: {photo:"dji-pocket4.png", inclusions:"DJI POCKET 4 STANDARD - INCLUSION.jpg", creatorInclusions:"DJI POCKET 4 COMBO CREATOR - INCLUSION.jpg"}
};
const pricing = {
  KODAK_PINK:{oneToFour:250,fivePlus:200},
  KODAK_CHERRY:{oneToFour:250,fivePlus:200},
  OLYMPUS_SZ31MR:{oneToFour:350,fivePlus:300},
  CANON_285_BLACK:{oneToFour:450,fivePlus:400},
  CANON_285_BROWN:{oneToFour:450,fivePlus:400},
  CANON_M200:{oneToFour:500,fivePlus:450},
  CANON_SX740:{oneToFour:500,fivePlus:450},
  DJI_POCKET_4:{oneToFour:500,fivePlus:450,creatorOneToFour:600,creatorFivePlus:550}
};
const fallbackCameras = [
  {camera_id:"KODAK_PINK",unit_name:"Kodak PixPro FZ55",variant:"Pink",active:"TRUE"},
  {camera_id:"KODAK_CHERRY",unit_name:"Kodak PixPro FZ55",variant:"Cherry",active:"TRUE"},
  {camera_id:"OLYMPUS_SZ31MR",unit_name:"Olympus SZ-31MR",variant:"",active:"TRUE"},
  {camera_id:"CANON_285_BLACK",unit_name:"Canon IXUS 285",variant:"Black",active:"TRUE"},
  {camera_id:"CANON_285_BROWN",unit_name:"Canon IXUS 285",variant:"Brown",active:"TRUE"},
  {camera_id:"CANON_M200",unit_name:"Canon M200",variant:"",active:"TRUE"},
  {camera_id:"CANON_SX740",unit_name:"Canon SX740 HS",variant:"",active:"TRUE"},
  {camera_id:"DJI_POCKET_4",unit_name:"DJI Pocket 4",variant:"Standard / Creator Combo",active:"TRUE"}
];
const fallbackAddons = [
  {addon_id:"KODAK_BATTERY",addon_name:"Kodak extra battery",camera_compatibility:"Kodak Pink / Cherry",price_php:50,active:"TRUE"},
  {addon_id:"CANON_M200_BATTERY_1",addon_name:"Canon M200 extra battery (1)",camera_compatibility:"Canon M200",price_php:75,active:"TRUE"},
  {addon_id:"CANON_M200_BATTERY_2",addon_name:"Canon M200 extra batteries (2)",camera_compatibility:"Canon M200",price_php:130,active:"TRUE"},
  {addon_id:"CANON_285_BATTERY",addon_name:"Canon 285 extra battery",camera_compatibility:"Canon 285 Black / Brown",price_php:75,active:"TRUE"},
  {addon_id:"CANON_SX740_BATTERY_1",addon_name:"Canon SX740 extra battery (1)",camera_compatibility:"Canon SX740 HS",price_php:75,active:"TRUE"},
  {addon_id:"CANON_SX740_BATTERY_2",addon_name:"Canon SX740 extra batteries (2)",camera_compatibility:"Canon SX740 HS",price_php:130,active:"TRUE"},
  {addon_id:"ULANZI_MT44",addon_name:"Ulanzi MT-44 tripod",camera_compatibility:"All compatible cameras",price_php:150,active:"TRUE"},
  {addon_id:"ULANZI_MT41",addon_name:"Ulanzi MT-41 mini tripod",camera_compatibility:"All compatible cameras",price_php:100,active:"TRUE"}
];
let cameraRows = [...fallbackCameras];
let addonRows = [...fallbackAddons];

const cameraDescriptions = {
  KODAK_PINK:"A beginner-friendly compact camera for simple, fun photos—perfect for trips and celebrations.",
  KODAK_CHERRY:"A beginner-friendly compact camera for simple, fun photos—perfect for trips and celebrations.",
  OLYMPUS_SZ31MR:"A versatile compact zoom camera for travel, family moments and getting closer to the action.",
  CANON_285_BLACK:"A compact point-and-shoot for everyday photos, outings and travel memories.",
  CANON_285_BROWN:"A compact point-and-shoot for everyday photos, outings and travel memories.",
  CANON_M200:"A mirrorless camera for crisp photos and creative control—great for portraits and special occasions.",
  CANON_SX740:"A travel-friendly compact camera with powerful zoom to bring faraway subjects closer.",
  DJI_POCKET_4:"A pocket-sized camera for smooth videos, vlogs and capturing moments while you move."
};
const addonDescriptions = {
  KODAK_BATTERY:"Keep your Kodak ready for more memories. A spare battery is handy for long outings, trips and celebrations.",
  CANON_M200_BATTERY_1:"A handy backup battery for your Canon M200—ideal for longer days and extra photo opportunities.",
  CANON_M200_BATTERY_2:"Two spare batteries to help you shoot longer with fewer charging breaks.",
  CANON_285_BATTERY:"Keep your Canon IXUS 285 ready for more snapshots with an extra battery.",
  CANON_SX740_BATTERY_1:"An extra battery to help you keep shooting while exploring with the Canon SX740 HS.",
  CANON_SX740_BATTERY_2:"Two extra batteries for extended adventures and more time behind the lens.",
  ULANZI_MT44:"An extendable tripod for steadier photos, group shots, selfies and hands-free videos.",
  ULANZI_MT41:"A compact mini tripod that is easy to carry for tabletop shots, vlogging and steady hands-free content."
};
const money = value => `₱${Number(value || 0).toLocaleString("en-PH")}`;
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const asset = filename => "assets/" + encodeURIComponent(filename || "").replace(/%2F/g,"/");
function ratesFor(id) {
  const p=pricing[id]; if(!p) return "";
  if(id==="DJI_POCKET_4") return `<span><b>Standard</b> · ${money(p.oneToFour)}/day · 1–4 days</span><span>${money(p.fivePlus)}/day · 5 days &amp; above</span><span><b>Creator Combo</b> · ${money(p.creatorOneToFour)}/day · 1–4 days</span><span>${money(p.creatorFivePlus)}/day · 5 days &amp; above</span>`;
  return `<span>${money(p.oneToFour)}/day · 1–4 days</span><span>${money(p.fivePlus)}/day · 5 days &amp; above</span>`;
}
async function loadCatalog() {
  try {
    const res=await fetch(`${API_BASE}?action=catalog`);
    if(!res.ok) throw new Error(`Catalog API returned HTTP ${res.status}`);
    const data=await res.json();
    if(data.error) throw new Error(data.error);
    if(Array.isArray(data.cameras)&&data.cameras.length) {
      const activeIds=new Set(data.cameras.filter(c=>String(c.active).toUpperCase()!=="FALSE").map(c=>c.camera_id));
      cameraRows=fallbackCameras.filter(c=>activeIds.has(c.camera_id));
      if(!cameraRows.length) cameraRows=[...fallbackCameras];
    }
    if(Array.isArray(data.addons)&&data.addons.length) {
      const activeIds=new Set(data.addons.filter(a=>String(a.active).toUpperCase()!=="FALSE").map(a=>a.addon_id));
      addonRows=fallbackAddons.filter(a=>activeIds.has(a.addon_id));
      if(!addonRows.length) addonRows=[...fallbackAddons];
    }
  } catch(err) { console.warn("Using local camera/add-on catalogue:",err); }
  renderCameras(cameraRows); renderAddons(addonRows); populateCameraSelect(cameraRows); renderInclusions(cameraRows);
}
function renderCameras(rows) {
  const grid=document.getElementById("camera-grid"); if(!grid)return;
  grid.innerHTML=rows.map(c=>{
    const a=cameraAssets[c.camera_id]||{};
    const variant=c.variant||"";
    const displayName=[c.unit_name, variant].filter(Boolean).join(" ");
    return `<article class="camera-card"><h3 class="camera-unit-name">${esc(displayName)}</h3><img src="${asset(a.photo)}" alt="${esc(displayName)}" loading="lazy"><div class="camera-card-body"><p class="camera-description">${esc(cameraDescriptions[c.camera_id]||"A handy camera for capturing your favourite moments.")}</p><p class="camera-rate">${ratesFor(c.camera_id)}</p><div class="card-actions"><a class="button secondary-button" href="camera-inclusions.html?camera=${encodeURIComponent(c.camera_id)}">View inclusions</a><a class="button" href="#booking" data-camera="${esc(c.camera_id)}">Book this unit</a></div></div></article>`;
  }).join("");
  grid.querySelectorAll("[data-camera]").forEach(btn=>btn.addEventListener("click",()=>{const sel=document.getElementById("camera-select");if(sel){sel.value=btn.dataset.camera;updateVariantOptions();}}));
}
function renderInclusions(rows) {
  const grid=document.getElementById("inclusion-grid");if(!grid)return;
  const query=new URLSearchParams(location.search).get("camera");
  const list=query?rows.filter(c=>c.camera_id===query):rows;
  const cards=[];
  const seen=new Set();
  list.forEach(c=>{
    const a=cameraAssets[c.camera_id]||{};
    if(c.camera_id==="DJI_POCKET_4") {
      const djiOptions=[
        {label:"Standard",file:a.inclusions},
        {label:"Creator Combo",file:a.creatorInclusions}
      ];
      djiOptions.forEach(option=>{
        if(option.file&&!seen.has(option.file)){
          seen.add(option.file);
          cards.push(`<article class="inclusion-card"><h3>DJI Pocket 4 <span>${option.label}</span></h3><img src="${asset(option.file)}" alt="DJI Pocket 4 ${option.label} inclusions" loading="lazy"></article>`);
        }
      });
      return;
    }
    const file=a.inclusions;
    if(file&&!seen.has(file)){
      seen.add(file);
      const displayName=[c.unit_name,c.variant].filter(Boolean).join(" ");
      cards.push(`<article class="inclusion-card"><h3>${esc(displayName)}</h3><img src="${asset(file)}" alt="${esc(displayName)} inclusions" loading="lazy"></article>`);
    }
  });
  grid.innerHTML=cards.join("")||"<p>No matching inclusion image found. <a href='camera-inclusions.html'>View all inclusions</a>.</p>";
}
function renderAddons(rows) {
  const grid=document.getElementById("addon-grid");if(!grid)return;
  const promo=[
    {name:"ADD-ON - EXTRA BATTERIES",file:"ADD-ON - EXTRA BATTERIES.png",caption:"Need more shooting time? See our extra battery options for compatible cameras.",type:"battery",button:"View battery add-ons"},
    {name:"ADD-ON - ULANZI MT-41 MINI TRIPOD",file:"ADD-ON - ULANZI MT-41 MINI TRIPOD.png",caption:"Keep your camera steady for group photos, tabletop shots and hands-free videos.",type:"tripod",button:"View tripod add-ons"}
  ];
  grid.innerHTML=`<div class="addon-teaser-grid">${promo.map(p=>`<article class="addon-teaser-card"><img src="${asset(p.file)}" alt="${esc(p.name)}" loading="lazy"><div class="addon-teaser-copy"><h3>${esc(p.name)}</h3><p>${esc(p.caption)}</p><a class="button secondary-button" href="add-ons.html?type=${p.type}">${p.button}</a></div></article>`).join("")}</div>`;
}

function populateCameraSelect(rows) {
  const select=document.getElementById("camera-select");if(!select)return;
  select.innerHTML='<option value="">Select a camera</option>'+rows.map(c=>`<option value="${esc(c.camera_id)}">${esc(c.unit_name)}${c.variant?` — ${esc(c.variant)}`:""}</option>`).join("");
  select.addEventListener("change",updateVariantOptions);updateVariantOptions();
}
function updateVariantOptions() {
  const sel=document.getElementById("camera-select"),variant=document.getElementById("variant-select");if(!sel||!variant)return;
  const camera=cameraRows.find(c=>c.camera_id===sel.value);
  if(!camera){variant.innerHTML='<option value="">Select an option</option>';return;}
  const options=camera.camera_id==="DJI_POCKET_4"?["Standard","Creator Combo"]:[camera.variant||"Standard"];
  variant.innerHTML=options.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");
}
const form=document.getElementById("booking-form");
if(form) form.addEventListener("submit",async event=>{
  event.preventDefault();
  const message=document.getElementById("form-message"),submit=form.querySelector("button[type=submit]");
  const values=Object.fromEntries(new FormData(form).entries());
  const camera=cameraRows.find(c=>c.camera_id===values.camera_id);
  if(!camera){message.textContent="Please select a camera.";return;}
  if(new Date(values.return_datetime_requested)<=new Date(values.pickup_datetime_requested)){message.textContent="Return date and time must be later than pickup.";return;}
  const days=Math.max(1,Math.ceil((new Date(values.return_datetime_requested)-new Date(values.pickup_datetime_requested))/86400000));
  const creator=String(values.variant||"").toLowerCase().includes("creator"),p=pricing[camera.camera_id]||{};
  const rate=camera.camera_id==="DJI_POCKET_4"?(creator?(days>=5?p.creatorFivePlus:p.creatorOneToFour):(days>=5?p.fivePlus:p.oneToFour)):(days>=5?p.fivePlus:p.oneToFour);
  const payload={action:"createBooking",...values,daily_rate_php:rate||0,pickup_method:"Store pickup",return_method:"Store return"};
  submit.disabled=true;submit.textContent="Submitting…";message.textContent="";
  try {
    const res=await fetch(API_BASE,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(payload)});
    const result=await res.json();if(!result.ok)throw new Error(result.error||"Unable to submit booking.");
    message.textContent=`Booking request submitted! Reference: ${result.booking_reference}. Please take a screenshot of this confirmation and send it to JYPER through our Facebook page.`;
    message.style.color="green";message.classList.add("success-message");form.reset();updateVariantOptions();
  } catch(err) {message.textContent=err.message+" Please try again or contact JYPER.";message.style.color="var(--wine)";}
  finally {submit.disabled=false;submit.textContent="Submit Booking Request";}
});
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();
loadCatalog();
