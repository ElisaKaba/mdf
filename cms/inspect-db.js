const Database = require("better-sqlite3");

const db = new Database(".tmp/data.db", { readonly: true });

const columns = db
  .prepare("PRAGMA table_info(strapi_history_versions)")
  .all();

console.log("===== COLONNES =====");
console.table(columns);

const rows = db
  .prepare(`
    SELECT *
    FROM strapi_history_versions
    ORDER BY id DESC
    LIMIT 100
  `)
  .all();

console.log("\n===== HISTORIQUE =====");
console.dir(rows, { depth: null });