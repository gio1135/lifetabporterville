import fs from 'fs';
import path from 'path';

const targetDirs = ['src', '.vscode'];
const targetFiles = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'wrangler.jsonc',
  'prettier.config.js'
];

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf'].includes(ext)) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  content = content.replace(/[ \t\r\n]+$/, '');
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.svelte-kit' && file !== '.git') {
        walkDir(fullPath);
      }
    } else {
      processFile(fullPath);
    }
  }
}

for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    walkDir(dir);
  }
}

for (const file of targetFiles) {
  if (fs.existsSync(file)) {
    processFile(file);
  }
}
