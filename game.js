(() => {
  "use strict";

  // ใช้ชื่อเดียวเท่านั้น ป้องกัน Identifier 'supabase' has already been declared
  const SUPABASE_URL = "https://tabhvfrodakgfphfcctd.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_RsJy62SEbT7WjhNGF20k9g_dNTEKSNN";

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    alert("โหลด Supabase ไม่สำเร็จ กรุณารีเฟรชหน้า");
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const $ = id => document.getElementById(id);
  const state = {
    roomCode: null,
    playerId: crypto.randomUUID(),
    role: null,
    mode: "online",
    bot: null,
    channel: null,
    room: null,
    timerId: null,
    seconds: 30,
    busy: false,
    sleepSkipTimerId: null,
    announcedTurnId: null,
    turnAnnouncementTimerId: null,
    botTimer: null,
    botEventTimer: null
  };

  const CARDS = [
    ["Estrogen","ควบคุมลักษณะเพศหญิง","เพิ่มการฟื้นฟู 50% 2 เทิร์น","รังไข่"],
    ["Progesterone","เตรียมเยื่อบุมดลูกสำหรับการฝังตัว","เพิ่มการฟื้นฟู 50% 1 เทิร์น","รังไข่"],
    ["Testosterone","ควบคุมลักษณะเพศชาย","เพิ่มความเสียหาย 100% 2 เทิร์น","อัณฑะ"],
    ["Androgen","กระตุ้นลักษณะเพศชายรอง","เพิ่มความเสียหาย 50% 2 เทิร์น","ต่อมหมวกไตส่วนนอก"],
    ["FSH","กระตุ้นการเจริญของไข่และการสร้างอสุจิ","เพิ่มการฟื้นฟู 25% 2 เทิร์น","ต่อมใต้สมองส่วนหน้า"],
    ["LH","กระตุ้นการตกไข่และการสร้างเทสโทสเทอโรน","เพิ่มความเสียหาย 25% 2 เทิร์น","ต่อมใต้สมองส่วนหน้า"],
    ["GH","กระตุ้นการเจริญเติบโตของร่างกาย","เพิ่มความเสียหายและการฟื้นฟู 100% 2 เทิร์น","ต่อมใต้สมองส่วนหน้า"],
    ["Thyroxine","ควบคุมอัตราเมแทบอลิซึม","สร้างดาเมจ 10 และเพิ่มความเสียหาย 100% 2 เทิร์น","ต่อมไทรอยด์"],
    ["ADH","ช่วยให้ไตดูดน้ำกลับ","ติดสถานะดูดกลับน้ำ 2 เทิร์น","ต่อมใต้สมองส่วนหลัง"],
    ["Aldosterone","ควบคุมสมดุลน้ำและเกลือแร่","ติดสถานะเพิ่มปริมาณน้ำ 2 เทิร์น","ต่อมหมวกไตส่วนนอก"],
    ["Calcitonin","ลดระดับแคลเซียมในเลือด","ลดความเสียหายที่ได้รับ 25% และแก้แคลเซียมสูง","ต่อมไทรอยด์"],
    ["PTH","เพิ่มระดับแคลเซียมในเลือด","ติดแคลเซียมสูงให้ศัตรู","ต่อมพาราไทรอยด์"],
    ["GnRH","กระตุ้นการหลั่ง FSH และ LH","สุ่มจั่ว FSH หรือ LH","ไฮโพทาลามัส"],
    ["TRH","กระตุ้นการหลั่ง TSH","จั่ว TSH","ไฮโพทาลามัส"],
    ["CRH","กระตุ้นการหลั่ง ACTH","จั่ว ACTH","ไฮโพทาลามัส"],
    ["PIH / Dopamine","ยับยั้งการหลั่งโพรแลกทิน","ศัตรูใช้โพรแลกทินไม่ได้","ไฮโพทาลามัส"],
    ["GHIH / Somatostatin","ยับยั้งการหลั่ง GH","ศัตรูใช้ GH ไม่ได้ 3 เทิร์น","ไฮโพทาลามัส"],
    ["GHRH","กระตุ้นการหลั่ง GH","หยิบ GH ขึ้นมือ 1 ใบ","ไฮโพทาลามัส"],
    ["ACTH","กระตุ้นต่อมหมวกไตส่วนนอก","สุ่มจั่วกลูโคคอร์ทิคอยด์หรือคอร์ทิซอล","ต่อมใต้สมองส่วนหน้า"],
    ["TSH","กระตุ้นต่อมไทรอยด์","จั่วไทรอกซิน","ต่อมใต้สมองส่วนหน้า"],
    ["Prolactin","กระตุ้นการสร้างน้ำนม","ฟื้นฟู HP 10","ต่อมใต้สมองส่วนหน้า"],
    ["Endorphin","ช่วยระงับความเจ็บปวด","ฟื้นฟู HP 5 และแก้เครียด","ต่อมใต้สมองส่วนหน้า"],
    ["Glucocorticoids","ควบคุมเมแทบอลิซึมของคาร์โบไฮเดรต","สร้างดาเมจ 15","ต่อมหมวกไตชั้นนอก"],
    ["Cortisol","หลั่งมากเมื่อเครียดหรืออดนอน","ทำให้ศัตรูติดเครียด","ต่อมหมวกไตชั้นนอก"],
    ["Epinephrine","เตรียมร่างกายให้ใช้พลังงานสูง","ดาเมจ 20 + 50% HP ที่เสียไป","ต่อมหมวกไตชั้นใน"],
    ["Norepinephrine","ทำให้หลอดเลือดหดตัว","ดาเมจ 10 + 50% HP ปัจจุบัน","ต่อมหมวกไตชั้นใน"],
    ["Insulin","ลดระดับน้ำตาลในเลือด","ติดน้ำตาลในเลือดต่ำ","ตับอ่อน"],
    ["Glucagon","เพิ่มระดับน้ำตาลในเลือด","ติดน้ำตาลในเลือดสูง","ตับอ่อน"],
    ["Melatonin","ควบคุมการนอนหลับ","ทำให้ศัตรูหลับ 2 เทิร์น","ต่อมไพเนียล"],
    ["Oxytocin","เกี่ยวข้องกับการคลอด การหลั่งน้ำนม และความผูกพัน","ลดความเสียหายที่ได้รับ 50% 3 เทิร์น","ไฮโพทาลามัส / ต่อมใต้สมองส่วนหลัง"],
    ["hCG","คงสภาพโครงสร้างในรังไข่ระหว่างตั้งครรภ์","เพิ่ม HP 10","รก"],
    ["Thymosin","กระตุ้นการพัฒนา T-cell","ล้างดีบัพและต้านดีบัพ 3 เทิร์น","ต่อมไทมัส"],
    ["Gastrin","กระตุ้นการหลั่งกรดและเอนไซม์ในกระเพาะ","เพิ่มความเสียหาย 40%","กระเพาะอาหาร"],
    ["Secretin","ควบคุมความเป็นกรด-ด่างในลำไส้","ลดความเสียหายจากดีบัพ","ลำไส้เล็กส่วนต้น"],
    ["Cholecystokinin / CCK","ช่วยย่อยอาหารและกระตุ้นถุงน้ำดี","เพิ่มความเสียหาย 40%","ลำไส้เล็กส่วนต้น"],
    ["EPO","กระตุ้นการสร้างเม็ดเลือดแดง","ฟื้น HP 10 ต่อเนื่อง 3 เทิร์น","ไต"],
  ];

  const starterHand = () => {
    const shuffled = [...CARDS].sort(() => Math.random() - .5);
    return shuffled.slice(0, 5).map(c => ({name:c[0], real:c[1], ability:c[2], organ:c[3]}));
  };

  const initialPlayer = id => ({
    id, hp:100, water:100, hand:starterHand(), statuses:[]
  });

  const newState = hostId => ({
    status:"waiting",
    round:1,
    roundStarter:null,
    playedThisRound:[],
    activePlayer:null,
    attacker:null,
    actionUsed:false,
    specialUsed:false,
    turnStartedAt:null,
    turnId:0,
    drawnTurnId:null,
    event:null,
    organEvents:{},
    host:initialPlayer(hostId),
    guest:null,
    lastCard:null,
    log:["สร้างห้องแล้ว รอผู้เล่นอีกคน..."]
  });

  function setMessage(text, error=false) {
    $("lobbyMessage").textContent = text;
    $("lobbyMessage").style.color = error ? "#ff8f9d" : "#ffd36a";
  }

  function makeCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({length:6}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
  }

  function getMe() {
    return state.role === "host" ? state.room?.host : state.room?.guest;
  }

  function getEnemy() {
    return state.role === "host" ? state.room?.guest : state.room?.host;
  }


  function announceTurn(room) {
    if (!room || !room.activePlayer || room.turnId == null) return;
    if (state.announcedTurnId === room.turnId) return;

    state.announcedTurnId = room.turnId;
    const mine = room.activePlayer === state.playerId;
    $("turnIcon").textContent = mine ? "🧑‍🔬" : "🤖";
    $("turnTitle").textContent = mine ? "เทิร์นของคุณ" : "เทิร์นของคู่ต่อสู้";
    $("turnText").textContent = mine
      ? "คุณเริ่มเล่นการ์ดได้แล้ว"
      : "รอคู่ต่อสู้เล่นการ์ด...";
    $("turnOverlay").classList.remove("hidden");

    clearTimeout(state.turnAnnouncementTimerId);
    state.turnAnnouncementTimerId = setTimeout(() => {
      $("turnOverlay").classList.add("hidden");
    }, 1800);
  }


  const STATUS_DETAILS = {
    "ดูดกลับน้ำ": "ลดน้ำ 10 หน่วยตามจังหวะของสถานะ",
    "เพิ่มปริมาณน้ำ": "เพิ่มน้ำ 10 หน่วยตามจังหวะของสถานะ",
    "แคลเซียมสูง": "ลด HP 10 หน่วยตามจังหวะของสถานะ",
    "แคลเซียมต่ำ": "ความเสียหายที่ทำลดลง 50%",
    "น้ำตาลสูง": "ลด HP 5 หน่วย และลดน้ำ 15 หน่วยตามจังหวะของสถานะ",
    "น้ำตาลต่ำ": "ลด HP 10 หน่วย และความเสียหายที่ทำลดลง 50%",
    "เครียด": "ลด HP 5 หน่วยต่อดีบัฟ 1 ชนิดที่ติดอยู่",
    "หลับ": "ไม่สามารถเล่นการ์ดได้ และจะรอ 3 วินาทีก่อนจบเทิร์นอัตโนมัติ",
    "เพิ่มความเสียหาย": "เพิ่มความเสียหายที่ทำตามค่าของบัฟ",
    "เพิ่มการฟื้นฟู": "เพิ่มประสิทธิภาพการฟื้นฟู HP",
    "ลดความเสียหาย": "ลดความเสียหายที่ได้รับ",
    "ลดความเสียหายจากดีบัพ": "ลดความเสียหายที่เกิดจากดีบัฟ",
    "ต้านดีบัพ": "ไม่รับดีบัฟใหม่ในช่วงเวลาที่สถานะยังคงอยู่",
    "ห้ามใช้ GH": "ไม่สามารถใช้การ์ด GH ได้ในช่วงเวลาที่สถานะยังคงอยู่",
    "ห้ามใช้โพรแลกทิน": "ไม่สามารถใช้การ์ดโพรแลกทินได้ในช่วงเวลาที่สถานะยังคงอยู่"
  };

  function openStatusDetails(player, ownerLabel, isMe) {
    if (!player) return;
    const statuses = player.statuses || [];
    $("statusDetailIcon").textContent = isMe ? "🧑‍🔬" : "🤖";
    $("statusDetailTitle").textContent = "รายละเอียดสถานะ";
    $("statusDetailOwner").textContent = ownerLabel;

    if (!statuses.length) {
      $("statusDetailList").innerHTML = '<div class="status-empty">ไม่มีบัฟหรือดีบัฟอยู่ในขณะนี้</div>';
    } else {
      $("statusDetailList").innerHTML = statuses.map(s => {
        const detail = STATUS_DETAILS[s.name] || "สถานะนี้มีผลตามความสามารถของการ์ดที่ทำให้เกิดสถานะ";
        const turns = s.turns != null ? `เหลือ ${s.turns} เทิร์น` : "ไม่มีระยะเวลา";
        return `<div class="status-detail-item">
          <h3>${escapeHtml(s.name)}</h3>
          <p>${escapeHtml(detail)}</p>
          <div class="turns">⏳ ${escapeHtml(turns)}</div>
        </div>`;
      }).join("");
    }

    $("statusOverlay").classList.remove("hidden");
  }

  function closeStatusDetails() {
    $("statusOverlay").classList.add("hidden");
  }

  function render() {
    const r = state.room;
    if (!r) return;

    if (r.status === "waiting") {
      $("lobby").classList.remove("hidden");
      $("game").classList.add("hidden");
      $("roomInfo").classList.remove("hidden");
      $("roomInfo").textContent = `รหัสห้อง: ${state.roomCode} • รอผู้เล่นอีกคน`;
      return;
    }

    if (r.status === "finished") {
      showEnd();
      return;
    }

    $("lobby").classList.add("hidden");
    $("game").classList.remove("hidden");
    $("roomInfo").classList.add("hidden");

    const me = getMe();
    const enemy = getEnemy();
    if (!me || !enemy) return;

    updatePlayer("my", me);
    updatePlayer("enemy", enemy);
    $("myRoleBadge").textContent = r.attacker === me.id ? "⚔️ โจมตี" : "🛡️ ป้องกัน";
    $("enemyRoleBadge").textContent = r.attacker === enemy.id ? "⚔️ โจมตี" : "🛡️ ป้องกัน";
    announceTurn(r);

    $("round").textContent = r.round;
    $("lastCard").textContent = r.lastCard ? `${r.lastCard.playerName} ใช้ ${r.lastCard.name}\n${r.lastCard.ability}` : "ยังไม่มีการ์ดที่ใช้";

    if (r.event) {
      showEvent(r.event);
    } else {
      $("eventOverlay").classList.add("hidden");
    }

    const sleeping = hasStatus(me,"หลับ");
    scheduleSleepingTurn(r);
    const canPlay = r.activePlayer === state.playerId && !state.busy && !sleeping && !r.event;
    $("handHint").textContent = r.event
      ? "กำลังดำเนินอีเวนต์"
      : sleeping && r.activePlayer === state.playerId
        ? "หลับ — ข้ามเทิร์นทันที"
        : r.activePlayer === state.playerId ? `ถึงตาคุณ • ${r.actionUsed ? "ใช้การ์ดหลักแล้ว" : "เลือกการ์ดหลักได้"}` : "รอคู่ต่อสู้เล่น";

    renderSpecial(me.specialCard, canPlay); renderHand(me.hand || [], canPlay && !r.actionUsed);
    updateTimer();
    $("endTurnBtn").disabled = !(r.activePlayer === state.playerId) || state.busy || !!r.event;
    scheduleBotTurn();
    if (state.mode==="bot" && r.event && !state.busy && !state.botEventTimer) {
      state.botEventTimer=setTimeout(()=>{ state.botEventTimer=null; closeEvent(); },1200);
    }
  }

  function updatePlayer(prefix, p) {
    const hp = Math.max(0, Math.min(100, p.hp || 0));
    const water = Math.max(0, Math.min(100, p.water || 0));
    $(`${prefix}Hp`).textContent = hp;
    $(`${prefix}HpBar`).style.width = hp + "%";
    $(`${prefix}Water`).textContent = water;
    $(`${prefix}WaterBar`).style.width = water + "%";
    const shieldEl = $(`${prefix}Shield`); if (shieldEl) shieldEl.textContent = Math.max(0,p.shield||0);
    $(`${prefix}Statuses`).innerHTML = (p.statuses || []).map(s => `<span class="status">${s.name} ${s.turns ? `(${s.turns})` : ""}</span>`).join("") || `<span class="status">ปกติ</span>`;
  }

  function renderSpecial(card, canPlay) {
    const box = $("specialHand");
    if (!card) { box.innerHTML = ""; return; }
    const used = state.room?.specialUsed;
    const disabled = !canPlay || used;
    box.innerHTML = `<article class="card special-card ${disabled ? "disabled" : ""}">
      <h3>${card.type === "attack" ? "⚔️" : "🛡️"} ${escapeHtml(card.name)}</h3>
      <small>การ์ดพิเศษประจำฝ่าย</small>
      <p><b>ผล:</b> ${escapeHtml(card.real)}</p>
      <button class="primary" id="specialCardBtn" ${disabled ? "disabled" : ""}>ใช้การ์ด</button>
    </article>`;
    const btn = $("specialCardBtn");
    if (btn) btn.addEventListener("click", playSpecialCard);
  }

  function renderHand(hand, canPlay) {
    $("cardCount").textContent = `${hand.length}/60`;
    $("hand").innerHTML = hand.map((c,i) => `
      <article class="card ${canPlay ? "" : "disabled"}">
        <h3>${escapeHtml(c.name)}</h3>
        <small>สร้างจาก: ${escapeHtml(c.organ)}</small>
        <p><b>หน้าที่จริง:</b> ${escapeHtml(c.real)}</p>
        <button class="primary" data-card="${i}" ${canPlay ? "" : "disabled"}>ใช้การ์ด</button>
      </article>
    `).join("");
    $("hand").querySelectorAll("[data-card]").forEach(btn => {
      btn.addEventListener("click", () => playCard(Number(btn.dataset.card)));
    });
  }

  async function playSpecialCard() {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId || state.room.specialUsed) return;
    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const me = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;
      const card = me.specialCard;
      if (!card) return;
      if (card.type === "attack") {
        dealDamage(enemy, 10, me);
      } else {
        me.shield = (me.shield || 0) + 5;
      }
      me.specialCard = null;
      next.specialUsed = true;
      next.lastCard = {name:card.name, ability:card.ability, playerName:"คุณ"};
      next.log = [...(next.log||[]), `${card.name}: ${card.ability}`].slice(-20);
      await showCardAnimation(card, "คุณ");
      await delay(400);
      await saveRoom(next);
    } finally {
      state.busy = false;
      render();
    }
  }



  function startBotGame() {
    state.mode = "bot";
    state.role = "host";
    state.roomCode = "BOT";
    const botId = "BOT-" + crypto.randomUUID();
    state.bot = botId;
    const room = newState(state.playerId);
    room.status = "playing";
    room.guest = initialPlayer(botId);
    room.roundStarter = Math.random() < .5 ? state.playerId : botId;
    room.activePlayer = room.roundStarter;
    room.attacker = room.roundStarter;
    room.log = [`เริ่มเกมกับบอท — ${room.roundStarter === state.playerId ? "คุณ" : "บอท"} เป็นฝ่ายโจมตี`];
    state.room = room;
    startTurn(room, room.roundStarter);
    render();
  }

  function playBotCompatibleCard(index) {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId || state.room.actionUsed) return;
    return playLocalNormal(index);
  }

  async function playLocalNormal(index) {
    state.busy=true;
    try {
      const next=structuredClone(state.room);
      const me=next.host, enemy=next.guest;
      const card=me.hand[index];
      if (!card) return;
      if (isOrganBlocked(next,card.organ)) return;
      me.hand.splice(index,1);
      await showCardAnimation(card,"คุณ");
      applyCard(card,me,enemy,next);
      if (isOrganBoosted(next,card.organ)) applyCard(card,me,enemy,next,true);
      next.actionUsed=true;
      next.lastCard={name:card.name,ability:card.ability,playerName:"คุณ"};
      if (me.hp<=0||enemy.hp<=0) next.status="finished";
      state.room=next;
      render();
    } finally { state.busy=false; }
  }

  async function botPlayTurn() {
    if (state.mode!=="bot" || state.busy || !state.room || state.room.activePlayer!==state.bot || state.room.status!=="playing" || state.room.event) return;
    state.busy=true;
    try {
      const r=state.room;
      const bot=r.guest, me=r.host;
      if (hasStatus(bot,"หลับ")) {
        await delay(3000);
        if (state.room && state.room.activePlayer===state.bot) await finishTurn(state.room,state.room.guest,state.room.host,null);
        return;
      }

      if (bot.specialCard && !r.specialUsed) {
        const next=structuredClone(state.room);
        const b=next.guest, p=next.host, card=b.specialCard;
        if (card.type==="attack") dealDamage(p,10,b);
        else b.shield=(b.shield||0)+5;
        b.specialCard=null; next.specialUsed=true;
        next.lastCard={name:card.name,ability:card.ability,playerName:"บอท"};
        state.room=next; render();
        await showCardAnimation(card,"บอท");
        await delay(500);
      }

      if (!state.room || state.room.status!=="playing" || state.room.activePlayer!==state.bot) return;
      const next=structuredClone(state.room);
      const b=next.guest,p=next.host;
      if (!next.actionUsed && b.hand.length) {
        let idx=b.hand.findIndex(c => /Prolactin|Endorphin|hCG|EPO/i.test(c.name) && b.hp<65);
        if (idx<0) idx=Math.floor(Math.random()*b.hand.length);
        const card=b.hand[idx];
        if (!isOrganBlocked(next,card.organ)) {
          b.hand.splice(idx,1);
          state.room=next; render();
          await showCardAnimation(card,"บอท");
          applyCard(card,b,p,next);
          if (isOrganBoosted(next,card.organ)) applyCard(card,b,p,next,true);
          next.actionUsed=true;
          next.lastCard={name:card.name,ability:card.ability,playerName:"บอท"};
          state.room=next; render();
        }
      }
      await delay(700);
      if (state.room && state.room.activePlayer===state.bot && state.room.status==="playing") {
        await finishTurn(state.room,state.room.guest,state.room.host,null);
      }
    } finally {
      state.busy=false;
      render();
    }
  }


  function scheduleBotTurn() {
    if (state.mode!=="bot" || !state.room || state.room.activePlayer!==state.bot || state.room.event) return;
    if (state.botTimer) return;
    state.botTimer=setTimeout(async()=>{
      state.botTimer=null;
      await botPlayTurn();
    },1100);
  }

  async function createRoom() {
    if (state.busy) return;
    state.busy = true;
    setMessage("กำลังสร้างห้อง...");
    try {
      let code, exists;
      for (let i=0;i<10;i++) {
        code = makeCode();
        const res = await db.from("rooms").select("room_code").eq("room_code", code).maybeSingle();
        if (!res.data) { exists = false; break; }
        exists = true;
      }
      if (exists) throw new Error("ไม่สามารถสร้างรหัสห้องได้");

      const room = newState(state.playerId);
      const {data,error} = await db.from("rooms").insert({
        room_code: code,
        player1_id: state.playerId,
        player2_id: null,
        game_state: room
      }).select().single();

      if (error) throw error;
      state.roomCode = code;
      state.role = "host";
      state.room = data.game_state;
      subscribe();
      setMessage(`สร้างห้องสำเร็จ: ${code}`);
      render();
    } catch(e) {
      console.error(e);
      setMessage("สร้างห้องไม่สำเร็จ: " + (e.message || e), true);
    } finally {
      state.busy = false;
    }
  }

  async function joinRoom() {
    if (state.busy) return;
    const code = $("roomCodeInput").value.trim().toUpperCase();
    if (code.length !== 6) return setMessage("กรุณากรอกรหัสห้อง 6 ตัว", true);

    state.busy = true;
    setMessage("กำลังเข้าห้อง...");
    try {
      const {data,error} = await db.from("rooms").select("*").eq("room_code", code).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("ไม่พบห้องนี้");
      if (data.player2_id) throw new Error("ห้องเต็มแล้ว");

      const room = data.game_state || newState(data.player1_id);
      room.guest = initialPlayer(state.playerId);
      room.status = "playing";
      room.round = room.round || 1;
      room.playedThisRound = [];
      room.roundStarter = Math.random() < .5 ? room.host.id : state.playerId;
      room.activePlayer = room.roundStarter;
      startTurn(room, room.activePlayer);
      room.log = [...(room.log || []), `ผู้เล่นครบ 2 คน เกมเริ่มแล้ว — ${room.roundStarter === room.host.id ? "ฝ่ายเจ้าของห้อง" : "ฝ่ายผู้เข้าร่วม"} เริ่มก่อน`];

      const {error:updateError} = await db.from("rooms")
        .update({player2_id:state.playerId, game_state:room})
        .eq("room_code", code)
        .is("player2_id", null);

      if (updateError) throw updateError;

      state.roomCode = code;
      state.role = "guest";
      state.room = room;
      subscribe();
      render();
    } catch(e) {
      console.error(e);
      setMessage("เข้าห้องไม่สำเร็จ: " + (e.message || e), true);
    } finally {
      state.busy = false;
    }
  }

  function subscribe() {
    if (state.channel) db.removeChannel(state.channel);
    state.channel = db.channel("room-" + state.roomCode)
      .on("postgres_changes", {
        event:"UPDATE", schema:"public", table:"rooms",
        filter:`room_code=eq.${state.roomCode}`
      }, payload => {
        state.room = payload.new.game_state;
        render();
      })
      .subscribe();
  }

  async function saveRoom(next) {
    if (state.mode === "bot") {
      state.room = next;
      render();
      return;
    }
    const {error} = await db.from("rooms")
      .update({game_state:next})
      .eq("room_code", state.roomCode);
    if (error) throw error;
    state.room = next;
    render();
  }

  async function playCard(index) {
    if (state.mode === "bot") return playBotCompatibleCard(index);
    if (state.busy || !state.room || state.room.status !== "playing" || state.room.event) return;
    if (state.room.activePlayer !== state.playerId || state.room.actionUsed) return;
    const me = getMe();
    if (!me) return;
    if (hasStatus(me,"หลับ")) { await skipSleepingTurn(); return; }
    const card = me.hand[index];
    if (!card) return;

    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const player = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;
      if (isOrganBlocked(next, card.organ)) {
        next.log = [...(next.log||[]), `${card.name} ใช้งานไม่ได้: อวัยวะถูกหยุดการทำงาน`].slice(-20);
        next.actionUsed = true;
        await saveRoom(next);
        return;
      }
      player.hand.splice(index,1);
      await showCardAnimation(card, "คุณ");
      applyCard(card, player, enemy, next);
      if (isOrganBoosted(next, card.organ)) applyCard(card, player, enemy, next, true);
      next.actionUsed = true;
      next.lastCard = {name:card.name, ability:card.ability, playerName:"คุณ"};
      next.log = [...(next.log||[]), `${card.name}: ${card.ability}`].slice(-20);
      if (player.hp <= 0 || enemy.hp <= 0) {
        next.status = "finished";
        await saveRoom(next);
      } else {
        await saveRoom(next);
      }
    } catch(e) {
      console.error(e); setMessage("ใช้การ์ดไม่สำเร็จ: "+e.message,true);
    } finally { state.busy=false; render(); }
  }

  async function endCurrentTurn() {
    if (state.mode === "bot") return botEndTurn();
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId) return;
    state.busy=true;
    try {
      const next=structuredClone(state.room);
      const me=state.role==="host"?next.host:next.guest;
      const enemy=state.role==="host"?next.guest:next.host;
      await finishTurn(next,me,enemy,null);
    } finally { state.busy=false; render(); }
  }


  async function finishTurn(next, player, enemy, card) {
    // ลดระยะเวลาสถานะเฉพาะสถานะที่มีอยู่ตั้งแต่เริ่มเทิร์นนี้
    // สถานะที่เพิ่งใช้ในเทิร์นนี้จะไม่ถูกลดทันที
    processStatusesAtEnd(player, next.turnId);

    if (player.hp <= 0 || enemy.hp <= 0) {
      next.status = "finished";
      await saveRoom(next);
      return;
    }

    if (!next.playedThisRound) next.playedThisRound = [];
    if (!next.playedThisRound.includes(player.id)) {
      next.playedThisRound.push(player.id);
    }

    // ทั้งสองฝ่ายเล่นครบ = จบรอบ
    if (next.playedThisRound.length >= 2) {
      next.round += 1;
      next.playedThisRound = [];

      // สลับฝ่ายเริ่มจากรอบก่อน
      next.roundStarter = next.roundStarter === player.id ? enemy.id : player.id;

      // ทุก 3 รอบแสดง Event ก่อนเริ่มรอบถัดไป
      if (next.round % 3 === 0) {
        next.event = createRandomEvent(next);
        next.activePlayer = null;
        next.turnStartedAt = null;
        next.log = [...(next.log || []), `เกิดอีเวนต์: ${next.event.title}`].slice(-20);
        await saveRoom(next);
        return;
      }

      startTurn(next, next.roundStarter);
      next.log = [...(next.log || []), `เริ่มรอบ ${next.round}: สลับฝ่ายเริ่ม`].slice(-20);
      await saveRoom(next);
      return;
    }

    // อีกฝ่ายเล่นต่อ
    startTurn(next, enemy.id);

    await saveRoom(next);
    // ถ้าฝ่ายถัดไปหลับ render() จะเริ่มนับ 3 วินาที
    // แล้วบังคับจบเทิร์นผ่าน scheduleSleepingTurn()
  }

  function startTurn(room, playerId) {
    room.activePlayer = playerId;
    room.attacker = room.roundStarter;
    room.actionUsed = false;
    room.specialUsed = false;
    room.turnStartedAt = Date.now();
    room.turnId = (Number(room.turnId) || 0) + 1;
    room.drawnTurnId = room.turnId;

    // สถานะทำงานเมื่อเริ่มเทิร์นของเจ้าของสถานะ
    // สถานะที่เพิ่งถูกใช้ในเทิร์นก่อนหน้าจะยังไม่ลดจนกว่าจะถึงจบเทิร์นนี้
    const p = room.host?.id === playerId ? room.host : room.guest;
    if (p) {
      processStatusesAtStart(p);
      for (const st of (p.statuses || [])) st._startedTurnId = room.turnId;
    }

    drawForTurn(room, playerId);
  }

  function drawForTurn(room, playerId) {
    const p = room.host?.id === playerId ? room.host : room.guest;
    if (!p) return;
    if (!p.hand) p.hand = [];
    if (p.hand.length >= 60) return;
    const raw = CARDS[Math.floor(Math.random() * CARDS.length)];
    p.hand.push({name:raw[0], real:raw[1], ability:raw[2], organ:raw[3], type:"normal"});
    p.specialCard = room.attacker === playerId
      ? {name:"โจมตี", real:"สร้างความเสียหาย 10 หน่วย", ability:"โจมตีเป้าหมาย 10 HP", organ:"การ์ดพิเศษ", type:"attack"}
      : {name:"ป้องกัน", real:"ได้รับโล่ 5 หน่วย", ability:"ได้รับโล่ 5 หน่วย", organ:"การ์ดพิเศษ", type:"defense"};
  }

  const DEBUFF_STATUS_NAMES = new Set([
    "ดูดกลับน้ำ",
    "เพิ่มปริมาณน้ำ",
    "แคลเซียมสูง",
    "แคลเซียมต่ำ",
    "น้ำตาลสูง",
    "น้ำตาลต่ำ",
    "เครียด",
    "หลับ"
  ]);

  function processStatusesAtStart(p) {
    if (!p || !p.statuses) return;

    // ผลของสถานะต่อเนื่องเกิดตอนเริ่มเทิร์นของเจ้าของสถานะ
    for (const s of p.statuses) {
      if (s.name === "ดูดกลับน้ำ") p.water -= 10;
      if (s.name === "เพิ่มปริมาณน้ำ") p.water += 10;
      if (s.name === "แคลเซียมสูง") p.hp -= 10;
      if (s.name === "น้ำตาลสูง") { p.hp -= 5; p.water -= 15; }
      if (s.name === "น้ำตาลต่ำ") p.hp -= 10;
      if (s.name === "ฟื้นฟู") p.hp += 10;
    }

    // เครียด: ลด HP 5 ต่อจำนวนชนิดของดีบัพที่กำลังติดอยู่
    const debuffCount = (p.statuses || [])
      .filter(s => s.name !== "เครียด" && DEBUFF_STATUS_NAMES.has(s.name))
      .length;
    if (debuffCount > 0 && hasStatus(p, "เครียด")) {
      p.hp -= debuffCount * 5;
    }

    p.hp = Math.max(0, Math.min(100, p.hp));
    p.water = Math.max(0, Math.min(100, p.water));
  }

  function processStatusesAtEnd(p, turnId) {
    if (!p || !p.statuses) return;
    for (const s of p.statuses) {
      // เฉพาะสถานะที่มีอยู่ก่อนเริ่มเทิร์นนี้เท่านั้นที่นับถอยหลัง
      if (s._startedTurnId === turnId) s.turns -= 1;
      delete s._startedTurnId;
    }
    p.statuses = p.statuses.filter(s => s.turns > 0);
  }

  async function skipSleepingTurn() {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId) return;
    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const me = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;
      await finishTurn(next, me, enemy, null);
    } finally {
      state.busy = false;
      render();
    }
  }

  async function autoSkipSleeping(room) {
    if (!room || room.status !== "playing" || room.activePlayer === state.playerId) return;
    const sleeping = room.activePlayer === room.host?.id ? room.host : room.guest;
    const other = room.activePlayer === room.host?.id ? room.guest : room.host;
    if (!sleeping || !hasStatus(sleeping,"หลับ")) return;

    const next = structuredClone(room);
    await finishTurn(next, sleeping, other, null);
  }

  function showCardAnimation(card, playerName) {
    $("playCardName").textContent = `${playerName} ใช้ ${card.name}`;
    $("playCardAbility").textContent = card.ability;
    $("playCardOrgan").textContent = `สร้างจาก: ${card.organ}`;
    $("cardOverlay").classList.remove("hidden");
    return delay(900).then(() => $("cardOverlay").classList.add("hidden"));
  }

  function createRandomEvent(room) {
    const organs = [
      "ต่อมใต้สมองส่วนหน้า","ต่อมไทรอยด์","ต่อมหมวกไตส่วนนอก",
      "ต่อมหมวกไตส่วนใน","ตับอ่อน","ไฮโพทาลามัส","ต่อมใต้สมองส่วนหลัง",
      "รังไข่","อัณฑะ","ไต","กระเพาะอาหาร","ลำไส้เล็กส่วนต้น"
    ];
    const organ = organs[Math.floor(Math.random()*organs.length)];
    const boost = Math.random() < .5;
    return {
      organ,
      mode: boost ? "boost" : "stop",
      title: boost ? `⚡ ${organ} ทำงานเพิ่มขึ้น` : `⛔ ${organ} หยุดการทำงาน`,
      text: boost
        ? `ฮอร์โมนที่สร้างจาก ${organ} จะแสดงผล 2 เท่าในช่วงอีเวนต์นี้`
        : `ฮอร์โมนที่สร้างจาก ${organ} จะไม่สามารถใช้งานได้ในช่วงอีเวนต์นี้`,
      ack:[]
    };
  }

  function showEvent(ev) {
    $("eventIcon").textContent = ev.mode === "boost" ? "⚡" : "⛔";
    $("eventTitle").textContent = ev.title;
    $("eventText").textContent = ev.text;
    $("eventOverlay").classList.remove("hidden");
  }

  function isOrganBlocked(room, organ) {
    return room.event?.mode === "stop" && room.event.organ === organ;
  }

  function isOrganBoosted(room, organ) {
    return room.event?.mode === "boost" && room.event.organ === organ;
  }

  async function closeEvent() {
    if (!state.room?.event || state.busy) return;
    state.busy = true;
    try {
      const next = structuredClone(state.room);
      if (!next.event.ack) next.event.ack = [];
      if (!next.event.ack.includes(state.playerId)) next.event.ack.push(state.playerId);

      if (next.event.ack.length >= (state.mode === "bot" ? 1 : 2)) {
        const starter = next.roundStarter || next.host.id;
        next.event = null;
        startTurn(next, starter);
        next.log = [...(next.log || []), `อีเวนต์จบแล้ว เริ่มรอบ ${next.round}`].slice(-20);
      }
      await saveRoom(next);
    } finally {
      state.busy = false;
      render();
    }
  }

  function applyCard(card, me, enemy, room, isBoostPass=false) {
    const n = card.name.toLowerCase();
    if (room && !isBoostPass && isOrganBlocked(room, card.organ)) return;

    if (n.includes("prolactin")) me.hp += 10;
    else if (n.includes("endorphin")) me.hp += 5;
    else if (n === "hcg") me.hp += 10;
    else if (n === "epo") addStatus(me,"ฟื้นฟู",3);
    else if (n === "melatonin") addStatus(enemy,"หลับ",2);
    else if (n === "insulin") addStatus(enemy,"น้ำตาลต่ำ",3);
    else if (n === "glucagon") addStatus(enemy,"น้ำตาลสูง",3);
    else if (n === "pth") { removeStatus(me,"แคลเซียมต่ำ"); addStatus(enemy,"แคลเซียมสูง",3); }
    else if (n === "calcitonin") { removeStatus(me,"แคลเซียมสูง"); addStatus(enemy,"แคลเซียมต่ำ",3); }
    else if (n === "oxytocin") addStatus(me,"ลดความเสียหาย",3);
    else if (n.includes("thymosin")) { me.statuses=[]; addStatus(me,"ต้านดีบัพ",3); }
    else if (n.includes("secretin")) addStatus(me,"ลดความเสียหายจากดีบัพ",3);
    else if (n.includes("epinephrine")) dealDamage(enemy, 20 + Math.floor((100-enemy.hp)*.5), me);
    else if (n.includes("norepinephrine")) dealDamage(enemy, 10 + Math.floor(enemy.hp*.5), me);
    else if (n.includes("glucocorticoid")) dealDamage(enemy, 15, me);
    else if (n.includes("gastrin") || n.includes("cholecystokinin")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("testosterone")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("androgen")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("lh")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("fsh") || n.includes("estrogen") || n.includes("progesterone")) addStatus(me,"เพิ่มการฟื้นฟู",2);
    else if (n.includes("gh")) { addStatus(me,"เพิ่มความเสียหาย",2); addStatus(me,"เพิ่มการฟื้นฟู",2); }
    else if (n.includes("thyroxine")) { dealDamage(enemy, 10, me); addStatus(me,"เพิ่มความเสียหาย",2); }
    else if (n.includes("cortisol")) addStatus(enemy,"เครียด",2);
    else if (n.includes("adh")) addStatus(enemy,"ดูดกลับน้ำ",2);
    else if (n.includes("aldosterone")) addStatus(enemy,"เพิ่มปริมาณน้ำ",2);

    me.hp = Math.min(100, Math.max(0, me.hp));
    enemy.hp = Math.min(100, Math.max(0, enemy.hp));
  }

  function dealDamage(target, amount, attacker) {
    let damage = amount;
    if (hasStatus(attacker,"เพิ่มความเสียหาย")) damage *= 1.5;
    if (hasStatus(attacker,"แคลเซียมต่ำ")) damage *= .5;
    if (hasStatus(target,"ลดความเสียหาย")) damage *= .5;
    if (hasStatus(target,"ลดความเสียหายจากดีบัพ")) damage *= .5;
    damage = Math.round(damage);
    const shield = Math.min(target.shield || 0, damage);
    target.shield = Math.max(0, (target.shield || 0) - shield);
    target.hp -= (damage - shield);
  }

  function addStatus(p,name,turns) {
    const old = p.statuses.find(s => s.name === name);
    if (old) old.turns = Math.max(old.turns,turns);
    else p.statuses.push({name,turns});
  }

  function removeStatus(p,name) {
    p.statuses = p.statuses.filter(s => s.name !== name);
  }

  function hasStatus(p,name) {
    return (p.statuses || []).some(s => s.name === name);
  }

  function updateTimer() {
    if (!state.room || state.room.status !== "playing" || !state.room.activePlayer) {
      $("timer").textContent = "--";
      return;
    }
    // ใช้ turnStartedAt เดียวกันจาก game_state ให้ทั้ง 2 ฝั่งเห็นเวลาเดียวกัน
    const elapsed = Math.floor((Date.now() - (state.room.turnStartedAt || Date.now())) / 1000);
    const remaining = Math.max(0, 30 - elapsed);
    $("timer").textContent = remaining;
    if (remaining <= 0 && state.room.activePlayer === state.playerId) timeoutTurn();
  }

  function scheduleSleepingTurn(room) {
    if (!room || room.status !== "playing" || !room.activePlayer || !room.turnId) return;
    const active = room.activePlayer === room.host?.id ? room.host : room.guest;
    if (!active || !hasStatus(active, "หลับ")) {
      if (state.sleepSkipTimerId) {
        clearTimeout(state.sleepSkipTimerId);
        state.sleepSkipTimerId = null;
      }
      return;
    }

    const turnId = room.turnId;
    if (state.sleepSkipTimerId) return;

    // ให้ผู้เล่นที่หลับค้างอยู่ 3 วินาที แล้วจบเทิร์นอัตโนมัติ
    state.sleepSkipTimerId = setTimeout(async () => {
      state.sleepSkipTimerId = null;
      if (!state.room || state.room.turnId !== turnId || state.room.activePlayer !== room.activePlayer) return;
      const current = state.room.activePlayer === state.playerId ? getMe() : getEnemy();
      if (!current || !hasStatus(current, "หลับ")) return;

      if (state.room.activePlayer === state.playerId) {
        await skipSleepingTurn();
      } else {
        await autoSkipSleeping(state.room);
      }
    }, 3000);
  }

  async function timeoutTurn() {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId) return;
    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const me = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;
      next.log = [...(next.log || []), "หมดเวลา ข้ามเทิร์น"].slice(-20);
      await finishTurn(next, me, enemy, null);
    } finally {
      state.busy = false;
      render();
    }
  }

  function showEnd() {
    $("game").classList.add("hidden");
    $("end").classList.remove("hidden");
    const me = getMe();
    const enemy = getEnemy();
    const win = me && me.hp > 0 && (enemy.hp <= 0 || me.hp > enemy.hp);
    const lose = me && me.hp <= 0;
    $("endIcon").textContent = win ? "🏆" : "💀";
    $("endTitle").textContent = win ? "คุณชนะ!" : "คุณแพ้!";
    $("endText").textContent = win
      ? "ยินดีด้วย คุณเอาชนะคู่ต่อสู้ได้"
      : "HP ของคุณหมดลง เกมจบแล้ว";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  $("createBtn").addEventListener("click", createRoom);
  $("joinBtn").addEventListener("click", joinRoom);
  $("botBtn").addEventListener("click", startBotGame);
  $("onlineBtn").addEventListener("click", () => { $("onlineLobby").classList.remove("hidden"); });
  $("roomCodeInput").addEventListener("keydown", e => {
    if (e.key === "Enter") joinRoom();
  });
  $("guideBtn").addEventListener("click", () => $("guideOverlay").classList.remove("hidden"));
  $("closeGuideBtn").addEventListener("click", () => $("guideOverlay").classList.add("hidden"));
  $("backLobbyBtn").addEventListener("click", () => location.reload());
  $("closeEventBtn").addEventListener("click", closeEvent);
  $("myStatusDetailsBtn").addEventListener("click", () =>
    openStatusDetails(getMe(), "บัฟและดีบัฟของคุณ", true)
  );
  $("enemyStatusDetailsBtn").addEventListener("click", () =>
    openStatusDetails(getEnemy(), "บัฟและดีบัฟของคู่ต่อสู้", false)
  );
  $("closeStatusBtn").addEventListener("click", closeStatusDetails);
  $("endTurnBtn").addEventListener("click", endCurrentTurn);
  $("statusOverlay").addEventListener("click", e => {
    if (e.target.id === "statusOverlay") closeStatusDetails();
  });

  setInterval(() => {
    if (state.room) updateTimer();
  }, 1000);
})();
