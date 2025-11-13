
const fs = require('fs');
const path = require('path');

function readData(filename) {
  const filePath = path.join(__dirname, 'data', filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function writeData(filename, data) {
  const filePath = path.join(__dirname, 'data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
