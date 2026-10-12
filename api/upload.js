import { put } from "@vercel/blob";

export async function POST(request) {
  // 1. Cek password
  const passwordBenar = process.env.UPLOAD_PASSWORD;
  const passwordKiriman = request.headers.get("x-password");

  if (passwordKiriman !== passwordBenar) {
    return Response.json({ error: "Password salah" }, { status: 401 });
  }

  // 2. Ambil nama file dan mata kuliah dari alamat
  const alamat = new URL(request.url);
  const filename = alamat.searchParams.get("filename");
  const matkul = alamat.searchParams.get("matkul");

  // 3. Simpan file ke Vercel Blob
  const hasil = await put("tugas/" + matkul + "/" + filename, request.body, {
    access: "public",
    addRandomSuffix: true
  });

  return Response.json(hasil);
}
