# Throwaway end-to-end test for the admin panel against a running server.
# Run: powershell -File .admin-test.ps1 [-Base http://localhost:3001]

param([string]$Base = "http://localhost:3001")

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

function Write-Json($path, $text) {
  [System.IO.File]::WriteAllText((Join-Path $PWD $path), $text, (New-Object System.Text.UTF8Encoding($false)))
}

function Hits($url, $pattern) {
  $html = curl.exe -s --noproxy "*" $url
  return ($html | Select-String -Pattern $pattern -AllMatches).Matches.Count
}

function Code($url, $extra = @()) {
  $args = @("-s", "-o", "NUL", "-w", "%{http_code}", "--noproxy", "*") + $extra + @($url)
  return (curl.exe @args)
}

$pass = 0
$fail = 0
function Check($label, $condition, $detail = "") {
  if ($condition) { $script:pass++; "  OK   $label" }
  else { $script:fail++; "  GAGAL $label $detail" }
}

"=== 0. tanpa sesi ==="
Check "/admin tanpa sesi -> 307" ((Code "$Base/admin") -eq "307")
Check "POST save tanpa sesi -> 401" ((Code "$Base/api/admin/save" @("-X", "POST", "-H", "Content-Type: application/json", "-d", '@.payload-min.json')) -eq "401")
Check "POST upload tanpa sesi -> 401" ((Code "$Base/api/admin/upload" @("-X", "POST", "-F", "file=@.test-upload.png")) -eq "401")
Check "GET media tanpa sesi -> 401" ((Code "$Base/api/admin/media") -eq "401")
$robots = (curl.exe -s -D - -o NUL --noproxy "*" "$Base/admin" | Select-String -Pattern "x-robots-tag: noindex" -Quiet)
Check "header X-Robots-Tag di /admin" $robots

"=== 1. login ==="
Write-Json ".login.json" '{"username":"admin","password":"4608bdbca933d865"}'
$bad = curl.exe -s --noproxy "*" -X POST -H "Content-Type: application/json" -d '@.login.json' "$Base/api/admin/login"
Write-Json ".login-bad.json" '{"username":"admin","password":"jelas-salah"}'
$wrong = Code "$Base/api/admin/login" @("-X", "POST", "-H", "Content-Type: application/json", "-d", '@.login-bad.json')
Check "password salah -> 401" ($wrong -eq "401")
$good = curl.exe -s -c .cookies.txt -w "|%{http_code}" --noproxy "*" -X POST -H "Content-Type: application/json" -d '@.login.json' "$Base/api/admin/login"
Check "password benar -> 200" ($good -match "\|200$") $good
Check "/admin dengan sesi -> 200" ((Code "$Base/admin" @("-b", ".cookies.txt")) -eq "200")
Check "/admin/login saat sudah masuk -> 307" ((Code "$Base/admin/login" @("-b", ".cookies.txt")) -eq "307")

"=== 2. simpan pengaturan ==="
Write-Json ".payload-settings.json" '{"doc":{"settings":{"whatsapp":"6281234567890","email":"halo@contoh.com","address":"Bandung, Indonesia"}}}'
$saved = curl.exe -s -b .cookies.txt -w "|%{http_code}" --noproxy "*" -X POST -H "Content-Type: application/json" -d '@.payload-settings.json' "$Base/api/admin/save"
Check "save pengaturan -> 200" ($saved -match "\|200$") ($saved.Substring(0, [Math]::Min(120, $saved.Length)))
Check "wa.me muncul di /id" ((Hits "$Base/id" 'wa\.me/6281234567890') -gt 0)
Check "wa.me muncul di /id/pricing" ((Hits "$Base/id/pricing" 'wa\.me/6281234567890') -gt 0)
Check "email muncul di /id" ((Hits "$Base/id" 'halo@contoh\.com') -gt 0)
Check "alamat muncul di /id/contact" ((Hits "$Base/id/contact" 'Bandung, Indonesia') -gt 0)
Check "alamat muncul di /en/contact" ((Hits "$Base/en/contact" 'Bandung, Indonesia') -gt 0)

"=== 2b. dokumen sebagian tidak menghapus bagian lain ==="
Check "karya bawaan masih tampil di /id/portfolio" ((Hits "$Base/id/portfolio" 'cp-kontraktor') -gt 0)
Check "portofolio bawaan masih tampil di /id" ((Hits "$Base/id" 'work-card') -gt 0)
Check "paket bawaan masih tampil di /id/pricing" ((Hits "$Base/id/pricing" 'plan-features') -gt 0)
Check "faq bawaan masih tampil di /id/pricing" ((Hits "$Base/id/pricing" 'faq') -gt 0)

"=== 3. unggah berkas ==="
Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 96, 60
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(14, 110, 63))
$g.Dispose()
$bmp.Save((Join-Path $PWD ".test-upload.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$up = curl.exe -s -b .cookies.txt -w "|%{http_code}" --noproxy "*" -X POST -F "file=@.test-upload.png" "$Base/api/admin/upload"
Check "upload -> 200" ($up -match "\|200$") ($up.Substring(0, [Math]::Min(160, $up.Length)))
$src = ([regex]::Match($up, '"src":"([^"]+)"')).Groups[1].Value
Check "src berbentuk /media/uploads/..." ($src -like "/media/uploads/*") $src
Check "berkas bisa diakses" ((Code "$Base$src") -eq "200")
Check "daftar media memuat berkas" ((Hits "$Base/api/admin/media" [regex]::Escape($src)) -gt 0)
Check "format asing ditolak -> 415" ((Code "$Base/api/admin/upload" @("-b", ".cookies.txt", "-X", "POST", "-F", "file=@.login.json")) -eq "415")

"=== 4. simpan karya baru + media ==="
$doc = @{
  doc = @{
    settings = @{ whatsapp = "6281234567890"; email = "halo@contoh.com"; address = "Bandung, Indonesia" }
    work     = @(
      @{
        id       = "uji-panel"
        category = "company"
        kind     = "concept"
        cover    = $src
        gallery  = @(@{ src = $src; kind = "image"; alt = "Tangkapan layar uji" }, @{ src = "/media/uploads/tidak-ada.png"; kind = "image"; alt = "contoh" })
        copy     = @{ id = @{ title = "Uji dari panel"; client = "Klien Uji"; before = "Sebelum"; solution = "Solusi"; result = "Hasil"; detail = "Cerita panjang"; stack = @("Next.js", "Tailwind") } }
      }
    )
  }
}
Write-Json ".payload-work.json" ($doc | ConvertTo-Json -Depth 12)
$savedWork = curl.exe -s -b .cookies.txt -w "|%{http_code}" --noproxy "*" -X POST -H "Content-Type: application/json" -d '@.payload-work.json' "$Base/api/admin/save"
Check "save karya -> 200" ($savedWork -match "\|200$") ($savedWork.Substring(0, [Math]::Min(120, $savedWork.Length)))
Check "judul di /id/portfolio" ((Hits "$Base/id/portfolio" 'Uji dari panel') -gt 0)
Check "slug baru dirender on-demand -> 200" ((Code "$Base/id/portfolio/uji-panel") -eq "200")
Check "judul di studi kasus" ((Hits "$Base/id/portfolio/uji-panel" 'Uji dari panel') -gt 0)
Check "teks EN kosong jatuh ke ID" ((Hits "$Base/en/portfolio/uji-panel" 'Uji dari panel') -gt 0)
Check "sampul dipakai kartu + halaman" ((Hits "$Base/id/portfolio/uji-panel" [regex]::Escape($src)) -gt 0)
Check "galeri dirender" ((Hits "$Base/id/portfolio/uji-panel" 'Tangkapan layar uji') -gt 0)

"=== 5. daftar karya tersimpan menggantikan daftar bawaan ==="
Check "karya bawaan hilang setelah daftar baru disimpan" ((Hits "$Base/id/portfolio" 'cp-kontraktor') -eq 0)

"=== 6. /admin memuat dokumen tersimpan ==="
Check "judul karya baru tampil di panel" ((Hits "$Base/admin" 'Uji dari panel') -gt 0)

""
"PASS=$pass FAIL=$fail"
if ($fail -gt 0) { exit 1 }
