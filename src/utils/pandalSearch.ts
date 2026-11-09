import { PandalInfo } from '../data/pandals';

// Common transliterations mapping for phonetic English searches
const TRANSLITERATION_MAP: Record<string, string[]> = {
  karunamoyee: ['korunamoyi', 'karunamoyi', 'kalibari', 'karunamoye', 'guptapara'],
  dharmashava: ['dharmasabha', 'dhormoshova', 'dharma', 'jahaj', 'jahaj company', 'ship company'],
  guptapara: ['gupatpara', 'gupto para', 'guptapada'],
  palpara: ['paulpara', 'mritshilpi', 'potter', 'pal para'],
  supermarket: ['super market', 'shiv mandir', 'shib mandir', 'central road'],
  kshatriya: ['khotrio', 'khatriya', 'rajbongshi', 'rajbanshi', 'station road'],
  mulatol: ['mulatole', 'mulatola', 'mula tol'],
  senpara: ['sen para', 'shepara', 'shapla'],
  kamarpara: ['kamar para', 'roth mandir', 'rath mandir'],
  ramakrishna: ['ramkrishna', 'ramkrisna', 'ashram', 'mission', 'shapla mor'],
  hospital: ['sadar hospital', 'haspatal', 'hospital road'],
  shalbon: ['salbon', 'shal bon', 'mistripara'],
  zila_school: ['zilla school', 'kachari bazar', 'court', 'kachari'],
  lalbagh: ['lalbag', 'carmichael', 'carmichael college', 'college'],
  tajhat: ['tajhat rajbari', 'palace', 'rajbari', 'zamindar'],
  robertsonganj: ['robertson ganj', 'robertsongonj', 'alamnagar', 'railway'],
  mahiganj: ['mohigonj', 'mahiganj bazar', 'nd hall', 'natmandir'],
  karipara: ['kadipara', 'kari para', 'mahiganj'],
  ashratpur: ['asratpur', 'ashrotpur', 'kotpara'],
  chawkbazar: ['chawk bazar', 'chowk bazar', 'mahiganj'],
  kamal_kachna: ['bairagipara', 'bairagi para', 'kachna', 'ghaghot'],
  khasbag: ['khasbagh', 'khas bag'],
  babupara: ['babu para', 'railway station', 'station'],
  medical: ['dhap', 'medical college', 'medical east gate', 'hospital'],
  darshana: ['dorshona', 'darshana mor', 'highway', 'dhaka road'],
  engineering: ['engineering para', 'eng para', 'led lighting'],
  radhaballabh: ['radhaballav', 'radhaballav', 'radhaballov'],
  keranipara: ['kerani para', 'kachari'],
  palichara: ['palisara', 'palichora', 'zamindar', 'zamindar bari', 'chandanpat'],
  shyampur: ['shampur', 'sugar mill', 'fanil sarkar', 'vaishnav'],
  paglapir: ['pagla pir', 'paglapir bazar', 'haridebpur', 'highway'],
  haridebpur: ['horidebpur', 'harideb pur'],
  burirhat: ['burir hat', 'agriculture', 'krishi'],
  chandanpat: ['sondonpat', 'chandan pat'],
  madhabpur: ['madhab pur', 'modhobpur'],
  shahbazpur: ['sahbazpur', 'shahbajpur'],
  mallickpara: ['malikpara', 'mallik para'],
  mominpur: ['momin pur', 'mominpur bazar'],
  gobindapur: ['gobinda pur', 'lotus'],
  kachnapara: ['kachna para', 'mominpur'],
  sadyapushkarini: ['soddopushkorini', 'sadyapuskarni', 'dighi'],
  katabari: ['kata bari', 'hindu para'],
  khaleya: ['ganjipur', 'kholeya', 'ganjipur bazar'],
  lalchandpur: ['lalchand pur', 'lal chand pur'],
  lahiri: ['lahirir hat', 'lahiri hat'],
  kalabari: ['kala bari', 'tilakpara', 'tilak para'],
  rajendrapur: ['rajendra pur', 'border'],
};

export interface SearchMatchResult {
  pandal: PandalInfo;
  score: number; // Higher is better match
  matchedField: 'number' | 'name' | 'bengali' | 'area' | 'address' | 'keyword';
}

/**
 * Normalizes input text for resilient fuzzy/phonetic search in both English and Bengali
 */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[#.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Searches and scores all pandals based on a query. Returns matches sorted by relevance and serial number.
 */
export function searchPandals(pandals: PandalInfo[], rawQuery: string): PandalInfo[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return pandals;

  const results: SearchMatchResult[] = [];

  // Check if query is numeric (e.g., '1', '17', '50')
  const isNumeric = /^\d+$/.test(query);
  const queryNum = isNumeric ? parseInt(query, 10) : null;

  for (const p of pandals) {
    let score = 0;
    let matchedField: SearchMatchResult['matchedField'] = 'name';

    // 1. Exact or partial Serial Number match
    if (queryNum !== null) {
      if (p.serialNumber === queryNum) {
        score += 1000;
        matchedField = 'number';
      } else if (p.serialNumber.toString().startsWith(query)) {
        score += 500;
        matchedField = 'number';
      }
    }

    const normName = normalizeSearchText(p.name);
    const normBengali = normalizeSearchText(p.bengaliName);
    const normArea = normalizeSearchText(p.area);
    const normAddress = normalizeSearchText(p.address);
    const normCategory = normalizeSearchText(p.categoryBengali + ' ' + p.category);
    const normTransit = normalizeSearchText(p.nearestMetro);

    // 2. Exact word / prefix match in English Name
    if (normName.startsWith(query)) {
      score += 400;
      matchedField = 'name';
    } else if (normName.includes(query)) {
      score += 250;
      matchedField = 'name';
    }

    // 3. Exact word / prefix match in Bengali Name
    if (normBengali.startsWith(query)) {
      score += 450;
      matchedField = 'bengali';
    } else if (normBengali.includes(query)) {
      score += 260;
      matchedField = 'bengali';
    }

    // 4. Area / Address match
    if (normArea.includes(query)) {
      score += 180;
      if (matchedField === 'name') matchedField = 'area';
    }
    if (normAddress.includes(query)) {
      score += 150;
      if (matchedField === 'name') matchedField = 'address';
    }

    // 5. Category or Transit match
    if (normCategory.includes(query) || normTransit.includes(query)) {
      score += 100;
    }

    // 6. Phonetic / Transliteration keywords
    const keywords = TRANSLITERATION_MAP[p.id] || [];
    for (const kw of keywords) {
      if (kw.includes(query) || query.includes(kw)) {
        score += 220;
        matchedField = 'keyword';
        break;
      }
    }

    // If query contains multiple words, reward matching all words
    const queryWords = query.split(' ').filter(Boolean);
    if (queryWords.length > 1) {
      const allHaystack = `${normName} ${normBengali} ${normArea} ${normAddress} ${keywords.join(' ')}`;
      const allWordsMatch = queryWords.every((w) => allHaystack.includes(w));
      if (allWordsMatch) {
        score += 300;
      }
    }

    if (score > 0) {
      results.push({ pandal: p, score, matchedField });
    }
  }

  // Sort by highest score first; if scores are tied, sort by serialNumber
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.pandal.serialNumber - b.pandal.serialNumber;
  });

  return results.map((r) => r.pandal);
}
