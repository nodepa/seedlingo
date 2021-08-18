#!/usr/bin/env node

// Requires the GNU core utility 'sha1sum' to be installed

const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const contentFolder = path.resolve(__dirname);
const metaFile =  path.resolve(contentFolder, 'LICENSE.md');


exec(`sha1sum ${contentFolder}/**/*`, (err, stdout, stderr) => {
  if (err) {
    console.log('error:');
    console.error(err);
  } else if (stderr) {
    console.log('stderr:');
    console.log(stderr);
  } else {
    if (!stdout) {
      console.log('no output');
    } else {
      console.log(`Processing ${contentFolder} for CC-BY-SA-4.0 licensed files`);

      // Reformat to a WebStatement:
      // https://wiki.creativecommons.org/wiki/Web_Statement
      // Assumptions about 'stdout':
      // Each line starts with a sha1 hash
      // followed by two spaces
      // followed by the folder and the folder delimiter '/'
      // followed by the name of the file that was hashed
      // followed by a newline
      const currentMetadata = fs.readFileSync(metaFile, {encoding: 'utf8' });
      const lines = stdout.split("\n");
      const hashAndFilename = new RegExp(`(.+)  ${contentFolder}\/(.+)`, 'g');
      const out = lines.reduce((list, line)=> {
        return list + line.replace(hashAndFilename, (match, hash, filename) => {
          // Do not duplicate existing hashes/files
          if (currentMetadata.includes(hash.toUpperCase())) {
            return '';
          } else {
            return `<p><a href="https://github.com/nodepa/seedling/blob/main/content/${filename}">${filename}</a> is licensed under a ` +
              `<a about="urn:sha1:${hash.toUpperCase()}" rel="license" ` +
              `href="http://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> license.</p>\n`;
          }
        });
      }, '');

      console.log('These are the new or changed files:');
      console.log(out);

      try {
        fs.writeFileSync(
          metaFile,
          out,
          { flag: 'a' }
        );
      } catch (error) {
        console.log(error);
      }
      console.log(`^^^ was added to ${metaFile}`);
    }
  }
});

