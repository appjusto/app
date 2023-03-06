const { spawn, spawnSync } = require('child_process');
const { version } = require('../version.json');
const { ENV, FLAVOR, PLATFORM, DISTRIBUTION, TOOL } = process.env;
require('dotenv').config();

// Usage: ENV=dev FLAVOR=courier npm run build-js
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

  const { stdout } = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const branch = stdout.toString().trim();
  if (branch !== ENV) {
    console.warn(`Atenção: a branch atual (${branch}) não é a branch do ambiente ${ENV}.`);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  const releaseChannel = `v${version.slice(0, version.indexOf('.'))}`;
  const platform = PLATFORM ?? 'android';
  const distribution = DISTRIBUTION ?? 'internal';
  const profile = `${FLAVOR}-${releaseChannel}-${distribution}-${ENV}`;

  spawnSync('npm', ['run', 'prepare-env']);

  const tool = TOOL ?? (FLAVOR === 'business' ? 'expo' : 'eas');
  if (tool === 'eas') {
    process.env['EAS_NO_VCS'] = '1';
    spawn('eas', ['build', '--platform', platform, '--profile', profile], { stdio: 'inherit' });
  } else {
    const buildType =
      distribution === 'internal' ? 'apk' : platform === 'android' ? 'app-bundle' : 'archive';
    spawn('expo', [`build:${platform}`, '-t', buildType, '--release-channel', releaseChannel], {
      stdio: 'inherit',
    });
  }
};

run()
  .then(() => null)
  .catch(console.error);
