// Temporary bootstrap: expose only changed tracked project text and generated lockfile.
// The workflow has read-only permissions; no automatic commits.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const paths = execFileSync('git', ['diff', '--name-only', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
if (existsSync('package-lock.json')) paths.push('package-lock.json');
for (const path of [...new Set(paths)]) {
  const source = readFileSync(path, 'utf8');
  const chars = Array.from(source);
  const size = 2500;
  const total = Math.max(1, Math.ceil(chars.length / size));
  for (let part = 0; part < total; part++) {
    console.log('CME_PATCH ' + JSON.stringify({ path, part, total, text: chars.slice(part * size, (part + 1) * size).join('') }));
  }
}
