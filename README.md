# Portofolio — Ahmadin Umair

Website portofolio pribadi **Ahmadin Umair**, mahasiswa Program Studi **Teknologi Rekayasa Perangkat Lunak (TRPL)** di **Politeknik IDN Bogor**. Dirancang dengan konsep editorial modern berbasis *scroll-driven motion graphics*, menggabungkan kontras warna terang (`#F6F6F7`), obsidian gelap (`#08080B` / `#111113`), dan aksen merah crimson (`#E50914` / `#DC2626`).

---

## Fitur Utama

- **Navbar Adaptif & Indikator Scroll**  
  Bar navigasi tetap di bagian atas yang menyesuaikan tema (terang/gelap) secara otomatis sesuai posisi *scroll*, dilengkapi garis progres *scroll* dan navigasi responsif untuk perangkat mobile.
- **Hero Section Sinematik (2 Beat)**  
  Transisi *scroll-linked* dari kanvas terang ke panggung gelap dengan lingkaran fokus merah yang mengembang, tipografi besar berlapis, serta potret *foreground* dengan efek paralaks.
- **Marquee Divider**  
  Pita teks diagonal berjalan yang menghubungkan bagian pembuka menuju daftar keahlian.
- **Skills & Education Showcase**  
  Menampilkan tiga lingkaran fokus utama (**Major: TRPL**, **Skills**, **Stage: Beginner**) yang bergerak menyatu saat di-*scroll*, serta katalog **Tools & Technologies** dengan filter kategori (`All`, `Frontend`, `Backend & Database`, `Tools`).
- **Interactive Projects Showcase (`Projects by Umair`)**  
  - **Transisi Shutter 5-Bilah**: Mengklik menu `Projects` di *navbar* memicu animasi tirai 5 bilah vertikal merah-obsidian sebelum berpindah ke panggung proyek.
  - **Vertical Strips View**: Menampilkan 5 proyek dalam bilah vertikal beranimasi *drop-in* bertahap yang menyala saat di-*hover* dan dapat difilter berdasarkan kategori (`All`, `Web App`, `Landing Page`, `Dashboard UI`).
  - **Widescreen Spotlight Hero**: Mengklik salah satu proyek akan memperluas bilah menjadi tampilan layar penuh beserta ringkasan, navigasi antar layar, dan tombol aksi sirkular (`Gallery →` dan `Inspect Screens +`).
  - **Parallax `Gallery` Khusus Proyek**: Hanya terbuka saat proyek dipilih, menampilkan tata letak galeri multi-kedalaman dengan 4 kecepatan paralaks berbeda saat di-*scroll*.
  - **Lightbox Multi-Layar**: Penampil gambar resolusi penuh dengan dukungan navigasi keyboard (`ArrowLeft`, `ArrowRight`, `Escape`) dan *thumbnail switcher*.
- **Transisi Masuk & Keluar Dua Arah (*Bidirectional Scroll Motion*)**  
  Seluruh bagian utama (`Skills`, `Projects`, dan `Contact`) memiliki animasi masuk dan keluar yang responsif mengikuti arah *scroll* pengguna serta menghormati preferensi aksesibilitas `prefers-reduced-motion`.
- **Contact & Footer**  
  Dilengkapi tautan langsung ke **GitHub**, **LinkedIn**, **Instagram**, **WhatsApp**, **Email**, serta formulir catatan cepat.

---

## Daftar Proyek yang Ditampilkan

1. **NusantaraMart** *(Web App)*  
   Aplikasi web e-commerce gadget & lifestyle berbasis Golang dan React dengan katalog produk, kode voucher diskon, dan riwayat pesanan.
2. **ahmadinumair.id** *(Landing Page)*  
   Landing page platform edukasi pemrograman bernuansa *dark mode* dan aksen piksel retro, mencakup katalog kursus Bootstrap, Tailwind CSS, dan Laravel.
3. **Pesantren Darul Ilmi** *(Dashboard UI)*  
   Desain antarmuka dashboard manajemen tahfidz untuk memantau perkembangan hafalan santri, grafik tren 30 hari, laporan bulanan, dan formulir setoran.
4. **Smart Campus** *(Dashboard UI)*  
   Konsep dashboard akademik *dark theme* bagi mahasiswa untuk mengelola prioritas tugas, beban belajar mingguan, dan peringatan dini tenggat waktu.
5. **UMAIR Cafe & Roastery** *(Landing Page)*  
   Konsep website kafe dan roastery bergaya editorial hangat dengan menu unggulan, filter kategori hidangan, dan formulir reservasi meja.

---

## Teknologi yang Digunakan

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Animasi & Motion Graphics**: Motion (`motion/react`)
- **Ikon**: Lucide React (`lucide-react`)

---

## Struktur Direktori

```text
.
├── public/
│   └── assets/                  # Aset gambar proyek, foto profil, dan ikon teknologi
├── src/
│   ├── components/
│   │   ├── ContactSection.tsx           # Bagian kontak & formulir pesan
│   │   ├── HeroSection.tsx              # Hero 2-beat dengan transisi lingkaran merah
│   │   ├── MarqueeDivider.tsx           # Pita pembatas bergerak
│   │   ├── Navbar.tsx                   # Navigasi atas responsif & indikator scroll
│   │   ├── ProjectTransitionOverlay.tsx # Tirai transisi 5-bilah menuju Projects
│   │   ├── ProjectsSection.tsx          # Stage proyek, widescreen hero, gallery & lightbox
│   │   └── SkillsSection.tsx            # Lingkaran fokus & daftar keahlian teknis
│   ├── data/
│   │   └── portfolioData.ts             # Data profil, skill, proyek, galeri, dan kontak
│   ├── App.tsx                  # Komposisi halaman utama & sinkronisasi tema navbar
│   ├── index.css                # Konfigurasi gaya global & Tailwind CSS
│   └── main.tsx                 # Entry point React
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Cara Menjalankan di Lokal

Pastikan **Node.js** sudah terpasang di perangkat Anda.

1. **Instalasi dependensi**
   ```bash
   npm install
   ```

2. **Jalankan server pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan secara default di `http://localhost:3000`.

3. **Build untuk produksi**
   ```bash
   npm run build
   ```

4. **Pemeriksaan tipe TypeScript**
   ```bash
   npm run lint
   ```

---

## Kontak

- **Nama**: Ahmadin Umair
- **Institusi**: Politeknik IDN Bogor — Teknologi Rekayasa Perangkat Lunak (TRPL)
- **Email**: [umairpasomal@gmail.com](mailto:umairpasomal@gmail.com)
- **WhatsApp**: [+62 812-8360-8347](https://wa.me/6281283608347)
- **GitHub**: [github.com/ahmadinumair](https://github.com/ahmadinumair)
- **LinkedIn**: [Ahmadin Umair Pasomal Rambe](https://www.linkedin.com/in/ahmadin-umair-pasomal-rambe-75a731427)
- **Instagram**: [@ahd.umr](https://www.instagram.com/ahd.umr?lqvp=MW93dWcwY29nNGtvcw==)
