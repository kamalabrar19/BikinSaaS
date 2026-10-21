import { Editor } from "@/components/admin/Editor";
import { getAdminDoc } from "@/lib/admin/defaults";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <>
      <header className="page-head">
        <div>
          <p className="kicker">
            <span className="dot" />/ Daftar harga
          </p>
          <h1>
            Harga <em>jelas</em>
          </h1>
          <p className="lead">
            Klik sebuah paket untuk mengubah harga dan isinya. Perubahan langsung tampil di situs setelah
            disimpan.
          </p>
        </div>
      </header>
      <Editor
        initialDoc={getAdminDoc()}
        sections={[
          { key: "websitePlans", variant: "list" },
          { key: "webappPlans", variant: "list" },
          { key: "addOns", variant: "list" },
          { key: "maintenance", variant: "list" },
        ]}
      />
    </>
  );
}
