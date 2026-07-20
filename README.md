# Hormone Duel Online - New

## 1. Supabase
สร้างตาราง `rooms` ถ้ายังไม่มี:

```sql
create table if not exists public.rooms (
  id text primary key,
  game_state jsonb not null,
  created_at timestamptz default now()
);
```

ตั้งค่า RLS และ policy:

```sql
alter table public.rooms enable row level security;

drop policy if exists "Anyone can read rooms" on public.rooms;
drop policy if exists "Anyone can create rooms" on public.rooms;
drop policy if exists "Anyone can update rooms" on public.rooms;

create policy "Anyone can read rooms"
on public.rooms for select using (true);

create policy "Anyone can create rooms"
on public.rooms for insert with check (true);

create policy "Anyone can update rooms"
on public.rooms for update using (true) with check (true);
```

เปิด Realtime ให้ `rooms` จาก Dashboard:
Database → Publications → supabase_realtime → เพิ่ม rooms

ถ้าขึ้นว่า `rooms is already member of publication` แปลว่าเปิดไว้แล้ว ไม่ต้องทำอะไร

## 2. Deploy
เป็น Static HTML สามารถอัปโหลดทั้งโฟลเดอร์ขึ้น GitHub Pages ได้

โครงสร้างต้องเป็น:

index.html
game.js
style.css

## 3. ถ้ากดสร้างห้องไม่ได้
เปิด F12 → Console ตรวจ error

## 4. สำคัญ
คีย์ใน game.js เป็น publishable/anon key เท่านั้น
ห้ามใส่ service_role key
