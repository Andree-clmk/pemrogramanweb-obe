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

// ==========================================
// SELEKTOR DOM & ELEMEN HTML
// ==========================================
const daftar = document.querySelector('#daftar-alat');
const tombolFilter = document.querySelectorAll('[data-filter]');
const themeButton = document.querySelector('#theme-button');

// ==========================================
// FUNGSI RENDER DOM AMAN (renderItems)
// ==========================================
function renderItems(items) {
    if (!daftar) return;
    daftar.replaceChildren(); // Membersihkan container sebelum merender ulang
    for (const item of items) {
        const article = document.createElement('article');
        article.className = 'card';

        const title = document.createElement('h3');
        title.textContent = item.nama;

        const info = document.createElement('p');
        info.textContent = `${item.kategori} - ${item.jumlah} unit - Kondisi: ${item.kondisi}`;

        article.append(title, info);
        daftar.append(article);
    }
}

// ==========================================
// EVENT LISTENER FILTER INVENTARIS
// ==========================================
if (tombolFilter.length > 0) {
    tombolFilter.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            const hasil = filter === 'Semua' 
                ? inventaris 
                : inventaris.filter(item => item.kondisi === filter);
            renderItems(hasil);
        });
    });
}

// ==========================================
// WEB STORAGE: PREFERENSI TEMA (LOCALSTORAGE)
// ==========================================
const savedTheme = localStorage.getItem('theme') ?? 'light';
document.documentElement.dataset.theme = savedTheme;

if (themeButton) {
    themeButton.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem('theme', nextTheme);
    });
}

// ==========================================
// PENGUJIAN LOGIKA, ARRAY METHODS & RENDER AWAL
// ==========================================
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

// Render awal saat halaman dimuat
renderItems(inventaris);