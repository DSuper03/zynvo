const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const imageExtensions = ['.jpg', '.jpeg', '.png'];

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`✅ Converted: ${inputPath} → ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error.message);
  }
}

async function processDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (imageExtensions.includes(path.extname(item).toLowerCase())) {
      const webpPath = fullPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Only convert if WebP doesn't exist or is older
      if (!fs.existsSync(webpPath) || 
          fs.statSync(fullPath).mtime > fs.statSync(webpPath).mtime) {
        await convertToWebP(fullPath, webpPath);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting image conversion to WebP...');
  
  if (!fs.existsSync(publicDir)) {
    console.error('❌ Public directory not found');
    return;
  }
  
  await processDirectory(publicDir);
  console.log('✨ Image conversion completed!');
}

main().catch(console.error);