#!/usr/bin/env node

// Requires the GNU core utility 'sha1sum' to be installed

const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

const getFileList = (fullPath, extensions) => {
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  const files = entries.filter(
    (entry) => !entry.isDirectory() &&
      extensions.includes(path.extname(entry.name))
  ).map(
    (entry) => `${fullPath}/${entry.name}`
  );
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  return files.concat(
    ...folders.map((folder) => getFileList(`${fullPath}/${folder}`, extensions))
  );
}

const contentFolder = path.resolve(__dirname);
console.log(`Processing ${contentFolder} for CC-BY-SA-4.0 licensed files\n`);

const files = getFileList(contentFolder, ['.json', '.mp3']);
const hashes = files.map((file) => {
  return {
    relPath: file.substring(contentFolder.length + 1),
    hash: crypto
      .createHash('sha1')
      .update(fs.readFileSync(file))
      .digest('hex')
      .toUpperCase(),
  };
});

const metaFile =  path.resolve(contentFolder, 'LICENSE.md');
const currentMetadata = fs.readFileSync(metaFile, {encoding: 'utf8' });
const newOrChanged = hashes.filter(
  (entry) => !currentMetadata.includes(entry.hash)
);
const webStatements = newOrChanged.reduce((list, entry) => {
  console.log(entry.hash, entry.relPath)
  return `${list}${list ? "\n" : ''}<p>` +
    '<a href="https://github.com/nodepa/seedlingo-en/blob/main/content/' +
    `${entry.relPath}">${path.basename(entry.relPath)}</a> ` +
    `is licensed to the public under <a about="urn:sha1:${entry.hash}" ` +
    'rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">' +
    'CC BY-SA 4.0</a>.</p>';
}, '');

if (newOrChanged && webStatements) {
  console.log(`\nWriting ${newOrChanged.length} new webstatements to ${metaFile}`);
  try {
    fs.writeFileSync(
      metaFile,
      `\n${webStatements}`,
      { flag: 'a' }
    );
  } catch (error) {
    console.log(error);
  }
} else {
  console.log(
    `No files diverge from previously hashed versions. No updates made to LICENSE.md`
  );
};
