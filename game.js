const STATUS={
  WATER_REABSORB:['ดูดกลับน้ำ',true], WATER_INCREASE:['เพิ่มปริมาณน้ำ',false],
  HIGH_CALCIUM:['แคลเซียมในเลือดสูง',true], LOW_CALCIUM:['แคลเซียมในเลือดต่ำ',true],
  HIGH_SUGAR:['น้ำตาลในเลือดสูง',true], LOW_SUGAR:['น้ำตาลในเลือดต่ำ',true],
  STRESS:['เครียด',true], SLEEP:['หลับ',true],
  DMG_UP:['เพิ่มความเสียหาย',false], HEAL_UP:['เพิ่มการฟื้นฟู',false],
  DMG_REDUCE:['ลดความเสียหายที่ได้รับ',false], DEBUFF_REDUCE:['ลดความเสียหายจากดีบัพ',false]
};
const DEBUFFS=new Set(['WATER_REABSORB','WATER_INCREASE','HIGH_CALCIUM','LOW_CALCIUM','HIGH_SUGAR','LOW_SUGAR','STRESS','SLEEP']);
const cards=[
['Estrogen','อีสโทรเจน (Estrogen)','🌸','ควบคุมลักษณะเพศหญิง','รังไข่','healBuff',50,2],
['Progesterone','โพรเจสเทอโรน (Progesterone)','🌼','เตรียมเยื่อบุมดลูกสำหรับการฝังตัวของตัวอ่อน','รังไข่','healBuff',50,1],
['Testosterone','เทสโทสเทอโรน (Testosterone)','💪','ควบคุมลักษณะเพศชาย','อัณฑะ','dmgBuff',100,2],
['Androgen','แอนโดรเจน (Androgen)','🧬','กระตุ้นลักษณะเพศชายรอง เช่น ขน หนวด','ต่อมหมวกไตส่วนนอก','dmgBuff',50,2],
['FSH','FSH (Follicle Stimulating Hormone)','🥚','กระตุ้นการเจริญของไข่ในผู้หญิง และการสร้างอสุจิในผู้ชาย','ต่อมใต้สมองส่วนหน้า','healBuff',25,2],
['LH','LH (Luteinizing Hormone)','🌙','กระตุ้นการตกไข่ในผู้หญิง และการสร้างเทสโทสเทอโรนในผู้ชาย','ต่อมใต้สมองส่วนหน้า','dmgBuff',25,2],
['GH','GH (Growth Hormone)','📈','กระตุ้นการเจริญเติบโตของร่างกาย กระดูก และกล้ามเนื้อ','ต่อมใต้สมองส่วนหน้า','bothBuff',100,2],
['Thyroxine','ไทรอกซิน (Thyroxine)','🔥','ควบคุมอัตราเมแทบอลิซึมและการเจริญเติบโตของร่างกาย','ต่อมไทรอยด์','thyroxine',10,2],
['ADH','ADH (Antidiuretic Hormone)','💧','ช่วยให้ไตดูดน้ำกลับ รักษาสมดุลน้ำในร่างกาย','ต่อมใต้สมองส่วนหลัง','adh',0,2],
['Aldosterone','แอลโดสเทอโรน (Aldosterone)','🧂','ควบคุมสมดุลน้ำและเกลือแร่ เพิ่มการดูดกลับโซเดียมและน้ำที่ไต','ต่อมหมวกไตส่วนนอก','aldo',0,2],
['Calcitonin','แคลซิโทนิน (Calcitonin)','🦴','ลดระดับแคลเซียมในเลือด ช่วยสะสมแคลเซียมที่กระดูก','ต่อมไทรอยด์','calcitonin',0,2],
['PTH','พาราทอร์โมน (Parathyroid Hormone, PTH)','🦴','เพิ่มระดับแคลเซียมในเลือด','ต่อมพาราไทรอยด์','pth',0,2],
['GnRH','GnRH (Gonadotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง FSH และ LH','ไฮโพทาลามัส','drawFSHLH',0,2],
['TRH','TRH (Thyrotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง TSH','ไฮโพทาลามัส','drawTSH',0,2],
['CRH','CRH (Corticotropin-Releasing Hormone)','📡','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง ACTH','ไฮโพทาลามัส','drawACTH',0,2],
['PIH','PIH (Prolactin-Inhibiting Hormone / Dopamine)','✨','ยับยั้งไม่ให้ต่อมใต้สมองส่วนหน้าหลั่งโพรแลกทิน','ไฮโพทาลามัส','blockProlactin',3,3],
['GHIH','GHIH (Somatostatin)','🛑','ยับยั้งการหลั่ง Growth Hormone จากต่อมใต้สมองส่วนหน้า','ไฮโพทาลามัส','blockGH',3,3],
['GHRH','GHRH (Growth Hormone-Releasing Hormone)','📈','กระตุ้นต่อมใต้สมองส่วนหน้าให้หลั่ง Growth Hormone','ไฮโพทาลามัส','drawGH',0,2],
['ACTH','ACTH (Adrenocorticotropic Hormone)','📡','กระตุ้นต่อมหมวกไตส่วนนอกให้หลั่งฮอร์โมนกลูโคคอร์ทิคอยด์','ต่อมใต้สมองส่วนหน้า','drawCort',0,2],
['TSH','TSH (Thyroid-Stimulating Hormone)','📡','กระตุ้นต่อมไทรอยด์ให้สร้างและหลั่งไทรอกซิน','ต่อมใต้สมองส่วนหน้า','drawThyroxine',0,2],
['Prolactin','โพรแลกทิน (Prolactin / PRL)','🍼','กระตุ้นต่อมน้ำนมให้เจริญเติบโตและสร้างน้ำนมหลังคลอดบุตร','ต่อมใต้สมองส่วนหน้า','heal',10,2],
['Endorphin','เอนดอร์ฟิน (Endorphin)','🏃','ช่วยระงับความเจ็บปวด และหลั่งเมื่อออกกำลังกายหรือเผชิญความเครียด/บาดเจ็บ','ต่อมใต้สมอง','endorphin',5,2],
['Glucocorticoids','กลูโคคอร์ทิคอยด์ (Glucocorticoids)','🔥','ควบคุมเมแทบอลิซึมของคาร์โบไฮเดรตและต้านการอักเสบ','ต่อมหมวกไตส่วนนอก','attack',15,2],
['Cortisol','คอร์ทิซอล (Cortisol)','⚠️','เป็นฮอร์โมนหลักของกลุ่มกลูโคคอร์ทิคอยด์ หลั่งมากเมื่อเครียดหรืออดนอน','ต่อมหมวกไตส่วนนอก','stress',3,2],
['Epinephrine','เอพิเนฟริน (Epinephrine / Adrenaline)','⚡','กระตุ้นหัวใจและเพิ่มน้ำตาลในเลือดเพื่อเตรียมร่างกายใช้พลังงานสูง','ต่อมหมวกไตชั้นใน','epi',20,2],
['Norepinephrine','นอร์เอพิเนฟริน (Norepinephrine / Noradrenaline)','🚨','ทำให้หลอดเลือดส่วนปลายหดตัวและความดันโลหิตสูงขึ้น','ต่อมหมวกไตชั้นใน','norepi',10,2],
['Insulin','อินซูลิน (Insulin)','🍬','ลดระดับน้ำตาลในเลือด','ตับอ่อน (เบต้าเซลล์)','lowSugar',0,2],
['Glucagon','กลูคากอน (Glucagon)','🍬','เพิ่มระดับน้ำตาลในเลือด','ตับอ่อน (อัลฟาเซลล์)','highSugar',0,2],
['Melatonin','เมลาโทนิน (Melatonin)','🌙','ควบคุมการนอนหลับและอาการง่วง','ต่อมไพเนียล','sleep',2,2],
['Oxytocin','ออกซิโทซิน (Oxytocin)','💞','กระตุ้นการหดตัวของมดลูก การหลั่งน้ำนม และมีบทบาทด้านความผูกพัน','ไฮโพทาลามัส → หลั่งจากต่อมใต้สมองส่วนหลัง','damageReduce',50,3],
['hCG','hCG (Human Chorionic Gonadotropin)','🧪','คงสภาพโครงสร้างในรังไข่ให้สร้างโพรเจสเทอโรนเพื่อรักษาเยื่อบุมดลูก และใช้ตรวจการตั้งครรภ์','รกของหญิงตั้งครรภ์','heal',10,1],
['Thymosin','ไทโมซิน (Thymosin)','🛡️','กระตุ้นการพัฒนาเซลล์เม็ดเลือดขาวชนิด T-lymphocyte (T-cell)','ต่อมไทมัส','thymosin',0,3],
['Gastrin','แกสทริน (Gastrin)','🍽️','กระตุ้นการหลั่งกรดและเอนไซม์ รวมถึงการเคลื่อนไหวของกระเพาะอาหาร','เยื่อบุกระเพาะอาหาร','dmgBuff',40,2],
['Secretin','ซีครีทิน (Secretin)','⚗️','ช่วยควบคุมกรด-ด่างโดยกระตุ้นการหลั่งไบคาร์บอเนตและยับยั้งกรดในกระเพาะอาหาร','ลำไส้เล็กส่วนต้น','debuffReduce',50,3],
['CCK','โคเลซิสโตไคนิน (Cholecystokinin / CCK)','🥗','กระตุ้นการหลั่งน้ำดีและเอนไซม์จากตับอ่อนเพื่อย่อยอาหาร','ลำไส้เล็กส่วนต้น','dmgBuff',40,2],
['EPO','อีริโทรโพอิติน (Erythropoietin / EPO)','🩸','กระตุ้นไขกระดูกให้สร้างเซลล์เม็ดเลือดแดงเมื่อร่างกายขาดออกซิเจนหรือมีเม็ดเลือดแดงต่ำ','ไต (หลัก) และตับ (ส่วนน้อย)','epo',10,3]
].map((x,i)=>({id:i,name:x[0],display:x[1],emoji:x[2],real:x[3],organ:x[4],effect:x[5],power:x[6],duration:x[7]}));

const byName=n=>cards.find(c=>c.name===n);
let deck,st;
const $=id=>document.getElementById(id);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

function player(name){return{name,hp:100,water:100,hand:[],status:{},blocked:{},organMods:{}}}
function addStatus(p,k,t){p.status[k]=Math.max(p.status[k]||0,t)}
function removeStatus(p,k){delete p.status[k]}
function has(p,k){return !!p.status[k]}
function clearDebuffs(p){DEBUFFS.forEach(k=>removeStatus(p,k))}
function log(x){$('log').innerHTML+=`<div>${x}</div>`;$('log').scrollTop=$('log').scrollHeight}
function buildDeck(){return shuffle(cards.flatMap(c=>[c,c])).slice(0,60)}
function draw(p,n=1){for(let i=0;i<n;i++){if(!deck.length)deck=buildDeck();p.hand.push(deck.pop())}}
function mult(p,c){return p.organMods[c.organ]?.type==='boost'?2:1}
function canUse(p,c){return !(p.blocked[c.name]||p.blocked[c.organ]) && !has(p,'SLEEP')}
function damage(target,n){target.hp=clamp(target.hp-n,0,100)}
function effectiveDamage(attacker,target,n,isDebuff=false){
  let m=1;
  if(has(attacker,'DMG_UP'))m*=1+(attacker.status.DMG_UP/100);
  if(has(attacker,'LOW_CALCIUM')||has(attacker,'LOW_SUGAR'))m*=.5;
  if(has(target,'DMG_REDUCE'))m*=1-target.status.DMG_REDUCE/100;
  if(isDebuff && has(target,'DEBUFF_REDUCE'))m*=1-target.status.DEBUFF_REDUCE/100;
  damage(target,n*m);
}
function effectiveHeal(p,n){
  let m=1;
  if(has(p,'HEAL_UP'))m*=1+p.status.HEAL_UP/100;
  p.hp=clamp(p.hp+n*m,0,100);
}
function apply(c,a,t){
  const m=mult(a,c);
  switch(c.effect){
    case 'healBuff': addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=50*m;break;
    case 'dmgBuff': addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=c.power*m;break;
    case 'bothBuff': addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=100*m;addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;
    case 'thyroxine': effectiveDamage(a,t,10*m);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;
    case 'adh': addStatus(t,'WATER_REABSORB',c.duration);removeStatus(a,'WATER_INCREASE');break;
    case 'aldo': addStatus(t,'WATER_INCREASE',c.duration);removeStatus(a,'WATER_REABSORB');break;
    case 'calcitonin': removeStatus(a,'HIGH_CALCIUM');addStatus(a,'LOW_CALCIUM',c.duration);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=25*m;break;
    case 'pth': addStatus(t,'HIGH_CALCIUM',c.duration);removeStatus(a,'LOW_CALCIUM');break;
    case 'drawFSHLH': a.hand.push(Math.random()<.5?byName('FSH'):byName('LH'));break;
    case 'drawTSH': a.hand.push(byName('TSH'));break;
    case 'drawACTH': a.hand.push(byName('ACTH'));break;
    case 'blockProlactin': t.blocked.Prolactin=c.duration;break;
    case 'blockGH': t.blocked.GH=c.duration;break;
    case 'drawGH': a.hand.push(byName('GH'));break;
    case 'drawCort': a.hand.push(Math.random()<.5?byName('Glucocorticoids'):byName('Cortisol'));break;
    case 'drawThyroxine': a.hand.push(byName('Thyroxine'));break;
    case 'heal': effectiveHeal(a,c.power*m);break;
    case 'endorphin': effectiveHeal(a,5*m);removeStatus(a,'STRESS');break;
    case 'attack': effectiveDamage(a,t,c.power*m);break;
    case 'stress': addStatus(t,'STRESS',c.duration);break;
    case 'epi': effectiveDamage(a,t,(20*m)+(100-t.hp)*.5);break;
    case 'norepi': effectiveDamage(a,t,(10*m)+(t.hp*.5));break;
    case 'lowSugar': addStatus(t,'LOW_SUGAR',c.duration);break;
    case 'highSugar': addStatus(t,'HIGH_SUGAR',c.duration);break;
    case 'sleep': addStatus(t,'SLEEP',c.duration);break;
    case 'damageReduce': addStatus(a,'DMG_REDUCE',c.duration);a.status.DMG_REDUCE=c.power*m;break;
    case 'thymosin': clearDebuffs(a);addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=100;break;
    case 'debuffReduce': addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=c.power*m;break;
    case 'epo': addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=10*m;break;
  }
}
function tick(p){
  if(has(p,'WATER_REABSORB'))p.water-=10;
  if(has(p,'WATER_INCREASE'))p.water+=10;
  if(p.water<0)p.hp=clamp(p.hp-20,0,100);
  else if(p.water<20)p.hp=clamp(p.hp-5,0,100);
  if(has(p,'HIGH_CALCIUM'))p.hp=clamp(p.hp-10,0,100);
  if(has(p,'HIGH_SUGAR')){p.hp=clamp(p.hp-5,0,100);p.water-=15}
  if(has(p,'LOW_SUGAR'))p.hp=clamp(p.hp-10,0,100);
  Object.keys(p.status).forEach(k=>{if(['HEAL_UP','DMG_UP','DMG_REDUCE','DEBUFF_REDUCE'].includes(k))return;if(--p.status[k]<=0)delete p.status[k]});
  Object.keys(p.blocked).forEach(k=>{if(--p.blocked[k]<=0)delete p.blocked[k]});
  Object.keys(p.organMods).forEach(k=>{if(--p.organMods[k].turns<=0)delete p.organMods[k]});
}
function statuses(id,p){
  const e=$(id);e.innerHTML='';
  Object.entries(p.status).forEach(([k,v])=>{
    const s=STATUS[k];if(!s)return;
    const d=document.createElement('span');d.className='status '+(s[1]?'bad':'good');d.textContent=`${s[0]} (${v})`;e.appendChild(d)
  });
  Object.keys(p.blocked).forEach(k=>{const d=document.createElement('span');d.className='status bad';d.textContent=`หยุดใช้: ${k} (${p.blocked[k]})`;e.appendChild(d)});
  if(!e.children.length)e.innerHTML='<span class="status">ปกติ</span>'
}
function render(){
  const p=st.p,b=st.b;
  $('php').textContent=`${Math.round(p.hp)} / 100`;$('bhp').textContent=`${Math.round(b.hp)} / 100`;
  $('phb').style.width=clamp(p.hp,0,100)+'%';$('bhb').style.width=clamp(b.hp,0,100)+'%';
  $('pwater').textContent=Math.round(p.water);$('bwater').textContent=Math.round(b.water);
  $('pwb').style.width=clamp(p.water,0,100)+'%';$('bwb').style.width=clamp(b.water,0,100)+'%';
  $('count').textContent=p.hand.length;$('round').textContent=st.round;
  $('banner').textContent=st.busy?`⚔️ ${st.turnActor==='p'?'ถึงตาคุณเล่นการ์ด':'บอทกำลังเล่นการ์ด'}...`:'🎮';
  statuses('pstatus',p);statuses('bstatus',b);renderHand()
}
function renderHand(){
  const e=$('hand');e.innerHTML='';
  st.p.hand.forEach((c,i)=>{
    const b=document.createElement('button');b.className='card';b.disabled=st.busy||st.turnActor!=='p'||!canUse(st.p,c);
    b.innerHTML=`<div class="cardtop"><span class="emoji">${c.emoji}</span><span class="type">${c.organ}</span></div><h3>${c.display}</h3><div class="real">หน้าที่จริง: ${c.real}</div><div class="organ">สร้างจาก: ${c.organ}</div>${!canUse(st.p,c)?'<div class="disabled-note">ไม่สามารถใช้การ์ดนี้ได้ในขณะนี้</div>':''}`;
    b.onclick=()=>selectPlayerCard(i);e.appendChild(b)
  })
}
function show(c,who){
  $('last').innerHTML=`<div><div class="emoji">${c.emoji}</div><h3>${who}: ${c.display}</h3><p><b>หน้าที่จริง:</b> ${c.real}</p><p><b>สร้างจาก:</b> ${c.organ}</p></div>`
}
function eventFor(round){
  const organs=[...new Set(cards.map(c=>c.organ))],organ=organs[Math.floor(Math.random()*organs.length)],boost=Math.random()<.5;
  return{organ,boost,turns:3}
}
async function triggerEvent(){
  const ev=eventFor(st.round);
  st.p.organMods[ev.organ]={type:ev.boost?'boost':'disabled',turns:ev.turns};
  st.b.organMods[ev.organ]={type:ev.boost?'boost':'disabled',turns:ev.turns};
  $('eventIcon').textContent=ev.boost?'⚡':'🛑';
  $('eventTitle').textContent=ev.boost?'อวัยวะทำงานเพิ่มประสิทธิภาพ!':'อวัยวะหยุดทำงาน!';
  $('eventText').innerHTML=ev.boost?`<b>${ev.organ}</b> ทำงานเพิ่มประสิทธิภาพเป็น 2 เท่า<br>การ์ดฮอร์โมนจากอวัยวะนี้จะแสดงผล 2 เท่า เป็นเวลา 3 เทิร์น`:`<b>${ev.organ}</b> หยุดทำงาน<br>การ์ดฮอร์โมนจากอวัยวะนี้ใช้งานไม่ได้ เป็นเวลา 3 เทิร์น`;
  $('eventOverlay').classList.remove('hidden');$('eventOverlay').classList.add('event-show');
  await new Promise(resolve=>$('eventClose').onclick=()=>{ $('eventOverlay').classList.add('hidden');resolve() });
}
async function initiative(){
  const first=st.first;
  $('initiativeIcon').textContent=first==='p'?'🎮':'🤖';
  $('initiativeTitle').textContent=first==='p'?'ผู้เล่นเริ่มก่อน!':'บอทเริ่มก่อน!';
  $('initiativeText').textContent='ผลัดกันประมวลผลการ์ดในรอบนี้';
  $('initiativeOverlay').classList.remove('hidden');
  await wait(1200);
  $('initiativeOverlay').classList.add('hidden');
}
function end(){
  if(st.p.hp<=0||st.b.hp<=0){
    $('game').classList.add('hidden');$('end').classList.remove('hidden');
    const win=st.p.hp>0&&st.b.hp<=0;
    $('endicon').textContent=win?'🏆':'💀';$('endtitle').textContent=win?'คุณชนะ!':'บอทชนะ!';
    $('endtext').textContent=win?'การวางแผนฮอร์โมนของคุณยอดเยี่ยมมาก':'ลองวางแผนการ์ดและสถานะใหม่อีกครั้ง';return true
  }return false
}
function choose(){
  const b=st.b,p=st.p;let best=0,score=-1e9;
  b.hand.forEach((c,i)=>{
    if(!canUse(b,c))return;
    let s=Math.random()*4;
    if(b.hp<45&&['heal','endorphin','healBuff','bothBuff','epo'].includes(c.effect))s+=45;
    if(p.hp<40&&['attack','epi','norepi','highSugar','stress','sleep'].includes(c.effect))s+=45;
    if(c.effect==='dmgBuff'||c.effect==='bothBuff')s+=20;
    if(c.effect==='sleep'&&!has(p,'SLEEP'))s+=30;
    if(s>score){score=s;best=i}
  });
  return best
}
async function resolveCard(c,who){
  show(c,who);
  $('last').classList.remove('card-played','card-effect');void $('last').offsetWidth;$('last').classList.add('card-played');
  log(`🧬 ${who} ใช้ ${c.display}`);render();await wait(800);
  $('last').classList.add('card-effect');apply(c,who==='ผู้เล่น'?st.p:st.b,who==='ผู้เล่น'?st.b:st.p);
  log(`✨ ผลของ ${c.display} ทำงานแล้ว`);render();await wait(500)
}
async function finishRound(){
  tick(st.p);tick(st.b);render();if(end()){st.busy=false;return}
  st.round++;st.first=st.first==='p'?'b':'p';
  draw(st.p);draw(st.b);log(`🔄 จบรอบ — ทั้งสองฝ่ายจั่วการ์ด 1 ใบ`);render();
  if(st.round%3===0)await triggerEvent();
  st.p.pending=null;st.b.pending=null;st.turnActor=st.first;st.busy=false;render();
  await wait(350);await initiative();
  await beginTurn();
}
async function beginTurn(){
  if(st.busy)return;
  const actor=st.turnActor;
  const p=actor==='p'?st.p:st.b;
  // หลับ = จบเทิร์นทันที ไม่ต้องเลือกการ์ด
  if(has(p,'SLEEP')){
    log(`${actor==='p'?'🎮 ผู้เล่น':'🤖 บอท'} ติดสถานะหลับ — จบเทิร์นทันที`);
    await wait(500);
    st.turnActor=actor==='p'?'b':'p';
    if(has(st[st.turnActor],'SLEEP')) return beginTurn();
    render();
    if(st.turnActor==='b') return beginTurn();
    return;
  }
  render();
  if(actor==='b'){
    const bi=choose();
    if(bi<0){
      log('🤖 บอทไม่มีการ์ดที่สามารถใช้ได้ — จบเทิร์น');
      await wait(500);
      st.turnActor='p';
      return beginTurn();
    }
    st.busy=true;render();
    const c=st.b.hand.splice(bi,1)[0];st.b.pending=c;
    await resolveCard(c,'บอท');
    st.b.pending=null;
    if(end()){st.busy=false;return}
    st.turnActor='p';st.busy=false;render();
    return beginTurn();
  }
}
async function selectPlayerCard(i){
  if(st.busy||st.turnActor!=='p')return;
  const c=st.p.hand[i];if(!canUse(st.p,c))return;
  st.busy=true;st.p.hand.splice(i,1);st.p.pending=c;render();
  await resolveCard(c,'ผู้เล่น');
  st.p.pending=null;
  if(end()){st.busy=false;return}
  st.turnActor='b';st.busy=false;render();
  await beginTurn();
  if(st.turnActor==='p' && !st.busy){
    // ทั้งสองฝ่ายเล่นครบแล้ว จบรอบ
    await finishRound();
  }
}
function showGuide(){
  if(localStorage.getItem('hormone-duel-guide-seen'))return;
  $('guideOverlay').classList.remove('hidden');
}
function closeGuide(){localStorage.setItem('hormone-duel-guide-seen','1');$('guideOverlay').classList.add('hidden')}
async function newGame(){
  deck=buildDeck();st={p:player('ผู้เล่น'),b:player('บอท'),round:1,busy:true,first:Math.random()<.5?'p':'b',turnActor:null};
  draw(st.p,5);draw(st.b,5);$('start').classList.add('hidden');$('end').classList.add('hidden');$('game').classList.remove('hidden');$('log').innerHTML='';$('last').textContent='การ์ดที่ใช้จะแสดงตรงนี้';log('🎮 เริ่มเกม — กำลังสุ่มฝ่ายที่เริ่มก่อน...');log('🃏 จำกัดเด็คสูงสุด 60 ใบ');render();
  await initiative();st.turnActor=st.first;st.busy=false;render();await beginTurn();
}
$('startBtn').onclick=()=>{closeGuide();newGame()};
$('again').onclick=newGame;$('new').onclick=newGame;$('guideClose').onclick=closeGuide;$('guideOpen').onclick=showGuide;
showGuide();
