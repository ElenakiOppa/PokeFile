import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [{ language: 'en', setId: 'me05' }, { language: 'en', setId: 'me04' }];

for (const target of targets) {
  const apiRoot = `https://api.tcgdex.net/v2/${target.language}`;
  const set = await fetch(`${apiRoot}/sets/${target.setId}`).then((response) => response.json());
  const cards = await Promise.all(set.cards.map((card) => (
    fetch(`${apiRoot}/cards/${card.id}`).then((response) => response.json())
  )));
  const payload = {
    provider: 'tcgdex',
    apiVersion: 'v2',
    fetchedAt: new Date().toISOString(),
    language: target.language,
    set,
    cards,
  };
  const directory = path.join(root, 'data', 'providers', 'tcgdex');
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, `${target.setId}.json`), `${JSON.stringify(payload)}\n`, 'utf8');
}
