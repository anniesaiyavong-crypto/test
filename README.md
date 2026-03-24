# SS - Social POD Platform (Ecosystem)

ยินดีต้อนรับสู่โปรเจกต์ SS แพลตฟอร์ม Social Print-on-Demand (POD) ที่ออกแบบมาเพื่อรองรับผู้ใช้งานและนักสร้างสรรค์ในภูมิภาคเอเชียตะวันออกเฉียงใต้ โดยเฉพาะลาว ไทย และอังกฤษ

## 🛠️ Tech Stack

### Frontend & App Framework
- **Next.js 15 (App Router)**: เฟรมเวิร์กหลักสำหรับหน้าเว็บ (Client Application)
- **TypeScript**: เพื่อความปลอดภัยของประเภทข้อมูลและความแม่นยำในการพัฒนา
- **Tailwind CSS**: สำหรับการออกแบบ UI ที่ยืดหยุ่นและตอบสนองได้ทุกหน้าจอ
- **next-intl**: ระบบจัดการภาษา (Internationalization) รองรับภาษาอังกฤษ (en), ไทย (th), และลาว (lo)
- **Fabric.js**: สำหรับเครื่องมือ Designer Canvas Editor
- **Framer Motion**: สำหรับเอนิเมชันที่ลื่นไหล
- **Lucide React**: ชุดไอคอนที่สวยงามและน้ำหนักเบา

### Monorepo Structure
- **npm Workspaces**: จัดการหลายโปรเจกต์ภายใต้ Root เดียวกัน

## 📁 โครงสร้างโปรเจกต์ (Folder Structure)

โปรเจกต์นี้ใช้โครงสร้างแบบ **Feature-First** เพื่อความง่ายในการขยายระบบ (Scalability):

```text
/
├── apps/
│   └── client/               # แอปพลิเคชันหลัก (Next.js)
│       ├── messages/         # ไฟล์แปลภาษา (.json)
│       ├── public/           # ไฟล์สติกเกอร์และ Mockup ต่างๆ
│       └── src/
│           ├── app/          # App Router (i18n Routing)
│           ├── components/   # UI Components ส่วนกลาง
│           ├── features/     # หัวใจสำคัญ แยกตามฟีเจอร์ (Feature-First)
│           │   ├── auth/     # ระบบเข้าสู่ระบบ
│           │   ├── designer/ # เครื่องมือออกแบบ Canvas
│           │   ├── feed/     # ระบบฟีดสินค้า
│           │   └── ...
│           ├── i18n/         # การตั้งค่าภาษา
│           └── lib/          # ยูทิลิตี้และ Mock Data
├── packages/                 # แพ็กเกจที่ใช้ร่วมกัน
│   └── types/                # Shared TypeScript Definitions
└── README.md                 # เอกสารแนะนำโปรเจกต์
```

## 🔄 การไหลของข้อมูล (Data Flow)

1.  **I18n Middleware**: เมื่อผู้ใช้เข้าชมระบบ Middleware จะทำการตรวจสอบภาษาจาก URL (เช่น `/th`, `/lo`) และโหลดข้อความที่เหมาะสมจากไฟล์ใน `messages/`.
2.  **Edge API Routes**: ระบบ Sticker และฟีเจอร์เบื้องหลังถูกตั้งค่าให้รันบน Cloudflare Edge Runtime เพื่อความเร็วสูงสุดและตอบสนองได้ทั่วโลก.
3.  **Feature Components**: แต่ละฟีเจอร์ใน `features/` จะจัดการสถานะ (State) และตรรกะ (Logic) ของตัวเอง แยกออกจากกันอย่างชัดเจน.
4.  **Designer Engine**: ใช้ Fabric.js ในการประมวลผลการออกแบบบนเครื่องของผู้ใช้ (Client-side) และจัดการองค์ประกอบสติกเกอร์ผ่าน API ภายใน.

## 🚀 การ Deploy บน Cloudflare

โปรเจกต์นี้ได้รับการตั้งค่าให้ทำงานบน Cloudflare Pages อย่างสมบูรณ์ผ่าน `@cloudflare/next-on-pages`:

### การตั้งค่าใน Dashboard:
- **Framework Preset**: `Next.js`
- **Root Directory**: `apps/client`
- **Build Command**: `npm run build && npx @cloudflare/next-on-pages`
- **Build Output Directory**: `.vercel/output/static`
- **Compatibility Flags**: ต้องเพิ่ม `nodejs_compat` ในส่วนของ **Settings > Functions** เพื่อรองรับ Next.js Edge Runtime

### การตั้งค่าทางเทคนิคที่สำคัญ:
- **Edge Runtime**: ทุก Route ถูกตั้งค่าเป็น `export const runtime = 'edge'`
- **Version Locking**: ล็อคเวอร์ชัน Next.js (15.4.11) เพื่อความเสถียรบนระบบ Workers
- **No Static Params**: ใช้ Dynamic Routing สำหรับ i18n เพื่อความยืดหยุ่นบน Edge

---
สร้างและดูแลโดย Gemini CLI 🚀
