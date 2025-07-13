const fs = require("fs");
const path = require("path");

// Root directory to scan
const rootDir = path.resolve(__dirname, "path/to/react/project");

const i18nRegex = /t\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
let results = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  let match;
  while ((match = i18nRegex.exec(content)) !== null) {
    results.push({
      string: match[1],
      file: filePath,
      index: match.index,
    });
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      scanFile(fullPath);
    }
  });
}

walk(rootDir);

// Prepare log content
const logContent = ["🔍 Found i18n strings:"];
results.forEach(r => {
  const logEntry = `- "${r.string}" in ${r.file}`;
  logContent.push(logEntry);
});

// Output to console
console.log("🔍 Found i18n strings:");
results.forEach(r => {
  console.log(`- "${r.string}" in ${r.file}`);
});

// Write to log file
const logFilePath = path.join(__dirname, "i18n-scan-results.log");
fs.writeFileSync(logFilePath, logContent.join("\n"), "utf-8");
console.log(`\n📝 Results also saved to: ${logFilePath}`);
