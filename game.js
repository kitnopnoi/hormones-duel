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

const SUPABASE_URL='https://tabhvfrodakgfphfcctd.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_RsJy62SEbT7WjhNGF20k9g_dNTEKSNN';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
let deck=[],st=null,roomId=null,role=null,channel=null,lastAction=0,timerInterval=null,hostTimer=null;
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
function canUse(p,c){return !(p.blocked[c.name]||p.blocked[c.organ]) && !has(p,'SLEEP') && p.organMods[c.organ]?.type!=='disabled'}
function damage(target,n){target.hp=clamp(target.hp-n,0,100)}
function effectiveDamage(attacker,target,n,isDebuff=false){let m=1;if(has(attacker,'DMG_UP'))m*=1+(attacker.status.DMG_UP/100);if(has(attacker,'LOW_CALCIUM')||has(attacker,'LOW_SUGAR'))m*=.5;if(has(target,'DMG_REDUCE'))m*=1-target.status.DMG_REDUCE/100;if(isDebuff&&has(target,'DEBUFF_REDUCE'))m*=1-target.status.DEBUFF_REDUCE/100;damage(target,n*m)}
function effectiveHeal(p,n){let m=1;if(has(p,'HEAL_UP'))m*=1+p.status.HEAL_UP/100;p.hp=clamp(p.hp+n*m,0,100)}
function apply(c,a,t){const m=mult(a,c);switch(c.effect){case'healBuff':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=50*m;break;case'dmgBuff':addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=c.power*m;break;case'bothBuff':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=100*m;addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;case'thyroxine':effectiveDamage(a,t,10*m);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;case'adh':addStatus(t,'WATER_REABSORB',c.duration);removeStatus(a,'WATER_INCREASE');break;case'aldo':addStatus(t,'WATER_INCREASE',c.duration);removeStatus(a,'WATER_REABSORB');break;case'calcitonin':removeStatus(a,'HIGH_CALCIUM');addStatus(a,'LOW_CALCIUM',c.duration);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=25*m;break;case'pth':addStatus(t,'HIGH_CALCIUM',c.duration);removeStatus(a,'LOW_CALCIUM');break;case'drawFSHLH':a.hand.push(Math.random()<.5?byName('FSH'):byName('LH'));break;case'drawTSH':a.hand.push(byName('TSH'));break;case'drawACTH':a.hand.push(byName('ACTH'));break;case'blockProlactin':t.blocked.Prolactin=c.duration;break;case'blockGH':t.blocked.GH=c.duration;break;case'drawGH':a.hand.push(byName('GH'));break;case'drawCort':a.hand.push(Math.random()<.5?byName('Glucocorticoids'):byName('Cortisol'));break;case'drawThyroxine':a.hand.push(byName('Thyroxine'));break;case'heal':effectiveHeal(a,c.power*m);break;case'endorphin':effectiveHeal(a,5*m);removeStatus(a,'STRESS');break;case'attack':effectiveDamage(a,t,c.power*m);break;case'stress':addStatus(t,'STRESS',c.duration);break;case'epi':effectiveDamage(a,t,(20*m)+(100-t.hp)*.5);break;case'norepi':effectiveDamage(a,t,(10*m)+(t.hp*.5));break;case'lowSugar':addStatus(t,'LOW_SUGAR',c.duration);break;case'highSugar':addStatus(t,'HIGH_SUGAR',c.duration);break;case'sleep':addStatus(t,'SLEEP',c.duration);break;case'damageReduce':addStatus(a,'DMG_REDUCE',c.duration);a.status.DMG_REDUCE=c.power*m;break;case'thymosin':clearDebuffs(a);addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=100;break;case'debuffReduce':addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=c.power*m;break;case'epo':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=10*m;break}}
function tick(p){if(has(p,'WATER_REABSORB'))p.water-=10;if(has(p,'WATER_INCREASE'))p.water+=10;if(p.water<0)p.hp=clamp(p.hp-20,0,100);else if(p.water<20)p.hp=clamp(p.hp-5,0,100);if(has(p,'HIGH_CALCIUM'))p.hp=clamp(p.hp-10,0,100);if(has(p,'HIGH_SUGAR')){p.hp=clamp(p.hp-5,0,100);p.water-=15}if(has(p,'LOW_SUGAR'))p.hp=clamp(p.hp-10,0,100);Object.keys(p.status).forEach(k=>{if(['HEAL_UP','DMG_UP','DMG_REDUCE','DEBUFF_REDUCE'].includes(k))return;if(--p.status[k]<=0)delete p.status[k]});Object.keys(p.blocked).forEach(k=>{if(--p.blocked[k]<=0)delete p.blocked[k]});Object.keys(p.organMods).forEach(k=>{if(--p.organMods[k].turns<=0)delete p.organMods[k]})}
function statuses(id,p){const e=$(id);e.innerHTML='';Object.entries(p.status).forEach(([k,v])=>{const s=STATUS[k];if(!s)return;const d=document.createElement('span');d.className='status '+(s[1]?'bad':'good');d.textContent=`${s[0]} (${v})`;e.appendChild(d)});Object.keys(p.blocked).forEach(k=>{const d=document.createElement('span');d.className='status bad';d.textContent=`หยุดใช้: ${k} (${p.blocked[k]})`;e.appendChild(d)});if(!e.children.length)e.innerHTML='<span class="status">ปกติ</span>'}
function render(){if(!st)return;const p=st.p,b=st.b;$('php').textContent=`${Math.round(p.hp)} / 100`;$('bhp').textContent=`${Math.round(b.hp)} / 100`;$('phb').style.width=clamp(p.hp,0,100)+'%';$('bhb').style.width=clamp(b.hp,0,100)+'%';$('pwater').textContent=Math.round(p.water);$('bwater').textContent=Math.round(b.water);$('pwb').style.width=clamp(p.water,0,100)+'%';$('bwb').style.width=clamp(b.water,0,100)+'%';$('count').textContent=role==='p'?p.hand.length:b.hand.length;$('round').textContent=st.round;$('pname').textContent=p.name;$('bname').textContent=b.name;$('banner').textContent=st.phase==='finished'?'จบเกม':st.turnActor===role?'⚔️ ถึงตาคุณเล่นการ์ด':'⏳ รออีกฝ่ายเล่นการ์ด';$('turnHint').textContent=st.turnActor===role?'เลือกการ์ดภายใน 30 วินาที':'รออีกฝ่ายเล่นการ์ด';statuses('pstatus',p);statuses('bstatus',b);renderHand();renderTimer()}
function renderHand(){const e=$('hand');e.innerHTML='';if(!st||!role)return;const me=role==='p'?st.p:st.b;me.hand.forEach((c,i)=>{const b=document.createElement('button');b.className='card';b.disabled=st.phase!=='playing'||st.turnActor!==role||!canUse(me,c)||!!st.action;b.innerHTML=`<div class="cardtop"><span class="emoji">${c.emoji}</span><span class="type">${c.organ}</span></div><h3>${c.display}</h3><div class="real">หน้าที่จริง: ${c.real}</div><div class="organ">สร้างจาก: ${c.organ}</div>${!canUse(me,c)?'<div class="disabled-note">ไม่สามารถใช้การ์ดนี้ได้</div>':''}`;b.onclick=()=>submitCard(i);e.appendChild(b)})}
function renderTimer(){if(!st||!st.timerEndsAt){$('timer').textContent='—';$('timerbar').style.width='0%';return}const sec=Math.max(0,Math.ceil((st.timerEndsAt-Date.now())/1000));$('timer').textContent=sec;$('timerbar').style.width=clamp(sec/30*100,0,100)+'%';$('timer').parentElement.classList.toggle('warning',sec<=10)}
function show(c,who){$('last').innerHTML=`<div><div class="emoji">${c.emoji}</div><h3>${who}: ${c.display}</h3><p><b>หน้าที่จริง:</b> ${c.real}</p><p><b>สร้างจาก:</b> ${c.organ}</p></div>`}
function eventFor(round){const organs=[...new Set(cards.map(c=>c.organ))],organ=organs[Math.floor(Math.random()*organs.length)],boost=Math.random()<.5;return{organ,boost,turns:3}}
async function triggerEvent(){const ev=eventFor(st.round);st.p.organMods[ev.organ]={type:ev.boost?'boost':'disabled',turns:ev.turns};st.b.organMods[ev.organ]={type:ev.boost?'boost':'disabled',turns:ev.turns};$('eventIcon').textContent=ev.boost?'⚡':'🛑';$('eventTitle').textContent=ev.boost?'อวัยวะทำงานเพิ่มประสิทธิภาพ!':'อวัยวะหยุดทำงาน!';$('eventText').innerHTML=ev.boost?`<b>${ev.organ}</b> ทำงานเพิ่มประสิทธิภาพเป็น 2 เท่า<br>การ์ดฮอร์โมนจากอวัยวะนี้จะแสดงผล 2 เท่า เป็นเวลา 3 เทิร์น`:`<b>${ev.organ}</b> หยุดทำงาน<br>การ์ดฮอร์โมนจากอวัยวะนี้ใช้งานไม่ได้ เป็นเวลา 3 เทิร์น`;$('eventOverlay').classList.remove('hidden');$('eventOverlay').classList.add('event-show');await wait(1200);$('eventOverlay').classList.add('hidden')}
async function initiative(){const first=st.first;$('initiativeIcon').textContent=first==='p'?'🎮':'🧑‍🔬';$('initiativeTitle').textContent=first==='p'?`${st.p.name} เริ่มก่อน!`:`${st.b.name} เริ่มก่อน!`;$('initiativeText').textContent='ฝ่ายที่เริ่มก่อนจะมีสิทธิ์เล่นการ์ดก่อน';$('initiativeOverlay').classList.remove('hidden');await wait(1200);$('initiativeOverlay').classList.add('hidden')}
function end(){if(st.p.hp<=0||st.b.hp<=0){st.phase='finished';$('game').classList.add('hidden');$('end').classList.remove('hidden');const win=st.p.hp>0&&st.b.hp<=0;$('endicon').textContent=win?'🏆':'💀';$('endtitle').textContent=win?(role==='p'?'คุณชนะ!':'คู่ต่อสู้ชนะ!'):(role==='p'?'คู่ต่อสู้ชนะ!':'คุณชนะ!');$('endtext').textContent='เกมจบแล้ว';return true}return false}
function eventKey(){return st.action?.id||0}
async function publishState(){if(!roomId||!st)return;await sb.from('rooms').update({game_state:st}).eq('id',roomId)}
async function submitCard(i){if(!st||st.phase!=='playing'||st.turnActor!==role||st.action)return;const me=role==='p'?st.p:st.b;const c=me.hand[i];if(!canUse(me,c))return;st.action={id:Date.now()+Math.random(),role,cardId:c.id};render();await publishState();if(role==='p')processAction()}
async function processAction(){if(role!=='p'||!st.action||st.action.id===lastAction)return;lastAction=st.action.id;const a=st.action;const actor=a.role==='p'?st.p:st.b;const target=a.role==='p'?st.b:st.p;const i=actor.hand.findIndex(c=>c.id===a.cardId);if(i<0){st.action=null;await publishState();return}const c=actor.hand.splice(i,1)[0];show(c,actor.name);log(`🧬 ${actor.name} ใช้ ${c.display}`);await wait(1200);apply(c,actor,target);log(`✨ ผลของ ${c.display} ทำงานแล้ว`);render();await wait(700);if(end()){await publishState();return}st.action=null;if(a.role!==st.first){await finishRound();return}st.turnActor=a.role==='p'?'b':'p';if(has(st[st.turnActor],'SLEEP')){log(`${st[st.turnActor].name} ติดสถานะหลับ — จบเทิร์นทันที`);st.turnActor=st.turnActor==='p'?'b':'p';await finishRound();return}st.timerEndsAt=Date.now()+30000;await publishState();render()}
async function timeoutTurn(){if(role!=='p'||!st||st.phase!=='playing'||!st.timerEndsAt||Date.now()<st.timerEndsAt||st.action)return;const actor=st.turnActor;log(`⏱️ ${st[actor].name} หมดเวลา — ข้ามเทิร์น`);st.turnActor=actor==='p'?'b':'p';if(has(st[st.turnActor],'SLEEP'))st.turnActor=st.turnActor==='p'?'b':'p';st.timerEndsAt=Date.now()+30000;await publishState()}
async function finishRound(){if(role!=='p')return;tick(st.p);tick(st.b);if(end()){await publishState();return}st.round++;st.first=st.first==='p'?'b':'p';st.turnActor=st.first;draw(st.p);draw(st.b);st.timerEndsAt=Date.now()+30000;log(`🔄 จบรอบ — ทั้งสองฝ่ายจั่วการ์ด 1 ใบ`);if(st.round%3===0)await triggerEvent();await publishState();await initiative()}
function initialState(name){deck=buildDeck();const p=player(name),b=player('กำลังรอผู้เล่น 2');draw(p,5);return{p,b,round:1,first:Math.random()<.5?'p':'b',turnActor:null,phase:'waiting',timerEndsAt:null,action:null}}
async function createRoom(){const id=(($('roomInput').value||'')||Math.random().toString(36).slice(2,8)).toUpperCase().slice(0,6);const name=prompt('ชื่อของคุณ','ผู้เล่น 1')||'ผู้เล่น 1';const state=initialState(name);const {error}=await sb.from('rooms').insert({id,game_state:state});if(error){$('roomMessage').textContent='สร้างห้องไม่สำเร็จ: '+error.message;return}roomId=id;role='p';localStorage.setItem('hormone-room',id);$('roomInput').value=id;$('roomMessage').textContent=`สร้างห้อง ${id} แล้ว ส่งรหัสนี้ให้เพื่อน`;await connectRoom()}
async function joinRoom(){const id=$('roomInput').value.trim().toUpperCase();if(id.length<4)return $('roomMessage').textContent='กรอกรหัสห้องก่อน';const name=prompt('ชื่อของคุณ','ผู้เล่น 2')||'ผู้เล่น 2';const {data,error}=await sb.from('rooms').select('game_state').eq('id',id).single();if(error||!data)return $('roomMessage').textContent='ไม่พบห้อง';const s=data.game_state;if(s.phase!=='waiting')return $('roomMessage').textContent='ห้องนี้เริ่มเกมไปแล้ว';s.b=player(name);drawFromState(s.b);s.phase='playing';s.turnActor=s.first;s.timerEndsAt=Date.now()+30000;roomId=id;role='b';await sb.from('rooms').update({game_state:s}).eq('id',id);await connectRoom()}
function drawFromState(p){for(let i=0;i<5;i++)p.hand.push(cards[Math.floor(Math.random()*cards.length)])}
async function connectRoom(){if(channel)await sb.removeChannel(channel);channel=sb.channel('room-'+roomId).on('postgres_changes',{event:'UPDATE',schema:'public',table:'rooms',filter:`id=eq.${roomId}`},payload=>{const incoming=payload.new.game_state;const old=st;st=incoming;if(!old||old.phase!==st.phase){if(st.phase==='playing'){$('start').classList.add('hidden');$('game').classList.remove('hidden');$('connection').textContent=`ห้อง ${roomId} • ${role==='p'?'ผู้เล่น 1':'ผู้เล่น 2'}`;initiative()}}render();if(role==='p'&&st.action&&st.action.id!==lastAction)processAction()}).subscribe(async status=>{if(status==='SUBSCRIBED'){const {data}=await sb.from('rooms').select('game_state').eq('id',roomId).single();st=data.game_state;$('start').classList.add('hidden');$('game').classList.remove('hidden');$('connection').textContent=`ห้อง ${roomId} • ${role==='p'?'ผู้เล่น 1':'ผู้เล่น 2'}`;render();if(st.phase==='playing'&&st.turnActor===st.first)initiative();if(role==='p'&&st.action)processAction()}})}
function leave(){if(channel)sb.removeChannel(channel);roomId=null;role=null;st=null;$('game').classList.add('hidden');$('end').classList.add('hidden');$('start').classList.remove('hidden');$('connection').textContent='ยังไม่ได้เข้าห้อง';$('roomMessage').textContent=''}
function showGuide(){if(localStorage.getItem('hormone-duel-guide-seen'))return;$('guideOverlay').classList.remove('hidden')}
function closeGuide(){localStorage.setItem('hormone-duel-guide-seen','1');$('guideOverlay').classList.add('hidden')}
setInterval(()=>{if(st){renderTimer();if(role==='p')timeoutTurn()}},500);
$('createRoom').onclick=createRoom;$('joinRoom').onclick=joinRoom;$('new').onclick=leave;$('again').onclick=leave;$('guideClose').onclick=closeGuide;$('guideOpen').onclick=showGuide;showGuide();
