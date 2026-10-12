import { list } from "@vercel/blob";

export async function GET() {
  // Ambil semua file yang ada di folder "tugas"
  const hasil = await list({ prefix: "tugas/" });

  return Response.json(hasil.blobs);
}
