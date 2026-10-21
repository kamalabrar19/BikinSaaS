# Deploy ke VPS

Situs berjalan sebagai build **standalone** Next.js di belakang nginx. Build dibuat
di laptop, lalu satu arsip dikirim ke server: server tidak perlu `npm install`
atau `next build` (RAM-nya dipakai aplikasi lain).

## Susunan di server

```
/opt/bikinsaas/
  current -> releases/<tanggal-jam>     rilis yang sedang jalan
  releases/                             rilis lama, bisa dihapus
  shared/
    .env                                rahasia (chmod 600, milik root)
    data/                               site.json, analytics.json, backups (tetap ada antar rilis)
```

- Service: `bikinsaas.service` (systemd), user `bikinsaas`, `127.0.0.1:3300`.
- nginx: `/etc/nginx/sites-available/bikinsaas.<domain>`, HTTPS lewat certbot.
- Aplikasi lain di server tidak disentuh: port, service, dan vhost-nya terpisah.

## Rilis baru

```bash
NEXT_PUBLIC_SITE_URL=https://<domain> npm run build

R=release && rm -rf $R && mkdir $R
cp -r .next/standalone/. $R/ && rm -rf $R/data
mkdir -p $R/.next $R/assets
cp -r .next/static $R/.next/static
cp -r public $R/public && rm -rf $R/public/media/uploads
cp -r assets/fonts $R/assets/fonts
tar -czf bikinsaas-release.tgz -C $R .
```

Kirim `bikinsaas-release.tgz` ke `/tmp` server, lalu di server:

```bash
APP=/opt/bikinsaas; REL=$APP/releases/$(date +%Y%m%d-%H%M%S)
mkdir -p $REL && tar -xzf /tmp/bikinsaas-release.tgz -C $REL
ln -s $APP/shared/data $REL/data
chown -R bikinsaas:bikinsaas $REL
ln -sfn $REL $APP/current && systemctl restart bikinsaas
```

Kembali ke rilis sebelumnya: arahkan `current` ke folder lama, lalu `systemctl restart bikinsaas`.

## Variabel di `shared/.env`

`NODE_ENV`, `PORT`, `HOSTNAME`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`,
`ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `CLOUDINARY_*`. Nilai `NEXT_PUBLIC_*`
ikut tertanam saat build, jadi ubahnya di build, bukan di file ini.
Ganti password admin: `npm run admin:password`, tempel hasilnya, restart service.
