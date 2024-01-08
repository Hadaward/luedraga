const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const AdmZip = require("adm-zip");

function calculateMD5(filePath) {
  const fileContent = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileContent).digest('hex');
}

function generateFileHashes(folder) {
  const fileHashes = {};

  const files = fs.readdirSync(folder);

  files.forEach((file) => {
    if (file.endsWith('manifest.json'))
        return;

    const filePath = path.join(folder, file);
    const hash = calculateMD5(filePath);
    fileHashes[file] = {
      path: filePath.replace(/\\/g, "/"),
      hash: hash,
      isZip: file.endsWith('.zip'),
      isLauncherPCK: file.endsWith('.pck'),
    };
	
    if (file.endsWith('.zip')) {
      fileHashes[file].entries = [];

      const zip = new AdmZip(filePath);

      zip.getEntries().forEach((entry) => {
        if (entry.isDirectory) {
          return;
        }

        const entryHash = crypto.createHash('md5').update(entry.getData()).digest('hex');
        
        fileHashes[file].entries.push({
          path: entry.entryName.replace(/\\/g, "/"),
          hash: entryHash
        })
      })
    }
  });

  const outputFilePath = 'files/manifest.json';
  fs.writeFileSync(outputFilePath, JSON.stringify(fileHashes));

  console.log(`File hashes generated and saved to ${outputFilePath}`);
}

generateFileHashes('files');