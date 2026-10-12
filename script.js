// Mengambil elemen dari halaman
const inputMatkul = document.getElementById("inputMatkul");
const inputFile = document.getElementById("inputFile");
const inputPassword = document.getElementById("inputPassword");
const tombolUpload = document.getElementById("tombolUpload");
const tombolRefresh = document.getElementById("tombolRefresh");
const status = document.getElementById("status");
const daftar = document.getElementById("daftar");


// Fungsi untuk menampilkan daftar tugas
async function tampilkanTugas() {
  daftar.innerHTML = "<li>Memuat tugas...</li>";

  try {
    const respon = await fetch("/api/list");
    const data = await respon.json();

    if (data.length == 0) {
      daftar.innerHTML = "<li>Belum ada tugas.</li>";
      return;
    }

    let isi = "";
    for (let i = 0; i < data.length; i++) {
      const file = data[i];
      const bagian = file.pathname.split("/");   // tugas / matkul / namafile
      const matkul = bagian[1];
      const namaFile = bagian[2];

      isi = isi + "<li><b>" + matkul + "</b><br>";
      isi = isi + "<a href='" + file.url + "' target='_blank'>" + namaFile + "</a></li>";
    }
    daftar.innerHTML = isi;

  } catch (error) {
    daftar.innerHTML = "<li>Gagal memuat tugas.</li>";
  }
}


// Fungsi untuk upload tugas
async function uploadTugas() {
  const file = inputFile.files[0];
  let matkul = inputMatkul.value;

  // Cek dulu apakah sudah memilih file
  if (!file) {
    status.innerHTML = "Pilih file dulu ya.";
    return;
  }

  // Batas ukuran file 4 MB
  if (file.size > 4 * 1024 * 1024) {
    status.innerHTML = "File terlalu besar (maksimal 4 MB).";
    return;
  }

  // Kalau mata kuliah kosong, pakai "Umum"
  if (matkul == "") {
    matkul = "Umum";
  }

  status.innerHTML = "Sedang mengupload...";

  const alamat = "/api/upload?matkul=" + encodeURIComponent(matkul) +
                 "&filename=" + encodeURIComponent(file.name);

  try {
    const respon = await fetch(alamat, {
      method: "POST",
      headers: { "x-password": inputPassword.value },
      body: file
    });

    if (respon.ok) {
      status.innerHTML = "Berhasil diupload!";
      inputFile.value = "";
      tampilkanTugas();
    } else {
      const hasil = await respon.json();
      status.innerHTML = "Gagal: " + hasil.error;
    }

  } catch (error) {
    status.innerHTML = "Gagal upload, coba lagi.";
  }
}


// Menghubungkan tombol dengan fungsinya
tombolUpload.onclick = uploadTugas;
tombolRefresh.onclick = tampilkanTugas;

// Tampilkan daftar tugas saat halaman dibuka
tampilkanTugas();