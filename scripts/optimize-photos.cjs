const sharp = require('sharp');
const { readFile, mkdir, writeFile } = require('node:fs/promises');
const { createHash } = require('node:crypto');
const path = require('node:path');

// Generate at authoring time: visitors never wait for image encoding.
const widths = [320, 480, 640, 820, 1080, 1230, 1640];
async function main() {
  const manifest = {};
  for (let number = 1; number <= 7; number++) {
    const name = `photo-${String(number).padStart(2, '0')}`;
    const source = `/images/personal/${name}.${number === 1 ? 'png' : 'jpg'}`;
    const input = await readFile(path.join('public', source));
    const hash = createHash('sha256').update(input).update('lossless-webp-v1').digest('hex').slice(0, 16);
    const directory = `/images/optimized/${name}-${hash}`;
    await mkdir(path.join('public', directory), { recursive: true });
    manifest[source] = directory;
    for (const width of widths) {
      await sharp(input).rotate().resize({ width, withoutEnlargement: true })
        .keepIccProfile().webp({ lossless: true, effort: 6 })
        .toFile(path.join('public', directory, `${width}.webp`));
    }
  }
  await writeFile('src/content/photo-assets.json', `${JSON.stringify(manifest, null, 2)}\n`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
