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
  console.log(`Found ${files.length} images to optimize.`);

  let totalSaved = 0;

  for (const filePath of files) {
    try {
      const stats = fs.statSync(filePath);
      const originalSize = stats.size;
      
      // Don't process if already small (e.g. < 100KB) unless it's huge in dimensions
      if (originalSize < 100 * 1024) {
        // console.log(`Skipping ${path.basename(filePath)} (already small: ${(originalSize / 1024).toFixed(2)} KB)`);
        // continue;
      }

      const ext = path.extname(filePath).toLowerCase();
      const isEvent = filePath.includes('events');
      const maxWidth = isEvent ? 1920 : 800;
      
      const tempPath = filePath + '.tmp';
      
      let pipeline = sharp(filePath)
        .resize({ width: maxWidth, withoutEnlargement: true });

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: 80, palette: true });
      }

      await pipeline.toFile(tempPath);
      
      const newStats = fs.statSync(tempPath);
      const newSize = newStats.size;

      if (newSize < originalSize) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        const saved = originalSize - newSize;
        totalSaved += saved;
        console.log(`Optimized ${path.basename(filePath)}: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024).toFixed(2)} KB (Saved ${(saved / 1024 / 1024).toFixed(2)} MB)`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`Skipped ${path.basename(filePath)}: No size reduction.`);
      }
    } catch (err) {
      console.error(`Error optimizing ${filePath}:`, err.message);
    }
  }

  console.log('--- Optimization Complete ---');
  console.log(`Total storage saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
