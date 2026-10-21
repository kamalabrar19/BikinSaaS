"use client";

import { useState, type FormEvent } from "react";
import { BrandMark } from "@/components/site/BrandMark";

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
  const [show, setShow] = useState(false);

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
        <div className="card login-card">
          <p className="kicker">
            <span className="dot" />/ Pengaturan
          </p>
          <h1>
            Panel belum <em>siap</em>
          </h1>
          <p className="muted">Isi dulu variabel berikut di <code>.env.local</code>, lalu jalankan ulang server:</p>
          <ul className="login-missing">
            {missing.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
          <p className="muted">Untuk membuat password, jalankan di terminal:</p>
          <pre className="login-code">npm run admin:password</pre>
          <p className="muted">
            Perintah itu mencetak <code>ADMIN_PASSWORD_HASH</code> yang bisa langsung ditempel, dan menampilkan
            password yang dipakai. Simpan password di tempat aman — yang tersimpan di server hanya sidik jarinya.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="shell-bg" aria-hidden="true" />
      <form className="card login-card" onSubmit={submit}>
        <p className="brand login-brand">
          <BrandMark className="brand-logo" />
          <span className="brand-name">BikinSaaS</span>
          <span className="brand-tag">Admin</span>
        </p>
        <h1>
          Selamat <em>datang</em>
        </h1>
        <p className="muted">Masuk untuk melihat statistik situs dan mengatur portofolio serta harga.</p>

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
          <div className="input-eye">
            <input
              className="input"
              type={show ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShow((on) => !on)}
              aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
              aria-pressed={show}
            >
              {show ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </label>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary btn-block" disabled={busy || !username || !password}>
          {busy ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
