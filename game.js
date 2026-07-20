const SUPABASE_URL = "https://tabhvfrodakgfphfcctd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RsJy62SEbT7WjhNGF20k9g_dNTEKSNN";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const randomId = () => Math.random().toString(36).slice(2, 8).toUpperCase();

const CARDS = [
  {name:"Estrogen", fn:"ควบคุมลักษณะเพศหญิง", loc:"รังไข่", effect:"ฟื้นฟูเพิ่ม 50% 2 เทิร์น", type:"heal"},
  {name:"Progesterone", fn:"เตรียมเยื่อบุมดลูกสำหรับการฝังตัว", loc:"รังไข่", effect:"ฟื้นฟูเพิ่ม 50% 1 เทิร์น", type:"heal"},
  {name:"Testosterone", fn:"ควบคุมลักษณะเพศชาย", loc:"อัณฑะ", effect:"ความเสียหายเพิ่ม 100% 2 เทิร์น", type:"attack"},
  {name:"Androgen", fn:"กระตุ้นลักษณะเพศชายรอง", loc:"ต่อมหมวกไตส่วนนอก", effect:"ความเสียหายเพิ่ม 50% 2 เทิร์น", type:"attack"},
  {name:"FSH", fn:"กระตุ้นการเจริญของไข่และการสร้างอสุจิ", loc:"ต่อมใต้สมองส่วนหน้า", effect:"ฟื้นฟูเพิ่ม 25% 2 เทิร์น", type:"heal"},
  {name:"LH", fn:"กระตุ้นการตกไข่และการสร้างเทสโทสเทอโรน", loc:"ต่อมใต้สมองส่วนหน้า", effect:"ความเสียหายเพิ่ม 25% 2 เทิร์น", type:"attack"},
  {name:"GH", fn:"กระตุ้นการเจริญเติบโตของร่างกาย กระดูก และกล้ามเนื้อ", loc:"ต่อมใต้สมองส่วนหน้า", effect:"ความเสียหายและการฟื้นฟูเพิ่ม 100% 2 เทิร์น", type:"both"},
  {name:"Thyroxine", fn:"ควบคุมอัตราเมแทบอลิซึมและการเจริญเติบโต", loc:"ต่อมไทรอยด์", effect:"สร้างดาเมจ 10 และเพิ่มความเสียหาย 100% 2 เทิร์น", type:"attack"},
  {name:"ADH", fn:"ช่วยให้ไตดูดน้ำกลับและรักษาสมดุลน้ำ", loc:"ต่อมใต้สมองส่วนหลัง", effect:"ติดดูดกลับน้ำ 2 เทิร์น และแก้เพิ่มปริมาณน้ำให้ตนเอง", type:"water"},
  {name:"Aldosterone", fn:"ควบคุมสมดุลน้ำและเกลือแร่", loc:"ต่อมหมวกไตส่วนนอก", effect:"ติดเพิ่มปริมาณน้ำ 2 เทิร์น และแก้ดูดกลับน้ำให้ตนเอง", type:"water"},
  {name:"Calcitonin", fn:"ลดระดับแคลเซียมในเลือดและช่วยสะสมแคลเซียมที่กระดูก", loc:"ต่อมไทรอยด์", effect:"ลดความเสียหายที่ได้รับ 25% เพิ่มความเสียหาย 25% และแก้แคลเซียมสูง", type:"attack"},
  {name:"PTH", fn:"เพิ่มระดับแคลเซียมในเลือด", loc:"ต่อมพาราไทรอยด์", effect:"ติดแคลเซียมสูงให้ศัตรูและแก้แคลเซียมต่ำให้ตนเอง", type:"debuff"},
  {name:"GnRH", fn:"กระตุ้นต่อมใต้สมองให้หลั่ง FSH และ LH", loc:"ไฮโพทาลามัส", effect:"สุ่มจั่ว FSH หรือ LH", type:"draw"},
  {name:"TRH", fn:"กระตุ้นต่อมใต้สมองให้หลั่ง TSH", loc:"ไฮโพทาลามัส", effect:"จั่ว TSH", type:"draw"},
  {name:"CRH", fn:"กระตุ้นต่อมใต้สมองให้หลั่ง ACTH", loc:"ไฮโพทาลามัส", effect:"จั่ว ACTH", type:"draw"},
  {name:"PIH / Dopamine", fn:"ยับยั้งการหลั่งโพรแลกทิน", loc:"ไฮโพทาลามัส", effect:"ป้องกันการใช้ Prolactin และล้างสถานะจาก Prolactin", type:"debuff"},
  {name:"GHIH / Somatostatin", fn:"ยับยั้งการหลั่ง Growth Hormone", loc:"ไฮโพทาลามัส", effect:"ศัตรูใช้ GH ไม่ได้ 3 เทิร์น", type:"debuff"},
  {name:"GHRH", fn:"กระตุ้นการหลั่ง Growth Hormone", loc:"ไฮโพทาลามัส", effect:"หยิบ GH ขึ้นมือ", type:"draw"},
  {name:"ACTH", fn:"กระตุ้นต่อมหมวกไตส่วนนอกให้หลั่งกลูโคคอร์ทิคอยด์", loc:"ต่อมใต้สมองส่วนหน้า", effect:"สุ่มจั่วกลูโคคอร์ทิคอยด์หรือคอร์ทิซอล", type:"draw"},
  {name:"TSH", fn:"กระตุ้นต่อมไทรอยด์ให้สร้างไทรอกซิน", loc:"ต่อมใต้สมองส่วนหน้า", effect:"จั่วไทรอกซิน", type:"draw"},
  {name:"Prolactin", fn:"กระตุ้นการเจริญเติบโตของต่อมน้ำนมและการสร้างน้ำนม", loc:"ต่อมใต้สมองส่วนหน้า", effect:"ฟื้นฟู HP 10", type:"heal"},
  {name:"Endorphin", fn:"ช่วยระงับความเจ็บปวดและเกี่ยวข้องกับความสุข", loc:"สมองและต่อมใต้สมอง", effect:"ฟื้นฟู HP 5 และแก้เครียด", type:"heal"},
  {name:"Glucocorticoids", fn:"ควบคุมเมแทบอลิซึมคาร์โบไฮเดรตและต้านการอักเสบ", loc:"ต่อมหมวกไตชั้นนอก", effect:"สร้างดาเมจ 15", type:"attack"},
  {name:"Cortisol", fn:"ฮอร์โมนสำคัญในภาวะเครียดและอดนอน", loc:"ต่อมหมวกไตชั้นนอก", effect:"ทำให้ศัตรูติดเครียด", type:"debuff"},
  {name:"Epinephrine", fn:"เพิ่มการทำงานของหัวใจและเพิ่มน้ำตาลเพื่อเตรียมใช้พลังงาน", loc:"ต่อมหมวกไตชั้นใน", effect:"ดาเมจ 20 + 50% HP ที่เสียไป", type:"attack"},
  {name:"Norepinephrine", fn:"ทำให้หลอดเลือดส่วนปลายหดตัวและความดันสูงขึ้น", loc:"ต่อมหมวกไตชั้นใน", effect:"ดาเมจ 10 + 50% HP ปัจจุบัน", type:"attack"},
  {name:"Insulin", fn:"ลดระดับน้ำตาลในเลือด", loc:"เบต้าเซลล์ ตับอ่อน", effect:"ติดน้ำตาลในเลือดต่ำให้ศัตรู", type:"debuff"},
  {name:"Glucagon", fn:"เพิ่มระดับน้ำตาลในเลือด", loc:"อัลฟาเซลล์ ตับอ่อน", effect:"ติดน้ำตาลในเลือดสูงให้ศัตรู", type:"debuff"},
  {name:"Melatonin", fn:"ควบคุมการนอนหลับและอาการง่วง", loc:"ต่อมไพเนียล", effect:"ทำให้ศัตรูหลับ 2 เทิร์น", type:"debuff"},
  {name:"Oxytocin", fn:"กระตุ้นการหดตัวของมดลูกและการหลั่งน้ำนม มีบทบาทด้านความผูกพัน", loc:"สร้างจากไฮโพทาลามัส หลั่งจากต่อมใต้สมองส่วนหลัง", effect:"ลดความเสียหายที่ได้รับ 50% 3 เทิร์น", type:"heal"},
  {name:"hCG", fn:"คงสภาพโครงสร้างในรังไข่และช่วยรักษาเยื่อบุมดลูก", loc:"รก", effect:"เพิ่ม HP 10", type:"heal"},
  {name:"Thymosin", fn:"กระตุ้นการพัฒนาเซลล์ T-lymphocyte", loc:"ต่อมไทมัส", effect:"ล้างดีบัพทั้งหมดและต้านดีบัพ 3 เทิร์น", type:"heal"},
  {name:"Gastrin", fn:"กระตุ้นการหลั่งกรดและเอนไซม์ รวมถึงการเคลื่อนไหวของกระเพาะ", loc:"กระเพาะอาหาร", effect:"เพิ่มความเสียหาย 40%", type:"attack"},
  {name:"Secretin", fn:"ช่วยควบคุมความเป็นกรด-ด่างในลำไส้เล็ก", loc:"ลำไส้เล็กส่วนต้น", effect:"ลดความเสียหายจากดีบัพ", type:"heal"},
  {name:"CCK", fn:"กระตุ้นการหลั่งน้ำดีและเอนไซม์ย่อยอาหาร", loc:"ลำไส้เล็กส่วนต้น", effect:"เพิ่มความเสียหาย 40%", type:"attack"},
  {name:"EPO", fn:"กระตุ้นไขกระดูกให้สร้างเม็ดเลือดแดง", loc:"ไตเป็นหลัก และตับบางส่วน", effect:"ฟื้นฟู HP 10 ต่อเนื่อง 3 เทิร์น", type:"heal"}
];

const STATUS = {
  sleep:"😴 หลับ",
  dehydration:"💧 ขาดน้ำ",
  highSugar:"🍬 น้ำตาลสูง",
  lowSugar:"🍬 น้ำตาลต่ำ",
  highCalcium:"🦴 แคลเซียมสูง",
  lowCalcium:"🦴 แคลเซียมต่ำ",
  stress:"😰 เครียด"
};

let roomId = null;
let playerId = randomId();
let role = null;
let channel = null;
let state = null;
let timerInterval = null;

function freshPlayer() {
  return {
    hp:100, water:100, hand:shuffle(CARDS).slice(0,5),
    statuses:{}, chosenCard:null
  };
}

function freshState(hostId) {
  return {
    status:"waiting",
    hostId,
    players:{[hostId]:freshPlayer()},
    turn:null,
    round:1,
    turnEndsAt:null,
    lastCard:null,
    log:[]
  };
}

function setMessage(text, error=false) {
  $("lobbyMessage").textContent = text;
  $("lobbyMessage").style.color = error ? "#f87171" : "#fbbf24";
}

function log(text) {
  if (!state) return;
  state.log = [text, ...(state.log || [])].slice(0,30);
  renderLog();
}

function renderLog() {
  $("gameLog").innerHTML = (state?.log || []).map(x => `<div>${x}</div>`).join("");
}

function getMe() {
  return state?.players?.[playerId];
}

function getEnemy() {
  const ids = Object.keys(state?.players || {});
  const enemy = ids.find(id => id !== playerId);
  return enemy ? state.players[enemy] : null;
}

async function saveState() {
  const {error} = await supabaseClient.from("rooms").update({game_state:state}).eq("id",roomId);
  if (error) {
    console.error(error);
    setMessage("บันทึกเกมไม่สำเร็จ: " + error.message, true);
  }
}

async function createRoom() {
  const id = randomId();
  const initial = freshState(playerId);
  const {error} = await supabaseClient.from("rooms").insert({id, game_state:initial});
  if (error) {
    console.error(error);
    setMessage("สร้างห้องไม่สำเร็จ: " + error.message, true);
    return;
  }
  roomId=id; role="host"; state=initial;
  await connectRoom();
  setMessage("สร้างห้องแล้ว: " + id + " — ส่งรหัสให้เพื่อน");
  render();
}

async function joinRoom() {
  const id = $("roomCodeInput").value.trim().toUpperCase();
  if (id.length !== 6) return setMessage("กรุณากรอกรหัส 6 ตัว", true);

  const {data,error} = await supabaseClient.from("rooms").select("game_state").eq("id",id).single();
  if (error || !data) {
    setMessage("ไม่พบห้องนี้", true);
    return;
  }
  const current = data.game_state;
  if (Object.keys(current.players || {}).length >= 2) {
    setMessage("ห้องเต็มแล้ว", true);
    return;
  }

  roomId=id; role="guest"; state=current;
  state.players[playerId] = freshPlayer();
  state.status="playing";
  state.turn = Math.random() < .5 ? state.hostId : playerId;
  state.turnEndsAt = Date.now()+30000;
  log("เริ่มเกมแล้ว");
  await supabaseClient.from("rooms").update({game_state:state}).eq("id",roomId);
  await connectRoom();
  render();
}

async function connectRoom() {
  if (channel) await supabaseClient.removeChannel(channel);

  channel = supabaseClient.channel("room:" + roomId)
    .on("postgres_changes",
      {event:"UPDATE", schema:"public", table:"rooms", filter:`id=eq.${roomId}`},
      payload => {
        state = payload.new.game_state;
        render();
      })
    .subscribe();

  $("lobby").classList.add("hidden");
  $("game").classList.remove("hidden");
  render();
}

function render() {
  if (!state) return;
  const me=getMe(), enemy=getEnemy();
  if (!me) return;

  $("roundNo").textContent=state.round;
  $("myHp").textContent=Math.max(0,Math.round(me.hp));
  $("myWater").textContent=Math.max(0,Math.round(me.water));
  $("enemyHp").textContent=enemy ? Math.max(0,Math.round(enemy.hp)) : "—";
  $("enemyWater").textContent=enemy ? Math.max(0,Math.round(enemy.water)) : "—";

  $("myHpBar").style.width=Math.max(0,Math.min(100,me.hp))+"%";
  $("myWaterBar").style.width=Math.max(0,Math.min(100,me.water))+"%";
  $("enemyHpBar").style.width=enemy ? Math.max(0,Math.min(100,enemy.hp))+"%" : "0%";
  $("enemyWaterBar").style.width=enemy ? Math.max(0,Math.min(100,enemy.water))+"%" : "0%";

  $("myStatuses").innerHTML=renderStatuses(me.statuses);
  $("enemyStatuses").innerHTML=enemy ? renderStatuses(enemy.statuses) : "";

  const myTurn = state.turn === playerId && state.status === "playing";
  $("myTurnBadge").textContent=myTurn ? "ถึงเทิร์น" : "";
  $("enemyTurnBadge").textContent=state.turn && state.turn !== playerId ? "ถึงเทิร์น" : "";
  $("turnHint").textContent = state.status === "waiting" ? "รอผู้เล่นอีกคน" : myTurn ? "เลือกการ์ดของคุณ" : "รอคู่ต่อสู้";

  $("lastCard").textContent=state.lastCard ? `${state.lastCard.playerName} ใช้ ${state.lastCard.name}` : "ยังไม่มีการ์ด";
  $("handCount").textContent=`(${me.hand.length})`;
  renderHand(me.hand, myTurn && !hasStatus(me,"sleep"));
  renderLog();

  $("statusBanner").textContent = state.status === "waiting"
    ? "รอผู้เล่นคนที่ 2..."
    : myTurn ? "ถึงเทิร์นของคุณ" : "รอคู่ต่อสู้เล่น";

  updateTimer();
}

function renderStatuses(statuses={}) {
  return Object.entries(statuses).filter(([,v])=>v>0).map(([k,v])=>`<span class="status">${STATUS[k] || k} ${v}</span>`).join("");
}

function renderHand(hand, enabled) {
  $("hand").innerHTML = hand.map((card,i)=>`
    <button class="card" ${enabled ? "" : "disabled"} data-index="${i}">
      <h3>${card.name}</h3>
      <p>${card.fn}</p>
      <p class="muted">📍 ${card.loc}</p>
      <p class="effect">${card.effect}</p>
    </button>
  `).join("");

  document.querySelectorAll(".card").forEach(btn=>{
    btn.addEventListener("click",()=>playCard(Number(btn.dataset.index)));
  });
}

function hasStatus(player, key) {
  return Number(player?.statuses?.[key] || 0) > 0;
}

function addStatus(player,key,turns) {
  player.statuses[key]=Math.max(Number(player.statuses[key]||0),turns);
}

function damage(target, amount) {
  target.hp -= Math.max(0,amount);
}

function heal(target, amount) {
  target.hp = Math.min(100,target.hp+amount);
}

function applyCard(card, actor, target) {
  const e=card.name;
  if (e==="Prolactin") heal(actor,10);
  else if (e==="Endorphin") {heal(actor,5); delete actor.statuses.stress;}
  else if (e==="hCG") heal(actor,10);
  else if (e==="EPO") heal(actor,10);
  else if (e==="Glucocorticoids") damage(target,15);
  else if (e==="Epinephrine") damage(target,20);
  else if (e==="Norepinephrine") damage(target,10);
  else if (e==="Cortisol") addStatus(target,"stress",2);
  else if (e==="Melatonin") addStatus(target,"sleep",2);
  else if (e==="Insulin") addStatus(target,"lowSugar",3);
  else if (e==="Glucagon") addStatus(target,"highSugar",3);
  else if (e==="PTH") {addStatus(target,"highCalcium",3); delete actor.statuses.lowCalcium;}
  else if (e==="Calcitonin") {delete actor.statuses.highCalcium; addStatus(target,"lowCalcium",3);}
  else if (e==="ADH") {addStatus(target,"dehydration",3); delete actor.statuses.dehydration;}
  else if (e==="Aldosterone") {delete actor.statuses.dehydration; actor.water=Math.min(100,actor.water+10);}
  else if (e==="Thymosin") {actor.statuses={}; actor.thymosinResist=3;}
  else if (e==="Secretin") actor.debuffResist=3;
  else if (e==="Oxytocin") actor.damageReduction=3;
  else if (e==="Testosterone") actor.damageBoost=2;
  else if (e==="Androgen") actor.damageBoost=2;
  else if (e==="LH") actor.damageBoost=2;
  else if (e==="Gastrin" || e==="CCK") actor.damageBoost=2;
  else if (e==="GH") {actor.damageBoost=2; actor.healBoost=2;}
  else if (e==="Thyroxine") {damage(target,10); actor.damageBoost=2;}
  else if (e==="Estrogen" || e==="Progesterone" || e==="FSH") actor.healBoost=2;
  else if (e==="GHRH") {
    const idx=CARDS.findIndex(c=>c.name==="GH"); if(idx>=0) actor.hand.push(CARDS[idx]);
  }
  else if (e==="TRH") {
    const idx=CARDS.findIndex(c=>c.name==="TSH"); if(idx>=0) actor.hand.push(CARDS[idx]);
  }
  else if (e==="TSH") {
    const idx=CARDS.findIndex(c=>c.name==="Thyroxine"); if(idx>=0) actor.hand.push(CARDS[idx]);
  }
  else if (e==="PIH / Dopamine") {delete actor.statuses.prolactinBlock; delete actor.statuses.stress;}
  else if (e==="GHIH / Somatostatin") target.ghBlocked=3;
}

async function showCard(card, actorName) {
  $("cardIcon").textContent = card.type==="attack" ? "⚔️" : card.type==="heal" ? "💚" : "🧬";
  $("cardName").textContent = `${actorName} ใช้ ${card.name}`;
  $("cardFunction").textContent = card.fn;
  $("cardLocation").textContent = "📍 " + card.loc;
  $("cardEffect").textContent = "ความสามารถ: " + card.effect;
  $("cardModal").classList.remove("hidden");
  await sleep(1400);
  $("cardModal").classList.add("hidden");
}

async function playCard(index) {
  if (!state || state.status !== "playing" || state.turn !== playerId) return;
  const me=getMe(), enemy=getEnemy();
  if (!me || !enemy || hasStatus(me,"sleep")) return;

  const card=me.hand[index];
  if (!card) return;

  me.hand.splice(index,1);
  state.lastCard={playerName:"คุณ",name:card.name};
  await saveState();
  render();

  await showCard(card,"คุณ");
  applyCard(card,me,enemy);
  endTurn(me, card);
  await saveState();
  render();
}

async function endTurn(me, card) {
  if (me.statuses.sleep) me.statuses.sleep=Math.max(0,me.statuses.sleep-1);

  const ids=Object.keys(state.players);
  const enemyId=ids.find(id=>id!==playerId);

  if (enemyId && state.players[enemyId].chosenCard) {
    state.players[enemyId].chosenCard=null;
  }

  state.turn = enemyId;
  state.turnEndsAt=Date.now()+30000;

  if (me.hp<=0 || (enemyId && state.players[enemyId].hp<=0)) {
    state.status="finished";
    return;
  }

  state.round += 0.5;
  if (state.round % 1 === 0) {
    state.round = Math.floor(state.round);
    Object.values(state.players).forEach(p=>{
      Object.keys(p.statuses).forEach(k=>{
        p.statuses[k]=Math.max(0,p.statuses[k]-1);
        if(p.statuses[k]===0) delete p.statuses[k];
      });
      p.hand.push(...shuffle(CARDS).slice(0,1));
      if(p.water<20) p.hp-=5;
      if(p.water<0) p.hp-=20;
    });
  }
}

async function timeoutTurn() {
  if (!state || state.status !== "playing" || state.turn !== playerId) return;
  const enemy=getEnemy();
  if (!enemy) return;
  log("⏱️ หมดเวลา ข้ามเทิร์น");
  state.turn=Object.keys(state.players).find(id=>id!==playerId);
  state.turnEndsAt=Date.now()+30000;
  await saveState();
  render();
}

function updateTimer() {
  clearInterval(timerInterval);
  if (!state || state.status !== "playing" || !state.turnEndsAt) {
    $("timer").textContent="⏱️ —";
    return;
  }

  const tick=()=>{
    const remaining=Math.max(0,state.turnEndsAt-Date.now());
    const sec=Math.ceil(remaining/1000);
    $("timer").textContent=`⏱️ ${sec}s`;
    if (remaining<=0) {
      clearInterval(timerInterval);
      if (state.turn===playerId) timeoutTurn();
    }
  };
  tick();
  timerInterval=setInterval(tick,250);
}

$("createBtn").addEventListener("click",createRoom);
$("joinBtn").addEventListener("click",joinRoom);
$("guideBtn").addEventListener("click",()=>$("guideModal").classList.remove("hidden"));
$("closeGuideBtn").addEventListener("click",()=>$("guideModal").classList.add("hidden"));

render();
