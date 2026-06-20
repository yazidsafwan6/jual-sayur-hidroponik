# Jual Sayur Hidroponik - React Practice

Base latihan React untuk memecah aplikasi HTML menjadi komponen, state, data, dan utility kecil.

## Jalankan

```bash
npm install
npm run dev
```

## Convex

Project ini sudah disiapkan untuk Convex Cloud.

```bash
npm run convex:dev
```

Untuk deploy lokal/frontend-only di Vercel, project memakai build command:

```bash
npm run build
```

Setelah punya production deploy key Convex Cloud, build bisa diganti menjadi:

```bash
npm run vercel-build
```

Build tersebut menjalankan `convex deploy` lebih dulu, lalu meng-inject `VITE_CONVEX_URL` ke Vite build.

Env yang dibutuhkan untuk deploy:

- `CONVEX_DEPLOY_KEY`
- `VERCEL_TOKEN`
- `GITHUB_TOKEN`

## Struktur

- `src/App.jsx` - komponen utama, filter produk, dan state keranjang.
- `src/components/` - komponen UI yang bisa dipraktikkan satu per satu.
- `src/data/products.js` - data contoh produk.
- `src/utils/currency.js` - helper format Rupiah.
- `convex/` - schema dan function backend Convex.
- `vercel.json` - konfigurasi Vercel untuk Vite + Convex.
- `legacy-index.html` - file HTML lama sebagai referensi.

## Ide latihan

1. Tambahkan kategori filter.
2. Batasi jumlah item sesuai stok.
3. Simpan keranjang ke `localStorage`.
4. Buat form checkout WhatsApp.
5. Pisahkan logic keranjang menjadi custom hook `useCart`.
