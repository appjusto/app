const { spawn, spawnSync } = require('child_process');
const { version } = require('../version.json');
const { ENV, FLAVOR } = process.env;

const run = async () => {
  if (!ENV) {
    console.error('ENV indefinido');
    process.exit(-1);
  }

  if (!FLAVOR) {
    console.error('FLAVOR indefinido');
    process.exit(-1);
  }

  const { stdout } = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const branch = stdout.toString();
  if (branch !== ENV) {
    console.warn(`Atenção: a branch atual (${branch}) não é a branch do ambiente ${ENV}.`);
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  const releaseChannel = `v-${version.slice(0, version.indexOf('.'))}`;

  spawnSync('npm', ['run', 'prepare-env']);
  const child = spawn('expo', ['publish', '--release-channel', releaseChannel]);
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  child.on('error', (error) => {
    console.error(`${error.message}`);
    process.exit(code);
  });
  child.on('close', (code) => {
    process.exit(code);
  });
};

run()
  .then(() => null)
  .catch(console.error);
