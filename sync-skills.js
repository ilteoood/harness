#!/usr/bin/env node
import { execSync } from 'child_process';
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const config = (await import('./sync-config.js')).default;

const headers = {
  Accept: 'application/vnd.github.raw',
  Authorization: `Bearer ${execSync('gh auth token', { encoding: 'utf8' }).trim()}`,
};

async function ghJson(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers: { ...headers, Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${res.statusText}`);
  return res.json();
}

async function ghRaw(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${res.statusText}`);
  return Buffer.from(await res.arrayBuffer());
}

for (const { repo, branch = 'main', skillsPath = 'skills', skills } of config) {
  console.log(`Syncing from ${repo} (${branch})...`);

  const commit = (await ghJson(`/repos/${repo}/branches/${branch}`)).commit.sha;
  const tree = (await ghJson(`/repos/${repo}/git/trees/${commit}?recursive=1`)).tree;

  for (const { name, category, path: skillPath } of skills) {
    const prefix = `${skillPath ?? `${skillsPath}/${name}`}/`;
    const blobs = tree.filter(t => t.type === 'blob' && t.path.startsWith(prefix));
    if (!blobs.length) {
      console.log(`  ${name}: not found, skipping`);
      continue;
    }

    const dir = join(__dirname, 'skills', category, name);
    await mkdir(dir, { recursive: true });

    await Promise.all(blobs.map(async blob => {
      const relativePath = blob.path.slice(prefix.length);
      const localPath = join(dir, relativePath);
      await mkdir(dirname(localPath), { recursive: true });
      const content = await ghRaw(`/repos/${repo}/git/blobs/${blob.sha}`);
      await writeFile(localPath, content);
      console.log(`  + ${category}/${name}/${relativePath}`);
    }));
  }
}

console.log('Done!');
