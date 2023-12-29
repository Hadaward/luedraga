const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const folderPath = 'files';

function calculateMD5(filePath) {
  const fileContent = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileContent).digest('hex');
}

function generateFileHashes() {
  const fileHashes = {};

  // Read files from the specified folder
  const files = fs.readdirSync(folderPath);

  // Generate hashes for each file
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const hash = calculateMD5(filePath);
    fileHashes[file] = hash;
  });

  // Write the hashes to a JSON file
  const outputFilePath = 'files/hash.json';
  fs.writeFileSync(outputFilePath, JSON.stringify(fileHashes, null, 2));

  console.log(`File hashes generated and saved to ${outputFilePath}`);
}

generateFileHashes();
