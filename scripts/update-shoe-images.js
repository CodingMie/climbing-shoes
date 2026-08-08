import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('data/app.db');

// 获取所有鞋款
const shoes = db.prepare(`
  SELECT s.id, b.name as brand, s.model, s.images
  FROM shoe s
  JOIN brand b ON s.brand_id = b.id
`).all();

// 获取所有本地图片文件
const imageDir = 'public/shoe-images';
const imageFiles = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpg'));

// 创建图片文件名到路径的映射
const imageMap = new Map();
for (const file of imageFiles) {
  imageMap.set(file, `/shoe-images/${file}`);
}

// 匹配函数
function normalizeForFilename(str) {
  return str
    .toLowerCase()
    .replace(/[\s:：]+/g, '-')  // 空格和冒号替换为 -
    .replace(/[éè]/g, 'e')     // 处理特殊字符
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[öòóôõ]/g, 'o')
    .replace(/[üùúû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '') // 只保留字母数字和连字符
    .replace(/-+/g, '-')       // 多个连字符替换为一个
    .replace(/^-|-$/g, '');    // 去除首尾连字符
}

// 更新统计
let updated = 0;
let notFound = 0;
let alreadyCorrect = 0;
const updates = [];

for (const shoe of shoes) {
  const brandNorm = normalizeForFilename(shoe.brand);
  const modelNorm = normalizeForFilename(shoe.model);
  
  // 尝试多种匹配模式
  const patterns = [
    `${brandNorm}-${modelNorm}.jpg`,
    `${brandNorm}-${modelNorm.replace(/-/g, '')}.jpg`,
    `${brandNorm}-${modelNorm.replace(/-/g, ' ')}.jpg`,
  ];
  
  let matchedImage = null;
  for (const pattern of patterns) {
    if (imageMap.has(pattern)) {
      matchedImage = imageMap.get(pattern);
      break;
    }
  }
  
  // 如果没找到，尝试模糊匹配
  if (!matchedImage) {
    for (const [file, path] of imageMap) {
      const fileBase = file.replace('.jpg', '');
      if (fileBase.includes(brandNorm) && fileBase.includes(modelNorm.split('-')[0])) {
        matchedImage = path;
        break;
      }
    }
  }
  
  if (matchedImage) {
    const currentImages = JSON.parse(shoe.images);
    if (currentImages.length === 1 && currentImages[0] === matchedImage) {
      alreadyCorrect++;
    } else {
      updates.push({
        id: shoe.id,
        brand: shoe.brand,
        model: shoe.model,
        oldImages: shoe.images,
        newImages: JSON.stringify([matchedImage])
      });
      updated++;
    }
  } else {
    notFound++;
    console.log(`❌ 未找到图片: ${shoe.brand} ${shoe.model} (尝试: ${brandNorm}-${modelNorm}.jpg)`);
  }
}

// 执行更新
if (updates.length > 0) {
  console.log(`\n📝 准备更新 ${updates.length} 双鞋的图片:`);
  
  const updateStmt = db.prepare('UPDATE shoe SET images = ?, updated_at = unixepoch() WHERE id = ?');
  
  const updateTransaction = db.transaction((updates) => {
    for (const update of updates) {
      updateStmt.run(update.newImages, update.id);
      console.log(`✅ ${update.brand} ${update.model}: ${update.oldImages} → ${update.newImages}`);
    }
  });
  
  updateTransaction(updates);
}

// 输出统计
console.log(`\n📊 统计:`);
console.log(`- 已有正确图片: ${alreadyCorrect}`);
console.log(`- 新更新: ${updated}`);
console.log(`- 未找到图片: ${notFound}`);
console.log(`- 总计: ${shoes.length}`);

db.close();