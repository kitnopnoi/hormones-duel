/* Hormone Duel Online — FINAL CLEAN BUILD
   ใช้กับ index.html เดิมของ Hormone Duel Online
   Supabase schema:
   rooms(id text primary key, host_id text, guest_id text, game_state jsonb, created_at timestamptz)
*/

const SUPABASE_URL = 'https://tabhvfrodakgfphfcctd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_RsJy62SEbT7WjhNGF20k9g_dNTEKSNN';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = id => document.getElementById(id);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const uid = () => globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now();
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const clone = x => JSON.parse(JSON.stringify(x));

const STATUS = {
  WATER_REABSORB: ['ดูดกลับน้ำ', true],
  WATER_INCREASE: ['เพิ่มปริมาณน้ำ', false],
  HIGH_CALCIUM: ['แคลเซียมในเลือดสูง', true],
  LOW_CALCIUM: ['แคลเซียมในเลือดต่ำ', true],
  HIGH_SUGAR: ['น้ำตาลในเลือดสูง', true],
  LOW_SUGAR: ['น้ำตาลในเลือดต่ำ', true],
  STRESS: ['เครียด', true],
  SLEEP: ['หลับ', true],
  DMG_UP: ['เพิ่มความเสียหาย', false],
  HEAL_UP: ['เพิ่มการฟื้นฟู', false],
  DMG_REDUCE: ['ลดความเสียหายที่ได้รับ', false],
  DEBUFF_REDUCE: ['ลดความเสียหายจากดีบัพ', false]
};
const DEBUFFS = new Set([
  'WATER_REABSORB','WATER_INCREASE','HIGH_CALCIUM','LOW_CALCIUM',
  'HIGH_SUGAR','LOW_SUGAR','STRESS','SLEEP'
]);

const rawCards = [
 ['Estrogen','อีสโทรเจน (Estrogen)','🌸','ควบคุมลักษณะเพศหญิง','รังไข่','healBuff',50,2],
 ['Progesterone','โพรเจสเทอโรน (Progesterone)','🌼','เตรียมเยื่อบุมดลูกสำหรับการฝังตัวของตัวอ่อน','รังไข่','healBuff',50,1],
 ['Testosterone','เทสโทสเทอโรน (Testosterone)','💪','ควบคุมลักษณะเพศชาย','อัณฑะ','dmgBuff',100,2],
 ['Androgen','แอนโดรเจน (Androgen)','🧬','กระตุ้นลักษณะเพศชายรอง เช่น ขน หนวด','ต่อมหมวกไตส่วนนอก','dmgBuff',50,2],
 ['FSH','FSH (Follicle Stimulating Hormone)','🥚','กระตุ้นการเจริญของไข่และการสร้างอสุจิ','ต่อมใต้สมองส่วนหน้า','healBuff',25,2],
 ['LH','LH (Luteinizing Hormone)','🌙','กระตุ้นการตกไข่และการสร้างเทสโทสเทอโรน','ต่อมใต้สมองส่วนหน้า','dmgBuff',25,2],
 ['GH','GH (Growth Hormone)','📈','กระตุ้นการเจริญเติบโตของร่างกาย กระดูก และกล้ามเนื้อ','ต่อมใต้สมองส่วนหน้า','bothBuff',100,2],
 ['Thyroxine','ไทรอกซิน (Thyroxine)','🔥','ควบคุมอัตราเมแทบอลิซึมและการเจริญเติบโต','ต่อมไทรอยด์','thyroxine',10,2],
 ['ADH','ADH (Antidiuretic Hormone)','💧','ช่วยให้ไตดูดน้ำกลับ รักษาสมดุลน้ำในร่างกาย','ต่อมใต้สมองส่วนหลัง','adh',0,2],
 ['Aldosterone','แอลโดสเทอโรน (Aldosterone)','🧂','ควบคุมสมดุลน้ำและเกลือแร่ เพิ่มการดูดกลับโซเดียมและน้ำที่ไต','ต่อมหมวกไตส่วนนอก','aldo',0,2],
 ['Calcitonin','แคลซิโทนิน (Calcitonin)','🦴','ลดระดับแคลเซียมในเลือด ช่วยสะสมแคลเซียมที่กระดูก','ต่อมไทรอยด์','calcitonin',0,2],
 ['PTH','พาราทอร์โมน (Parathyroid Hormone, PTH)','🦴','เพิ่มระดับแคลเซียมในเลือด','ต่อมพาราไทรอยด์','pth',0,2],
 ['GnRH','GnRH (Gonadotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง FSH และ LH','ไฮโพทาลามัส','drawFSHLH',0,1],
 ['TRH','TRH (Thyrotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง TSH','ไฮโพทาลามัส','drawTSH',0,1],
 ['CRH','CRH (Corticotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง ACTH','ไฮโพทาลามัส','drawACTH',0,1],
 ['PIH','PIH (Dopamine)','✨','ยับยั้งการหลั่งโพรแลกทิน','ไฮโพทาลามัส','blockProlactin',0,3],
 ['GHIH','GHIH (Somatostatin)','🛑','ยับยั้งการหลั่ง Growth Hormone','ไฮโพทาลามัส','blockGH',0,3],
 ['GHRH','GHRH','📈','กระตุ้นการหลั่ง Growth Hormone','ไฮโพทาลามัส','drawGH',0,1],
 ['ACTH','ACTH','📡','กระตุ้นต่อมหมวกไตส่วนนอกให้หลั่งกลูโคคอร์ทิคอยด์','ต่อมใต้สมองส่วนหน้า','drawCort',0,1],
 ['TSH','TSH','📡','กระตุ้นต่อมไทรอยด์ให้สร้างและหลั่งไทรอกซิน','ต่อมใต้สมองส่วนหน้า','drawThyroxine',0,1],
 ['Prolactin','โพรแลกทิน (Prolactin / PRL)','🍼','กระตุ้นต่อมน้ำนมให้เจริญเติบโตและสร้างน้ำนม','ต่อมใต้สมองส่วนหน้า','heal',10,1],
 ['Endorphin','เอนดอร์ฟิน (Endorphin)','🏃','ช่วยระงับความเจ็บปวดและเกี่ยวข้องกับความเครียด','ต่อมใต้สมอง','endorphin',5,1],
 ['Glucocorticoids','กลูโคคอร์ทิคอยด์ (Glucocorticoids)','🔥','ควบคุมเมแทบอลิซึมของคาร์โบไฮเดรตและต้านการอักเสบ','ต่อมหมวกไตส่วนนอก','attack',15,1],
 ['Cortisol','คอร์ทิซอล (Cortisol)','⚠️','หลั่งมากเมื่อร่างกายเครียดหรืออดนอน','ต่อมหมวกไตส่วนนอก','stress',0,2],
 ['Epinephrine','เอพิเนฟริน (Epinephrine / Adrenaline)','⚡','กระตุ้นหัวใจและเพิ่มน้ำตาลในเลือด','ต่อมหมวกไตชั้นใน','epi',0,1],
 ['Norepinephrine','นอร์เอพิเนฟริน (Norepinephrine)','🚨','ทำให้หลอดเลือดหดตัวและความดันโลหิตสูงขึ้น','ต่อมหมวกไตชั้นใน','norepi',0,1],
 ['Insulin','อินซูลิน (Insulin)','🍬','ลดระดับน้ำตาลในเลือด','ตับอ่อน เบต้าเซลล์','lowSugar',0,3],
 ['Glucagon','กลูคากอน (Glucagon)','🍬','เพิ่มระดับน้ำตาลในเลือด','ตับอ่อน อัลฟาเซลล์','highSugar',0,3],
 ['Melatonin','เมลาโทนิน (Melatonin)','🌙','ควบคุมการนอนหลับและอาการง่วง','ต่อมไพเนียล','sleep',0,2],
 ['Oxytocin','ออกซิโทซิน (Oxytocin)','💞','เกี่ยวข้องกับการหดตัวของมดลูก การหลั่งน้ำนม และความผูกพัน','ไฮโพทาลามัส → หลั่งจากต่อมใต้สมองส่วนหลัง','damageReduce',50,3],
 ['hCG','hCG (Human Chorionic Gonadotropin)','🧪','คงสภาพโครงสร้างในรังไข่เพื่อรักษาเยื่อบุมดลูก','รกของหญิงตั้งครรภ์','heal',10,1],
 ['Thymosin','ไทโมซิน (Thymosin)','🛡️','กระตุ้นการพัฒนา T-cell','ต่อมไทมัส','thymosin',0,3],
 ['Gastrin','แกสทริน (Gastrin)','🍽️','กระตุ้นการหลั่งกรดและเอนไซม์ในกระเพาะอาหาร','เยื่อบุกระเพาะอาหาร','dmgBuff',40,2],
 ['Secretin','ซีครีทิน (Secretin)','⚗️','ช่วยควบคุมกรด-ด่างในลำไส้','ลำไส้เล็กส่วนต้น','debuffReduce',50,3],
 ['CCK','โคเลซิสโตไคนิน (Cholecystokinin / CCK)','🥗','กระตุ้นการหลั่งน้ำดีและเอนไซม์จากตับอ่อนเพื่อย่อยอาหาร','ลำไส้เล็กส่วนต้น','dmgBuff',40,2],
 ['EPO','อีริโทรโพอิติน (Erythropoietin / EPO)','🩸','กระตุ้นไขกระดูกให้สร้างเซลล์เม็ดเลือดแดง','ไตเป็นหลักและตับบางส่วน','epo',10,3]
];
const cards = rawCards.map((x,i)=>({
 id:i,name:x[0],display:x[1],emoji:x[2],real:x[3],organ:x[4],
 effect:x[5],power:x[6],duration:x[7]
}));

let roomId = null, role = null, room = null, channel = null;
let hostTimer = null, hostBusy = false;
const myId = localStorage.getItem('hormone-duel-player') || uid();
localStorage.setItem('hormone-duel-player', myId);

function player(name) {
 return {name,hp:100,water:100,hand:[],status:{},blocked:{},organMods:{}};
}
function addStatus(p,k,t) { p.status[k] = Math.max(p.status[k] || 0, t); }
function removeStatus(p,k) { delete p.status[k]; }
function has(p,k) { return !!p.status[k]; }
function cardOf(x) { return cards[typeof x === 'number' ? x : x.cardId]; }
function byName(n) { return cards.find(c => c.name === n); }
function buildDeck() { return shuffle(cards.flatMap(c => [c.id,c.id])).slice(0,60); }
function draw(p, deck, n=1) {
 for (let i=0;i<n;i++) {
  if (!deck.length) deck.push(...buildDeck());
  p.hand.push({uid:uid(), cardId:deck.pop()});
 }
}
function damage(p,n) { p.hp = clamp(p.hp - n, 0, 100); }
function heal(p,n) { p.hp = clamp(p.hp + n, 0, 100); }
function multiplier(p,c) { return p.organMods[c.organ]?.type === 'boost' ? 2 : 1; }
function canUse(p,c) { return !p.blocked[c.name] && !p.blocked[c.organ] && !has(p,'SLEEP'); }

function effectiveDamage(a,t,n,isDebuff=false) {
 let m = 1;
 if (has(a,'DMG_UP')) m *= 1 + a.status.DMG_UP / 100;
 if (has(a,'LOW_CALCIUM') || has(a,'LOW_SUGAR')) m *= .5;
 if (has(t,'DMG_REDUCE')) m *= 1 - t.status.DMG_REDUCE / 100;
 if (isDebuff && has(t,'DEBUFF_REDUCE')) m *= 1 - t.status.DEBUFF_REDUCE / 100;
 damage(t,n*m);
}
function effectiveHeal(p,n) {
 heal(p,n * (has(p,'HEAL_UP') ? 1 + p.status.HEAL_UP/100 : 1));
}

function applyCard(c,a,t) {
 const m = multiplier(a,c);
 switch(c.effect) {
  case 'healBuff': addStatus(a,'HEAL_UP',c.duration); a.status.HEAL_UP=50*m; break;
  case 'dmgBuff': addStatus(a,'DMG_UP',c.duration); a.status.DMG_UP=c.power*m; break;
  case 'bothBuff':
   addStatus(a,'HEAL_UP',c.duration); a.status.HEAL_UP=100*m;
   addStatus(a,'DMG_UP',c.duration); a.status.DMG_UP=100*m; break;
  case 'thyroxine': effectiveDamage(a,t,10*m); addStatus(a,'DMG_UP',c.duration); a.status.DMG_UP=100*m; break;
  case 'adh': addStatus(t,'WATER_REABSORB',c.duration); removeStatus(a,'WATER_INCREASE'); break;
  case 'aldo': addStatus(t,'WATER_INCREASE',c.duration); removeStatus(a,'WATER_REABSORB'); break;
  case 'calcitonin':
   removeStatus(a,'HIGH_CALCIUM'); addStatus(a,'LOW_CALCIUM',c.duration);
   addStatus(a,'DMG_UP',c.duration); a.status.DMG_UP=25*m;
   addStatus(a,'DMG_REDUCE',c.duration); a.status.DMG_REDUCE=25; break;
  case 'pth': addStatus(t,'HIGH_CALCIUM',3); removeStatus(a,'LOW_CALCIUM'); break;
  case 'drawFSHLH': a.hand.push({uid:uid(),cardId:byName(Math.random()<.5?'FSH':'LH').id}); break;
  case 'drawTSH': a.hand.push({uid:uid(),cardId:byName('TSH').id}); break;
  case 'drawACTH': a.hand.push({uid:uid(),cardId:byName('ACTH').id}); break;
  case 'blockProlactin': t.blocked.Prolactin=c.duration; break;
  case 'blockGH': t.blocked.GH=c.duration; break;
  case 'drawGH': a.hand.push({uid:uid(),cardId:byName('GH').id}); break;
  case 'drawCort': a.hand.push({uid:uid(),cardId:byName(Math.random()<.5?'Glucocorticoids':'Cortisol').id}); break;
  case 'drawThyroxine': a.hand.push({uid:uid(),cardId:byName('Thyroxine').id}); break;
  case 'heal': effectiveHeal(a,c.power*m); break;
  case 'endorphin': effectiveHeal(a,5*m); removeStatus(a,'STRESS'); break;
  case 'attack': effectiveDamage(a,t,c.power*m); break;
  case 'stress': addStatus(t,'STRESS',c.duration); break;
  case 'epi': effectiveDamage(a,t,20 + (100-a.hp)*.5); break;
  case 'norepi': effectiveDamage(a,t,10 + a.hp*.5); break;
  case 'lowSugar': addStatus(t,'LOW_SUGAR',c.duration); break;
  case 'highSugar': addStatus(t,'HIGH_SUGAR',c.duration); break;
  case 'sleep': addStatus(t,'SLEEP',2); break;
  case 'damageReduce': addStatus(a,'DMG_REDUCE',c.duration); a.status.DMG_REDUCE=50*m; break;
  case 'thymosin': clearDebuffs(a); a.blocked.__DEBUFF_IMMUNE__=3; break;
  case 'debuffReduce': addStatus(a,'DEBUFF_REDUCE',c.duration); a.status.DEBUFF_REDUCE=50*m; break;
  case 'epo': addStatus(a,'HEAL_UP',c.duration); a.status.HEAL_UP=c.power*m; break;
 }
}

function clearDebuffs(p) { DEBUFFS.forEach(k => removeStatus(p,k)); }

function tick(p) {
 if (has(p,'WATER_REABSORB')) p.water -= 10;
 if (has(p,'WATER_INCREASE')) p.water += 10;
 if (p.water < 20) damage(p,5);
 if (p.water < 0) damage(p,20);
 if (has(p,'HIGH_CALCIUM')) damage(p,10);
 if (has(p,'HIGH_SUGAR')) { damage(p,5); p.water -= 15; }
 if (has(p,'LOW_SUGAR')) damage(p,10);

 for (const k of Object.keys(p.status)) {
  if (['HEAL_UP','DMG_UP','DMG_REDUCE','DEBUFF_REDUCE'].includes(k)) continue;
  if (--p.status[k] <= 0) delete p.status[k];
 }
 for (const k of Object.keys(p.blocked)) {
  if (k === '__DEBUFF_IMMUNE__') { if (--p.blocked[k] <= 0) delete p.blocked[k]; continue; }
  if (--p.blocked[k] <= 0) delete p.blocked[k];
 }
 for (const k of Object.keys(p.organMods)) {
  if (--p.organMods[k].turns <= 0) delete p.organMods[k];
 }
}

function ability(c) {
 const m = {
  healBuff:`เพิ่มการฟื้นฟู ${c.power}% ${c.duration} เทิร์น`,
  dmgBuff:`เพิ่มความเสียหาย ${c.power}% ${c.duration} เทิร์น`,
  bothBuff:`เพิ่มความเสียหายและการฟื้นฟู ${c.power}% ${c.duration} เทิร์น`,
  thyroxine:`สร้างความเสียหาย 10 และเพิ่มความเสียหาย 100% ${c.duration} เทิร์น`,
  adh:`ติดสถานะดูดกลับน้ำให้เป้าหมาย ${c.duration} เทิร์น`,
  aldo:`ติดสถานะเพิ่มปริมาณน้ำให้เป้าหมาย ${c.duration} เทิร์น`,
  calcitonin:'ลดความเสียหายที่ได้รับ 25% เพิ่มความเสียหาย 25% และแก้แคลเซียมสูง',
  pth:'ติดแคลเซียมสูงให้ศัตรู และแก้แคลเซียมต่ำให้ตนเอง',
  drawFSHLH:'สุ่มจั่ว FSH หรือ LH',
  drawTSH:'จั่ว TSH',
  drawACTH:'จั่ว ACTH',
  blockProlactin:`ศัตรูใช้ Prolactin ไม่ได้ ${c.duration} เทิร์น`,
  blockGH:`ศัตรูใช้ GH ไม่ได้ ${c.duration} เทิร์น`,
  drawGH:'หยิบ GH ขึ้นมือ 1 ใบ',
  drawCort:'สุ่มจั่ว Glucocorticoids หรือ Cortisol',
  drawThyroxine:'จั่ว Thyroxine',
  heal:`ฟื้นฟู HP ${c.power}`,
  endorphin:'ฟื้นฟู HP 5 และแก้เครียด',
  attack:`สร้างความเสียหาย ${c.power}`,
  stress:'ทำให้ศัตรูติดสถานะเครียด',
  epi:'สร้างความเสียหาย 20 + 50% ของ HP ที่เสียไป',
  norepi:'สร้างความเสียหาย 10 + 50% ของ HP ปัจจุบัน',
  lowSugar:'ติดน้ำตาลในเลือดต่ำให้ศัตรู',
  highSugar:'ติดน้ำตาลในเลือดสูงให้ศัตรู',
  sleep:'ทำให้ศัตรูหลับ 2 เทิร์น',
  damageReduce:`ลดความเสียหายที่ได้รับ ${c.power}% ${c.duration} เทิร์น`,
  thymosin:'ล้างดีบัพทั้งหมดและต้านดีบัพ 3 เทิร์น',
  debuffReduce:`ลดความเสียหายจากดีบัพ ${c.power}% ${c.duration} เทิร์น`,
  epo:`เพิ่มการฟื้นฟู ${c.power} HP ${c.duration} เทิร์น`
 };
 return m[c.effect] || 'ใช้ความสามารถของฮอร์โมน';
}

function getState() { return room?.game_state || room?.state || null; }

async function saveState(state) {
 const { error } = await supabaseClient.from('rooms').update({game_state:state}).eq('id',roomId);
 if (error) console.error('SAVE ERROR:', error);
}

function normalizeRoom(data) {
 room = data;
 if (!room.game_state && room.state) room.game_state = room.state;
}

async function createRoom() {
 roomId = Math.random().toString(36).slice(2,8).toUpperCase();
 role = 'p1';
 const deck = buildDeck();
 const p1 = player('ผู้เล่น 1');
 const p2 = player('ผู้เล่น 2');
 draw(p1,deck,5); draw(p2,deck,5);
 const state = {
  p1,p2,deck,round:1,
  first:Math.random()<.5?'p1':'p2',
  turn:null,phase:'waiting',
  timerEndsAt:null,cardEffectEndsAt:null,
  pendingAction:null,lastCard:null,event:null
 };
 const {error} = await supabaseClient.from('rooms').insert({
  id:roomId,host_id:myId,guest_id:null,game_state:state
 });
 if (error) return alert('สร้างห้องไม่สำเร็จ: '+error.message);
 await enterRoom();
}

async function joinRoom() {
 const code = ($('roomCode')?.value || '').trim().toUpperCase();
 if (!code) return alert('กรอกรหัสห้อง');
 const {data,error} = await supabaseClient.from('rooms').select('*').eq('id',code).single();
 if (error || !data) return alert('ไม่พบห้อง');
 if (data.guest_id) return alert('ห้องเต็มแล้ว');
 const {error:e} = await supabaseClient.from('rooms')
  .update({guest_id:myId}).eq('id',code).is('guest_id',null);
 if (e) return alert('เข้าห้องไม่สำเร็จ: '+e.message);
 roomId = code; role = 'p2';
 await enterRoom();
}

async function enterRoom() {
 const {data,error} = await supabaseClient.from('rooms').select('*').eq('id',roomId).single();
 if (error) return alert(error.message);
 normalizeRoom(data);
 $('roomCodeDisplay').textContent = 'รหัสห้อง: '+roomId;
 $('lobby').classList.add('hidden');
 $('game').classList.remove('hidden');

 channel = supabaseClient.channel('hormone-room-'+roomId)
  .on('postgres_changes',{
    event:'UPDATE',schema:'public',table:'rooms',
    filter:`id=eq.${roomId}`
  }, payload => {
    normalizeRoom(payload.new);
    render();
  })
  .subscribe();

 render();
 if (role === 'p1') startHost();
}

async function playCard(index) {
 const state = getState();
 if (!state || state.phase !== 'turn' || state.turn !== role || state.pendingAction) return;
 const me = role === 'p1' ? state.p1 : state.p2;
 const item = me.hand[index];
 if (!item) return;
 const c = cardOf(item);
 if (!canUse(me,c)) return;
 const next = clone(state);
 next.pendingAction = {player:role,itemUid:item.uid};
 await saveState(next);
}

function startHost() {
 if (hostTimer) return;
 hostTimer = setInterval(async () => {
  if (!room || role !== 'p1' || hostBusy) return;
  hostBusy = true;
  try {
   const state = getState();
   if (!state) return;
   const now = Date.now();

   if (state.phase === 'waiting' && room.guest_id) {
    state.phase = 'initiative';
    state.cardEffectEndsAt = now + 1800;
    await saveState(state);
   } else if (state.phase === 'initiative' && now >= state.cardEffectEndsAt) {
    state.phase = 'turn';
    state.turn = state.first;
    state.timerEndsAt = now + 30000;
    await saveState(state);
   } else if (state.phase === 'turn') {
    if (state.pendingAction) await resolveAction(state);
    else if (now >= state.timerEndsAt) await advanceTurn(state);
   } else if (state.phase === 'card_effect' && now >= state.cardEffectEndsAt) {
    await advanceTurn(state);
   }
  } finally { hostBusy = false; }
 }, 250);
}

async function resolveAction(state) {
 const actor = state.pendingAction.player;
 const p = actor === 'p1' ? state.p1 : state.p2;
 const t = actor === 'p1' ? state.p2 : state.p1;
 const i = p.hand.findIndex(x => x.uid === state.pendingAction.itemUid);
 if (i < 0) { state.pendingAction=null; return saveState(state); }
 const c = cardOf(p.hand[i]);
 if (!canUse(p,c)) { state.pendingAction=null; return advanceTurn(state); }
 p.hand.splice(i,1);
 applyCard(c,p,t);
 state.lastCard = {
  who:actor==='p1'?'ผู้เล่น 1':'ผู้เล่น 2',
  emoji:c.emoji,display:c.display,real:c.real,organ:c.organ,
  ability:ability(c)
 };
 state.pendingAction = null;
 state.phase = 'card_effect';
 state.cardEffectEndsAt = Date.now() + 1400;
 if (state.p1.hp <= 0 || state.p2.hp <= 0) state.phase='ended';
 await saveState(state);
}

async function advanceTurn(state) {
 const old = state.turn;
 const next = old === 'p1' ? 'p2' : 'p1';
 const np = next === 'p1' ? state.p1 : state.p2;

 if (has(np,'SLEEP')) {
  state.turn = old;
  state.timerEndsAt = Date.now() + 300;
  await saveState(state);
  return;
 }

 if (old === 'p2') {
  tick(state.p1); tick(state.p2);
  if (state.p1.hp <= 0 || state.p2.hp <= 0) {
   state.phase='ended'; await saveState(state); return;
  }
  state.round++;
  state.first = state.first === 'p1' ? 'p2' : 'p1';
  draw(state.p1,state.deck,1);
  draw(state.p2,state.deck,1);

  if (state.round % 3 === 0) {
   const organs = [...new Set(cards.map(c=>c.organ))];
   const organ = organs[Math.floor(Math.random()*organs.length)];
   const boost = Math.random() < .5;
   state.event = {organ,boost};
   state.p1.organMods[organ] = {type:boost?'boost':'disabled',turns:3};
   state.p2.organMods[organ] = {type:boost?'boost':'disabled',turns:3};
   state.phase='initiative';
   state.turn=null;
   state.cardEffectEndsAt=Date.now()+1800;
   await saveState(state);
   return;
  }
 }
 state.turn = next;
 state.timerEndsAt = Date.now()+30000;
 state.phase='turn';
 await saveState(state);
}

function renderStatuses(id,p) {
 const e=$(id); if (!e) return;
 e.innerHTML='';
 Object.entries(p.status || {}).forEach(([k,v])=>{
  const s=STATUS[k]; if (!s) return;
  const d=document.createElement('span');
  d.className='status '+(s[1]?'bad':'good');
  d.textContent=`${s[0]} (${v})`;
  e.appendChild(d);
 });
 Object.entries(p.blocked || {}).forEach(([k,v])=>{
  if (k==='__DEBUFF_IMMUNE__') return;
  const d=document.createElement('span');
  d.className='status bad';
  d.textContent=`หยุดใช้: ${k} (${v})`;
  e.appendChild(d);
 });
 if (!e.children.length) e.innerHTML='<span class="status">ปกติ</span>';
}

function renderHand(me,state) {
 const e=$('hand'); if (!e) return;
 e.innerHTML='';
 (me.hand || []).forEach((item,i)=>{
  const c=cardOf(item);
  if (!c) return;
  const b=document.createElement('button');
  b.className='card';
  b.disabled = state.phase!=='turn' || state.turn!==role || !!state.pendingAction || !canUse(me,c);
  b.innerHTML = `
   <div class="cardtop"><span class="emoji">${c.emoji}</span><span class="type">${c.organ}</span></div>
   <h3>${c.display}</h3>
   <div class="real">หน้าที่จริง: ${c.real}</div>
   <div class="organ">สร้างจาก: ${c.organ}</div>`;
  b.onclick=()=>playCard(i);
  e.appendChild(b);
 });
}

function renderLast(state) {
 const e=$('last'); if (!e) return;
 const c=state.lastCard;
 if (!c) { e.textContent='การ์ดที่ใช้จะแสดงตรงนี้'; return; }
 e.innerHTML=`<div><div class="emoji">${c.emoji}</div>
 <h3>${c.who} ใช้ ${c.display}</h3>
 <p><b>ความสามารถ:</b> ${c.ability}</p>
 <p><b>หน้าที่จริง:</b> ${c.real}</p>
 <p><b>สร้างจาก:</b> ${c.organ}</p></div>`;
}

function render() {
 const state=getState();
 if (!state || !state.p1 || !state.p2) return;
 const me=role==='p1'?state.p1:state.p2;
 const op=role==='p1'?state.p2:state.p1;

 $('php').textContent=`${Math.round(me.hp)} / 100`;
 $('bhp').textContent=`${Math.round(op.hp)} / 100`;
 $('phb').style.width=clamp(me.hp,0,100)+'%';
 $('bhb').style.width=clamp(op.hp,0,100)+'%';
 $('pwater').textContent=Math.round(me.water);
 $('bwater').textContent=Math.round(op.water);
 $('pwb').style.width=clamp(me.water,0,100)+'%';
 $('bwb').style.width=clamp(op.water,0,100)+'%';
 $('count').textContent=me.hand.length;
 $('round').textContent=state.round;
 renderStatuses('pstatus',me);
 renderStatuses('bstatus',op);

 const n=state.timerEndsAt && state.phase==='turn'
  ? Math.max(0,Math.ceil((state.timerEndsAt-Date.now())/1000)) : 0;
 $('timer').textContent=n ? `⏱️ ${n}s` : '⏱️ —';
 $('timer').className=n && n<=5 ? 'timer danger' : 'timer';

 let banner='';
 if (state.phase==='waiting') banner='⏳ รอผู้เล่นคนที่ 2...';
 else if (state.phase==='initiative') banner=`⚔️ ${state.first===role?'คุณ':'คู่ต่อสู้'} เริ่มก่อน`;
 else if (state.phase==='card_effect') banner=`✨ กำลังแสดงผลการ์ดของ ${state.lastCard?.who || ''}`;
 else if (state.phase==='ended') banner='🏁 เกมจบแล้ว';
 else banner=state.turn===role?'🎮 ถึงตาคุณ':'⏳ รอคู่ต่อสู้';
 $('banner').textContent=banner;

 renderHand(me,state);
 renderLast(state);

 if (state.phase==='ended') {
  $('game').classList.add('hidden');
  $('end').classList.remove('hidden');
  const win=role==='p1'?state.p1.hp>0:state.p2.hp>0;
  $('endicon').textContent=win?'🏆':'💀';
  $('endtitle').textContent=win?'คุณชนะ!':'คุณแพ้!';
 }
}

$('createBtn')?.addEventListener('click',createRoom);
$('joinBtn')?.addEventListener('click',joinRoom);
$('guideClose')?.addEventListener('click',()=>{
 $('guideOverlay')?.classList.add('hidden');
 localStorage.setItem('hormone-duel-guide-seen','1');
});
$('guideOpen')?.addEventListener('click',()=> $('guideOverlay')?.classList.remove('hidden'));

setInterval(render,250);
if (!localStorage.getItem('hormone-duel-guide-seen')) {
 $('guideOverlay')?.classList.remove('hidden');
}
