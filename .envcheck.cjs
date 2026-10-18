/* Throwaway diagnostic: shows exactly what Next hands the server. */
const { loadEnvConfig } = require("@next/env");
const { scryptSync, timingSafeEqual } = require("node:crypto");

loadEnvConfig(process.cwd(), false, { info: () => {}, error: () => {} });

const user = process.env.ADMIN_USERNAME ?? "";
const value = process.env.ADMIN_PASSWORD_HASH ?? "";
const secret = process.env.ADMIN_SESSION_SECRET ?? "";

console.log("ADMIN_USERNAME       =", JSON.stringify(user));
console.log("ADMIN_SESSION_SECRET =", secret ? `set (${secret.length} chars)` : "MISSING");
console.log("ADMIN_PASSWORD_HASH  =", JSON.stringify(value));

const parts = value.split(/[:$]/);
console.log("parts after split    =", parts.length, parts.map((one) => `${one.length}`).join("/"));

if (parts.length === 3) {
  const salt = Buffer.from(parts[1].trim(), "base64url");
  const hash = Buffer.from(parts[2].trim(), "base64url");
  const actual = scryptSync("4608bdbca933d865".normalize("NFKC"), salt, hash.length);
  console.log("salt bytes           =", salt.length, "hash bytes =", hash.length);
  console.log("password matches     =", timingSafeEqual(actual, hash));
}
