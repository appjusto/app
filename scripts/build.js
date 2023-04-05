const { spawn, spawnSync } = require('child_process');
const { version } = require('../version.json');
const { ENV, FLAVOR, PLATFORM, DISTRIBUTION } = process.env;
require('dotenv').config();

// Usage: ENV=dev FLAVOR=courier npm run build-js
// Usage: ENV=dev FLAVOR=consumer DISTRIBUTION=devclient npm run build-js
// Usage: ENV=staging FLAVOR=courier PLATFORM=ios npm run build-js
// Usage: ENV=live FLAVOR=consumer DISTRIBUTION=store npm run build-js

const run = async () => {
  if (!ENV) {
    console.error('ENV indefinido');
    process.exit(-1);
  }

  if (!FLAVOR) {
    console.error('FLAVOR indefinido');
    process.exit(-1);
  }

  if (!PLATFORM) {
    console.warn('PLATFORM não definido: usando android');
  }

  const releaseChannel = `v${version.slice(0, version.indexOf('.'))}`;
  const platform = PLATFORM ?? 'android';
  const distribution = DISTRIBUTION ?? 'internal';
  const profile = `${FLAVOR}-${releaseChannel}-${distribution}-${ENV}`;

  spawnSync('npm', ['run', 'prepare-env']);
  process.env['EAS_NO_VCS'] = '1';
  spawn('eas', ['build', '--platform', platform, '--profile', profile], { stdio: 'inherit' });
};

run()
  .then(() => null)
  .catch(console.error);
