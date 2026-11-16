(() => {
  "use strict";

  const levels = [
    ["Das Geheimnis der Lichtkristalle","Flockendorf","Dorfplatz und erloschene Lichtkristalle"],
    ["Die geheimnisvolle Eishöhle","Flockendorf","Eine verborgene Höhle voller Rätsel"],
    ["Das Geheimnis der verschwundenen Dorfbewohner","Flockendorf","Spuren führen zu einem versteckten Lager"],
    ["Der verschollene Kristallpfad","Flockendorf","Drei Kristallstücke müssen gefunden werden"],
    ["Der Wächter von Flockendorf","Flockendorf","Der Frostwächter versperrt den Weg"],
    ["Der flüsternde Wald","Tannenwald","Ein stiller Wald voller fremder Spuren"],
    ["Die Schatten im Schnee","Tannenwald","Schattenwölfe verfolgen Leon und Peter"],
    ["Das verlassene Waldlager","Tannenwald","Ein altes Lager birgt ein Geheimnis"],
    ["Der Nebelpfad","Tannenwald","Finde einen sicheren Weg durch den Nebel"],
    ["Der Frostwächter","Tannenwald","Ein Frostwächter bewacht den alten Turm"],
    ["Der gefrorene See","Frostsee","Etwas bewegt sich unter dem Eis"],
    ["Die geheimnisvollen Eishöhlen","Frostsee","Aktiviere die Kristalle in der richtigen Reihenfolge"],
    ["Gefahr unter dem Eis","Frostsee","Weiche den Eis-Schlangen aus"],
    ["Das Herz des Frostsees","Frostsee","Stabilisiere die alte Kristallstation"],
    ["Die Eishexe","Frostsee","Stelle dich der unheimlichen Eishexe"],
    ["Der Aufstieg","Kristallgebirge","Finde den sicheren Weg durch den Schneesturm"],
    ["Die Kristallhöhlen","Kristallgebirge","Löse die Rätsel der leuchtenden Kristalle"],
    ["Der Sturm auf dem Gipfel","Kristallgebirge","Überquere den stürmischen Gebirgspfad"],
    ["Der Frostautomat","Kristallgebirge","Besiege den mechanischen Wächter"],
    ["Die Eisgrenze","Eisgrenze und Eispalast","Finde den Weg zum fernen Eispalast"],
    ["Die Wächter des Eises","Eisgrenze und Eispalast","Aktiviere die drei magischen Siegel"],
    ["Das Geheimnis des Eispalastes","Eisgrenze und Eispalast","Entdecke die verborgene Bibliothek"],
    ["Der letzte Weg","Eisgrenze und Eispalast","Besiege den Eisdrache auf dem letzten Weg"],
    ["Der Eisregent – Das große Finale","Eisgrenze und Eispalast","Nutze alle 24 Kalendergegenstände im finalen Kampf"]
  ].map((v,i)=>({id:i+1,name:v[0],region:v[1],objective:v[2]}));

  const calendarItems = [
    "Sonnenelixier","Mondsplitter","Frostfeder","Schneekugel","Sternenstaub","Eiskompass",
    "Wärmekristall","Nebelglas","Winterharz","Polarlichtfunke","Kristallherz","Schneerose",
    "Frostmünze","Silberner Tannenzapfen","Echoschale","Gletscherperle","Nordstern-Siegel",
    "Eisblume","Runenstein","Kristallköder","Lichtlaterne","Schutzamulett","Aurorakristall","Siegessiegel"
  ];

  const regionColors = {"Flockendorf":"#9acbd5","Tannenwald":"#5e9b92","Frostsee":"#75a9d8","Kristallgebirge":"#b4a4e7","Eisgrenze und Eispalast":"#8b9acb"};
  const defaultState = {unlocked:1,completed:[],current:1,xp:0,coins:0,hearts:5,items:calendarItems.map((name,i)=>({id:i+1,name,owned:false})),journal:["Leon und Peter sind in Flockendorf angekommen. Die Lichtkristalle sind erloschen."],freeExplore:false};
  let state = loadState();
  let currentScreen = "start-screen";
  let soundOn = false;
  let supabase = null;
  let audio = null;
  let player = {x:50,y:68};

  const $ = id => document.getElementById(id);
  function loadState(){ try { return {...structuredClone(defaultState),...JSON.parse(localStorage.getItem("winterquest-save")||"{}")}; } catch { return structuredClone(defaultState); } }
  function saveState(){ localStorage.setItem("winterquest-save",JSON.stringify(state)); $("save-status").textContent="Spielstand lokal gespeichert"; syncRemote(); }
  function show(id){ document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden")); $(id).classList.remove("hidden"); currentScreen=id; }
  function modal(title,text){ $("modal-title").textContent=title; $("modal-text").textContent=text; $("modal").classList.remove("hidden"); }
  function closeModal(){ $("modal").classList.add("hidden"); }
  function updateStats(){ $("hearts").textContent=`${state.hearts}/5`; $("xp").textContent=`${state.xp} XP`; $("coins").textContent=state.coins; }
  function renderMap(){
    const groups = [...new Set(levels.map(l=>l.region))];
    $("region-list").innerHTML = groups.map(region=>{
      const rows=levels.filter(l=>l.region===region);
      return `<section class="region-block"><h3><span style="background:${regionColors[region]}"></span>${region}</h3><div class="level-grid">${rows.map(l=>{
        const done=state.completed.includes(l.id), open=l.id<=state.unlocked;
        const cls=done?"done":open?"open":"locked";
        return `<button class="level-tile ${cls}" data-level="${l.id}" ${open?"":"disabled"}><b>${String(l.id).padStart(2,"0")}</b><span>${l.name}</span><small>${done?"Abgeschlossen":open?"Spielbar":"Gesperrt"}</small></button>`;
      }).join("")}</div></section>`;
    }).join("");
    document.querySelectorAll("[data-level]").forEach(btn=>btn.addEventListener("click",()=>startLevel(Number(btn.dataset.level))));
  }
  function startLevel(id){
    const l=levels[id-1];
    if(!l || (id>state.unlocked && !state.completed.includes(id))) return;
    state.current=id; state.hearts=5; saveState();
    $("region-name").textContent=l.region.toUpperCase(); $("level-name").textContent=l.name;
    $("world-title").textContent=l.region; $("objective-title").textContent=l.name;
    $("objective-text").textContent=l.objective;
    $("speech").textContent=id===1?"Peter: Los, Leon! Im Dorf stimmt etwas nicht.":"Peter: Ich passe auf, Leon. Wir schaffen das zusammen!";
    $("peter-line").textContent=id===24?"„Leon, jetzt ist der Moment gekommen. Schau in deinen Rucksack!“":"„Ich habe da eine Spur entdeckt!“";
    $("journal-text").textContent=state.journal.join("\n\n");
    updateStats(); show("game-screen");
  }
  function completeTask(){
    const id=state.current, l=levels[id-1];
    if(state.completed.includes(id)){ modal("Schon geschafft!","Dieses Level ist bereits abgeschlossen. Du kannst es jederzeit erneut spielen."); return; }
    state.completed.push(id); state.xp+=100; state.coins+=25;
    state.unlocked=Math.max(state.unlocked,Math.min(24,id+1));
    state.journal.push(`Level ${id}: ${l.name} – ${l.objective}`);
    if(id===24){state.freeExplore=true;modal("Der Eisregent ist besiegt!","Der Winter kehrt in die Welt zurück. Die Welt bleibt geöffnet – du kannst weiter erkunden und Level erneut spielen.");}
    else modal("Level abgeschlossen!",`Gut gemacht! ${l.name} ist geschafft. Du kehrst zur Levelkarte zurück.`);
    saveState(); updateStats();
    $("modal-ok").onclick=()=>{closeModal();renderMap();show("map-screen");$("modal-ok").onclick=closeModal;};
  }
  function renderInventory(){
    $("inventory-grid").innerHTML=state.items.map(item=>`<div class="item-slot ${item.owned?"owned":""}"><span class="item-icon">✧</span><b>${String(item.id).padStart(2,"0")}</b><small>${item.name}</small><em>${state.current===24?"Für das Finale":"Bis Level 24 geschützt"}</em></div>`).join("");
  }
  function move(dx,dy){
    player.x=Math.max(8,Math.min(92,player.x+dx)); player.y=Math.max(35,Math.min(88,player.y+dy));
    const leon=document.querySelector(".leon"); leon.style.left=player.x+"%"; leon.style.top=player.y+"%";
    $("location-label").textContent=player.x<35?"Am Dorfrand":player.x>70?"Bei den Lichtkristallen":"Dorfplatz";
  }
  async function initSupabase(){
    const cfg=window.WINTERQUEST_CONFIG||{};
    if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase) return;
    try{
      supabase=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
      const {data:{session}}=await supabase.auth.getSession();
      if(session){$("save-status").textContent="Cloud-Speicherung bereit"; await syncRemote();}
    }catch(e){console.warn("Supabase nicht verbunden:",e);}
  }
  async function syncRemote(){
    if(!supabase) return;
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user) return;
      const {error}=await supabase.from("game_saves").upsert({user_id:user.id,save_data:state,updated_at:new Date().toISOString()},{onConflict:"user_id"});
      if(error) throw error;
      $("save-status").textContent="Cloud-Spielstand gespeichert";
    }catch(e){console.warn("Cloud-Speicherung nicht möglich:",e);$("save-status").textContent="Lokal gespeichert";}
  }

  $("new-game").onclick=()=>{state=structuredClone(defaultState);saveState();startLevel(1);};
  $("continue-game").onclick=()=>startLevel(state.current||1);
  $("open-map-start").onclick=()=>{renderMap();show("map-screen");};
  $("map-button").onclick=()=>{renderMap();show("map-screen");};
  $("inventory-button").onclick=()=>{renderInventory();show("inventory-screen");};
  $("journal-button").onclick=()=>{ $("journal-text").textContent=state.journal.join("\n\n");show("journal-screen");};
  $("complete-task").onclick=completeTask;
  $("close-modal").onclick=closeModal; $("modal-ok").onclick=closeModal;
  document.querySelectorAll(".back-home").forEach(b=>b.onclick=()=>show("start-screen"));
  document.querySelectorAll(".back-game").forEach(b=>b.onclick=()=>show("game-screen"));
  $("settings-button").onclick=()=>show("settings-screen");
  $("reset-progress").onclick=()=>modal("Spielstand zurücksetzen?","Bitte bestätige den Reset, indem du im Browser die Website-Daten löschst. Der lokale Spielstand wird dadurch entfernt.");
  $("sound-toggle").onclick=()=>{soundOn=!soundOn;$("sound-toggle").textContent=soundOn?"♫ Ton aus":"♫ Ton an"; if(soundOn) modal("Audio vorbereitet","Lege deine lizenzierten Audiodateien später in assets/audio/ und trage ihre Dateinamen in game.js ein.");};
  $("music-volume").oninput=e=>{if(audio)audio.volume=Number(e.target.value)/100;};
  $("sfx-volume").oninput=()=>{};
  window.addEventListener("keydown",e=>{
    if(currentScreen!=="game-screen")return;
    const k=e.key.toLowerCase();
    if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(k))e.preventDefault();
    if(k==="arrowup"||k==="w")move(0,-2);
    if(k==="arrowdown"||k==="s")move(0,2);
    if(k==="arrowleft"||k==="a")move(-2,0);
    if(k==="arrowright"||k==="d")move(2,0);
    if(k==="i"){renderInventory();show("inventory-screen");}
  });
  renderMap(); updateStats(); initSupabase();
})();