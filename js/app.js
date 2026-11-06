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
const inputCari = document.querySelector('#cari-nama');
const limitSelect = document.querySelector('#limit-select');

// Selektor untuk Validasi Form (Langkah Praktikum)
const form = document.querySelector('#form-alat');
const status = document.querySelector('#form-status');

// ==========================================
// FUNGSI RENDER DOM AMAN (renderItems) + TOMBOL DETAIL
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

        // Menambahkan Tombol "Detail" secara dinamis dengan atribut data-id (Latihan 2)
        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Detail';
        detailBtn.className = 'btn-detail';
        detailBtn.dataset.id = item.id;

        article.append(title, info, detailBtn);
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
// EVENT LISTENER PENCARIAN BERDASARKAN NAMA (Latihan 1)
// ==========================================
if (inputCari) {
    inputCari.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const hasilPencarian = inventaris.filter(item => 
            item.nama.toLowerCase().includes(keyword)
        );
        renderItems(hasilPencarian);
    });
}

// ==========================================
// EVENT DELEGATION UNTUK TOMBOL DETAIL (Latihan 2)
// ==========================================
if (daftar) {
    daftar.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-detail')) {
            const idAlat = e.target.dataset.id;
            const alatDitemukan = inventaris.find(item => item.id == idAlat);
            
            if (alatDitemukan) {
                alert(`Detail Alat:\nNama: ${alatDitemukan.nama}\nKategori: ${alatDitemukan.kategori}\nJumlah: ${alatDitemukan.jumlah}\nKondisi: ${alatDitemukan.kondisi}`);
            }
        }
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
// WEB STORAGE: PILIHAN JUMLAH ITEM PER HALAMAN (Latihan 3)
// ==========================================
const savedLimit = localStorage.getItem('limitPerPage') ?? '5';
if (limitSelect) {
    limitSelect.value = savedLimit;

    limitSelect.addEventListener('change', (e) => {
        const selectedLimit = e.target.value;
        localStorage.setItem('limitPerPage', selectedLimit);
        console.log(`Jumlah item per halaman diatur ke: ${selectedLimit}`);
    });
}

// ==========================================
// FUNGSI VALIDASI FORM & EVENT SUBMIT (Langkah Praktikum)
// ==========================================
function validateForm(data) {
    const errors = {};
    const nama = String(data.get('nama') ?? '').trim();
    const jumlah = Number(data.get('jumlah'));
    
    if (nama.length < 3) {
        errors.nama = 'Nama alat minimal 3 karakter.';
    }
    if (!Number.isInteger(jumlah) || jumlah < 0) {
        errors.jumlah = 'Jumlah harus bilangan bulat 0 atau lebih.';
    }
    return errors;
}

if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault(); // Mencegah form terkirim langsung ke server[cite: 3]
        const data = new FormData(form);
        const errors = validateForm(data);

        // Membersihkan pesan error dan atribut aria-invalid sebelumnya[cite: 3]
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));

        if (Object.keys(errors).length) {
            for (const [field, message] of Object.entries(errors)) {
                const errorElement = document.querySelector(`#error-${field}`);
                if (errorElement) errorElement.textContent = message;
                form.elements[field]?.setAttribute('aria-invalid', 'true');[cite: 3]
            }
            const firstField = Object.keys(errors)[0];
            form.elements[firstField]?.focus(); // Mengarahkan fokus ke field error pertama[cite: 3]
            if (status) status.textContent = 'Periksa kembali data yang belum valid.';[cite: 3]
            return;
        }

        if (status) status.textContent = 'Data valid dan siap dikirim.';[cite: 3]
    });
}

// ==========================================
// PENGUJIAN LOGIKA, ARRAY METHODS & RENDER AWAL
// ==========================================
const ringkasan = ringkasInventaris(inventaris);
console.log("=== RINGKASAN INVENTARIS ===", ringkasan);

const alatBaik = inventaris.filter(item => item.kondisi === 'Baik');
console.log("=== ALAT DENGAN KONDISI BAIK ===", alatBaik);

const namaAlat = inventaris.map(({ nama }) => nama);
console.log("=== DAFTAR NAMA ALAT ===", namaAlat);

const totalUnit = inventaris.reduce((total, item) => total + item.jumlah, 0);
console.log(`=== TOTAL KESELURUHAN UNIT: ${totalUnit} unit ===`);

// Render awal saat halaman dimuat
renderItems(inventaris);