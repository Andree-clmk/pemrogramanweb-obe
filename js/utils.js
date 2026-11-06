// ==========================================
// DATA & FUNGSI INVENTARIS
// ==========================================

// Data Array of Objects yang relevan dengan proyek
export const inventarisData = [
    { id: 1, nama: "Multimeter Digital", kategori: "Alat Ukur", status: "Tersedia", kondisi: "Baik", jumlah: 5 },
    { id: 2, nama: "Oscilloscope", kategori: "Alat Ukur", status: "Dipinjam", kondisi: "Perlu Kalibrasi", jumlah: 2 },
    { id: 3, nama: "Modul ESP32", kategori: "IoT", status: "Tersedia", kondisi: "Baik", jumlah: 10 },
    { id: 4, nama: "Sensor Suhu LM35", kategori: "Komponen", status: "Tersedia", kondisi: "Baik", jumlah: 25 }
];

// Fungsi untuk meringkas data inventaris (menggunakan reduce & filter)
export function ringkasInventaris(data) {
    if (!Array.isArray(data)) throw new TypeError('Data harus berupa array');
    return {
        jenisAlat: data.length,
        totalUnit: data.reduce((sum, item) => sum + item.jumlah, 0),
        perluCek: data.filter(item => item.kondisi !== 'Baik').length
    };
}

// Arrow Function untuk memfilter item berdasarkan status dengan Error Handling (try...catch)
export const filterBerdasarkanStatus = (data, statusPencarian) => {
    try {
        if (!Array.isArray(data)) {
            throw new Error("Data yang dimasukkan harus berupa array!");
        }
        return data.filter(item => item.status.toLowerCase() === statusPencarian.toLowerCase());
    } catch (error) {
        console.error("Terjadi kesalahan saat memfilter data:", error.message);
        return [];
    }
};

// Arrow Function untuk memetakan (map) nama alat
export const ambilNamaAlat = (data) => {
    return data.map(item => item.nama);
};