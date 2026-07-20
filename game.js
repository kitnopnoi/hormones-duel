/* Hormone Duel Online - CLEAN BUILD
   ใช้ไฟล์นี้แทน game.js เดิมทั้งไฟล์
*/
const SUPABASE_URL='https://tabhvfrodakgfphfcctd.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_RsJy62SEbT7WjhNGF20k9g_dNTEKSNN';
const supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

const STATUS={
 WATER_REABSORB:['ดูดกลับน้ำ',1],WATER_INCREASE:['เพิ่มปริมาณน้ำ',0],
 HIGH_CALCIUM:['แคลเซียมในเลือดสูง',1],LOW_CALCIUM:['แคลเซียมในเลือดต่ำ',1],
 HIGH_SUGAR:['น้ำตาลในเลือดสูง',1],LOW_SUGAR:['น้ำตาลในเลือดต่ำ',1],
 STRESS:['เครียด',1],SLEEP:['หลับ',1],DMG_UP:['เพิ่มความเสียหาย',0],
 HEAL_UP:['เพิ่มการฟื้นฟู',0],DMG_REDUCE:['ลดความเสียหายที่ได้รับ',0],
 DEBUFF_REDUCE:['ลดความเสียหายจากดีบัพ',0]
};
const DEBUFFS=new Set(['WATER_REABSORB','WATER_INCREASE','HIGH_CALCIUM','LOW_CALCIUM','HIGH_SUGAR','LOW_SUGAR','STRESS','SLEEP']);

const rawCards=[
['Estrogen','อีสโทรเจน (Estrogen)','🌸','ควบคุมลักษณะเพศหญิง','รังไข่','healBuff',50,2],
['Progesterone','โพรเจสเทอโรน (Progesterone)','🌼','เตรียมเยื่อบุมดลูกสำหรับการฝังตัวของตัวอ่อน','รังไข่','healBuff',50,1],
['Testosterone','เทสโทสเทอโรน (Testosterone)','💪','ควบคุมลักษณะเพศชาย','อัณฑะ','dmgBuff',100,2],
['Androgen','แอนโดรเจน (Androgen)','🧬','กระตุ้นลักษณะเพศชายรอง เช่น ขน หนวด','ต่อมหมวกไตส่วนนอก','dmgBuff',50,2],
['FSH','FSH (Follicle Stimulating Hormone)','🥚','กระตุ้นการเจริญของไข่และการสร้างอสุจิ','ต่อมใต้สมองส่วนหน้า','healBuff',25,2],
['LH','LH (Luteinizing Hormone)','🌙','กระตุ้นการตกไข่และการสร้างเทสโทสเทอโรน','ต่อมใต้สมองส่วนหน้า','dmgBuff',25,2],
['GH','GH (Growth Hormone)','📈','กระตุ้นการเจริญเติบโตของร่างกาย กระดูก และกล้ามเนื้อ','ต่อมใต้สมองส่วนหน้า','bothBuff',100,2],
['Thyroxine','ไทรอกซิน (Thyroxine)','🔥','ควบคุมอัตราเมแทบอลิซึมและการเจริญเติบโต','ต่อมไทรอยด์','thyroxine',10,2],
['ADH','ADH (Antidiuretic Hormone)','💧','ช่วยให้ไตดูดน้ำกลับ รักษาสมดุลน้ำ','ต่อมใต้สมองส่วนหลัง','adh',0,2],
['Aldosterone','แอลโดสเทอโรน (Aldosterone)','🧂','ควบคุมสมดุลน้ำและเกลือแร่','ต่อมหมวกไตส่วนนอก','aldo',0,2],
['Calcitonin','แคลซิโทนิน (Calcitonin)','🦴','ลดระดับแคลเซียมในเลือดและช่วยสะสมที่กระดูก','ต่อมไทรอยด์','calcitonin',0,2],
['PTH','พาราทอร์โมน (PTH)','🦴','เพิ่มระดับแคลเซียมในเลือด','ต่อมพาราไทรอยด์','pth',0,2],
['GnRH','GnRH','📡','กระตุ้นต่อมใต้สมองให้หลั่ง FSH และ LH','ไฮโพทาลามัส','drawFSHLH',0,2],
['TRH','TRH','📡','กระตุ้นต่อมใต้สมองให้หลั่ง TSH','ไฮโพทาลามัส','drawTSH',0,2],
['CRH','CRH','📡','กระตุ้นต่อมใต้สมองให้หลั่ง ACTH','ไฮโพทาลามัส','drawACTH',0,2],
['PIH','PIH (Dopamine)','✨','ยับยั้งการหลั่งโพรแลกทิน','ไฮโพทาลามัส','blockProlactin',3,3],
['GHIH','GHIH (Somatostatin)','🛑','ยับยั้งการหลั่ง GH','ไฮโพทาลามัส','blockGH',3,3],
['GHRH','GHRH','📈','กระตุ้นการหลั่ง GH','ไฮโพทาลามัส','drawGH',0,2],
['ACTH','ACTH','📡','กระตุ้นต่อมหมวกไตส่วนนอก','ต่อมใต้สมองส่วนหน้า','drawCort',0,2],
['TSH','TSH','📡','กระตุ้นต่อมไทรอยด์ให้สร้างไทรอกซิน','ต่อมใต้สมองส่วนหน้า','drawThyroxine',0,2],
['Prolactin','โพรแลกทิน (Prolactin / PRL)','🍼','กระตุ้นการสร้างน้ำนม','ต่อมใต้สมองส่วนหน้า','heal',10,1],
['Endorphin','เอนดอร์ฟิน (Endorphin)','🏃','ช่วยระงับความเจ็บปวดและเกี่ยวข้องกับความเครียด','ต่อมใต้สมอง','endorphin',5,1],
['Glucocorticoids','กลูโคคอร์ทิคอยด์','🔥','ควบคุมเมแทบอลิซึมของคาร์โบไฮเดรตและต้านการอักเสบ','ต่อมหมวกไตส่วนนอก','attack',15,1],
['Cortisol','คอร์ทิซอล','⚠️','หลั่งมากเมื่อร่างกายเครียดหรืออดนอน','ต่อมหมวกไตส่วนนอก','stress',3,2],
['Epinephrine','เอพิเนฟริน (Adrenaline)','⚡','กระตุ้นหัวใจและเพิ่มน้ำตาลในเลือด','ต่อมหมวกไตชั้นใน','epi',20,1],
['Norepinephrine','นอร์เอพิเนฟริน','🚨','ทำให้หลอดเลือดหดตัวและความดันโลหิตสูงขึ้น','ต่อมหมวกไตชั้นใน','norepi',10,1],
['Insulin','อินซูลิน (Insulin)','🍬','ลดระดับน้ำตาลในเลือด','ตับอ่อน เบต้าเซลล์','lowSugar',0,2],
['Glucagon','กลูคากอน (Glucagon)','🍬','เพิ่มระดับน้ำตาลในเลือด','ตับอ่อน อัลฟาเซลล์','highSugar',0,2],
['Melatonin','เมลาโทนิน (Melatonin)','🌙','ควบคุมการนอนหลับและอาการง่วง','ต่อมไพเนียล','sleep',0,2],
['Oxytocin','ออกซิโทซิน (Oxytocin)','💞','เกี่ยวข้องกับการหดตัวของมดลูก การหลั่งน้ำนม และความผูกพัน','ไฮโพทาลามัส → หลั่งจากต่อมใต้สมองส่วนหลัง','damageReduce',50,3],
['hCG','hCG','🧪','คงสภาพโครงสร้างในรังไข่เพื่อรักษาเยื่อบุมดลูก','รกของหญิงตั้งครรภ์','heal',10,1],
['Thymosin','ไทโมซิน (Thymosin)','🛡️','กระตุ้นการพัฒนา T-cell','ต่อมไทมัส','thymosin',0,3],
['Gastrin','แกสทริน (Gastrin)','🍽️','กระตุ้นการหลั่งกรดและเอนไซม์ในกระเพาะอาหาร','เยื่อบุกระเพาะอาหาร','dmgBuff',40,2],
['Secretin','ซีครีทิน (Secretin)','⚗️','ช่วยควบคุมกรด-ด่างในลำไส้','ลำไส้เล็กส่วนต้น','debuffReduce',50,3],
['CCK','โคเลซิสโตไคนิน (CCK)','🥗','กระตุ้นการหลั่งน้ำดีและเอนไซม์จากตับอ่อน','ลำไส้เล็กส่วนต้น','dmgBuff',40,2],
['EPO','อีริโทรโพอิติน (EPO)','🩸','กระตุ้นไขกระดูกให้สร้างเซลล์เม็ดเลือดแดง','ไตเป็นหลักและตับบางส่วน','epo',10,3]
];
const cards=rawCards.map((x,i)=>({id:i,name:x[0],display:x[1],emoji:x[2],real:x[3],organ:x[4],effect:x[5],power:x[6],duration:x[7]}));

const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const uid=()=>globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2)+Date.now();
const byName=n=>cards.find(c=>c.name===n);

let roomId=null,role=null,room=null,channel=null,hostTimer=null,hostBusy=false;
const myId=localStorage.getItem('hormone-duel-player')||uid();
localStorage.setItem('hormone-duel-player',myId);

function player(name){return{name,hp:100,water:100,hand:[],status:{},blocked:{},organMods:{}}}
function addStatus(p,k,t){p.status[k]=Math.max(p.status[k]||0,t)}
function removeStatus(p,k){delete p.status[k]}
function has(p,k){return !!p.status[k]}
function clearDebuffs(p){DEBUFFS.forEach(k=>removeStatus(p,k))}
function cardOf(x){return cards[typeof x==='number'?x:x.cardId]}
function buildDeck(){return shuffle(cards.flatMap(c=>[c,c])).slice(0,60).map(c=>c.id)}
function draw(p,deck,n=1){for(let i=0;i<n;i++){if(!deck.length)deck.push(...buildDeck());p.hand.push({uid:uid(),cardId:deck.pop()})}}
function clone(x){return JSON.parse(JSON.stringify(x))}
function damage(t,n){t.hp=clamp(t.hp-n,0,100)}
function effectiveDamage(a,t,n,debuff=false){
 let m=1;
 if(has(a,'DMG_UP'))m*=1+a.status.DMG_UP/100;
 if(has(a,'LOW_CALCIUM')||has(a,'LOW_SUGAR'))m*=.5;
 if(has(t,'DMG_REDUCE'))m*=1-t.status.DMG_REDUCE/100;
 if(debuff&&has(t,'DEBUFF_REDUCE'))m*=1-t.status.DEBUFF_REDUCE/100;
 damage(t,n*m);
}
function effectiveHeal(p,n){p.hp=clamp(p.hp+n*(has(p,'HEAL_UP')?1+p.status.HEAL_UP/100:1),0,100)}
function mult(p,c){return p.organMods[c.organ]?.type==='boost'?2:1}
function canUse(p,c){return !p.blocked[c.name]&&!p.blocked[c.organ]&&!has(p,'SLEEP')}

function apply(c,a,t){
 const m=mult(a,c);
 switch(c.effect){
 case'healBuff':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=50*m;break;
 case'dmgBuff':addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=c.power*m;break;
 case'bothBuff':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=100*m;addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;
 case'thyroxine':effectiveDamage(a,t,10*m);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=100*m;break;
 case'adh':addStatus(t,'WATER_REABSORB',c.duration);removeStatus(a,'WATER_INCREASE');break;
 case'aldo':addStatus(t,'WATER_INCREASE',c.duration);removeStatus(a,'WATER_REABSORB');break;
 case'calcitonin':removeStatus(a,'HIGH_CALCIUM');addStatus(a,'LOW_CALCIUM',c.duration);addStatus(a,'DMG_UP',c.duration);a.status.DMG_UP=25*m;addStatus(a,'DMG_REDUCE',c.duration);a.status.DMG_REDUCE=25;break;
 case'pth':addStatus(t,'HIGH_CALCIUM',3);removeStatus(a,'LOW_CALCIUM');break;
 case'drawFSHLH':a.hand.push({uid:uid(),cardId:(Math.random()<.5?byName('FSH'):byName('LH')).id});break;
 case'drawTSH':a.hand.push({uid:uid(),cardId:byName('TSH').id});break;
 case'drawACTH':a.hand.push({uid:uid(),cardId:byName('ACTH').id});break;
 case'blockProlactin':t.blocked.Prolactin=c.duration;break;
 case'blockGH':t.blocked.GH=c.duration;break;
 case'drawGH':a.hand.push({uid:uid(),cardId:byName('GH').id});break;
 case'drawCort':a.hand.push({uid:uid(),cardId:(Math.random()<.5?byName('Glucocorticoids'):byName('Cortisol')).id});break;
 case'drawThyroxine':a.hand.push({uid:uid(),cardId:byName('Thyroxine').id});break;
 case'heal':effectiveHeal(a,c.power*m);break;
 case'endorphin':effectiveHeal(a,5*m);removeStatus(a,'STRESS');break;
 case'attack':effectiveDamage(a,t,c.power*m);break;
 case'stress':addStatus(t,'STRESS',c.duration);break;
 case'epi':effectiveDamage(a,t,20*m+(100-t.hp)*.5);break;
 case'norepi':effectiveDamage(a,t,10*m+t.hp*.5);break;
 case'lowSugar':addStatus(t,'LOW_SUGAR',3);break;
 case'highSugar':addStatus(t,'HIGH_SUGAR',3);break;
 case'sleep':addStatus(t,'SLEEP',2);break;
 case'damageReduce':addStatus(a,'DMG_REDUCE',c.duration);a.status.DMG_REDUCE=c.power*m;break;
 case'thymosin':clearDebuffs(a);addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=100;break;
 case'debuffReduce':addStatus(a,'DEBUFF_REDUCE',c.duration);a.status.DEBUFF_REDUCE=c.power*m;break;
 case'epo':addStatus(a,'HEAL_UP',c.duration);a.status.HEAL_UP=10*m;break;
 }
}
function tick(p){
 if(has(p,'WATER_REABSORB'))p.water-=10;
 if(has(p,'WATER_INCREASE'))p.water+=10;
 if(p.water<0)p.hp=clamp(p.hp-20,0,100);else if(p.water<20)p.hp=clamp(p.hp-5,0,100);
 if(has(p,'HIGH_CALCIUM'))p.hp=clamp(p.hp-10,0,100);
 if(has(p,'HIGH_SUGAR')){p.hp=clamp(p.hp-5,0,100);p.water-=15}
 if(has(p,'LOW_SUGAR'))p.hp=clamp(p.hp-10,0,100);
 Object.keys(p.status).forEach(k=>{if(['HEAL_UP','DMG_UP','DMG_REDUCE','DEBUFF_REDUCE'].includes(k))return;if(--p.status[k]<=0)delete p.status[k]});
 Object.keys(p.blocked).forEach(k=>{if(--p.blocked[k]<=0)delete p.blocked[k]});
 Object.keys(p.organMods).forEach(k=>{if(--p.organMods[k].turns<=0)delete p.organMods[k]});
}
function statuses(id,p){
 const e=$(id);if(!e)return;e.innerHTML='';
 Object.entries(p.status).forEach(([k,v])=>{const s=STATUS[k];if(!s)return;const d=document.createElement('span');d.className='status '+(s[1]?'bad':'good');d.textContent=`${s[0]} (${v})`;e.appendChild(d)});
 Object.keys(p.blocked).forEach(k=>{const d=document.createElement('span');d.className='status bad';d.textContent=`หยุดใช้: ${k} (${p.blocked[k]})`;e.appendChild(d)});
 if(!e.children.length)e.innerHTML='<span class="status">ปกติ</span>';
}
function ability(c){
 const m={
 healBuff:`เพิ่มการฟื้นฟู ${c.power}% ${c.duration} เทิร์น`,dmgBuff:`เพิ่มความเสียหาย ${c.power}% ${c.duration} เทิร์น`,
 bothBuff:`เพิ่มความเสียหายและการฟื้นฟู ${c.power}% ${c.duration} เทิร์น`,thyroxine:`สร้างดาเมจ 10 และเพิ่มความเสียหาย 100% ${c.duration} เทิร์น`,
 adh:`ติดสถานะดูดกลับน้ำให้เป้าหมาย ${c.duration} เทิร์น`,aldo:`ติดสถานะเพิ่มปริมาณน้ำให้เป้าหมาย ${c.duration} เทิร์น`,
 calcitonin:'ลดความเสียหายที่ได้รับ 25% เพิ่มความเสียหาย 25% และแก้แคลเซียมสูง',pth:'ติดแคลเซียมสูงให้ศัตรู และแก้แคลเซียมต่ำให้ตนเอง',
 drawFSHLH:'สุ่มจั่ว FSH หรือ LH',drawTSH:'จั่ว TSH',drawACTH:'จั่ว ACTH',blockProlactin:`ศัตรูใช้ Prolactin ไม่ได้ ${c.duration} เทิร์น`,
 blockGH:`ศัตรูใช้ GH ไม่ได้ ${c.duration} เทิร์น`,drawGH:'หยิบ GH ขึ้นมือ 1 ใบ',drawCort:'สุ่มจั่ว Glucocorticoids หรือ Cortisol',
 drawThyroxine:'จั่ว Thyroxine',heal:`ฟื้นฟู HP ${c.power}`,endorphin:`ฟื้นฟู HP ${c.power} และแก้เครียด`,attack:`สร้างความเสียหาย ${c.power}`,
 stress:'ทำให้ศัตรูติดสถานะเครียด',epi:'สร้างความเสียหาย 20 + 50% ของ HP ที่เสียไป',norepi:'สร้างความเสียหาย 10 + 50% ของ HP ปัจจุบัน',
 lowSugar:'ติดน้ำตาลในเลือดต่ำให้ศัตรู',highSugar:'ติดน้ำตาลในเลือดสูงให้ศัตรู',sleep:'ทำให้ศัตรูหลับ 2 เทิร์น',
 damageReduce:`ลดความเสียหายที่ได้รับ ${c.power}% ${c.duration} เทิร์น`,thymosin:'ล้างดีบัพทั้งหมดและต้านดีบัพ 3 เทิร์น',
 debuffReduce:`ลดความเสียหายจากดีบัพ ${c.power}% ${c.duration} เทิร์น`,epo:`เพิ่มการฟื้นฟู ${c.power} HP ${c.duration} เทิร์น`
 };
 return m[c.effect]||'ใช้ความสามารถของฮอร์โมน';
}
async function save(s){const{error}=await supabaseClient.from('rooms').update({game_state:s}).eq('id',roomId);if(error)console.error(error)}
function end(s){return s.p1.hp<=0||s.p2.hp<=0}
async function createRoom(){
 roomId=Math.random().toString(36).slice(2,8).toUpperCase();role='p1';
 const deck=buildDeck(),p1=player('ผู้เล่น 1'),p2=player('ผู้เล่น 2');draw(p1,deck,5);draw(p2,deck,5);
 const state={p1,p2,deck,round:1,first:Math.random()<.5?'p1':'p2',turn:null,phase:'waiting',timerEndsAt:null,cardEffectEndsAt:null,pendingAction:null,lastCard:null,event:null};
 const{error}=await supabaseClient.from('rooms').insert({id:roomId,host_id:myId,guest_id:null,game_state:state});
 if(error)return alert(error.message);await enter();
}
async function joinRoom(){
 const code=$('roomCode').value.trim().toUpperCase();if(!code)return alert('กรอกรหัสห้อง');
 const{data,error}=await supabaseClient.from('rooms').select('*').eq('id',code).single();
 if(error||!data)return alert('ไม่พบห้อง');if(data.guest_id)return alert('ห้องเต็มแล้ว');
 roomId=code;role='p2';
 const{error:e}=await supabaseClient.from('rooms').update({guest_id:myId}).eq('id',code).is('guest_id',null);
 if(e)return alert(e.message);await enter();
}
async function enter(){
 const{data,error}=await supabaseClient.from('rooms').select('*').eq('id',roomId).single();if(error)return alert(error.message);
 room=data;$('roomCodeDisplay').textContent=roomId;$('lobby').classList.add('hidden');$('game').classList.remove('hidden');
 channel=supabaseClient.channel('room-'+roomId).on('postgres_changes',{event:'UPDATE',schema:'public',table:'rooms',filter:`id=eq.${roomId}`},p=>{room=p.new;render()}).subscribe();
 render();if(role==='p1')startHost();
}
async function play(i){
 if(!room||room.state.phase!=='turn'||room.state.turn!==role||room.state.pendingAction)return;
 const me=role==='p1'?room.state.p1:room.state.p2,item=me.hand[i],c=cardOf(item);if(!canUse(me,c))return;
 const s=clone(room.state);s.pendingAction={player:role,itemUid:item.uid};await save(s);
}
function startHost(){
 if(hostTimer)return;
 hostTimer=setInterval(async()=>{
  if(!room||role!=='p1'||hostBusy)return;hostBusy=true;
  try{
   const s=room.state,now=Date.now();
   if(s.phase==='waiting'&&room.guest_id){s.phase='initiative';s.cardEffectEndsAt=now+1500;await save(s)}
   else if(s.phase==='initiative'&&now>=s.cardEffectEndsAt){s.phase='turn';s.turn=s.first;s.timerEndsAt=now+30000;await save(s)}
   else if(s.phase==='turn'){if(s.pendingAction)await resolve(s);else if(now>=s.timerEndsAt)await advance(s)}
   else if(s.phase==='card_effect'&&now>=s.cardEffectEndsAt)await advance(s);
  }finally{hostBusy=false}
 },250);
}
async function resolve(s){
 const actor=s.pendingAction.player,p=actor==='p1'?s.p1:s.p2,t=actor==='p1'?s.p2:s.p1;
 const i=p.hand.findIndex(x=>x.uid===s.pendingAction.itemUid);
 if(i<0){s.pendingAction=null;return save(s)}
 const c=cardOf(p.hand[i]);p.hand.splice(i,1);apply(c,p,t);
 s.lastCard={who:actor==='p1'?'ผู้เล่น 1':'ผู้เล่น 2',emoji:c.emoji,display:c.display,real:c.real,organ:c.organ,ability:ability(c)};
 s.pendingAction=null;s.phase='card_effect';s.cardEffectEndsAt=Date.now()+1400;
 if(end(s)){s.phase='ended';return save(s)}await save(s);
}
async function advance(s){
 const old=s.turn,next=old==='p1'?'p2':'p1',np=next==='p1'?s.p1:s.p2;
 if(has(np,'SLEEP')){s.turn=old;s.timerEndsAt=Date.now()+300;return save(s)}
 if(old==='p2'){
  tick(s.p1);tick(s.p2);if(end(s)){s.phase='ended';return save(s)}
  s.round++;s.first=s.first==='p1'?'p2':'p1';draw(s.p1,s.deck,1);draw(s.p2,s.deck,1);
  if(s.round%3===0){const organs=[...new Set(cards.map(c=>c.organ))],organ=organs[Math.floor(Math.random()*organs.length)],boost=Math.random()<.5;s.event={organ,boost};s.p1.organMods[organ]={type:boost?'boost':'disabled',turns:3};s.p2.organMods[organ]={type:boost?'boost':'disabled',turns:3};s.phase='initiative';s.cardEffectEndsAt=Date.now()+1800;s.turn=null;return save(s)}
 }
 s.turn=next;s.timerEndsAt=Date.now()+30000;s.phase='turn';await save(s);
}
function render(){
 if(!room)return;
 const me=role==='p1'?room.state.p1:room.state.p2,op=role==='p1'?room.state.p2:room.state.p1;
 $('php').textContent=`${Math.round(me.hp)} / 100`;$('bhp').textContent=`${Math.round(op.hp)} / 100`;
 $('phb').style.width=clamp(me.hp,0,100)+'%';$('bhb').style.width=clamp(op.hp,0,100)+'%';
 $('pwater').textContent=Math.round(me.water);$('bwater').textContent=Math.round(op.water);
 $('pwb').style.width=clamp(me.water,0,100)+'%';$('bwb').style.width=clamp(op.water,0,100)+'%';
 $('count').textContent=me.hand.length;$('round').textContent=room.state.round;statuses('pstatus',me);statuses('bstatus',op);
 const n=room.state.timerEndsAt&&room.state.phase==='turn'?Math.max(0,Math.ceil((room.state.timerEndsAt-Date.now())/1000)):0;
 $('timer').textContent=n?`⏱️ ${n}s`:'⏱️ —';
 $('banner').textContent=room.state.phase==='waiting'?'⏳ รอผู้เล่นคนที่ 2...':room.state.phase==='initiative'?`⚔️ ${room.state.first===role?'คุณ':'คู่ต่อสู้'} เริ่มก่อน`:room.state.phase==='card_effect'?`✨ กำลังแสดงผลการ์ดของ ${room.state.lastCard?.who||''}`:room.state.phase==='ended'?'เกมจบแล้ว':room.state.turn===role?'🎮 ถึงตาคุณ':'⏳ รอคู่ต่อสู้';
 renderHand(me);renderLast();
}
function renderHand(me){
 const e=$('hand');if(!e)return;e.innerHTML='';
 me.hand.forEach((it,i)=>{const c=cardOf(it),b=document.createElement('button');b.className='card';
 b.disabled=room.state.phase!=='turn'||room.state.turn!==role||room.state.pendingAction||!canUse(me,c);
 b.innerHTML=`<div class="cardtop"><span class="emoji">${c.emoji}</span><span class="type">${c.organ}</span></div><h3>${c.display}</h3><div class="real">หน้าที่จริง: ${c.real}</div><div class="organ">สร้างจาก: ${c.organ}</div>`;
 b.onclick=()=>play(i);e.appendChild(b)});
}
function renderLast(){
 const c=room?.state?.lastCard,e=$('last');if(!e)return;
 if(!c){e.textContent='การ์ดที่ใช้จะแสดงตรงนี้';return}
 e.innerHTML=`<div><div class="emoji">${c.emoji}</div><h3>${c.who} ใช้ ${c.display}</h3><p><b>ความสามารถ:</b> ${c.ability}</p><p><b>หน้าที่จริง:</b> ${c.real}</p><p><b>สร้างจาก:</b> ${c.organ}</p></div>`;
}
$('createBtn').onclick=createRoom;
$('joinBtn').onclick=joinRoom;
$('guideClose').onclick=()=>{$('guideOverlay').classList.add('hidden');localStorage.setItem('hormone-duel-guide-seen','1')};
$('guideOpen').onclick=()=>{$('guideOverlay').classList.remove('hidden')};
setInterval(render,250);
if(!localStorage.getItem('hormone-duel-guide-seen'))$('guideOverlay').classList.remove('hidden');
