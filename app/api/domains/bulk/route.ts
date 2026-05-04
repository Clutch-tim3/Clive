import { NextRequest, NextResponse } from 'next/server';
import { checkAllTLDs, parseDomainInput } from '@/lib/domains/availability';
import { getCachedTLDPrices, usdToZAR } from '@/lib/domains/tlds';

export async function POST(request: NextRequest) {
  try {
    const { domains } = await request.json();
    
    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return NextResponse.json(
        { error: 'Domains array is required' },
        { status: 400 }
      );
    }
    
    if (domains.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 domains allowed per request' },
        { status: 400 }
      );
    }
    
    // Validate and parse domains
    const validDomains: string[] = [];
    const invalidDomains: string[] = [];
    
    for (const domainInput of domains) {
      if (!domainInput || typeof domainInput !== 'string') {
        invalidDomains.push(domainInput ?? '');
        continue;
      }
      
      const cleaned = domainInput.trim().toLowerCase();
      if (!cleaned) {
        invalidDomains.push(domainInput);
        continue;
      }
      
      // Basic validation - should contain at least one dot
      if (!cleaned.includes('.')) {
        invalidDomains.push(domainInput);
        continue;
      }
      
      validDomains.push(cleaned);
    }
    
    if (validDomains.length === 0) {
      return NextResponse.json(
        { error: 'No valid domains provided', invalidDomains },
        { status: 400 }
      );
    }
    
    // Extract SLDs and check availability for each
    const results = await Promise.all(
      validDomains.map(async (domain) => {
        const { sld, tld, fullDomain } = parseDomainInput(domain);
        if (!sld || !tld) {
          return {
            domainName: domain,
            status: 'error' as const,
            errorMessage: 'Invalid domain format'
          };
        }
        
        try {
          // Check availability for this specific domain
          const tldResults = await checkAllTLDs(sld, [tld]);
          const result = tldResults[0] || {
            domainName: domain,
            status: 'error' as const,
            errorMessage: 'Unable to check availability'
          };
          
          // Add pricing info if available
          const prices = await getCachedTLDPrices();
          const priceInfo = prices[tld];
          
          if (priceInfo) {
            return {
              ...result,
              priceUSD: priceInfo.purchasePrice,
              priceZAR: usdToZAR(priceInfo.purchasePrice),
              renewalUSD: priceInfo.renewalPrice,
              renewalZAR: usdToZAR(priceInfo.renewalPrice)
            };
          }
          
          return result;
        } catch (error) {
          return {
            domainName: domain,
            status: 'error' as const,
            errorMessage: 'Failed to check availability'
          };
        }
      })
    );
    
    // Calculate totals
    const availableCount = results.filter(r => r.status === 'available' || r.status === 'premium').length;
    const totalPriceZAR = results
      .filter(r => r.status === 'available' || r.status === 'premium')
      .reduce((sum, r) => sum + (r.priceZAR || 0), 0);
    
    return NextResponse.json({
      results,
      summary: {
        total: validDomains.length,
        available: availableCount,
        taken: results.filter(r => r.status === 'taken').length,
        errors: results.filter(r => r.status === 'error').length,
        totalPriceZAR,
        totalPrice: `R${(totalPriceZAR / 100).toFixed(2)}`
      },
      invalidDomains
    });
  } catch (error) {
    console.error('Error in bulk domain check:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk domain request' },
      { status: 500 }
    );
  }
}