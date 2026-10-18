#!/usr/bin/env node
/**
 * Makes the lines the admin panel needs, for `.env.local`.
 *
 *   npm run admin:password              → a fresh random password, printed once
 *   npm run admin:password -- "rahasia" → hash a password you chose
 *
 * Only the scrypt hash is stored on the server; the password itself is never
 * written down. The environment is read when the server starts, so restart it
 * after pasting these lines in.
 *
 * The separator is a colon, not `$`: dotenv-expand in .env.local would read
 * `scrypt$abc$def` as a variable reference and hand us `scrypt`.
 */

import { randomBytes, scryptSync } from "node:crypto";

const provided = process.argv[2];
const password = provided ?? randomBytes(12).toString("base64url");
const salt = randomBytes(16);
const hash = scryptSync(password.normalize("NFKC"), salt, 64);

console.log("");
console.log("# Tempel di .env.local lalu jalankan ulang server.");
console.log("ADMIN_USERNAME=admin");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log("");
console.log(`Password: ${password}`);
console.log("");
console.log("Simpan password itu. Yang tersimpan di server hanya sidik jarinya,");
console.log("jadi tidak ada cara membacanya kembali dari file itu.");
