# Hormone Duel Online v7 — REAL ONLINE 2 PLAYER

เวอร์ชันออนไลน์ 2 คนด้วย Supabase Realtime

## ระบบ
- สร้างห้อง / เข้าห้องด้วยรหัส 6 ตัว
- เล่น 2 คนคนละเครื่องผ่านอินเทอร์เน็ต
- ผู้เล่นที่เริ่มก่อนเล่นก่อน อีกฝ่ายกดการ์ดไม่ได้
- Timer 30 วินาทีต่อเทิร์น หมดเวลาแล้วข้ามเทิร์น
- ติดสถานะหลับ = จบเทิร์นทันที
- การ์ดแสดงความสามารถเฉพาะช่วงการ์ดกำลังถูกประมวลผล
- ทุก 3 รอบมีอีเวนต์อวัยวะ
- ใช้ Supabase Realtime เป็นตัวกลาง

## SQL สำหรับ Supabase
```sql
create table if not exists public.rooms (
  id text primary key,
  host_id text not null,
  guest_id text,
  game_state jsonb not null,
  created_at timestamptz default now()
);

alter table public.rooms enable row level security;

create policy "rooms_select" on public.rooms for select using (true);
create policy "rooms_insert" on public.rooms for insert with check (true);
create policy "rooms_update" on public.rooms for update using (true) with check (true);

alter table public.rooms replica identity full;
alter publication supabase_realtime add table public.rooms;
```

ถ้าเจอว่า policy หรือ table มีอยู่แล้ว ให้ข้ามคำสั่งนั้น และถ้าตารางอยู่ใน Realtime แล้วไม่ต้องเพิ่มซ้ำ

## Deploy
อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ขึ้น GitHub Pages หรือ static hosting ใดก็ได้ แล้วเปิดลิงก์จากคนละเครื่องได้เลย ไม่ต้องเปิดคอมเจ้าของไว้
