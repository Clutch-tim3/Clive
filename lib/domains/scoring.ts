import { TLD_CATEGORY, CATEGORY_COLOR } from '@/app/domains/page';

/**
 * Calculate domain quality score (0-100)
 * Factors: length, pronounceability, TLD trust, memorability
 */
export function calculateDomainScore(domain: string): number {
  const [sld, tld = ''] = domain.split('.');
  
  if (!sld) return 0;
  
  let score = 100;
  
  // Length penalty (ideal: 8-15 characters)
  const length = sld.length;
  if (length < 3) score -= 30;
  else if (length < 5) score -= 10;
  else if (length > 20) score -= 20;
  else if (length > 15) score -= 5;
  else if (length >= 8 && length <= 15) score += 5; // Bonus for ideal length
  
  // Pronounceability score (vowel/consonant ratio)
  const vowels = (sld.match(/[aeiou]/gi) || []).length;
  const consonants = (sld.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const vowelRatio = vowels / Math.max(1, consonants);
  
  if (vowelRatio < 0.2) score -= 15; // Too few vowels
  else if (vowelRatio > 0.8) score -= 10; // Too many vowels
  else if (vowelRatio >= 0.3 && vowelRatio <= 0.6) score += 5; // Good ratio
  
  // Check for difficult patterns
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(sld)) score -= 10; // 4+ consecutive consonants
  if (/[aeiou]{3,}/.test(sld)) score -= 10; // 3+ consecutive vowels
  if (/(.)\1{2,}/.test(sld)) score -= 15; // Same char repeated 3+ times
  
  // Memorability bonuses
  if (/^[a-z]+$/.test(sld)) score += 5; // All letters (no numbers/hyphens)
  if (!sld.includes('-')) score += 5; // No hyphens
  if (!/[0-9]/.test(sld)) score += 5; // No numbers
  
  // TLD trust score
  const tldScore = getTLDTrustScore(tld.toLowerCase());
  score = score * 0.7 + tldScore * 0.3; // Weight: 70% SLD, 30% TLD
  
  // Category bonus
  const category = TLD_CATEGORY[tld.toLowerCase() as keyof typeof TLD_CATEGORY] || 'WEB';
  if (['TECH', 'SHOP', 'CREATIVE', 'BIZ'].includes(category)) score += 3;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get TLD trust score (0-100)
 * Based on popularity, age, and perceived trustworthiness
 */
function getTLDTrustScore(tld: string): number {
  const trustScores: Record<string, number> = {
    'com': 95,
    'org': 90,
    'net': 85,
    'co.za': 80,
    'io': 75,
    'dev': 70,
    'app': 70,
    'co': 75,
    'biz': 65,
    'info': 60,
    'me': 60,
    'site': 55,
    'online': 50,
    'store': 50,
    'tech': 45,
    'blog': 40,
    'news': 40,
    'ai': 35,
    'app': 30,
    'dev': 30,
  };
  
  return trustScores[tld] || 40; // Default score for unknown TLDs
}

/**
 * Get domain suggestions based on keywords
 */
export function generateDomainIdeas(
  keywords: string[], 
  tldFilter?: string,
  count: number = 20
): Array<{ domain: string; score: number; reason: string }> {
  const ideas: Array<{ domain: string; score: number; reason: string }> = [];
  
  // Single keyword domains
  for (const keyword of keywords) {
    const clean = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean.length >= 2) {
      // Original keyword
      if (!tldFilter || tldFilter === 'any') {
        ['com', 'co.za', 'net', 'org', 'io'].forEach(tld => {
          const domain = `${clean}.${tld}`;
          ideas.push({
            domain,
            score: calculateDomainScore(domain),
            reason: 'Exact match'
          });
        });
      } else if (tldFilter !== 'any') {
        const domain = `${clean}.${tldFilter}`;
        ideas.push({
          domain,
          score: calculateDomainScore(domain),
          reason: 'Exact match'
        });
      }
      
      // With common prefixes/suffixes
      const prefixes = ['get', 'my', 'the', 'go', 'try'];
      const suffixes = ['hq', 'app', 'io', 'dev', 'lab', 'hub'];
      
      for (const prefix of prefixes) {
        const domain = `${prefix}${clean}`;
        if (domain.length <= 20) { // Reasonable length
          const tlds = tldFilter && tldFilter !== 'any' 
            ? [tldFilter] 
            : ['com', 'co.za', 'net', 'org', 'io'];
          
          for (const tld of tlds) {
            const fullDomain = `${domain}.${tld}`;
            ideas.push({
              domain: fullDomain,
              score: calculateDomainScore(fullDomain),
              reason: `With '${prefix}' prefix`
            });
          }
        }
      }
      
      for (const suffix of suffixes) {
        const domain = `${clean}${suffix}`;
        if (domain.length <= 20) {
          const tlds = tldFilter && tldFilter !== 'any' 
            ? [tldFilter] 
            : ['com', 'co.za', 'net', 'org', 'io'];
          
          for (const tld of tlds) {
            const fullDomain = `${domain}.${tld}`;
            ideas.push({
              domain: fullDomain,
              score: calculateDomainScore(fullDomain),
              reason: `With '${suffix}' suffix`
            });
          }
        }
      }
    }
  }
  
  // Compound words (if we have 2+ keywords)
  if (keywords.length >= 2) {
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const k1 = keywords[i].toLowerCase().replace(/[^a-z0-9]/g, '');
        const k2 = keywords[j].toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (k1.length >= 2 && k2.length >= 2) {
          // k1 + k2
          const compound1 = `${k1}${k2}`;
          if (compound1.length <= 20) {
            const tlds = tldFilter && tldFilter !== 'any' 
              ? [tldFilter] 
              : ['com', 'co.za', 'net', 'org', 'io'];
            
            for (const tld of tlds) {
              const domain = `${compound1}.${tld}`;
              ideas.push({
                domain,
                score: calculateDomainScore(domain),
                reason: `Compound: '${k1}' + '${k2}'`
              });
            }
          }
          
          // k2 + k1
          const compound2 = `${k2}${k1}`;
          if (compound2.length <= 20 && compound1 !== compound2) {
            const tlds = tldFilter && tldFilter !== 'any' 
              ? [tldFilter] 
              : ['com', 'co.za', 'net', 'org', 'io'];
            
            for (const tld of tlds) {
              const domain = `${compound2}.${tld}`;
              ideas.push({
                domain,
                score: calculateDomainScore(domain),
                reason: `Compound: '${k2}' + '${k1}'`
              });
            }
          }
        }
      }
    }
  }
  
  // Remove duplicates and sort by score
  const uniqueIdeas = Array.from(
    new Map(ideas.map(item => [item.domain, item])).values()
  );
  
  return uniqueIdeas
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}