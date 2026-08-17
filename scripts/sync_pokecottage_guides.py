import html
import json
import re
import time
import urllib.request
from io import BytesIO
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
INDEX = 'https://pokecottage.com/pokemon-master-set-guides'

def get(url, attempts=3):
    request = urllib.request.Request(url, headers={'User-Agent': 'PokeFile data-quality sync/1.0'})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except Exception:
            if attempt == attempts - 1:
                raise
            time.sleep(1 + attempt)

def text_content(raw):
    value = raw.decode('utf-8', errors='replace')
    value = re.sub(r'(?is)<script.*?</script>|<style.*?</style>', ' ', value)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', value))).strip()

def slug(value):
    value = html.unescape(value).lower().replace('&', ' ')
    return re.sub(r'[^a-z0-9]+', '-', value).strip('-')

raw_sets = json.loads((ROOT / 'data' / 'scrydex' / 'sets.json').read_text(encoding='utf-8'))
english_sets = [item for item in raw_sets['sets'] if item.get('category') == 'English']
aliases = {slug(item['name']): item['id'] for item in english_sets}
aliases.update({
    '151': 'sv3pt5',
    'scarlet-violet': 'sv1',
    'sword-shield': 'swsh1',
    'pokemon-go': 'pgo',
    'shining-fates': 'swsh45',
    'crown-zenith': 'swsh12pt5',
    'celebrations': 'cel25',
})

index_html = get(INDEX).decode('utf-8', errors='replace')
urls = sorted(set(re.findall(r'https://pokecottage\.com/[a-z0-9-]+-master-set-guide/?', index_html)))
guides = []
unmapped = []

for guide_url in urls:
    guide_slug = guide_url.rstrip('/').split('/')[-1].removesuffix('-master-set-guide')
    set_id = aliases.get(guide_slug)
    try:
        page = get(guide_url)
    except Exception as error:
        unmapped.append({'slug': guide_slug, 'url': guide_url, 'error': str(error)})
        continue
    page_text = text_content(page)
    master_match = re.search(r'Master Set (?:contains|has)\s*([0-9,]+)\s+total cards', page_text, re.I)
    grand_match = re.search(r'Grand Master Set expands to\s*([0-9,]+)\s+cards', page_text, re.I)
    checklist_match = re.search(r'https://pokecottagecdn\.com/[^"\'<> ]+\.xlsx', page.decode('utf-8', errors='replace'), re.I)
    if not set_id:
        unmapped.append({'slug': guide_slug, 'url': guide_url})
        continue
    guide = {
        'setId': set_id,
        'slug': guide_slug,
        'guideUrl': guide_url,
        'masterPublished': int(master_match.group(1).replace(',', '')) if master_match else None,
        'grandmasterPublished': int(grand_match.group(1).replace(',', '')) if grand_match else None,
        'checklistUrl': checklist_match.group(0) if checklist_match else None,
        'records': [],
    }
    if guide['checklistUrl']:
        workbook = openpyxl.load_workbook(BytesIO(get(guide['checklistUrl'])), data_only=True, read_only=True)
        sheet = workbook.worksheets[0]
        associated = False
        for row_number, row in enumerate(sheet.iter_rows(values_only=True), start=1):
            values = list(row)
            if not values:
                continue
            marker = str(values[0] or '')
            if 'Promos & Variants' in marker:
                associated = True
                continue
            number = str(values[1] or '').strip() if len(values) > 1 else ''
            raw_name = str(values[2] or '').strip() if len(values) > 2 else ''
            if not number or not raw_name or marker not in ('☐', '☑'):
                continue
            name_match = re.search(r'friendlyName=([^,]+)', raw_name)
            name = name_match.group(1) if name_match else raw_name
            rarity = str(values[3] or '').strip() if len(values) > 3 else ''
            finish = str(values[4] or '').strip() if len(values) > 4 else ''
            classification = rarity if associated and not finish else finish or rarity
            guide['records'].append({
                'sourceRow': row_number,
                'number': number,
                'name': name,
                'rarity': rarity or None,
                'finish': finish or None,
                'classification': classification or None,
                'associated': associated,
            })
    guides.append(guide)
    time.sleep(0.15)

payload = {
    'provider': 'pokecottage',
    'generatedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    'source': INDEX,
    'guides': guides,
    'unmapped': unmapped,
}
output = ROOT / 'data' / 'providers' / 'pokecottage' / 'set-guides.json'
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(json.dumps({
    'mapped': len(guides),
    'unmapped': len(unmapped),
    'withGrandmaster': sum(1 for item in guides if item['grandmasterPublished']),
    'withChecklists': sum(1 for item in guides if item['records']),
}, indent=2))
