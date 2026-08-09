import fs from "node:fs";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db/index.ts";
import { brand, shoe } from "../src/db/schema.ts";

const seedSource = fs.readFileSync("scripts/seed.ts", "utf8");
const match = seedSource.match(/const SHOES: SeedShoe\[\] = (\[[\s\S]*?\n\]);\n\nfunction /);
if (!match) throw new Error("SHOES array not found");
const seedShoes = new Function(`return ${match[1]}`)() as {
  brand: string;
  model: string;
}[];
const seedKeys = new Set(seedShoes.map((s) => `${s.brand}\u0000${s.model}`));

const db = getDb();
const dbKeys = new Set(
  (
    await db
      .select({ brandName: brand.name, model: shoe.model })
      .from(shoe)
      .innerJoin(brand, eq(shoe.brandId, brand.id))
      .all()
  ).map((row) => `${row.brandName}\u0000${row.model}`),
);

const inSeedNotDb = seedShoes.filter((s) => !dbKeys.has(`${s.brand}\u0000${s.model}`));
const inDbNotSeed = [...dbKeys].filter((k) => !seedKeys.has(k));

console.log("=== in seed but NOT in db ===");
for (const s of inSeedNotDb) console.log(`${s.brand}\t${s.model}`);
console.log(`count: ${inSeedNotDb.length}`);

console.log("=== in db but NOT in seed ===");
for (const k of inDbNotSeed) console.log(k.replace("\u0000", "\t"));
console.log(`count: ${inDbNotSeed.length}`);
