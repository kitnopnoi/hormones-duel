# Hormone Duel Online v7

เกม Hormone Duel แบบออนไลน์ 2 คนผ่าน Supabase Realtime

## ระบบใหม่
- สร้างห้อง / เข้าร่วมห้องด้วยรหัส 6 ตัว
- เล่น 2 คนผ่านอินเทอร์เน็ต
- ฝ่ายเริ่มก่อนเล่นก่อน และอีกฝ่ายยังเล่นไม่ได้จนกว่าจะจบเทิร์น
- ถ้าติดสถานะหลับ จะจบเทิร์นทันที
- มีตัวจับเวลา 30 วินาทีต่อเทิร์น
- ถ้าหมดเวลา จะข้ามเทิร์นทันที
- จั่วการ์ด 1 ใบทุกต้นรอบ
- ทุก 3 รอบมีอีเวนต์อวัยวะ

## ตั้งค่า Supabase
1. สร้างโปรเจกต์ใน Supabase
2. สร้างตาราง `rooms` ด้วย SQL:

```sql
create table rooms (
  id text primary key,
  game_state jsonb not null,
  created_at timestamptz default now()
);

alter table rooms enable row level security;

create policy "Anyone can read rooms"
on rooms for select using (true);

create policy "Anyone can create rooms"
on rooms for insert with check (true);

create policy "Anyone can update rooms"
on rooms for update using (true);
```

3. เปิด Realtime ให้ตาราง `rooms`
4. เปิด `game.js` แล้วแทนที่:

```js
const SUPABASE_URL='YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY='YOUR_SUPABASE_ANON_KEY';
```

ด้วย Project URL และ Publishable/anon key ของ Supabase

## อัปโหลดออนไลน์
ไฟล์นี้เป็น Static Web App จึงสามารถอัปโหลดขึ้น GitHub Pages ได้ เมื่ออัปโหลดแล้วคอมของคุณไม่ต้องเปิดค้างไว้ ผู้เล่นทั้งสองคนเปิดลิงก์เดียวกันแล้วใช้รหัสห้องเดียวกันได้
