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
    channel: null,
    room: null,
    timerId: null,
    seconds: 30,
    busy: false
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
    ["Debuff: หลับ","ไม่สามารถเล่นการ์ดได้","จบเทิร์นทันที 2 เทิร์น","สถานะ"],
    ["Debuff: ดูดกลับน้ำ","ลดน้ำ 10 หน่วย 3 เทิร์น","ลดน้ำต่อเนื่อง","สถานะ"],
    ["Debuff: เพิ่มปริมาณน้ำ","เพิ่มน้ำ 10 หน่วย 3 เทิร์น","เพิ่มน้ำต่อเนื่อง","สถานะ"],
    ["Debuff: แคลเซียมสูง","ลด HP 10 หน่วย 3 เทิร์น","ลด HP ต่อเนื่อง","สถานะ"],
    ["Debuff: แคลเซียมต่ำ","ความเสียหายที่ทำลดลง 50% 3 เทิร์น","ลดความเสียหาย","สถานะ"],
    ["Debuff: น้ำตาลสูง","ลด HP 5 และน้ำ 15 หน่วย 3 เทิร์น","ลด HP และน้ำ","สถานะ"],
    ["Debuff: น้ำตาลต่ำ","ลด HP 10 และความเสียหาย 50%","ลด HP และความเสียหาย","สถานะ"]
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
    activePlayer:null,
    turnStartedAt:null,
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

    $("round").textContent = r.round;
    $("lastCard").textContent = r.lastCard ? `${r.lastCard.playerName} ใช้ ${r.lastCard.name}\n${r.lastCard.ability}` : "ยังไม่มีการ์ดที่ใช้";
    $("handHint").textContent = r.activePlayer === state.playerId ? "ถึงตาคุณ" : "รอคู่ต่อสู้เล่น";

    const canPlay = r.activePlayer === state.playerId && !state.busy && !hasStatus(me,"หลับ");
    renderHand(me.hand || [], canPlay);
    updateTimer();
  }

  function updatePlayer(prefix, p) {
    const hp = Math.max(0, Math.min(100, p.hp || 0));
    const water = Math.max(0, Math.min(100, p.water || 0));
    $(`${prefix}Hp`).textContent = hp;
    $(`${prefix}HpBar`).style.width = hp + "%";
    $(`${prefix}Water`).textContent = water;
    $(`${prefix}WaterBar`).style.width = water + "%";
    $(`${prefix}Statuses`).innerHTML = (p.statuses || []).map(s => `<span class="status">${s.name} ${s.turns ? `(${s.turns})` : ""}</span>`).join("") || `<span class="status">ปกติ</span>`;
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
      room.activePlayer = Math.random() < .5 ? room.host.id : state.playerId;
      room.turnStartedAt = Date.now();
      room.log = [...(room.log || []), "ผู้เล่นครบ 2 คน เกมเริ่มแล้ว"];

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
    const {error} = await db.from("rooms")
      .update({game_state:next})
      .eq("room_code", state.roomCode);
    if (error) throw error;
    state.room = next;
    render();
  }

  async function playCard(index) {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId) return;
    const me = getMe();
    if (!me || hasStatus(me,"หลับ")) return;

    const card = me.hand[index];
    if (!card) return;

    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const player = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;

      player.hand.splice(index,1);
      applyCard(card, player, enemy);

      next.lastCard = {
        name:card.name,
        ability:card.ability,
        playerName:state.role === "host" ? "คุณ" : "คู่ต่อสู้"
      };
      next.log = [...(next.log || []), `${card.name}: ${card.ability}`].slice(-20);

      // ฝ่ายที่เล่นก่อนส่งต่อให้อีกฝ่ายเล่น
      next.activePlayer = enemy.id;
      next.turnStartedAt = Date.now();

      await saveRoom(next);
      await delay(900);

      if (enemy.hp <= 0 || player.hp <= 0) {
        next.status = "finished";
        await saveRoom(next);
      }
    } catch(e) {
      console.error(e);
      setMessage("ใช้การ์ดไม่สำเร็จ: " + e.message, true);
    } finally {
      state.busy = false;
      render();
    }
  }

  function applyCard(card, me, enemy) {
    const n = card.name.toLowerCase();

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
    else if (n.includes("epinephrine")) enemy.hp -= 20 + Math.floor((100-enemy.hp)*.5);
    else if (n.includes("norepinephrine")) enemy.hp -= 10 + Math.floor(enemy.hp*.5);
    else if (n.includes("glucocorticoid")) enemy.hp -= 15;
    else if (n.includes("gastrin") || n.includes("cholecystokinin")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("testosterone")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("androgen")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("lh")) addStatus(me,"เพิ่มความเสียหาย",2);
    else if (n.includes("fsh") || n.includes("estrogen") || n.includes("progesterone")) addStatus(me,"เพิ่มการฟื้นฟู",2);
    else if (n.includes("gh")) { addStatus(me,"เพิ่มความเสียหาย",2); addStatus(me,"เพิ่มการฟื้นฟู",2); }
    else if (n.includes("thyroxine")) { enemy.hp -= 10; addStatus(me,"เพิ่มความเสียหาย",2); }
    else if (n.includes("cortisol")) addStatus(enemy,"เครียด",2);
    else if (n.includes("adh")) addStatus(enemy,"ดูดกลับน้ำ",2);
    else if (n.includes("aldosterone")) addStatus(enemy,"เพิ่มปริมาณน้ำ",2);

    me.hp = Math.min(100, Math.max(0, me.hp));
    enemy.hp = Math.min(100, Math.max(0, enemy.hp));
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
    if (!state.room || state.room.status !== "playing") {
      $("timer").textContent = "--";
      return;
    }
    if (state.room.activePlayer !== state.playerId) {
      $("timer").textContent = "--";
      return;
    }
    const elapsed = Math.floor((Date.now() - (state.room.turnStartedAt || Date.now())) / 1000);
    const remaining = Math.max(0,30-elapsed);
    $("timer").textContent = remaining;
    if (remaining <= 0) timeoutTurn();
  }

  async function timeoutTurn() {
    if (state.busy || !state.room || state.room.activePlayer !== state.playerId) return;
    state.busy = true;
    try {
      const next = structuredClone(state.room);
      const me = state.role === "host" ? next.host : next.guest;
      const enemy = state.role === "host" ? next.guest : next.host;
      next.activePlayer = enemy.id;
      next.turnStartedAt = Date.now();
      next.log = [...(next.log || []), "หมดเวลา ข้ามเทิร์น"].slice(-20);
      await saveRoom(next);
    } finally {
      state.busy = false;
    }
  }

  function showEnd() {
    $("game").classList.add("hidden");
    $("end").classList.remove("hidden");
    const me = getMe();
    const enemy = getEnemy();
    const win = me && enemy && me.hp > enemy.hp;
    $("endIcon").textContent = win ? "🏆" : "💥";
    $("endTitle").textContent = win ? "คุณชนะ!" : "จบเกม";
    $("endText").textContent = win ? "ยินดีด้วย คุณเอาชนะคู่ต่อสู้ได้" : "เกมจบแล้ว";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  $("createBtn").addEventListener("click", createRoom);
  $("joinBtn").addEventListener("click", joinRoom);
  $("roomCodeInput").addEventListener("keydown", e => {
    if (e.key === "Enter") joinRoom();
  });
  $("guideBtn").addEventListener("click", () => $("guideOverlay").classList.remove("hidden"));
  $("closeGuideBtn").addEventListener("click", () => $("guideOverlay").classList.add("hidden"));
  $("backLobbyBtn").addEventListener("click", () => location.reload());

  setInterval(() => {
    if (state.room) updateTimer();
  }, 1000);
})();
