# NanuuzyStore Official - Platform Jual Beli Followers

Platform reseller terpercaya untuk jual beli followers semua sosial media. Instagram, TikTok, Twitter, YouTube dan lainnya.

## 🚀 Fitur Utama

### 🎨 Tampilan & UI/UX
- **Tema Hitam**: Background hitam (#000000) yang elegan
- **Font Biru**: Warna font utama biru (#1E90FF)
- **Dark/Light Mode**: Toggle otomatis antara mode gelap dan terang
- **Tombol 3D**: Tombol interaktif dengan efek 3D keren
- **Responsif**: Optimal di desktop dan mobile
- **Animasi**: Animasi ringan dan interaktif

### 👤 Sistem Login
- **Login User**: Email dan password standar
- **Google OAuth**: Login dengan akun Google
- **Dashboard User**: Lihat riwayat order dan status
- **Login Admin**: Akses khusus untuk monitoring

### 📦 Sistem Order & Reseller
- **Multi Platform**: Instagram, TikTok, YouTube, Twitter, Facebook
- **Paket Lengkap**: Berbagai pilihan jumlah followers
- **Sistem Reseller**: Siap diintegrasikan dengan web lain
- **Status Order**: Tracking real-time status order
- **WhatsApp Integration**: Kontak langsung dengan admin

### 🛠️ Fitur Admin
- **Monitoring**: Pantau semua client dan order
- **Management**: Tambah, edit, hapus order
- **User Management**: Kelola semua user terdaftar
- **Package Management**: Atur paket followers
- **Analytics**: Statistik lengkap pendapatan dan order

## 📋 Instalasi & Setup

### Prerequisites
- Node.js 18+
- npm atau yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd nanuuzystore-official
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy file `.env.example` ke `.env` dan konfigurasi:
```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Setup Database
```bash
npm run db:push
```

### 5. Seed Default Data
```bash
npx tsx seed-packages.ts
npx tsx create-admin.ts
```

### 6. Jalankan Development Server
```bash
npm run dev
```

## 🏗️ Struktur Database

### Users
- id, email, name, role, password, googleId, avatar, phone
- Role: USER, ADMIN

### Orders
- id, userId, packageId, packageName, platform
- targetUrl, targetUsername, quantity, price, status
- resellerApiUrl, resellerOrderId, notes, timestamps

### Packages
- id, name, platform, quantity, price, description
- isActive, timestamps

## 🔐 Login Credentials

### Admin Default
- **Email**: admin@nanuuzystore.com
- **Password**: admin123

### User Registration
- Register via halaman `/register`
- Login dengan email atau Google OAuth

## 📱 Kontak & Support

- **WhatsApp**: 0831-7677-1027
- **Jam Operasional**: 09:00 - 22:00 WIB
- **Pembayaran**: Transfer Bank, E-Wallet

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js handlers

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Admin
- `GET /api/admin/orders` - Get all orders (admin only)
- `PATCH /api/admin/orders/[id]` - Update order status
- `GET /api/admin/users` - Get all users (admin only)

### Packages
- `GET /api/packages` - Get available packages
- `POST /api/packages` - Create package (admin only)

## 🎨 Komponen UI

### Custom Classes
- `.btn-3d` - Efek 3D untuk tombol
- `.card-3d` - Efek 3D untuk cards
- `.glow-blue` - Efek glow biru
- `.fade-in` - Animasi fade in
- `.slide-in-left` - Animasi slide dari kiri
- `.bounce-in` - Animasi bounce

### Color Scheme
- **Primary**: #1E90FF (Blue)
- **Background**: #000000 (Black)
- **Card**: #1a1a1a (Dark Gray)
- **Text**: #ffffff (White)
- **Muted**: #87CEEB (Light Blue)

## 🔄 Workflow Order

1. **User Login** → Dashboard
2. **Pilih Platform** → Pilih Paket
3. **Input Target** → Konfirmasi Order
4. **Admin Process** → Update Status
5. **Order Complete** → Notifikasi User

## 📊 Status Order

- **PENDING**: Menunggu proses
- **PROCESSING**: Sedang diproses
- **COMPLETED**: Selesai
- **FAILED**: Gagal
- **CANCELLED**: Dibatalkan

## 🔧 Integrasi Reseller

Web ini siap diintegrasikan dengan:
- API reseller followers
- Web penyedia layanan followers
- Sistem pembayaran otomatis
- Notifikasi WhatsApp

## 📝 Catatan Penting

- Akun target tidak boleh private
- Username harus benar dan valid
- Proses biasanya 1-24 jam
- Garansi penggantian jika drop
- Support via WhatsApp 24/7

## 🚀 Deployment

### Build untuk Production
```bash
npm run build
npm start
```

### Environment Variables Production
- Set NEXTAUTH_SECRET yang kuat
- Konfigurasi database production
- Setup Google OAuth credentials
- Konfigurasi domain untuk NextAuth

## 📄 License

MIT License - NanuuzyStore Official

---

📞 **Butuh Bantuan? Hubungi Admin via WhatsApp: 0831-7677-1027**