import { NextRequest, NextResponse } from 'next/server';
import { parseDomainInput, checkAllTLDs, RDAP_SERVERS } from '@/lib/domains/availability';

// ── Smart TLD selection ───────────────────────────────────────────────────────
// Keyword patterns that map a searched SLD to a contextual category.
const KEYWORD_MAP: Record<string, RegExp> = {
  tech:        /tech|app|dev|code|soft|web|cloud|ai|ml|bot|data|sys|digital|cyber|hack|api|stack|node|react|next|vue|js|py|build|run|systems|network/i,
  ecommerce:   /shop|store|market|buy|sell|goods|supply|hub|deal|cart|trade|merch/i,
  creative:    /design|studio|creative|art|photo|film|brand|pixel|make|craft|visual|animate/i,
  business:    /biz|corp|group|company|ventures|partners|consult|solutions|services|agency|consulting|global|world/i,
  nonprofit:   /org|ngo|foundation|charity|community|trust|fund|social|civic|aid|help/i,
  southafrica: /za|sa|africa|joburg|cape|durban|pretoria|sandton|zulu|xhosa|rand|soweto|mzansi/i,
  content:     /blog|news|media|post|write|journal|press|mag|content|read|story|talk|cast/i,
};

// TLDs for each category, ordered by relevance.
const CATEGORY_TLDS: Record<string, string[]> = {
  tech:        ['io', 'dev', 'app', 'ai', 'tech', 'cloud', 'digital', 'run', 'systems', 'network', 'works', 'page'],
  ecommerce:   ['store', 'shop', 'online', 'co', 'me'],
  creative:    ['studio', 'design', 'media', 'agency', 'works', 'me'],
  business:    ['co', 'biz', 'group', 'solutions', 'services', 'consulting', 'agency', 'global', 'world', 'info'],
  nonprofit:   ['org', 'me', 'global', 'world'],
  southafrica: ['co.za', 'africa'],
  content:     ['site', 'me', 'media', 'online'],
};

// Always lead with these regardless of category match.
const ALWAYS_INCLUDE = ['com', 'co.za', 'net'];

// Fallback ordering when no category matched (or to fill remaining slots).
const FALLBACK_TLDS = [
  'org', 'io', 'dev', 'app', 'africa', 'store', 'online',
  'tech', 'site', 'ai', 'co', 'shop', 'cloud', 'digital',
  'me', 'biz', 'info', 'studio', 'design', 'media',
  'agency', 'group', 'solutions', 'services', 'consulting',
  'systems', 'network', 'works', 'global', 'world', 'run', 'page',
];

function selectTLDsForSLD(sld: string, count = 30): string[] {
  // Detect matched categories
  const matched: string[] = [];
  for (const [cat, pattern] of Object.entries(KEYWORD_MAP)) {
    if (pattern.test(sld)) matched.push(cat);
  }

  const ordered: string[] = [...ALWAYS_INCLUDE];
  const seen = new Set(ordered);

  // Matched category TLDs first
  for (const cat of matched) {
    for (const tld of CATEGORY_TLDS[cat] ?? []) {
      if (!seen.has(tld) && RDAP_SERVERS[tld]) { ordered.push(tld); seen.add(tld); }
    }
  }

  // Fill with fallback pool
  for (const tld of FALLBACK_TLDS) {
    if (!seen.has(tld) && RDAP_SERVERS[tld]) { ordered.push(tld); seen.add(tld); }
  }

  // Fill any remaining slots with every other known RDAP TLD
  for (const tld of Object.keys(RDAP_SERVERS)) {
    if (!seen.has(tld)) { ordered.push(tld); seen.add(tld); }
  }

  return ordered.slice(0, count);
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.toLowerCase().trim();
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });

  const { sld, tld, fullDomain } = parseDomainInput(q);

  if (!sld || sld.length < 2) {
    return NextResponse.json({ error: 'Domain name too short.' }, { status: 400 });
  }

  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(sld)) {
    return NextResponse.json({
      error: 'Domain names can only contain letters, numbers, and hyphens.',
    }, { status: 400 });
  }

  // Build the smart-ordered TLD list for this SLD
  const smartTLDs = selectTLDsForSLD(sld, 30);

  if (fullDomain && tld) {
    // User typed a specific TLD — check it first, then smart suggestions for the rest
    const allTLDs = [tld, ...smartTLDs.filter(t => t !== tld)].slice(0, 30);
    const results = await checkAllTLDs(sld, allTLDs);
    return NextResponse.json({ results, primary: fullDomain });
  }

  // User typed just a name — check smart-ordered TLDs
  const results = await checkAllTLDs(sld, smartTLDs);
  return NextResponse.json({ results, primary: null });
}
