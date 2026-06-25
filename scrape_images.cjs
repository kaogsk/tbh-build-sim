const fs = require('fs');
const https = require('https');
const path = require('path');

const wikiDbPath = path.join(__dirname, 'public', 'wiki_db.json');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(wikiDbPath)) {
  console.error('wiki_db.json not found in public folder!');
  process.exit(1);
}

const wiki_db = JSON.parse(fs.readFileSync(wikiDbPath, 'utf-8'));
const icons = new Set();

// Extract all icon paths from the database
for (const key in wiki_db) {
  const table = wiki_db[key];
  if (Array.isArray(table)) {
    table.forEach(row => {
      if (row.icon) icons.add(row.icon);
      if (row.dead_icon) icons.add(row.dead_icon);
    });
  } else if (typeof table === 'object' && table !== null) {
    for (const k2 in table) {
      const row = table[k2];
      if (row) {
        if (row.icon) icons.add(row.icon);
        if (row.dead_icon) icons.add(row.dead_icon);
      }
    }
  }
}

const iconPaths = Array.from(icons).filter(p => p.startsWith('/game') || p.startsWith('game'));
console.log(`Found ${iconPaths.length} distinct game icons to download.`);

const CONCURRENCY_LIMIT = 15;
let activeRequests = 0;
let currentIndex = 0;
let successCount = 0;
let failCount = 0;

function downloadNext() {
  if (currentIndex >= iconPaths.length) {
    if (activeRequests === 0) {
      console.log(`\nAll done! Successfully downloaded: ${successCount}, Failed: ${failCount}`);
    }
    return;
  }

  const origPath = iconPaths[currentIndex++];
  const cleanPath = origPath.startsWith('/') ? origPath.slice(1) : origPath;
  const destPath = path.join(publicDir, ...cleanPath.split('/'));
  const destDir = path.dirname(destPath);
  const url = `https://taskbarhero.wiki/${cleanPath}`;

  activeRequests++;

  // Ensure directories exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Skip if already exists
  if (fs.existsSync(destPath)) {
    successCount++;
    activeRequests--;
    downloadNext();
    return;
  }

  const fileStream = fs.createWriteStream(destPath);
  
  https.get(url, (res) => {
    if (res.statusCode === 200) {
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        successCount++;
        process.stdout.write('.');
        activeRequests--;
        downloadNext();
      });
    } else {
      fileStream.close();
      fs.unlinkSync(destPath); // Remove empty file
      failCount++;
      console.error(`\nFailed to download ${url}: status ${res.statusCode}`);
      activeRequests--;
      downloadNext();
    }
  }).on('error', (err) => {
    fileStream.close();
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    failCount++;
    console.error(`\nError downloading ${url}: ${err.message}`);
    activeRequests--;
    downloadNext();
  });
}

// Start initial requests
for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
  downloadNext();
}
