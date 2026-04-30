# Goceng Frontend

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Goceng** adalah platform asisten finansial cerdas yang membantu pengguna mencatat dan mengelola keuangan pribadi. Menggunakan teknologi **Chatbot AI**, pengguna cukup mengetikkan pengeluaran atau pemasukan mereka layaknya sedang mengobrol, dan sistem akan mencatatnya secara otomatis.

## Fitur Utama

- **Authentication System:** Dilengkapi dengan `ProtectedRoute` dan `AuthContext` untuk keamanan akses halaman.
- **AI Chat Integration:** Antarmuka percakapan interaktif (halaman `Chat.tsx`).
- **Multi-language Support:** Mendukung perpindahan bahasa melalui `LanguageContext`.
- **Reporting & Dashboard:** Visualisasi data dan manajemen laporan yang terorganisir.
- **Responsive Layout:** Desain adaptif menggunakan Tailwind CSS untuk berbagai ukuran layar.

## Tech Stack

- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS & Lucide Icons
- **State Management:** React Context API (Auth & Language)
- **Networking:** Axios / Fetch API (terkonfigurasi di `lib/api.ts`)

##  Struktur Proyek

Sesuai dengan struktur folder terbaru:

```text
src/
├── components/
│   ├── ui/               
│   ├── Layout.tsx        
│   ├── Navbar.tsx        
│   └── ProtectedRoute.tsx 
├── contexts/
│   ├── AuthContext.tsx    
│   └── LanguageContext.tsx # Manajemen lokalisasi/bahasa
├── lib/
│   ├── api.ts            
│   └── utils.ts          
├── pages/
│   ├── Chat.tsx          
│   ├── Dashboard.tsx    
│   ├── Landing.tsx    
│   ├── Login.tsx      
│   └── Report.tsx      
├── App.tsx             
└── main.tsx
```

## Cara Menjalankan

### 1. Clone Repositori
```bash
git clone https://github.com/dianggraaeni/goceng-frontend.git
cd goceng-frontend
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Mode Pengembangan
```bash
npm run dev
```
Setelah dijalankan, buka [http://localhost:5173](http://localhost:5173) di browser.

### 4. Build untuk Produksi
```bash
npm run build
```
Hasil build akan tersimpan di dalam folder `dist/`.
