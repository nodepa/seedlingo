#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const getFileList = (basePath, extensions) => {
  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const files = entries.filter(
    (entry) => !entry.isDirectory() &&
      extensions.includes(path.extname(entry.name))
  ).map(
    (entry) => `${basePath}/${entry.name}`
  );
  return files.concat(
    ...folders.map((folder) => getFileList(`${basePath}/${folder}`, extensions))
  );
}

const contentFolder = path.resolve(__dirname);

console.log(`Processing ${contentFolder} and subfolders for mp3 files...`);
const processables = getFileList(contentFolder, ['.mp3']);

console.log(`Encoding ${processables.length} files to base64...\n`);
processables.forEach((entry) => {
  console.log(`${entry}.audio`);
  fs.writeFileSync(
    `${entry}.audio`,
    fs.readFileSync(entry).toString('base64'),
  );
});
console.log(`${processables.length} base64 encoded files written`);
