const sharp = require('sharp');
const { readFile, mkdir, writeFile } = require('node:fs/promises');
const { createHash } = require('node:crypto');
const path = require('node:path');

// Encode at authoring time. Content hashes make the existing immutable cache safe.
const pieces = [
  { key: 'orena', title: 'Orena' },
  { key: 'seattle', title: 'Seattle' },
  { key: 'waterloo', title: 'Waterloo' },
  { key: 'waves', title: 'Waves' },
];
async function main() {
  const manifest = [];
  for (const piece of pieces) {
    const input = await readFile(path.join('artwork', 'entrance', `${piece.key}.png`));
    const { width, height } = await sharp(input).metadata();
    const hash = createHash('sha256').update(input).update('entrance-webp-q84-v1').digest('hex').slice(0, 12);
    const directory = `/images/optimized/entrance-${piece.key}-${hash}`;
    await mkdir(path.join('public', directory), { recursive: true });
    for (const size of [480, 840]) {
      await sharp(input).resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 84, effort: 6 })
        .toFile(path.join('public', directory, `${size}.webp`));
    }
    manifest.push({ ...piece, src: `${directory}/480.webp`, srcSet: `${directory}/480.webp 480w, ${directory}/840.webp 840w`, width, height });
  }
  await writeFile('src/content/entrance-art.json', `${JSON.stringify(manifest, null, 2)}\n`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
