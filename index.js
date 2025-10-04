import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { pipeline } from '@xenova/transformers';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { insertImage, isIndexed } from './db.cjs';

const useGemini = !!process.env.GOOGLE_API_KEY;

async function loadModel() {
  if (useGemini) {
    console.log('Using Google Gemini AI (online mode)');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } else {
    console.log('Loading local AI model (this may take a while on first run)...');
    return await pipeline('image-to-text', 'Xenova/blip-image-captioning-base');
  }
}

async function processImage(filePath, model) {
  try {
    // Convert image to JPEG buffer
    const buffer = await sharp(filePath).jpeg().toBuffer();

    if (useGemini) {
      // Write to temp file for upload
      const tempPath = path.join(process.cwd(), 'temp_image.jpg');
      fs.writeFileSync(tempPath, buffer);
      const uploadResult = await model.uploadFile(tempPath);
      fs.unlinkSync(tempPath); // Clean up

      const result = await model.generateContent([
        "Describe this image in as much detail as possible, including any text, objects, people, scenes, colors, and context.",
        { fileData: { fileUri: uploadResult.file.uri, mimeType: uploadResult.file.mimeType } }
      ]);
      return result.response.text().trim();
    } else {
      // Local model
      const result = await model(buffer);
      return result[0].generated_text;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

async function indexFolder(folderPath, model) {
  const supportedExts = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.nef', '.cr2', '.arw', '.dng', '.raw'];
  const files = [];

  function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (supportedExts.includes(path.extname(item).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  walk(folderPath);

  console.log(`Found ${files.length} images to process.`);

  for (const file of files) {
    if (!isIndexed(file)) {
      console.log(`Processing ${file}`);
      const desc = await processImage(file, model);
      if (desc) {
        insertImage(file, desc);
        console.log(`Indexed: ${desc}`);
      } else {
        console.log(`Skipped ${file}`);
      }
    } else {
      console.log(`Already indexed ${file}`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.log('Usage: node index.js <folder_path>');
    process.exit(1);
  }

  const folder = args[0];
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    console.log(`Folder ${folder} does not exist or is not a directory`);
    process.exit(1);
  }

  const model = await loadModel();
  await indexFolder(folder, model);
  console.log('Indexing complete.');
}

main().catch(console.error);