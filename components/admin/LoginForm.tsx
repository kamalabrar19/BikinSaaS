"use client";

import { useState, type FormEvent } from "react";

/**
 * The only way in. One username and one password, checked against
 * ADMIN_USERNAME and ADMIN_PASSWORD_HASH on the server.
 *
 * Nothing here reveals whether it was the username or the password that was
 * wrong, and the server locks an address out after a handful of misses.
 */
export function LoginForm({ configured, missing }: { configured: boolean; missing: string[] }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Gagal masuk.");
        setPassword("");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Tidak bisa menghubungi server.");
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>Panel belum dikonfigurasi</h1>
          <p className="hint">
            Isi dulu variabel berikut di <code>.env.local</code>, lalu jalankan ulang server:
          </p>
          <ul className="login-missing">
            {missing.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p className="hint">
            Untuk membuat password, jalankan di terminal:
          </p>
          <pre className="login-code">npm run admin:password</pre>
          <p className="hint">
            Perintah itu mencetak <code>ADMIN_PASSWORD_HASH</code> yang bisa langsung ditempel, dan
            menampilkan password yang dipakai. Simpan password di tempat aman — yang tersimpan di
            server hanya sidik jarinya.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h1>
          BikinSaaS <span>panel</span>
        </h1>
        <p className="hint">Masuk untuk mengubah portfolio, harga, dan isi situs.</p>

        <label className="field">
          <span className="field-label">Username</span>
          <input
            className="input"
            type="text"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            className="input"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {error ? <p className="banner banner-error">{error}</p> : null}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy || !username || !password}>
          {busy ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
