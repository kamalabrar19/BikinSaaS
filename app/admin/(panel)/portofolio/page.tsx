import { Editor } from "@/components/admin/Editor";
import { getAdminDoc } from "@/lib/admin/defaults";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <p className="kicker">
            <span className="dot" />/ Portofolio
          </p>
          <h1>
            Karya <em>Anda</em>
          </h1>
          <p className="lead">
            Klik sebuah karya untuk mengubahnya. Perubahan langsung tampil di situs setelah disimpan.
          </p>
        </div>
      </header>
      <Editor initialDoc={getAdminDoc()} sections={[
          { key: "categories", variant: "tags" },
          { key: "work", variant: "cards" },
        ]} />
    </>
  );
}
