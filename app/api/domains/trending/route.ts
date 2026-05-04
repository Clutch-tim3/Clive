import { NextRequest, NextResponse } from 'next/server';
import { getCachedTLDPrices, usdToZAR } from '@/lib/domains/tlds';

// In-memory cache for trending domains (in production, use Redis or similar)
let trendingCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

export async function GET(request: NextRequest) {
  try {
    // Check cache
    const now = Date.now();
    if (trendingCache && (now - trendingCache.timestamp < CACHE_TTL)) {
      return NextResponse.json(trendingCache.data);
    }
    
    // Generate trending domains (in production, this would come from analytics/search data)
    const trendingDomains = generateTrendingDomains();
    
    // Cache the results
    trendingCache = {
      data: { results: trendingDomains },
      timestamp: now
    };
    
    return NextResponse.json({ results: trendingDomains });
  } catch (error) {
    console.error('Error fetching trending domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending domains' },
      { status: 500 }
    );
  }
}

/**
 * Generate trending domain suggestions
 * In production, this would be based on actual search/registration data
 */
function generateTrendingDomains(): Array<{
  domainName: string;
  status: 'available' | 'taken' | 'premium';
  score: number;
  trendScore: number;
  priceUSD?: number;
  priceZAR?: number;
}> {
  // Trending keywords/topics for 2024-2025
  const trendingKeywords = [
    'ai', 'crypto', 'nft', 'meta', 'web3', 'defi', 'dao',
    'sustainable', 'green', 'eco', 'climate', 'solar',
    'remote', 'work', 'nomad', 'digital',
    'health', 'wellness', 'fitness', 'mindful',
    'gaming', 'play', 'stream', 'esport',
    'food', 'recipe', 'cook', 'meal',
    'travel', 'trip', 'adventure', 'explore',
    'space', 'mars', 'rocket', 'nasa',
    'robot', 'auto', 'self', 'drive',
    'quantum', 'compute', 'cloud', 'data',
    'cyber', 'security', 'privacy', 'vpn',
    'learn', 'course', 'skill', 'edu',
    'create', 'design', 'make', 'build',
    'invest', 'trade', 'stock', 'fund',
    'music', 'sound', 'audio', 'podcast',
    'art', 'gallery', 'exhibit', 'show'
  ];
  
  const popularTLDs = ['com', 'co.za', 'net', 'org', 'io', 'dev', 'app', 'ai', 'store', 'online'];
  const results: any[] = [];
  
  // Generate combinations
  for (let i = 0; i < Math.min(15, trendingKeywords.length); i++) {
    const keyword = trendingKeywords[i];
    
    // Single keyword domains
    for (let j = 0; j < Math.min(5, popularTLDs.length); j++) {
      const tld = popularTLDs[j];
      const domain = `${keyword}.${tld}`;
      
      // In a real implementation, we'd check actual availability
      // For now, simulate based on keyword popularity
      const isAvailable = Math.random() > 0.6; // 40% chance of being taken
      const trendScore = Math.floor(Math.random() * 100) + 1; // 1-100
      
      results.push({
        domainName: domain,
        status: isAvailable ? 'available' : 'taken',
        score: calculateDomainScore(domain),
        trendScore,
        priceUSD: getMockPrice(tld),
        priceZAR: getMockPrice(tld) * 18.5 // Approximate USD to ZAR
      });
    }
    
    // Compound trending domains
    if (i < trendingKeywords.length - 1) {
      const keyword2 = trendingKeywords[i + 1];
      const compound = `${keyword}${keyword2}`;
      
      if (compound.length <= 20) {
        for (let j = 0; j < Math.min(3, popularTLDs.length); j++) {
          const tld = popularTLDs[j];
          const domain = `${compound}.${tld}`;
          
          const isAvailable = Math.random() > 0.7; // 30% chance of being taken
          const trendScore = Math.floor(Math.random() * 100) + 1;
          
          results.push({
            domainName: domain,
            status: isAvailable ? 'available' : 'taken',
            score: calculateDomainScore(domain),
            trendScore,
            priceUSD: getMockPrice(tld),
            priceZAR: getMockPrice(tld) * 18.5
          });
        }
      }
    }
  }
  
  // Sort by trend score (higher = more trending)
  return results
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, 20); // Return top 20
}

/**
 * Calculate domain quality score (same as in scoring.ts)
 */
function calculateDomainScore(domain: string): number {
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
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get TLD trust score (0-100)
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
  };
  
  return trustScores[tld] || 40;
}

/**
 * Get mock price for a TLD (in USD)
 */
function getMockPrice(tld: string): number {
  const prices: Record<string, number> = {
    'com': 10.99,
    'co.za': 7.99,
    'net': 11.99,
    'org': 11.99,
    'io': 39.99,
    'dev': 12.99,
    'app': 14.99,
    'ai': 79.99,
    'store': 19.99,
    'online': 4.99,
    'tech': 29.99,
    'site': 4.99,
    'biz': 14.99,
    'info': 5.99,
    'me': 19.99
  };
  
  return prices[tld] || 15.00;
}