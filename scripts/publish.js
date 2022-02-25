const { spawnSync } = require('child_process');
const { version } = require('../version.json');
const { ENV, FLAVOR } = process.env;

if (!ENV) {
  console.error('ENV indefinido');
  process.exit(-1);
}

if (!FLAVOR) {
  console.error('FLAVOR indefinido');
  process.exit(-1);
}

const releaseChannel = `v-${version.slice(0, version.indexOf('.'))}`;

spawnSync('npm', ['run', 'prepare-env']);
spawnSync('expo'[('publish', '--release-channel', releaseChannel)]);
