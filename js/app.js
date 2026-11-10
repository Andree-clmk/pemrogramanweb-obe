// ==========================================
// IMPOR MODUL DARI utils.js
// ==========================================
import { ringkasInventaris } from './utils.js';

// ==========================================
// DATA & LOGIKA UTAMA APLIKASI (Sinkron LocalStorage)
// ==========================================
let inventaris = JSON.parse(localStorage.getItem('dataInventaris')) || [
    { id: 1, nama: 'Router', kategori: 'Jaringan', jumlah: 4, kondisi: 'Baik' },
    { id: 2, nama: 'Multimeter', kategori: 'Elektronika', jumlah: 6, kondisi: 'Baik' },
    { id: 3, nama: 'Kabel UTP', kategori: 'Jaringan', jumlah: 20, kondisi: 'Perlu Cek' }
];

// Variabel Global untuk Menyimpan Data Mentah API (Latihan 2)
let allUsers = [];

// ==========================================
// SELEKTOR DOM & ELEMEN HTML
// ==========================================
const daftar = document.querySelector('#daftar-alat');
const tombolFilter = document.querySelectorAll('[data-filter]');
const themeButton = document.querySelector('#theme-button');
const inputCari = document.querySelector('#cari-nama');
const limitSelect = document.querySelector('#limit-select');

// Selektor untuk Validasi Form
const form = document.querySelector('#form-alat');
const status = document.querySelector('#form-status');

// Selektor untuk Fetch API (Modul Baru) & Tombol Retry
const apiOutput = document.querySelector('#api-output');
const apiMessage = document.querySelector('#api-message');
const retryButton = document.querySelector('#btn-retry');

// Selektor untuk Input Pencarian API (Latihan 2)
const inputCariApi = document.querySelector('#cari-api-user');

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
        info.textContent = `Kategori: ${item.kategori} | ${item.jumlah} unit | Kondisi: ${item.kondisi}`;

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
// EVENT LISTENER PENCARIAN BERDASARKAN NAMA
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
// EVENT DELEGATION UNTUK TOMBOL DETAIL
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
// WEB STORAGE: PREFERENSI TEMA
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
// WEB STORAGE: PILIHAN JUMLAH ITEM PER HALAMAN
// ==========================================
const savedLimit = localStorage.getItem('limitPerPage') ?? '5';
if (limitSelect) {
    limitSelect.value = savedLimit;

    limitSelect.addEventListener('change', (e) => {
        const selectedLimit = e.target.value;
        localStorage.setItem('limitPerPage', selectedLimit);
    });
}

// ==========================================
// FUNGSI VALIDASI FORM
// ==========================================
function validateForm(data) {
    const errors = {};
    const nama = String(data.get('nama') ?? '').trim();
    const kategori = String(data.get('kategori') ?? '').trim();
    const jumlahStr = String(data.get('jumlah') ?? '').trim();
    const kondisi = String(data.get('kondisi') ?? '').trim();
    const tanggal = String(data.get('tanggal') ?? '').trim();

    // 1. Validasi Nama
    if (nama === '') {
        errors.nama = 'Nama alat tidak boleh kosong.';
    } else if (nama.length < 3) {
        errors.nama = 'Nama alat minimal 3 karakter.';
    }

    // 2. Validasi Kategori
    const daftarKategoriValid = ['Jaringan', 'Elektronika'];
    if (kategori === '') {
        errors.kategori = 'Silakan pilih kategori alat.';
    } else if (!daftarKategoriValid.includes(kategori)) {
        errors.kategori = 'Kategori yang dipilih tidak valid.';
    }

    // 3. Validasi Jumlah
    if (jumlahStr === '') {
        errors.jumlah = 'Jumlah alat tidak boleh kosong.';
    } else {
        const jumlah = Number(jumlahStr);
        if (!Number.isInteger(jumlah) || jumlah < 0) {
            errors.jumlah = 'Jumlah harus berupa bilangan bulat 0 atau lebih.';
        }
    }

    // 4. Validasi Kondisi
    const daftarKondisiValid = ['Baik', 'Perlu Cek'];
    if (kondisi === '') {
        errors.kondisi = 'Silakan pilih kondisi alat.';
    } else if (!daftarKondisiValid.includes(kondisi)) {
        errors.kondisi = 'Kondisi yang dipilih tidak valid.';
    }

    // 5. Validasi Tanggal Perolehan
    if (tanggal === '') {
        errors.tanggal = 'Tanggal perolehan tidak boleh kosong.';
    } else {
        const inputDate = new Date(tanggal);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (inputDate > today) {
            errors.tanggal = 'Tanggal perolehan tidak boleh melebihi tanggal hari ini.';
        }
    }

    return errors;
}

// ==========================================
// EVENT LISTENER SUBMIT FORM & PENYIMPANAN DATA
// ==========================================
if (form) {
    form.addEventListener('submit', event => {
        event.preventDefault(); 
        const data = new FormData(form);
        const errors = validateForm(data);

        // Bersihkan pesan error dan atribut aria-invalid sebelumnya
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));

        // Jika ditemukan error, tampilkan dan hentikan proses
        if (Object.keys(errors).length) {
            for (const [field, message] of Object.entries(errors)) {
                const errorElement = document.querySelector(`#error-${field}`);
                if (errorElement) errorElement.textContent = message;
                form.elements[field]?.setAttribute('aria-invalid', 'true');
            }
            const firstField = Object.keys(errors)[0];
            form.elements[firstField]?.focus();
            if (status) status.textContent = 'Periksa kembali data yang belum valid.';
            return;
        }

        // --- JIKA VALID, SIMPAN DATA KE ARRAY & LOCALSTORAGE ---
        const alatBaru = {
            id: Date.now(),
            nama: data.get('nama').trim(),
            kategori: data.get('kategori').trim(),
            jumlah: Number(data.get('jumlah')),
            kondisi: data.get('kondisi'),
            tanggal: data.get('tanggal')
        };

        inventaris.push(alatBaru);
        localStorage.setItem('dataInventaris', JSON.stringify(inventaris));
        
        renderItems(inventaris);

        form.reset();
        if (status) status.textContent = 'Data berhasil disimpan dan ditambahkan ke daftar!';
    });
}

// ==========================================
// FUNGSI RENDER KHUSUS API (Latihan 2)
// ==========================================
function renderApiUsers(usersToRender) {
    if (!apiOutput) return;
    apiOutput.replaceChildren();

    usersToRender.slice(0, 5).forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.name} - ${user.email}`;
        apiOutput.append(li);
    });
}

// ==========================================
// FETCH API: PENGAMBILAN DATA PENGGUNA (ASINKRON)
// ==========================================
async function loadUsers() {
    if (!apiOutput || !apiMessage) return;

    // 1. Loading State & Sembunyikan tombol retry
    apiMessage.textContent = 'Memuat data...';
    if (retryButton) retryButton.style.display = 'none';

    // Konfigurasi fallback data lokal jika koneksi offline (ubah ke true jika diperlukan)
    const USE_LOCAL_DATA = false;
    const endpoint = USE_LOCAL_DATA 
        ? './data/users.json' 
        : 'https://jsonplaceholder.typicode.com/users';

    try {
        // 2. Melakukan GET request ke endpoint
        const response = await fetch(endpoint);

        // 3. Periksa response.ok
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        // 4. Parse JSON & Simpan ke Variabel Global (Latihan 2)
        allUsers = await response.json();
        
        // Render data menggunakan fungsi khusus
        renderApiUsers(allUsers);

        // Berhasil memuat data
        apiMessage.textContent = `Berhasil memuat ${allUsers.length} data.`;
        if (retryButton) retryButton.style.display = 'none';

    } catch (error) {
        // 5. Penanganan Error / Error Message & Tampilkan Tombol Retry
        console.error(error);
        apiMessage.textContent = 'Data belum dapat dimuat. Coba kembali.';
        
        if (retryButton) retryButton.style.display = 'inline-block';
    }
}

// Event listener untuk tombol retry
if (retryButton) {
    retryButton.addEventListener('click', () => {
        loadUsers();
    });
}

// ==========================================
// EVENT LISTENER PENCARIAN API LOKAL (Latihan 2)
// ==========================================
if (inputCariApi) {
    inputCariApi.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.name.toLowerCase().includes(keyword)
        );
        renderApiUsers(filteredUsers);
    });
}

// ==========================================
// FUNGSI CONTOH POST RESOURCE BARU KE API (Payload/Body JSON)
// ==========================================
async function tambahDataBaru() {
    // 1. Contoh Payload / Body JSON
    const dataBaru = {
        name: "Budi Santoso",
        username: "budi_s",
        email: "budi.santoso@example.com",
        kategori: "Elektronika"
    };

    try {
        // 2. Melakukan fetch dengan metode POST dan header Content-Type
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8' // Menentukan tipe konten data berupa JSON
            },
            body: JSON.stringify(dataBaru) // Mengonversi objek JavaScript menjadi string JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const hasilRespon = await response.json();
        console.log('Data berhasil ditambahkan ke server:', hasilRespon);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengirim data:', error);
    }
}

// Panggil fungsi loadUsers saat aplikasi dimuat
loadUsers();

// ==========================================
// PENGUJIAN LOGIKA & RENDER AWAL
// ==========================================
const ringkasan = ringkasInventaris(inventaris);
console.log("=== RINGKASAN INVENTARIS ===", ringkasan);

renderItems(inventaris);