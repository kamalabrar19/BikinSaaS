import { Editor } from "@/components/admin/Editor";
import { getAdminDoc } from "@/lib/admin/defaults";

export const dynamic = "force-dynamic";

export default function TeamPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <p className="kicker">
            <span className="dot" />/ Tim
          </p>
          <h1>
            Orang di <em>balik layar</em>
          </h1>
          <p className="lead">
            Tambah anggota, ubah peran, atau ganti foto. Perubahan langsung tampil di bagian Tim pada
            beranda setelah disimpan.
          </p>
        </div>
      </header>
      <Editor initialDoc={getAdminDoc()} sections={[{ key: "team", variant: "people" }]} />
    </>
  );
}
