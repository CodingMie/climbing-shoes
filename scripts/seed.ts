import fs from "node:fs";
import path from "node:path";
import { getDb } from "../src/db/index.ts";
import {
  brand,
  shoe,
  type ShoeScenario,
  type SHOE_CLOSURES,
  type SHOE_DOWNTURNS,
  type SHOE_LEVELS,
  type SHOE_STIFFNESS,
  type SHOE_WIDTHS,
} from "../src/db/schema.ts";

type SeedBrand = {
  name: string;
  description: string;
};

type SeedShoe = {
  brand: string;
  model: string;
  variant?: string;
  price: number;
  scenarios: ShoeScenario[];
  stiffness: (typeof SHOE_STIFFNESS)[number];
  width: (typeof SHOE_WIDTHS)[number];
  level: (typeof SHOE_LEVELS)[number];
  downturn: (typeof SHOE_DOWNTURNS)[number];
  closure: (typeof SHOE_CLOSURES)[number];
  material: string;
};

const BRANDS: SeedBrand[] = [
  { name: "La Sportiva", description: "意大利顶级品牌，竞技与高性能攀岩鞋的代名词。" },
  { name: "Scarpa", description: "意大利老牌，性能与舒适兼备，产品线覆盖全场景。" },
  { name: "Tenaya", description: "西班牙品牌，以舒适包裹与精准脚感著称。" },
  { name: "Evolv", description: "美国品牌，抱石与馆内场景的热门选择。" },
  { name: "Unparallel", description: "韩国品牌，橡胶性能出色，性价比高。" },
  { name: "Boreal", description: "西班牙品牌，攀岩橡胶技术的先行者。" },
  { name: "Mad Rock", description: "美国品牌，高性价比，新手友好。" },
  { name: "Butora", description: "韩国品牌，以合脚舒适与扎实做工闻名。" },
];

const SHOES: SeedShoe[] = [
  {
    brand: "La Sportiva",
    model: "Solution",
    price: 1380,
    scenarios: ["抱石"],
    stiffness: "软",
    width: "窄",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "La Sportiva",
    model: "Miura",
    variant: "系带版",
    price: 1180,
    scenarios: ["难度", "馆内全能"],
    stiffness: "硬",
    width: "窄",
    level: "极致性能",
    downturn: "适度",
    closure: "系带",
    material: "皮革",
  },
  {
    brand: "La Sportiva",
    model: "Katana",
    price: 1080,
    scenarios: ["馆内全能", "难度"],
    stiffness: "中",
    width: "中",
    level: "进阶",
    downturn: "适度",
    closure: "魔术贴",
    material: "皮革",
  },
  {
    brand: "La Sportiva",
    model: "Tarantulace",
    price: 680,
    scenarios: ["馆内全能"],
    stiffness: "软",
    width: "宽",
    level: "入门",
    downturn: "自然",
    closure: "系带",
    material: "皮革",
  },
  {
    brand: "La Sportiva",
    model: "Finale",
    price: 850,
    scenarios: ["馆内全能"],
    stiffness: "软",
    width: "宽",
    level: "入门",
    downturn: "自然",
    closure: "套脚",
    material: "皮革",
  },
  {
    brand: "La Sportiva",
    model: "Mythos",
    price: 980,
    scenarios: ["传统多段", "馆内全能"],
    stiffness: "软",
    width: "宽",
    level: "进阶",
    downturn: "自然",
    closure: "系带",
    material: "皮革",
  },
  {
    brand: "Scarpa",
    model: "Instinct",
    variant: "VS",
    price: 1280,
    scenarios: ["抱石", "馆内全能"],
    stiffness: "中",
    width: "中",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Scarpa",
    model: "Vapor V",
    price: 1050,
    scenarios: ["馆内全能", "难度"],
    stiffness: "中",
    width: "中",
    level: "进阶",
    downturn: "适度",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Scarpa",
    model: "Booster",
    price: 1250,
    scenarios: ["抱石"],
    stiffness: "软",
    width: "窄",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Tenaya",
    model: "Masai",
    price: 1150,
    scenarios: ["抱石"],
    stiffness: "软",
    width: "中",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "超细纤维",
  },
  {
    brand: "Tenaya",
    model: "Mundaka",
    price: 1180,
    scenarios: ["抱石", "竞技"],
    stiffness: "软",
    width: "中",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "超细纤维",
  },
  {
    brand: "Tenaya",
    model: "Tanta",
    price: 880,
    scenarios: ["馆内全能"],
    stiffness: "软",
    width: "宽",
    level: "入门",
    downturn: "自然",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Evolv",
    model: "Shaman",
    price: 1200,
    scenarios: ["抱石"],
    stiffness: "软",
    width: "中",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Evolv",
    model: "Defy",
    price: 950,
    scenarios: ["馆内全能", "抱石"],
    stiffness: "中",
    width: "中",
    level: "进阶",
    downturn: "适度",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Unparallel",
    model: "Regulus",
    price: 900,
    scenarios: ["抱石"],
    stiffness: "软",
    width: "窄",
    level: "极致性能",
    downturn: "激进",
    closure: "魔术贴",
    material: "合成纤维",
  },
  {
    brand: "Boreal",
    model: "Ninja",
    price: 1050,
    scenarios: ["竞技", "难度"],
    stiffness: "硬",
    width: "窄",
    level: "极致性能",
    downturn: "适度",
    closure: "系带",
    material: "皮革",
  },
  {
    brand: "Mad Rock",
    model: "Drifter",
    price: 550,
    scenarios: ["馆内全能"],
    stiffness: "软",
    width: "宽",
    level: "入门",
    downturn: "自然",
    closure: "系带",
    material: "皮革",
  },
  {
    brand: "Butora",
    model: "Mana",
    price: 750,
    scenarios: ["馆内全能"],
    stiffness: "软",
    width: "中",
    level: "入门",
    downturn: "自然",
    closure: "魔术贴",
    material: "亚麻",
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function brandHue(name: string): number {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.codePointAt(0)!) % 360;
  return hash;
}

function writeSeedImage(shoe: SeedShoe): string {
  const slug = `${slugify(shoe.brand)}-${slugify(shoe.model)}${
    shoe.variant ? `-${slugify(shoe.variant)}` : ""
  }`;
  const publicPath = `/seed/${slug}.svg`;
  const filePath = path.join(process.cwd(), "public", publicPath.slice(1));
  const hue = brandHue(shoe.brand);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="hsl(${hue}, 45%, 30%)"/>
  <rect x="24" y="24" width="752" height="552" fill="none" stroke="hsl(${hue}, 40%, 55%)" stroke-width="2" rx="12"/>
  <text x="400" y="280" font-family="sans-serif" font-size="44" fill="#ffffff" text-anchor="middle">${shoe.brand}</text>
  <text x="400" y="345" font-family="sans-serif" font-size="34" fill="hsl(${hue}, 30%, 85%)" text-anchor="middle">${shoe.model}${
    shoe.variant ? ` ${shoe.variant}` : ""
  }</text>
</svg>
`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, svg);
  return publicPath;
}

const db = getDb();

db.delete(shoe).run();
db.delete(brand).run();

const brandIds = new Map<string, number>();
for (const seedBrand of BRANDS) {
  const row = db.insert(brand).values(seedBrand).returning().get();
  brandIds.set(seedBrand.name, row.id);
}

for (const seedShoe of SHOES) {
  const brandId = brandIds.get(seedShoe.brand);
  if (!brandId) throw new Error(`未知品牌: ${seedShoe.brand}`);
  db.insert(shoe)
    .values({
      brandId,
      model: seedShoe.model,
      variant: seedShoe.variant ?? null,
      price: seedShoe.price,
      scenarios: seedShoe.scenarios,
      stiffness: seedShoe.stiffness,
      width: seedShoe.width,
      level: seedShoe.level,
      downturn: seedShoe.downturn,
      closure: seedShoe.closure,
      material: seedShoe.material,
      images: [writeSeedImage(seedShoe)],
      status: "approved",
    })
    .run();
}

console.log(`seeded: ${BRANDS.length} brands, ${SHOES.length} shoes`);
