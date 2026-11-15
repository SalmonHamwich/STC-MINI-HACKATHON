const $ = (s) => document.querySelector(s),
  main = $("#main");
let state;
try {
  state = JSON.parse(localStorage.getItem("schoolbridge")) || {};
} catch {
  state = {};
}
state.profile ||= { skills: ["Cleanup"], assets: ["Water pump"] };
state.reports ||= [];
state.pledges ||= {};
state.safety ||= "Not checked in";
let step = 0,
  report = { school: "SK Taman Seri Murni", needs: [], photos: [] },
  filter = "All missions";
const save = () => localStorage.setItem("schoolbridge", JSON.stringify(state));
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").style.display = "block";
  setTimeout(() => ($("#toast").style.display = "none"), 4000);
}
function modal(t) {
  $("#dialogbody").innerHTML = t;
  $("#dialog").showModal();
}
$("#close").onclick = () => $("#dialog").close();
const link = (url, t, cls = "") =>
  `<a class="button ${cls}" href="#${url}">${t}</a>`;
const head = (title, sub) =>
  `<div class="crumb"><a href="#home">⌂ Home</a><button onclick="history.back()">← Back</button></div><div class="pagehead"><span class="eyebrow">A little help goes a long way</span><h1>${title}</h1><p class="muted">${sub}</p></div>`;
const choices = (items, sel, name) =>
  `<div class="choices">${items.map((i) => `<label class="choice"><input type="checkbox" name="${name}" value="${i}" ${sel.includes(i) ? "checked" : ""}>${i}</label>`).join("")}</div>`;
const selected = (name) =>
  [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (x) => x.value,
  );
const scores = () =>
  `<div class="progressbox"><div class="score">School recovery<strong>64<span class="small"> / 100</span></strong><progress max="100" value="64" aria-label="School recovery 64 out of 100"></progress><p class="small">16 of 25 recovery tasks complete.</p></div><div class="score">Education continuity<strong>${state.plan ? 88 : 78}<span class="small"> / 100</span></strong><progress max="100" value="${state.plan ? 88 : 78}" aria-label="Education continuity"></progress><p class="small">${state.plan ? "264" : "234"} of 300 pupils have a learning arrangement.</p></div></div><p class="small muted">Planning indicators from sample records. These scores do not certify safety or approve reopening.</p>`;
const missions = [
  {
    id: 1,
    icon: "♧",
    title: "Help classrooms feel like classrooms again",
    school: "SK Taman Seri Murni",
    place: "Kuala Selangor",
    skill: "Cleanup",
    asset: "Water pump",
    time: "Tomorrow · 9:00 am–12:00 pm",
    people: "4 of 8 places available",
    kind: "Hands-on help",
    desc: "Sort dry learning materials and clean approved areas with the site team. No entry to restricted rooms.",
  },
  {
    id: 2,
    icon: "▣",
    title: "Bring learning packs to 60 children",
    school: "SJK(C) Sungai Buloh",
    place: "Sungai Buloh",
    skill: "Driving",
    asset: "4x4",
    time: "Tomorrow · 10:00 am–12:00 pm",
    people: "2 of 3 places available",
    kind: "Deliveries",
    desc: "Deliver prepared learning packs along a coordinator-approved route. Do not enter floodwater.",
  },
  {
    id: 3,
    icon: "⌁",
    title: "Inspect the classroom electrical supply",
    school: "SK Taman Seri Murni",
    place: "Kuala Selangor",
    skill: "Electrician",
    asset: "Generator",
    time: "Monday · 9:00 am–11:00 am",
    people: "Professional credentials required",
    kind: "Professional help",
    desc: "A qualified electrician must inspect and document the electrical system. Coordinator verification is required before assignment.",
  },
];
function match(m) {
  return (
    state.profile.skills.includes(m.skill) ||
    state.profile.assets.includes(m.asset)
  );
}
function missioncards(list) {
  return `<div class="list">${list.map((m) => `<article class="card mission"><div class="symbol" aria-hidden="true">${m.icon}</div><div><span class="tag ${m.id === 3 ? "gold" : ""}">${m.id === 3 ? "Professional inspection" : match(m) ? "Matches your profile" : "Open mission"}</span><h3>${m.title}</h3><p>${m.school} · ${m.place}</p><p class="muted">◷ ${m.time} · ${m.people}</p></div><button onclick="detail(${m.id})">View mission →</button></article>`).join("")}</div>`;
}
function home() {
  return `<section class="hero"><div><span class="pill">♡ Communities helping communities</span><h1>Every helping hand.<br>One step closer<br>to school.</h1><p>Help a school recover. Share your time or supplies. Together, we can bring children back to learning.</p><a class="button primary" href="#roles">Let's get started ↓</a><p class="small">No experience with technology? We'll guide you.</p></div><div class="heroart"><svg viewBox="0 0 500 350" role="img" aria-label="Illustration of a welcoming school and volunteers"><circle cx="391" cy="65" r="35" fill="#f2d58d"/><path d="M0 280Q100 210 240 275T500 265V350H0" fill="#bfcfae"/><path d="M108 145L250 68l142 77" fill="#59765c"/><path d="M125 145h250v145H125" fill="#fff9e8"/><path d="M220 210h60v80h-60" fill="#6b8b75"/><g fill="#b8ced0" stroke="#fff9e8" stroke-width="8"><path d="M151 166h48v44h-48zM300 166h48v44h-48z"/></g><rect x="211" y="130" width="78" height="29" rx="6" fill="#e8d59a"/><text x="250" y="150" text-anchor="middle" fill="#284a38" font-size="15" font-family="sans-serif">SCHOOL</text><g><circle cx="83" cy="224" r="16" fill="#b78058"/><path d="M60 283v-32q23-25 46 0v32" fill="#dba85d"/><path d="M72 283v32m24-32v32" stroke="#355347" stroke-width="10"/><circle cx="411" cy="234" r="15" fill="#d5aa82"/><path d="M390 287v-30q21-22 42 0v30" fill="#537d70"/><path d="M400 287v28m23-28v28" stroke="#355347" stroke-width="9"/></g><path d="M36 249V150m0 40q-40-50 0-67q45 20 0 67" fill="#829b68" stroke="#829b68" stroke-width="9"/></svg><div class="artcaption">✦ A fresh start begins with all of us.</div></div></section><section id="roles"><div class="row"><h2>How would you like to help?</h2><span class="small muted">Choose a role. You can change it anytime.</span></div><div class="grid">${[
    [
      "school",
      "⌂",
      "I’m from a school",
      "Tell us what your school needs. We’ll help you take the next step.",
      "Get help for my school",
    ],
    [
      "volunteer",
      "♡",
      "I want to volunteer",
      "Find a small task where your time, skills, or equipment can help.",
      "Find my way to help",
    ],
    [
      "coordinator",
      "☷",
      "I’m a coordinator",
      "Bring people and resources together. See recovery in one place.",
      "Open recovery dashboard",
    ],
  ]
    .map(
      ([u, i, t, d, b]) =>
        `<a href="#${u}" class="card role"><span class="icon">${i}</span><h3>${t}</h3><p>${d}</p><span class="go">${b} →</span></a>`,
    )
    .join(
      "",
    )}</div></section><div class="stats extra"><div><strong>12</strong><span>schools supported</span></div><div><strong>148</strong><span>helping hands</span></div><div><strong>1,240</strong><span>children learning again</span></div><div><strong>36</strong><span>missions completed</span></div></div><section class="section extra"><div class="row"><div><span class="eyebrow">Good things are happening</span><h2>A little of your time. A lasting difference.</h2></div>${link("missions", "See all missions →")}</div>${missioncards(missions.slice(0, 1))}</section><div class="banner"><span class="icon">☀</span><p><strong>One step at a time is enough.</strong><br><span class="muted">Turn on Simple mode for fewer choices and a quieter screen.</span></p></div>`;
}
function school() {
  return (
    head(
      "Let’s help your school recover.",
      "Start with what you know. You can add more details later.",
    ) +
    `<div class="twocol"><div><div class="card"><h2>SK Taman Seri Murni</h2><p class="muted">Kuala Selangor · 300 pupils · Flood recovery</p>${scores()}${link("report", "＋ Report damage or needs", "primary")}</div>${state.reports.length ? `<div class="banner">✓ Your report was saved. ${state.reports.length} report(s) awaiting coordinator review.</div>` : ""}</div><aside class="card"><h3>Keep learning going</h3><p>Choose temporary arrangements for pupils while recovery continues.</p>${link("learning", "▤ Make a learning plan")}<p class="notice small">Building and electrical damage require qualified professional inspection before use.</p></aside></div>`
  );
}
function reportpage() {
  let body = "";
  if (step === 0)
    body = `<h2>Which school needs help?</h2><label class="field">School<select id="school"><option>SK Taman Seri Murni</option><option>SJK(C) Sungai Buloh</option><option>SK Bukit Ceria</option></select></label><label class="field">What happened?<select id="event"><option>Flood</option><option>Storm</option><option>Landslide</option><option>Other / not sure</option></select></label>`;
  if (step === 1)
    body = `<h2>What does your school need?</h2><p>Choose all that apply. It is okay to be unsure.</p>${choices(["Classroom cleanup", "Furniture and supplies", "Electricity inspection", "Building inspection", "Temporary learning space", "Not sure — please help"], report.needs, "needs")}`;
  if (step === 2)
    body = `<h2>Add photos if you have them</h2><p>This step is optional. Only take photos from a safe place.</p><label class="upload">▧ Choose photos<input id="photos" type="file" accept="image/*" multiple><span class="small">Preview only. Photos stay on your device.</span></label><p id="photostatus" role="status">${report.photos.length} photo(s) selected</p><div class="notice">Do not enter damaged buildings to take photos.</div>`;
  if (step === 3)
    body = `<h2>Does this look right?</h2><div class="card"><h3>${escape(report.school)}</h3><p>${escape(report.event)}</p><p>Needs: ${report.needs.map(escape).join(", ")}</p><p>${report.photos.length} photo placeholder(s)</p></div><p class="notice">Demo AI suggests tasks from your choices. A coordinator reviews them. AI cannot certify structural safety.</p>`;
  return (
    head(
      "Tell us what happened",
      "A short report helps us find the right support.",
    ) +
    `<div class="form"><p class="step">Step ${step + 1} of 4 · ${["School", "Needs", "Photos", "Review"][step]}</p><progress value="${step + 1}" max="4" aria-label="Report progress"></progress>${body}<p id="error" role="alert"></p><div class="actions"><button onclick="reportBack()">← ${step ? "Previous step" : "Back to school"}</button><button class="primary" onclick="reportNext()">${step === 3 ? "Confirm demo report ✓" : step === 2 ? "Continue (photos optional) →" : "Continue →"}</button></div></div>`
  );
}
window.reportBack = () => {
  if (step) step--;
  else location.hash = "school";
  render();
};
window.reportNext = () => {
  if (step === 0) {
    report.school = $("#school").value;
    report.event = $("#event").value;
  }
  if (step === 1) {
    report.needs = selected("needs");
    if (!report.needs.length) {
      $("#error").textContent =
        "Please choose at least one need, or choose “Not sure — please help”.";
      return;
    }
  }
  if (step === 3) {
    state.reports.push({ ...report });
    save();
    location.hash = "generated";
    return;
  }
  step++;
  render();
};
function generated() {
  let tasks = report.needs.map((n) =>
    n.includes("inspection")
      ? `${n} — qualified professional required`
      : n === "Not sure — please help"
        ? "Coordinator needs assessment"
        : n,
  );
  return (
    head(
      "Your report is ready.",
      "Thank you. Here are suggested next steps for a coordinator to review.",
    ) +
    `<div class="banner">✓ Demo report saved for ${escape(report.school)}</div><span class="tag">Demo AI suggestions · Not yet dispatched</span><div class="list section">${tasks.map((t) => `<div class="card"><h3>${escape(t)}</h3><p>Pending coordinator review and safe access confirmation.</p></div>`).join("")}</div><div class="actions">${link("school", "Return to my school", "primary")}${link("coordinator", "View coordinator review")}</div>`
  );
}
function volunteer() {
  return (
    head(
      "Your helping hand starts here.",
      "Tell us what you can share. We’ll suggest missions that fit.",
    ) +
    `<div class="form"><label class="field">Your name (optional)<input id="name" type="text" maxlength="60" placeholder="For example, Aina" value="${escape(state.profile.name || "")}"></label><label class="field">Your area<select id="area"><option>Kuala Selangor</option><option>Sungai Buloh</option><option>Shah Alam</option></select></label><h2>What can you help with?</h2>${choices(["Cleanup", "Driving", "Teaching", "Electrician", "Engineer", "First aid"], state.profile.skills, "skills")}<h2>Equipment you can share</h2><p class="muted">Optional. No equipment? Your time matters too.</p>${choices(["4x4", "Boat", "Generator", "Water pump"], state.profile.assets, "assets")}<label class="field">When are you available?<select id="availability"><option>Weekends</option><option>Weekdays</option><option>Either</option></select></label><p class="notice small">Professional skills are self-reported here. Credentials and safe access must be checked before assignment. Children should take part with a responsible adult and coordinator approval.</p><button class="primary" onclick="saveProfile()">Save profile & find missions →</button></div>`
  );
}
window.saveProfile = () => {
  state.profile = {
    name: $("#name").value,
    skills: selected("skills"),
    assets: selected("assets"),
    area: $("#area").value,
    availability: $("#availability").value,
  };
  save();
  location.hash = "missions";
  toast("Your demo profile is saved.");
};
function board() {
  return (
    head(
      "Find your way to help.",
      "Every mission is a step toward getting children back to learning.",
    ) +
    `<div class="row"><p class="muted">Showing sample missions near Kuala Selangor</p>${link("volunteer", "✎ Edit my skills & equipment")}</div><div class="filters" role="group" aria-label="Filter missions">${["All missions", "Matches for me", "Hands-on help", "Deliveries", "Professional help"].map((f) => `<button class="${filter === f ? "active" : ""}" aria-pressed="${filter === f}" onclick="setFilter('${f}')">${f}</button>`).join("")}</div>${missioncards(missions.filter((m) => filter === "All missions" || (filter === "Matches for me" && match(m)) || filter === m.kind))}<div class="section">${link("safety", "✓ My mission & safety check-in")}</div>`
  );
}
window.setFilter = (f) => {
  filter = f;
  render();
};
window.detail = (id) => {
  let m = missions.find((x) => x.id === id);
  modal(
    `<span class="tag">${m.kind}</span><h2>${m.title}</h2><p>${m.school} · ${m.place}</p><p>${m.desc}</p><p><strong>Needs:</strong> ${m.skill} · ${m.asset}</p><p><strong>Profile match:</strong> ${match(m) ? "Your skills or equipment fit this mission." : "Add relevant skills or equipment to your profile."}</p><p>${m.time}</p><p class="notice small">Requests need coordinator approval. This prototype does not contact anyone or dispatch volunteers.</p><button class="primary" onclick="join(${id})">Request to join demo mission</button>`,
  );
};
window.join = (id) => {
  state.join = id;
  state.approved = false;
  save();
  $("#dialog").close();
  toast("Request saved. Coordinator approval is needed.");
  location.hash = "safety";
};
function safety() {
  let m = missions.find((m) => m.id === state.join);
  return (
    head(
      "A safe arrival. A safe return.",
      "Check in with the coordinator when you arrive, and check out when you leave.",
    ) +
    `<div class="form card">${m ? `<h2>${m.title}</h2><p>${m.school}</p><span class="tag">${state.approved ? "Approved in demo" : "Awaiting coordinator approval"}</span>` : `<h2>No mission selected yet</h2>${link("missions", "Find a mission")}`}<h3>Status: ${state.safety}</h3><p>Expected check-out: 12:00 pm (sample shift)</p><p class="notice">This demo does not send alerts or monitor your location. In a live service, an overdue check-out would prompt a coordinator follow-up.</p>${m && !state.approved ? link("coordinator", "Open coordinator approval") : ""}${m && state.approved ? `<button class="primary" onclick="safetyAction()">${state.safety === "Checked in" ? "Check out — I have left safely" : "Check in — I am with the coordinator"}</button>` : ""}<p class="small muted">Under 18? A responsible adult must arrange and accompany your participation.</p></div>`
  );
}
window.safetyAction = () =>
  modal(
    `<h2>${state.safety === "Checked in" ? "Have you left the site safely?" : "Are you at the approved meeting point?"}</h2><p>Confirm with your site coordinator before continuing.</p><button class="primary" onclick="confirmSafety()">Yes, confirm ${state.safety === "Checked in" ? "check-out" : "check-in"}</button>`,
  );
window.confirmSafety = () => {
  state.safety =
    state.safety === "Checked in" ? "Checked out safely" : "Checked in";
  save();
  $("#dialog").close();
  render();
  toast(state.safety);
};
function resources() {
  return (
    head(
      "Give supplies. Bring learning closer.",
      "Choose a need you can help with. A coordinator will arrange the details.",
    ) +
    `<div class="grid">${[
      ["Desks", 20, 8, "▤"],
      ["Learning packs", 60, 35, "▣"],
      ["Laptops", 12, 4, "▱"],
    ]
      .map(
        ([n, total, have, i]) =>
          `<article class="card"><span class="icon">${i}</span><h2>${n}</h2><p>SK Taman Seri Murni</p><progress value="${have + (state.pledges[n] || 0)}" max="${total}" aria-label="${n} pledged"></progress><p>${have + (state.pledges[n] || 0)} of ${total} pledged</p><button onclick="pledge('${n}',${total - have - (state.pledges[n] || 0)})">Offer ${n.toLowerCase()} →</button></article>`,
      )
      .join(
        "",
      )}</div><div class="banner">♡ Sample pledges only. No money, deliveries, or personal details are collected.</div>`
  );
}
window.pledge = (n, max) => {
  if (max <= 0) {
    toast("This sample need has been fulfilled. Thank you!");
    return;
  }
  modal(
    `<h2>Offer ${n.toLowerCase()}</h2><p>How many can you share? Up to ${max} still needed.</p><form id="pledgeform"><label class="field">Quantity<input id="qty" type="number" required min="1" max="${max}" value="1"></label><p>Review your quantity before confirming this demo pledge.</p><button class="primary">Confirm demo pledge</button></form>`,
  );
  $("#pledgeform").onsubmit = (e) => {
    e.preventDefault();
    state.pledges[n] = (state.pledges[n] || 0) + Number($("#qty").value);
    save();
    $("#dialog").close();
    render();
    toast("Thank you. Your demo pledge was saved.");
  };
};
function learning() {
  return (
    head(
      "Keep a place for every learner.",
      "Choose arrangements that fit your pupils. A coordinator reviews availability and accessibility.",
    ) +
    `<div class="form"><h2>What could work for your school?</h2>${choices(["Nearby partner school", "Community learning space", "Printed take-home packs", "Online lessons (internet needed)"], state.plan || [], "plan")}<p class="notice">Example options only. Confirm space, accessible transport, adult supervision, and family consent before moving pupils.</p><button class="primary" onclick="savePlan()">Review learning plan →</button></div>`
  );
}
window.savePlan = () => {
  let p = selected("plan");
  if (!p.length) {
    toast("Choose at least one learning arrangement.");
    return;
  }
  modal(
    `<h2>Review your plan</h2><p>${p.join("<br>")}</p><p>Save as a draft for coordinator review?</p><button id="confirmplan" class="primary">Save draft plan</button>`,
  );
  $("#confirmplan").onclick = () => {
    state.plan = p;
    save();
    $("#dialog").close();
    location.hash = "school";
    toast("Learning plan draft saved.");
  };
};
function coordinator() {
  return (
    head(
      "Good morning, coordinator.",
      "A clear view of what schools need and where your community can help.",
    ) +
    `<div class="stats"><div><strong>12</strong><span>schools supported</span></div><div><strong>${36 + state.reports.length}</strong><span>recovery missions</span></div><div><strong>18</strong><span>volunteers on site</span></div><div><strong>2</strong><span>check-outs to follow up</span></div></div><div class="twocol section"><section><div class="card"><span class="tag">Featured school</span><h2>SK Taman Seri Murni</h2>${scores()}${link("school", "View school →")}</div><h2>Reports to review</h2>${state.reports.length ? state.reports.map((r, i) => `<div class="card"><h3>${escape(r.school)}</h3><p>${r.needs.map(escape).join(", ")}</p><p class="small">AI task suggestions require human review. Qualified inspection required for building or electrical damage.</p><button onclick="reviewReport(${i})">${r.reviewed ? "✓ Reviewed in demo" : "Review suggested missions"}</button></div>`).join("") : '<div class="card"><p>No new demo reports yet.</p>' + link("report", "Try a school report") + "</div>"}</section><aside class="list"><div class="card"><h3>Volunteer requests</h3>${state.join ? `<p>Request for: ${missions.find((m) => m.id === state.join).title}</p><p class="small">Confirm credentials, access, supervision and meeting details before approval.</p><button onclick="approve()">${state.approved ? "✓ Demo approval saved" : "Review & approve demo request"}</button>` : "<p>New requests will appear here.</p>"}</div><div class="card"><h3>Safety follow-up</h3><span class="tag gold">2 sample check-outs overdue</span><p class="small">Aina · Cleanup team · due 12:00 pm<br>Ravi · Supply team · due 12:00 pm</p><button onclick="modal('<h2>Follow-up checklist</h2><p>Contact the volunteer through the approved channel, then the site lead. Record their status and follow the local response procedure if contact cannot be made.</p><p>This demo sends no messages.</p>')">View follow-up steps</button></div><div class="card"><h3>People + equipment</h3><p>Suggested match: Cleanup volunteers with a water pump → Classroom recovery.</p>${link("missions", "Explore matching")}</div></aside></div>`
  );
}
window.approve = () =>
  modal(
    `<h2>Approve this demo request?</h2><p>In a live service, check credentials where required, confirm safe access and give the volunteer meeting details first.</p><button class="primary" onclick="state.approved=true;save();document.querySelector('#dialog').close();render();toast('Demo approval saved. Check-in is now available.')">Confirm demo approval</button>`,
  );
window.reviewReport = (i) => {
  state.reports[i].reviewed = true;
  save();
  render();
  toast("Report marked reviewed in demo. No volunteers dispatched.");
};
function render() {
  let route = location.hash.slice(1) || "home";
  main.innerHTML = (
    {
      home,
      school,
      report: reportpage,
      generated,
      volunteer,
      missions: board,
      safety,
      resources,
      learning,
      coordinator,
    }[route] || home
  )();
  if (route === "report") {
    if (step === 0) {
      $("#school").value = report.school;
      if (report.event) $("#event").value = report.event;
    }
    if ($("#photos"))
      $("#photos").onchange = (e) => {
        report.photos = [...e.target.files].map((f) => f.name);
        $("#photostatus").textContent =
          report.photos.length +
          " photo(s) selected locally. Nothing uploaded.";
      };
  }
  if (route === "volunteer") {
    if (state.profile.area) $("#area").value = state.profile.area;
    if (state.profile.availability)
      $("#availability").value = state.profile.availability;
  }
  document.title =
    "SchoolBridge · " +
    (route === "home"
      ? "Back to learning, together"
      : route.charAt(0).toUpperCase() + route.slice(1));
}
window.addEventListener("hashchange", () => {
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});
for (const [id, cls] of [
  ["size", "large"],
  ["contrast", "contrast"],
  ["simple", "simple"],
]) {
  if (state[cls]) document.body.classList.add(cls);
  $("#" + id).setAttribute("aria-pressed", !!state[cls]);
  $("#" + id).onclick = () => {
    state[cls] = !state[cls];
    document.body.classList.toggle(cls, state[cls]);
    $("#" + id).setAttribute("aria-pressed", state[cls]);
    if (id === "size")
      $("#size").textContent = state.large
        ? "A− Standard text"
        : "A+ Larger text";
    save();
  };
}
$("#read").onclick = () => {
  if ("speechSynthesis" in window) {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      $("#read").textContent = "◖ Read aloud";
      return;
    }
    let u = new SpeechSynthesisUtterance(main.innerText);
    u.rate = 0.85;
    u.onend = () => ($("#read").textContent = "◖ Read aloud");
    speechSynthesis.speak(u);
    $("#read").textContent = "■ Stop reading";
  } else toast("Read-aloud preview is unavailable in this browser.");
};
$("#language").onclick = () =>
  modal(
    '<h2>Choose a language</h2><p>This prototype is in English.</p><p>Bahasa Melayu · 中文 · தமிழ்</p><p class="muted">Translation options are placeholders for the next version.</p>',
  );
render();
