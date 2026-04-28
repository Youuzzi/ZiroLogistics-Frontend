# ZiroLogistics – Frontend Interface 🖥️🚀

> **Repository:** [github.com/Youuzzi/ZiroLogistics-Frontend](https://github.com/Youuzzi/ZiroLogistics-Frontend)
>
> Antarmuka modern untuk sistem ZiroLogistics WMS. Dibangun dengan React.js dan Tailwind CSS dengan estetika dark mode minimalis khas Zirocraft Studio.

---

## 🔗 Related Repository

| Repository      | Link                                                                        | Status      |
| --------------- | --------------------------------------------------------------------------- | ----------- |
| ⚙️ **Backend**  | [ZiroLogistics-Backend](https://github.com/Youuzzi/ZiroLogistics-Backend)   | Active      |
| 🖥️ **Frontend** | [ZiroLogistics-Frontend](https://github.com/Youuzzi/ZiroLogistics-Frontend) | In Progress |

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
| ----------- | -------------------------------- |
| Framework   | React.js 18 (Vite)               |
| Styling     | Tailwind CSS + Custom Dark Theme |
| HTTP Client | Axios (dengan JWT Interceptor)   |
| Routing     | React Router Dom v6              |
| State       | React useState & useEffect       |
| Icons       | Lucide React                     |

---

## ✨ Fitur Utama

### 🔐 Authentication

- **Login** — JWT-based authentication dengan penyimpanan token di localStorage
- **Auto Token Injection** — Axios interceptor otomatis menyisipkan token di setiap request
- **Route Protection** — Halaman terlindungi, redirect ke login jika tidak authenticated

### 📊 Dashboard

- **Summary Cards** — Ringkasan total warehouse, total item, total stok, dan aktivitas terkini
- **Real-time Data** — Data di-fetch langsung dari backend saat halaman dibuka

### 🏬 Warehouse Management

- **Daftar Warehouse** — Tampilan semua gudang dengan pagination
- **Tambah Warehouse** — Form untuk registrasi gudang baru
- **Navigasi ke Bin** — Klik warehouse untuk lihat daftar bin di dalamnya

### 📦 Bin Management

- **Daftar Bin per Warehouse** — Tampilan semua rak dalam gudang yang dipilih
- **Tambah Bin** — Form dengan kapasitas berat maksimal, threshold minimum, dan kode bin unik
- **Capacity Display** — Tampilan visual kapasitas dan occupancy setiap bin

### 🗃️ Item Management

- **Daftar Item** — Tabel produk dengan pagination
- **Tambah & Edit Item** — CRUD lengkap dengan validasi input
- **SKU Management** — Setiap item memiliki SKU unik sebagai identifier

### 📥 Inbound (Barang Masuk)

- **Form Inbound** — Pilih item, warehouse, dan bin tujuan
- **Dynamic Bin Selection** — Bin otomatis difilter berdasarkan warehouse yang dipilih
- **Quantity & Notes** — Input jumlah barang dan catatan penerimaan
- **Idempotency Protection** — Mencegah duplikasi proses saat submit berulang

### 📤 Outbound (Barang Keluar)

- **Form Outbound** — Proses pengeluaran barang dengan validasi stok real-time
- **Stock Validation** — Sistem menolak outbound jika stok tidak mencukupi

### 🔄 Transfer (Pindah Stok)

- **Antar Bin** — Pindahkan stok dari bin satu ke bin lain dalam warehouse
- **Form Transfer** — Pilih item, bin asal, dan bin tujuan

### 📋 Inventory Stock

- **Tabel Stok** — Tampilan stok real-time per item per warehouse dengan pagination
- **Stock Level** — Informasi jumlah stok tersedia per lokasi

### 📖 Inventory Ledger

- **Riwayat Pergerakan** — Seluruh history inbound, outbound, dan transfer dengan pagination
- **Detail Transaksi** — Informasi lengkap setiap pergerakan stok

### 🎨 UI/UX

- **Dark Mode** — Background `#121416` dengan aksen Cyan (`#0dcaf0`) khas Zirocraft
- **Responsive Sidebar** — Navigasi collapsible untuk mobile dan desktop
- **Sticky Header** — Header tetap terlihat saat scroll dengan backdrop blur
- **Pagination Component** — Komponen pagination reusable di seluruh halaman
- **Error Boundary** — Tampilan error yang informatif jika terjadi crash

---

## 📁 Struktur Project

```
src/
├── api/
│   └── api.js              # Axios instance + JWT interceptor + semua API calls
├── components/
│   ├── ErrorBoundary.jsx   # Error handling global
│   ├── MainLayout.jsx      # Layout utama dengan sidebar & header
│   ├── Pagination.jsx      # Komponen pagination reusable
│   ├── Sidebar.jsx         # Navigasi sidebar dengan menu items
│   └── Header.jsx          # Header sticky dengan info user
├── pages/
│   ├── Dashboard.jsx       # Halaman dashboard summary
│   ├── Warehouses.jsx      # Manajemen warehouse
│   ├── Bins.jsx            # Manajemen bin per warehouse
│   ├── Items.jsx           # Manajemen item/produk
│   ├── Inbound.jsx         # Proses barang masuk
│   ├── Outbound.jsx        # Proses barang keluar
│   ├── Transfer.jsx        # Pindah stok antar bin
│   ├── Inventory.jsx       # Monitoring stok real-time
│   ├── Ledger.jsx          # Riwayat pergerakan stok
│   └── Login.jsx           # Halaman autentikasi
└── App.jsx                 # Router & route configuration
```

---

## 🚀 Cara Menjalankan

### Prerequisites

- Node.js 18+
- Backend ZiroLogistics sudah berjalan di `http://localhost:8080`

### Setup

```bash
# Clone repository
git clone https://github.com/Youuzzi/ZiroLogistics-Frontend.git
cd ZiroLogistics-Frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

### Konfigurasi API

Sesuaikan base URL backend di `src/api/api.js`:

```javascript
const api = axios.create({
  baseURL: "http://localhost:8080",
});
```

---

## 📌 Status Project

> ⚠️ **In Progress** — Fitur utama sudah berjalan. Masih dalam pengembangan aktif.

---

## 👨‍💻 Developer

**Yozi Heru Maulana** — [github.com/Youuzzi](https://github.com/Youuzzi)

_Zirocraft Studio_
