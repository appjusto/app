const { spawn, spawnSync } = require('child_process');
const { version } = require('../version.json');
const { ENV, FLAVOR } = process.env;

// Usage: ENV=staging FLAVOR=courier npm run publish-js

const run = async () => {
  if (!ENV) {
    console.error('ENV indefinido');
    process.exit(-1);
  }

  if (!FLAVOR) {
    console.error('FLAVOR indefinido');
    process.exit(-1);
  }

  const releaseChannel = `v${version.slice(0, version.indexOf('.'))}`;

  spawnSync('npm', ['run', 'prepare-env']);
  spawn('expo-cli', ['publish', '--release-channel', releaseChannel], {
    stdio: 'inherit',
  });
};

run()
  .then(() => null)
  .catch(console.error);
