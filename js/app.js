// ==========================================
// IMPOR MODUL DARI utils.js
// ==========================================
import { ringkasInventaris } from './utils.js';

// ==========================================
// DATA & LOGIKA UTAMA APLIKASI
// ==========================================
const inventaris = [
    { id: 1, nama: 'Router', kategori: 'Jaringan', jumlah: 4, kondisi: 'Baik' },
    { id: 2, nama: 'Multimeter', kategori: 'Elektronika', jumlah: 6, kondisi: 'Baik' },
    { id: 3, nama: 'Kabel UTP', kategori: 'Jaringan', jumlah: 20, kondisi: 'Perlu Cek' }
];

// Menggunakan fungsi ringkasInventaris dari modul
const ringkasan = ringkasInventaris(inventaris);
console.log("=== RINGKASAN INVENTARIS ===", ringkasan);

// Menggunakan filter untuk mengambil alat dengan kondisi "Baik"
const alatBaik = inventaris.filter(item => item.kondisi === 'Baik');
console.log("=== ALAT DENGAN KONDISI BAIK ===", alatBaik);

// Menggunakan map untuk menghasilkan array yang hanya berisi nama alat
const namaAlat = inventaris.map(({ nama }) => nama);
console.log("=== DAFTAR NAMA ALAT ===", namaAlat);

// Menggunakan reduce untuk menghitung total jumlah keseluruhan unit alat
const totalUnit = inventaris.reduce((total, item) => total + item.jumlah, 0);
console.log(`=== TOTAL KESELURUHAN UNIT: ${totalUnit} unit ===`);