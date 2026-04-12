import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, 'public');

async function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  for (const file of files) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  }
  return arrayOfFiles;
}

async function optimize() {
  console.log('--- Starting Image Optimization ---');
  const files = await getAllFiles(publicDir);
  console.log(`Found ${files.length} images to process.`);

  let totalSaved = 0;
  let count = 0;

  for (const filePath of files) {
    try {
      if (filePath.includes('.webp') || filePath.includes('.svg')) continue;

      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      
      const isEvent = filePath.includes('events');
      const isTeamMember = !isEvent && (path.basename(filePath).match(/(jpeg|jpg|png|webp)$/i) && fs.statSync(filePath).size > 0);
      
      // Heuristic: if it's in public root and looks like a profile pic, it's probably team
      const isTeam = !isEvent && filePath.includes('public') && path.dirname(filePath) === publicDir;

      let maxWidth = 1200;
      if (isEvent) maxWidth = 1600;
      if (isTeam) maxWidth = 600;

      const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      await sharp(filePath)
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(webpPath);
      
      const newStats = fs.statSync(webpPath);
      const newSize = newStats.size;

      // Delete original
      fs.unlinkSync(filePath);
      
      const saved = originalSize - newSize;
      if (saved > 0) totalSaved += saved;
      count++;
      console.log(`Optimized ${path.basename(filePath)} -> ${path.basename(webpPath)}: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB`);
    } catch (err) {
      console.error(`Error optimizing ${filePath}:`, err.message);
    }
  }

  console.log('--- Optimization Complete ---');
  console.log(`Processed ${count} images.`);
  console.log(`Total storage saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
