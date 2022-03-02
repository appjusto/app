const fs = require('fs');

const packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const versionJSON = JSON.parse(fs.readFileSync('./version.json', 'utf-8'));
const data = JSON.stringify(
  {
    version: packageJSON.version,
    versionCode: versionJSON.versionCode + 1,
  },
  undefined,
  '  '
);
fs.writeFileSync('./version.json', data);
