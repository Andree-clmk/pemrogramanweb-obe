# Dokumentasi Analisis Request-Response (Tugas 1 OBE)

Berikut adalah hasil analisis minimal 5 request pada tab Network dari situs layanan publik/pendidikan yang diamati:

| No | URL | Method | Status | Content Type | Ukuran (Size) | Fungsi Request |
|----|-----------------|--------|--------|--------------|---------------|----------------|
| 1  | `https://www.perpustakaan.co.id/m/home.dg` | GET | 200 OK | text/html | 17.4 kB | Sebagai halaman utama website. |
| 2  | `https://www.perpustakaan.co.id/m/css/bootstrap.min.css` | GET | 200 OK | text/css | 195 kB | Mengatur tampilan dan desain website. |
| 3  | `https://www.perpustakaan.co.id/m/js/bootstrap.bundle.min.js` | GET | 200 OK | text/javascript | 80.7 kB | Menjalankan fitur interaktif pada website. |
| 4  | `https://www.perpustakaan.co.id/m/js/waypoints.min.js` | GET | 200 OK | text/javascript | 8.4 B | Mendeteksi ketika pengguna menggulir halaman (scroll) hingga mencapai elemen tertentu. |
| 5  | `https://www.perpustakaan.co.id/ai/airead/images/bookloader.gif` | GET | 50.6 OK | image/png | ~196 B | Sebagai elemen visual atau animasi dekoratif pada website. |

## Kesimpulan Analisis
* **Method:** Sebagian besar request menggunakan metode `GET` karena bertujuan untuk mengambil atau mengunduh sumber daya (*resources*) dari server.
* **Status:** Seluruh request yang berhasil dimuat menunjukkan status `200 OK`, menandakan komunikasi antara klien (browser) dan server berjalan lancar tanpa kendala.
* **Content Type:** Menunjukkan keragaman tipe data yang dikirimkan oleh server, mulai dari dokumen HTML, lembar gaya CSS, skrip JavaScript, hingga file gambar biner.