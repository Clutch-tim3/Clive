import { NextRequest, NextResponse } from 'next/server';
import { generateDomainIdeas } from '@/lib/domains/scoring';

export async function POST(request: NextRequest) {
  try {
    const { keywords, tld } = await request.json();
    
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }
    
    // Clean and validate keywords
    const cleanKeywords = keywords
      .map((k: string) => k.trim().toLowerCase())
      .filter((k: string) => k.length > 0);
    
    if (cleanKeywords.length === 0) {
      return NextResponse.json(
        { error: 'At least one valid keyword is required' },
        { status: 400 }
      );
    }
    
    // Generate domain ideas
    const ideas = generateDomainIdeas(cleanKeywords, tld ?? undefined, 20);
    
    // Check availability for each idea (limit to avoid too many concurrent requests)
    const availabilityResults = await checkDomainAvailability(ideas.map(item => item.domain));
    
    // Combine ideas with availability data
    const results = ideas.map(idea => {
      const availability = availabilityResults.find(
        result => result.domainName === idea.domain
      ) || {
        domainName: idea.domain,
        status: 'error' as const,
        errorMessage: 'Unable to check availability'
      };
      
      return {
        ...idea,
        availability: availability
      };
    });
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error generating domain ideas:', error);
    return NextResponse.json(
      { error: 'Failed to generate domain ideas' },
      { status: 500 }
    );
  }
}

async function checkDomainAvailability(domains: string[]): Promise<Array<{
  domainName: string;
  status: 'available' | 'taken' | 'premium' | 'unsupported' | 'error';
  errorMessage?: string;
}>> {
  // For now, we'll return a placeholder implementation
  // In a real implementation, this would call the RDAP checking function
  return domains.map(domain => ({
    domainName: domain,
    // Placeholder: randomly assign some as available for demo
    status: Math.random() > 0.7 ? 'available' : 'taken',
    errorMessage: undefined
  }));
}