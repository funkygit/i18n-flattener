import fs from 'fs';
import path from 'path';

const inputDir = './input';
const outputDir = './output';

function flattenTranslations(obj, prefix = '') {
  const flat = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(flat, flattenTranslations(obj[key], prefix + key + '.'));
    } else {
      flat[prefix + key] = obj[key];
    }
  }

  return flat;
}

function processFile(fileName) {
  const inputPath = path.join(inputDir, fileName);
  const outputPath = path.join(outputDir, fileName);

  const raw = fs.readFileSync(inputPath, 'utf8');
  const json = JSON.parse(raw);
  const flattened = flattenTranslations(json);

  fs.writeFileSync(outputPath, JSON.stringify(flattened, null, 2), 'utf8');
  console.log(`✔ Flattened: ${fileName}`);
}

function run() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));
  files.forEach(processFile);
}

run();
