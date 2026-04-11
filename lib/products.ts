export interface PricingTier {
  name: string;
  calls: string;
  price: string;
  highlight: boolean;
}

// Standardised acquire-flow tier (ZAR, 3-tier)
export interface AcquireTier {
  id:             'free' | 'developer' | 'pro';
  name:           'Free' | 'Developer' | 'Pro';
  priceZAR:       number;          // monthly, in cents (0 for free)
  callsPerMonth:  number | 'unlimited';
  rateLimit:      number;          // req/min
  features:       string[];
  isFeatured:     boolean;
}

export interface Endpoint {
  method: 'POST' | 'GET' | 'DEL';
  path: string;
  description: string;
}

export type Channel = 'direct' | 'rapidapi' | 'aws' | 'gumroad' | 'chrome-store';

export interface Product {
  slug: string;
  name: string;
  category: 'ml' | 'api' | 'ext' | 'app';
  listingType?: 'own' | 'partner';   // 'partner' = APIlayer, no Acquire button
  tagline: string;
  description: string;
  pricing: {
    label: string;
    display: string;
    unit: string;
    tiers: PricingTier[];
  };
  features: string[];
  endpoints: Endpoint[];
  overview: {
    title: string;
    body: string[];
  };
  channels: Channel[];
  freeTier: string;
  licence?: string;
  isNew?: boolean;
  isRebuilt?: boolean;
  animateIn?: 'fade' | 'slide-right';
  animateDelay?: 0 | 1 | 2 | 3;
  isDark?: boolean;
}

// Standard 3-tier structure per product (ZAR cents)
const FREE_FEATURES  = ['All endpoints', 'Community support', '10 req/min'];
const DEV_FEATURES   = ['All endpoints', 'Email support', '60 req/min'];
const PRO_FEATURES   = ['All endpoints', 'Priority support', 'SLA guarantee', '100 req/min'];

function makeTiers(devPrice: number, devCalls: number | 'unlimited', proPrice: number, proCalls: number | 'unlimited'): AcquireTier[] {
  return [
    { id:'free',      name:'Free',      priceZAR:0,        callsPerMonth:100,      rateLimit:10,  features:FREE_FEATURES, isFeatured:false },
    { id:'developer', name:'Developer', priceZAR:devPrice, callsPerMonth:devCalls, rateLimit:60,  features:DEV_FEATURES,  isFeatured:false },
    { id:'pro',       name:'Pro',       priceZAR:proPrice, callsPerMonth:proCalls, rateLimit:100, features:PRO_FEATURES,  isFeatured:true  },
  ];
}

// Default for products not listed in spec
const DEFAULT_TIERS = makeTiers(19900, 2000, 49900, 10000);

export const PRODUCT_TIERS: Record<string, AcquireTier[]> = {
  hackkit:               makeTiers(29900,  5000,     79900,  20000),
  shieldkit:             makeTiers(49900,  10000,    119900, 50000),
  searchcore:            makeTiers(39900,  8000,     99900,  30000),
  embedcore:             makeTiers(19900,  2000000,  59900,  10000000),
  contractiq:            makeTiers(29900,  200,      79900,  1000),
  meetingiq:             makeTiers(19900,  50,       59900,  200),
  tenderiq:              makeTiers(29900,  500,      79900,  5000),
  fxbridge:              makeTiers(9900,   10000,    29900,  100000),
  wealthmind:            makeTiers(19900,  1000,     49900,  10000),
  oracleiq:              makeTiers(19900,  1000,     49900,  5000),
  devkit:                makeTiers(9900,   10000,    29900,  'unlimited'),
  // defaults for remaining products
  talentpulse:           DEFAULT_TIERS,
  creditlens:            DEFAULT_TIERS,
  finsightiq:            DEFAULT_TIERS,
  searchkit:             DEFAULT_TIERS,
  transactiq:            DEFAULT_TIERS,
  trustiqq:              DEFAULT_TIERS,
  voicepost:             DEFAULT_TIERS,
  paygrade:              DEFAULT_TIERS,
  reviewpal:             DEFAULT_TIERS,
  briefpal:              DEFAULT_TIERS,
  designspy:             DEFAULT_TIERS,
  copypilot:             DEFAULT_TIERS,
  handoffready:          DEFAULT_TIERS,
  flowmapper:            DEFAULT_TIERS,
  'tender-command-center': DEFAULT_TIERS,
};

export function getAcquireTiers(slug: string): AcquireTier[] {
  return PRODUCT_TIERS[slug] ?? DEFAULT_TIERS;
}

export const products: Product[] = [
  {
    slug: 'hackkit',
    name: 'HackKit',
    category: 'ml',
    isDark: true,
    animateIn: 'slide-right',
    animateDelay: 3,
    tagline: 'The complete penetration testing reconnaissance API. Ten capabilities, one credential, AI-synthesised red team reports.',
    description: 'HackKit consolidates the external pentest recon stack — domain intelligence, subdomain enumeration with takeover detection, CVE correlation from NVD, credential exposure, OSINT, and AI-synthesised red team reports with MITRE ATT&CK mapping — into one API at 60% below the cost of equivalent tooling.',
    pricing: {
      label: 'Starting from',
      display: '$29',
      unit: 'per month',
      tiers: [
        { name:'Free',         calls:'50 recon calls / month',                  price:'$0',   highlight:false },
        { name:'Researcher',   calls:'500 calls / month · all endpoints',        price:'$29',  highlight:false },
        { name:'Hunter',       calls:'2,500 calls / month · AI synthesis',       price:'$79',  highlight:true  },
        { name:'Professional', calls:'10,000 calls / month · priority · batch 50',price:'$199',highlight:false },
        { name:'Enterprise',   calls:'Unlimited · dedicated · team seats · SLA', price:'$499', highlight:false },
      ]
    },
    features: [
      'Domain recon: DNS, CT logs, ASN, cloud provider, attack vectors',
      'Subdomain enumeration with ML-powered takeover detection',
      'CVE correlation from NVD for all discovered services',
      'Credential and email exposure via breach databases',
      'Claude-powered AI red team synthesis with MITRE mapping',
    ],
    endpoints: [
      { method:'POST', path:'/v1/recon/domain',      description:'Domain intelligence: DNS, certificates, CT logs, ASN, cloud.' },
      { method:'POST', path:'/v1/recon/ip',           description:'Host fingerprinting: open ports, versions, OS, CVEs per port.' },
      { method:'POST', path:'/v1/recon/org',          description:'Organisation attack surface mapping across IPs and ASNs.' },
      { method:'POST', path:'/v1/enum/subdomains',    description:'CT log + DNS enumeration with subdomain takeover detection.' },
      { method:'POST', path:'/v1/enum/ports',         description:'Passive port and service fingerprinting.' },
      { method:'POST', path:'/v1/enum/technologies',  description:'Technology stack detection with version-matched CVE lookup.' },
      { method:'POST', path:'/v1/osint/emails',       description:'Employee email discovery from certificates and breach data.' },
      { method:'POST', path:'/v1/osint/credentials',  description:'Credential exposure check across breach datasets.' },
      { method:'POST', path:'/v1/vuln/correlate',     description:'CVE correlation from NVD for discovered service versions.' },
      { method:'POST', path:'/v1/intel/synthesise',   description:'AI red team report: executive summary, attack paths, MITRE. Hunter+.' },
    ],
    overview: {
      title: 'One API for the entire recon workflow.',
      body: [
        'HackKit consolidates the external penetration testing reconnaissance stack into a single API...',
        'Every endpoint returns structured findings with severity classifications, confidence scores, MITRE ATT&CK mappings...',
        'HackKit is a passive intelligence tool for authorised security testing only...',
      ]
    },
    channels: ['direct', 'rapidapi', 'aws'],
    freeTier: '50 recon calls / month',
    licence: 'NVD (public domain) · crt.sh (public) · Shodan API',
    isNew: true,
  },
  {
    slug: 'embedcore',
    name: 'EmbedCore',
    category: 'ml',
    isDark: true,
    animateIn: 'slide-right',
    animateDelay: 0,
    tagline: 'General-purpose text embeddings. OpenAI-compatible. 60% cheaper than market.',
    description: 'Production-ready text embedding model using sentence-transformers/all-MiniLM-L6-v2. 512-dimensional L2-normalised vectors, OpenAI-compatible API, batch up to 256 texts per call. Drop-in replacement for text-embedding-3-small — change base URL and API key, nothing else.',
    pricing: {
      label: 'Starting from',
      display: '$0.008',
      unit: 'per 1M tokens',
      tiers: [
        { name: 'Free', calls: '500 calls / month · batch 1', price: '$0', highlight: false },
        { name: 'Basic', calls: '50,000 calls / month · batch 32', price: '$9', highlight: false },
        { name: 'Pro', calls: '500,000 calls / month · batch 256', price: '$29', highlight: true },
        { name: 'Ultra', calls: '5,000,000 calls / month · batch 256', price: '$99', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      '512-dimensional L2-normalised vectors',
      'OpenAI-compatible — migrate with 2 line changes',
      'Batch up to 256 texts per request',
      'Sub-15ms p50 latency on GPU endpoint',
      'Apache 2.0 base model — fully commercial',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/embeddings', description: 'Generate embeddings from text' },
    ],
    overview: {
      title: 'Text Embeddings for Production',
      body: [
        'EmbedCore provides production-ready text embedding capabilities with an OpenAI-compatible API. The model is based on sentence-transformers/all-MiniLM-L6-v2, a proven open-source model that balances performance and efficiency.',
        'Each text is converted to a 512-dimensional L2-normalised vector, perfect for semantic search, recommendation systems, and other NLP tasks. The API supports batch processing of up to 256 texts per call, making it ideal for large-scale applications.',
        'With pricing at 60% below market rates, EmbedCore is an affordable solution for developers building search and recommendation features.',
      ],
    },
    channels: ['direct', 'rapidapi', 'aws'],
    freeTier: '500 calls / month',
    licence: 'Apache 2.0',
  },
  {
    slug: 'shieldkit',
    name: 'ShieldKit',
    category: 'ml',
    isDark: true,
    animateIn: 'slide-right',
    animateDelay: 1,
    tagline: 'Unified cybersecurity API. Six capabilities — IP, domain, URL, payload, email, batch.',
    description: 'IP reputation scoring, domain DGA and typosquat detection, URL redirect chain scanning, payload injection detection (SQLi/XSS/CMDi/SSTI/prompt injection), SPF/DKIM/DMARC email authentication. All endpoints return a normalised RiskScore 0–100 with ALLOW/MONITOR/BLOCK/QUARANTINE recommended action.',
    pricing: {
      label: 'Starting from',
      display: '$19',
      unit: 'per month, Starter',
      tiers: [
        { name: 'Free', calls: '100 calls / month', price: '$0', highlight: false },
        { name: 'Starter', calls: '10,000 calls / month · batch 10', price: '$19', highlight: false },
        { name: 'Pro', calls: '100,000 calls / month · batch 100', price: '$49', highlight: true },
        { name: 'Business', calls: '1,000,000 calls / month · batch 500', price: '$149', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'IP reputation with VPN, Tor, and proxy detection',
      'Domain DGA detection and lookalike/typosquat analysis',
      'URL redirect chain scanning',
      'SQLi, XSS, CMDi, SSTI, prompt injection detection',
      'SPF, DKIM, DMARC email authentication checks',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/ip/reputation', description: 'IP reputation scoring' },
      { method: 'POST', path: '/v1/domain/analysis', description: 'Domain DGA and typosquat detection' },
      { method: 'POST', path: '/v1/url/scan', description: 'URL redirect chain scanning' },
      { method: 'POST', path: '/v1/payload/scan', description: 'Payload injection detection' },
      { method: 'POST', path: '/v1/email/verify', description: 'SPF/DKIM/DMARC email authentication' },
    ],
    overview: {
      title: 'Unified Cybersecurity API',
      body: [
        'ShieldKit is a comprehensive cybersecurity API that provides six core capabilities in a single interface. Protect your applications from a wide range of threats with easy-to-use endpoints.',
        'Each request returns a normalized RiskScore between 0 and 100, along with recommended actions (ALLOW/MONITOR/BLOCK/QUARANTINE) and detailed threat indicators. This makes it simple to integrate security checks into your existing workflows.',
        'From IP reputation checks to advanced payload scanning, ShieldKit covers all the essential security requirements for modern web applications.',
      ],
    },
    channels: ['direct', 'rapidapi', 'aws'],
    freeTier: '100 calls / month',
  },
  {
    slug: 'searchcore',
    name: 'SearchCore',
    category: 'ml',
    isDark: true,
    animateIn: 'slide-right',
    animateDelay: 2,
    tagline: 'Full-text, semantic, and hybrid search in one deployable API.',
    description: 'BM25 full-text search (Tantivy), semantic vector search (FAISS + local embeddings), and hybrid Reciprocal Rank Fusion in a single search endpoint. Faceted filtering with counts, typeahead completion, highlighted snippets, and query analytics built in from day one.',
    pricing: {
      label: 'Starting from',
      display: '$19',
      unit: 'per month, Starter',
      tiers: [
        { name: 'Free', calls: '1 index · 1,000 docs · 500 searches', price: '$0', highlight: false },
        { name: 'Starter', calls: '5 indexes · 100,000 docs · 10,000 searches', price: '$19', highlight: false },
        { name: 'Pro', calls: '20 indexes · 1,000,000 docs · 100,000 searches', price: '$49', highlight: true },
        { name: 'Business', calls: 'Unlimited indexes · unlimited docs · unlimited searches', price: '$149', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'BM25 full-text search with stemming',
      'Semantic vector search via FAISS',
      'Hybrid RRF — best of keyword and semantic',
      'Facets, filters, typeahead, highlights',
      'Query analytics: zero-result rate, top queries',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/index/create', description: 'Create a new search index' },
      { method: 'POST', path: '/v1/index/destroy', description: 'Delete a search index' },
      { method: 'POST', path: '/v1/index/add', description: 'Add documents to an index' },
      { method: 'POST', path: '/v1/index/remove', description: 'Remove documents from an index' },
      { method: 'POST', path: '/v1/search', description: 'Search documents with hybrid BM25/vector search' },
    ],
    overview: {
      title: 'Hybrid Search Engine',
      body: [
        'SearchCore combines the best of both worlds: traditional full-text search with modern semantic search. Powered by Tantivy for BM25 full-text search and FAISS for vector search, it provides state-of-the-art search capabilities.',
        'The hybrid search mode uses Reciprocal Rank Fusion (RRF) to combine results from both search methods, delivering more relevant results than either approach alone. Faceted filtering, typeahead completion, and highlighted snippets are included out of the box.',
        'With built-in query analytics, you can monitor search performance and identify areas for improvement. Perfect for e-commerce, documentation, and content discovery applications.',
      ],
    },
    channels: ['direct', 'rapidapi', 'aws'],
    freeTier: '500 searches / month',
    licence: 'Apache 2.0',
  },
  {
    slug: 'tenderiq',
    name: 'TenderIQ',
    category: 'api',
    animateIn: 'fade',
    tagline: 'South African government tender intelligence from CC BY 4.0 licensed procurement data.',
    description: 'Transforms raw government tender documents into actionable bid intelligence. Surfaces supplier networks, historical award pricing, compliance checkpoints, and a day-by-day action plan from submission deadline. First recommended listing — clean data lineage.',
    pricing: {
      label: 'Starting from',
      display: '$29',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '50 analyses / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '500 analyses / month · full features', price: '$29', highlight: true },
        { name: 'Business', calls: '5,000 analyses / month · batch', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'CC BY 4.0 licensed data — fully commercial',
      'Supplier networks and historical pricing data',
      'Compliance checklists and risk flags',
      'Day-by-day bid action plan generation',
      'Active tender search by keyword or department',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/tenders/search', description: 'Search active tenders' },
      { method: 'POST', path: '/v1/tenders/analyze', description: 'Analyze a tender document' },
      { method: 'GET', path: '/v1/suppliers', description: 'Get supplier information' },
      { method: 'GET', path: '/v1/historical', description: 'Get historical award pricing' },
    ],
    overview: {
      title: 'Government Tender Intelligence',
      body: [
        'TenderIQ provides comprehensive intelligence on South African government tenders. The API processes raw tender documents to extract actionable insights for bid preparation and strategy.',
        'Features include supplier network analysis, historical pricing data, compliance checklists, and a day-by-day bid action plan. The data is CC BY 4.0 licensed, ensuring full commercial usability.',
        'With TenderIQ, you can make more informed bidding decisions, identify potential partners, and stay ahead of competitors in the government procurement market.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '50 analyses / month',
    licence: 'CC BY 4.0 — SA eTender Portal',
  },
  {
    slug: 'contractiq',
    name: 'ContractIQ',
    category: 'api',
    animateIn: 'slide-right',
    animateDelay: 0,
    tagline: 'Contract analysis and risk scoring API.',
    description: 'Extract key terms, clauses, and obligations from contracts. Identify high-risk sections and score contract risk based on industry standards.',
    pricing: {
      label: 'Starting from',
      display: '$39',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '20 analyses / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '200 analyses / month', price: '$39', highlight: true },
        { name: 'Business', calls: '2,000 analyses / month', price: '$99', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Key term and clause extraction',
      'Contract risk scoring',
      'Obligation identification',
      'Industry-standard risk assessment',
      'Batch processing support',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/contracts/analyze', description: 'Analyze a contract document' },
      { method: 'POST', path: '/v1/contracts/extract', description: 'Extract key terms from a contract' },
      { method: 'POST', path: '/v1/contracts/risk', description: 'Score contract risk' },
    ],
    overview: {
      title: 'Contract Analysis API',
      body: [
        'ContractIQ simplifies contract review and analysis with powerful natural language processing capabilities. The API can extract key terms, clauses, and obligations from contracts in various formats.',
        'Advanced risk scoring algorithms identify high-risk sections based on industry standards, helping legal teams prioritize their review process. This reduces the time and effort required for contract analysis.',
        'ContractIQ supports batch processing, making it ideal for handling large volumes of contracts. Whether you\'re a legal firm, corporate legal department, or procurement team, ContractIQ can streamline your contract management workflow.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '20 analyses / month',
  },
  {
    slug: 'meetingiq',
    name: 'MeetingIQ',
    category: 'api',
    tagline: 'Meeting transcription and intelligence API.',
    description: 'Automatically transcribe meetings, extract action items, and generate meeting summaries. Supports multiple languages and speaker diarization.',
    pricing: {
      label: 'Starting from',
      display: '$24',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '5 hours / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '50 hours / month', price: '$24', highlight: true },
        { name: 'Business', calls: '500 hours / month', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'High-accuracy transcription',
      'Action item extraction',
      'Meeting summary generation',
      'Speaker diarization',
      'Multi-language support',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/meetings/transcribe', description: 'Transcribe a meeting audio file' },
      { method: 'POST', path: '/v1/meetings/analyze', description: 'Analyze a meeting transcription' },
      { method: 'POST', path: '/v1/meetings/summarize', description: 'Generate a meeting summary' },
    ],
    overview: {
      title: 'Meeting Intelligence API',
      body: [
        'MeetingIQ transforms unstructured meeting audio into structured, actionable data. The API provides high-accuracy transcription with speaker diarization, making it easy to follow conversations.',
        'Advanced analytics extract action items, key decisions, and important topics from meeting transcripts. Automated summary generation saves time by providing a concise overview of the meeting.',
        'Support for multiple languages and flexible pricing tiers make MeetingIQ suitable for teams of all sizes. Improve meeting efficiency and productivity with MeetingIQ.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '5 hours / month',
  },
  {
    slug: 'talentpulse',
    name: 'TalentPulse',
    category: 'api',
    tagline: 'Job market intelligence and salary benchmarks.',
    description: 'Get real-time job market data, salary benchmarks, and hiring trends. Analyze job descriptions for skills and requirements.',
    pricing: {
      label: 'Starting from',
      display: '$29',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '100 searches / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '1,000 searches / month', price: '$29', highlight: true },
        { name: 'Business', calls: '10,000 searches / month', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Real-time job market data',
      'Salary benchmarking',
      'Hiring trend analysis',
      'Job description analysis',
      'Skills and requirements extraction',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/jobs/search', description: 'Search for jobs' },
      { method: 'POST', path: '/v1/jobs/analyze', description: 'Analyze job descriptions' },
      { method: 'GET', path: '/v1/salaries', description: 'Get salary benchmarks' },
      { method: 'GET', path: '/v1/trends', description: 'Get hiring trends' },
    ],
    overview: {
      title: 'Job Market Intelligence',
      body: [
        'TalentPulse provides comprehensive job market intelligence and salary benchmarks. The API aggregates data from multiple sources to deliver real-time insights into hiring trends, skill requirements, and compensation levels.',
        'Analyze job descriptions to extract key skills and requirements, helping recruiters and job seekers understand market demands. Salary benchmarking data helps employers make informed compensation decisions.',
        'TalentPulse supports targeted searches by location, industry, and job title, making it an invaluable tool for recruiters, HR professionals, and job seekers.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '100 searches / month',
  },
  {
    slug: 'creditlens',
    name: 'CreditLens',
    category: 'api',
    animateIn: 'slide-right',
    animateDelay: 1,
    tagline: 'Alternative credit risk scoring API.',
    description: 'Score credit risk using alternative data sources including social media, transaction history, and behavioral data. Provides detailed risk insights and recommendations.',
    pricing: {
      label: 'Starting from',
      display: '$49',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '50 scores / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '500 scores / month', price: '$49', highlight: true },
        { name: 'Business', calls: '5,000 scores / month', price: '$149', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Alternative data-driven risk scoring',
      'Detailed risk insights and recommendations',
      'Real-time scoring capabilities',
      'Fraud detection integration',
      'Custom model training options',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/credit/score', description: 'Generate a credit score' },
      { method: 'POST', path: '/v1/credit/insights', description: 'Get detailed risk insights' },
      { method: 'POST', path: '/v1/credit/recommendations', description: 'Get risk recommendations' },
    ],
    overview: {
      title: 'Alternative Credit Scoring',
      body: [
        'CreditLens provides innovative credit risk scoring using alternative data sources. Traditional credit scoring relies heavily on financial history, which excludes many individuals and businesses. CreditLens expands the scope by incorporating social media data, transaction history, and behavioral patterns.',
        'The API delivers detailed risk insights and actionable recommendations, helping lenders make more informed decisions. Real-time scoring capabilities enable fast approval processes for loans and credit applications.',
        'CreditLens also includes fraud detection capabilities, adding an extra layer of security for financial institutions. Custom model training options allow organizations to fine-tune the scoring algorithm to their specific needs.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '50 scores / month',
  },
  {
    slug: 'fxbridge',
    name: 'FXBridge',
    category: 'api',
    tagline: 'Real-time and historical FX rates API.',
    description: 'Get real-time foreign exchange rates and historical data for over 150 currencies. Supports batch queries and currency conversion.',
    pricing: {
      label: 'Starting from',
      display: '$19',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '1,000 calls / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '10,000 calls / month', price: '$19', highlight: true },
        { name: 'Business', calls: '100,000 calls / month', price: '$49', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Real-time FX rates for 150+ currencies',
      'Historical data for up to 10 years',
      'Currency conversion',
      'Batch query support',
      'Minute-level granularity',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/fx/rates', description: 'Get real-time exchange rates' },
      { method: 'GET', path: '/v1/fx/historical', description: 'Get historical FX data' },
      { method: 'GET', path: '/v1/fx/convert', description: 'Convert between currencies' },
    ],
    overview: {
      title: 'Foreign Exchange Rates API',
      body: [
        'FXBridge provides reliable real-time and historical foreign exchange rates for over 150 currencies. The API delivers accurate, up-to-date data from multiple liquidity providers, ensuring the best possible rates.',
        'Access historical data for up to 10 years with minute-level granularity, perfect for financial analysis and reporting. Currency conversion and batch query capabilities simplify integration into applications.',
        'Whether you\'re building a financial application, e-commerce platform, or business intelligence tool, FXBridge has the currency data you need.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '1,000 calls / month',
  },
  {
    slug: 'devkit',
    name: 'DevKit',
    category: 'api',
    tagline: 'Developer utility API (UUID, hash, cron, etc.).',
    description: 'A collection of developer utility endpoints including UUID generation, hash functions, cron expression parsing, and more.',
    pricing: {
      label: 'Starting from',
      display: '$9',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '10,000 calls / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '100,000 calls / month', price: '$9', highlight: true },
        { name: 'Business', calls: '1,000,000 calls / month', price: '$29', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'UUID generation (v1, v3, v4, v5)',
      'Hash functions (MD5, SHA-1, SHA-256, SHA-512)',
      'Cron expression parsing and validation',
      'Random number generation',
      'Date and time utilities',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/uuid/generate', description: 'Generate UUIDs' },
      { method: 'POST', path: '/v1/hash', description: 'Compute hash values' },
      { method: 'POST', path: '/v1/cron/validate', description: 'Validate cron expressions' },
      { method: 'POST', path: '/v1/cron/next', description: 'Get next cron execution times' },
      { method: 'GET', path: '/v1/random', description: 'Generate random numbers' },
    ],
    overview: {
      title: 'Developer Utility API',
      body: [
        'DevKit is a collection of essential developer utility endpoints designed to simplify common tasks. Instead of implementing these features from scratch, you can use DevKit\'s reliable API.',
        'The API includes UUID generation, hash functions, cron expression parsing, and random number generation. Each endpoint is optimized for performance and reliability.',
        'DevKit simplifies development by providing well-documented, easy-to-use endpoints for common utility functions. Save time and effort by leveraging DevKit in your projects.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '10,000 calls / month',
  },
  {
    slug: 'finsightiq',
    name: 'FinSightIQ',
    category: 'api',
    tagline: 'Financial data intelligence API.',
    description: 'Access comprehensive financial data including stock prices, company information, financial statements, and market news.',
    pricing: {
      label: 'Starting from',
      display: '$49',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '500 calls / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '5,000 calls / month', price: '$49', highlight: true },
        { name: 'Business', calls: '50,000 calls / month', price: '$149', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Real-time and historical stock prices',
      'Company information and profiles',
      'Financial statements (balance sheet, income, cash flow)',
      'Market news and analysis',
      'Stock screeners and filters',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/stocks/prices', description: 'Get stock prices' },
      { method: 'GET', path: '/v1/stocks/company', description: 'Get company information' },
      { method: 'GET', path: '/v1/stocks/financials', description: 'Get financial statements' },
      { method: 'GET', path: '/v1/stocks/news', description: 'Get market news' },
      { method: 'GET', path: '/v1/stocks/screener', description: 'Screen stocks' },
    ],
    overview: {
      title: 'Financial Data Intelligence',
      body: [
        'FinSightIQ provides comprehensive financial data and market intelligence. Access real-time and historical stock prices, company information, financial statements, and market news from a single API.',
        'The API includes powerful stock screener capabilities, allowing you to filter stocks based on various criteria. Financial statements are available for balance sheets, income statements, and cash flow statements.',
        'FinSightIQ is ideal for financial analysts, traders, and developers building financial applications. The data is reliable, up-to-date, and easy to integrate.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '500 calls / month',
  },
  {
    slug: 'oracleiq',
    name: 'OracleIQ',
    category: 'api',
    animateIn: 'slide-right',
    animateDelay: 2,
    tagline: 'Prediction market intelligence API.',
    description: 'Access prediction market data from various platforms. Get real-time odds and trends for political events, sports, and more.',
    pricing: {
      label: 'Starting from',
      display: '$29',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '200 calls / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '2,000 calls / month', price: '$29', highlight: true },
        { name: 'Business', calls: '20,000 calls / month', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Real-time prediction market odds',
      'Historical data and trends',
      'Event categorization (politics, sports, technology)',
      'Market sentiment analysis',
      'Multiple prediction market sources',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/events', description: 'Get upcoming events' },
      { method: 'GET', path: '/v1/events/odds', description: 'Get event odds' },
      { method: 'GET', path: '/v1/events/trends', description: 'Get event trends' },
      { method: 'GET', path: '/v1/markets/sentiment', description: 'Get market sentiment' },
    ],
    overview: {
      title: 'Prediction Market Intelligence',
      body: [
        'OracleIQ provides access to prediction market data from various platforms. Prediction markets aggregate the wisdom of crowds, providing insights into the likelihood of future events.',
        'The API includes real-time odds, historical data, and sentiment analysis for events across politics, sports, technology, and more. Market trends help identify emerging patterns and potential shifts in sentiment.',
        'OracleIQ is ideal for researchers, analysts, and developers building prediction market applications. The data can also be used for event forecasting and decision support.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '200 calls / month',
  },
  {
    slug: 'searchkit',
    name: 'SearchKit',
    category: 'api',
    tagline: 'Intelligent web search API.',
    description: 'Perform intelligent web searches with advanced filtering and categorization. Get relevant results from multiple sources.',
    pricing: {
      label: 'Starting from',
      display: '$39',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '500 searches / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '5,000 searches / month', price: '$39', highlight: true },
        { name: 'Business', calls: '50,000 searches / month', price: '$99', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Advanced search filtering and categorization',
      'Multiple search engine integration',
      'Custom search queries',
      'Search result extraction and formatting',
      'Rate-limited API access',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/search/web', description: 'Search the web' },
      { method: 'GET', path: '/v1/search/images', description: 'Search for images' },
      { method: 'GET', path: '/v1/search/videos', description: 'Search for videos' },
      { method: 'POST', path: '/v1/search/custom', description: 'Custom search queries' },
    ],
    overview: {
      title: 'Intelligent Web Search API',
      body: [
        'SearchKit provides intelligent web search capabilities with advanced filtering and categorization. The API aggregates results from multiple sources to deliver the most relevant information.',
        'Advanced search features include filtering by date, region, language, and content type. Search results are extracted and formatted for easy integration into applications.',
        'SearchKit supports custom search queries, allowing you to tailor search parameters to your specific needs. Whether you\'re building a search engine, research tool, or content discovery application, SearchKit can help.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '500 searches / month',
  },
  {
    slug: 'transactiq',
    name: 'TransactIQ',
    category: 'api',
    tagline: 'Transaction enrichment and categorisation API.',
    description: 'Enrich and categorize financial transactions. Get merchant information, transaction types, and spending insights.',
    pricing: {
      label: 'Starting from',
      display: '$29',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '1,000 transactions / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '10,000 transactions / month', price: '$29', highlight: true },
        { name: 'Business', calls: '100,000 transactions / month', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Transaction categorization',
      'Merchant information enrichment',
      'Spending insights and analytics',
      'Fraud detection indicators',
      'Batch processing support',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/transactions/enrich', description: 'Enrich transaction data' },
      { method: 'POST', path: '/v1/transactions/categorize', description: 'Categorize transactions' },
      { method: 'POST', path: '/v1/transactions/insights', description: 'Get spending insights' },
    ],
    overview: {
      title: 'Transaction Enrichment API',
      body: [
        'TransactIQ simplifies transaction enrichment and categorization. The API takes raw transaction data and adds valuable information such as merchant details, transaction types, and spending insights.',
        'Advanced categorization algorithms automatically classify transactions into relevant categories, making it easy to analyze spending patterns. Fraud detection indicators help identify suspicious transactions.',
        'TransactIQ supports batch processing, making it ideal for handling large volumes of transactions. Whether you\'re building a personal finance app, accounting software, or financial management tool, TransactIQ can streamline your workflow.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '1,000 transactions / month',
  },
  {
    slug: 'trustiqq',
    name: 'TrustIQ',
    category: 'api',
    animateIn: 'slide-right',
    animateDelay: 3,
    tagline: 'Identity and trust verification API.',
    description: 'Verify user identities, authenticate documents, and assess trust levels. Supports email, phone, and document verification.',
    pricing: {
      label: 'Starting from',
      display: '$49',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '100 verifications / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '1,000 verifications / month', price: '$49', highlight: true },
        { name: 'Business', calls: '10,000 verifications / month', price: '$149', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Email verification and validation',
      'Phone number verification',
      'Document authentication',
      'Identity verification',
      'Trust scoring and assessment',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/verification/email', description: 'Verify an email address' },
      { method: 'POST', path: '/v1/verification/phone', description: 'Verify a phone number' },
      { method: 'POST', path: '/v1/verification/document', description: 'Authenticate a document' },
      { method: 'POST', path: '/v1/verification/identity', description: 'Verify user identity' },
      { method: 'POST', path: '/v1/verification/trust', description: 'Assess trust level' },
    ],
    overview: {
      title: 'Identity and Trust Verification',
      body: [
        'TrustIQ provides comprehensive identity and trust verification services. The API supports email verification, phone number verification, document authentication, and full identity verification.',
        'Advanced trust scoring algorithms assess user trust levels based on various factors. This helps organizations make informed decisions about user onboarding, access control, and transaction authorization.',
        'TrustIQ is ideal for fintech applications, marketplaces, and any service that requires user verification. The API is secure, reliable, and compliant with data protection regulations.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '100 verifications / month',
  },
  {
    slug: 'wealthmind',
    name: 'WealthMind',
    category: 'api',
    tagline: 'Personal finance intelligence API.',
    description: 'Get personalized financial advice, budget analysis, and investment recommendations. Analyze spending patterns and goals.',
    pricing: {
      label: 'Starting from',
      display: '$24',
      unit: 'per month, Pro',
      tiers: [
        { name: 'Free', calls: '50 analyses / month', price: '$0', highlight: false },
        { name: 'Pro', calls: '500 analyses / month', price: '$24', highlight: true },
        { name: 'Business', calls: '5,000 analyses / month', price: '$79', highlight: false },
        { name: 'Enterprise', calls: 'Unlimited', price: 'Custom', highlight: false },
      ],
    },
    features: [
      'Personalized financial advice',
      'Budget analysis and recommendations',
      'Investment recommendations',
      'Spending pattern analysis',
      'Goal tracking and planning',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/finance/analyze', description: 'Analyze financial data' },
      { method: 'POST', path: '/v1/finance/advice', description: 'Get personalized advice' },
      { method: 'POST', path: '/v1/finance/budget', description: 'Analyze budget' },
      { method: 'POST', path: '/v1/finance/invest', description: 'Get investment recommendations' },
    ],
    overview: {
      title: 'Personal Finance Intelligence',
      body: [
        'WealthMind provides personalized financial intelligence and advice. The API analyzes financial data to provide insights into spending patterns, budget recommendations, and investment suggestions.',
        'Advanced algorithms consider individual financial goals, risk tolerance, and current financial situation to deliver tailored advice. Whether you\'re planning for retirement, saving for a goal, or managing your daily expenses, WealthMind can help.',
        'WealthMind integrates with various financial data sources to provide a complete picture of your financial health. The API is secure, privacy-focused, and compliant with financial regulations.',
      ],
    },
    channels: ['direct', 'rapidapi', 'gumroad'],
    freeTier: '50 analyses / month',
  },
  {
    slug: 'voicepost',
    name: 'VoicePost',
    category: 'ext',
    tagline: 'AI LinkedIn writing assistant Chrome extension.',
    description: 'AI-powered writing assistant for LinkedIn posts. Generate engaging content, optimize for LinkedIn\'s algorithm, and analyze performance.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'AI-powered LinkedIn post generation',
      'Algorithm optimization tips',
      'Post performance analysis',
      'Content suggestions and ideas',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/linkedin/generate', description: 'Generate LinkedIn posts' },
      { method: 'POST', path: '/v1/linkedin/optimize', description: 'Optimize posts for LinkedIn algorithm' },
      { method: 'GET', path: '/v1/linkedin/ideas', description: 'Get post ideas' },
    ],
    overview: {
      title: 'LinkedIn Writing Assistant',
      body: [
        'VoicePost is an AI-powered LinkedIn writing assistant that helps you create engaging posts. The Chrome extension integrates seamlessly with LinkedIn, providing writing suggestions and optimization tips.',
        'Advanced AI algorithms generate post content based on your topic and writing style. The extension also provides tips for optimizing your posts for LinkedIn\'s algorithm, helping you reach a larger audience.',
        'VoicePost includes post performance analysis, allowing you to track engagement and identify what works. Whether you\'re a professional looking to build your personal brand or a business seeking to grow its LinkedIn presence, VoicePost can help.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'paygrade',
    name: 'PayGrade',
    category: 'ext',
    tagline: 'Salary intelligence overlay on job listings.',
    description: 'Chrome extension that adds salary intelligence to job listings. Get real-time salary benchmarks and compensation insights.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Real-time salary benchmarks',
      'Compensation insights for job listings',
      'Salary range estimates',
      'Comparison with market rates',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/salary/benchmark', description: 'Get salary benchmarks' },
      { method: 'POST', path: '/v1/salary/estimate', description: 'Estimate salary range' },
      { method: 'POST', path: '/v1/salary/compare', description: 'Compare with market rates' },
    ],
    overview: {
      title: 'Salary Intelligence Extension',
      body: [
        'PayGrade adds salary intelligence to job listings. The Chrome extension automatically detects job descriptions and provides real-time salary benchmarks and compensation insights.',
        'Advanced algorithms analyze job descriptions to estimate salary ranges based on location, experience level, and industry. Salary benchmarks help job seekers understand if a position is competitively paid.',
        'PayGrade simplifies salary research and negotiation. Whether you\'re job hunting or evaluating a job offer, PayGrade provides the salary information you need to make informed decisions.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'reviewpal',
    name: 'ReviewPal',
    category: 'ext',
    animateIn: 'slide-right',
    animateDelay: 0,
    tagline: 'GitHub PR visual design reviewer.',
    description: 'Chrome extension that reviews GitHub PRs for visual design changes. Compare screenshots of the old and new UI.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Visual design review for GitHub PRs',
      'Screenshot comparison of old and new UI',
      'Design change detection',
      'Automatic PR analysis',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/review/design', description: 'Review PR design changes' },
      { method: 'POST', path: '/v1/review/compare', description: 'Compare screenshots' },
      { method: 'POST', path: '/v1/review/detect', description: 'Detect design changes' },
    ],
    overview: {
      title: 'GitHub PR Design Review',
      body: [
        'ReviewPal helps you review GitHub PRs for visual design changes. The Chrome extension automatically compares screenshots of the old and new UI, making it easy to detect design inconsistencies.',
        'Advanced image analysis algorithms highlight design changes, making it simple to spot even subtle differences. This saves time and improves the quality of design reviews.',
        'ReviewPal is ideal for front-end developers, designers, and QA teams. The Chrome extension integrates seamlessly with GitHub, providing a familiar interface for design review.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'briefpal',
    name: 'BriefPal',
    category: 'ext',
    tagline: 'Meeting intelligence for Google Calendar + Meet.',
    description: 'Chrome extension that adds meeting intelligence to Google Calendar and Meet. Automatically transcribe meetings and extract action items.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Meeting transcription for Google Meet',
      'Action item extraction',
      'Meeting summary generation',
      'Integration with Google Calendar',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/meetings/transcribe', description: 'Transcribe Google Meet recordings' },
      { method: 'POST', path: '/v1/meetings/analyze', description: 'Analyze meeting transcriptions' },
      { method: 'POST', path: '/v1/meetings/summarize', description: 'Generate meeting summaries' },
    ],
    overview: {
      title: 'Google Meet Intelligence',
      body: [
        'BriefPal adds meeting intelligence to Google Calendar and Meet. The Chrome extension automatically transcribes meetings, extracts action items, and generates summaries.',
        'Advanced speech recognition and natural language processing algorithms ensure high-quality transcriptions and accurate action item extraction. Meeting summaries are automatically attached to Google Calendar events.',
        'BriefPal simplifies meeting follow-up and documentation. Whether you\'re a team lead, project manager, or individual contributor, BriefPal can help you stay organized and productive.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'designspy',
    name: 'DesignSpy',
    category: 'ext',
    tagline: 'Design token extractor from any live website.',
    description: 'Chrome extension that extracts design tokens from any live website. Get colors, fonts, spacing, and other design information.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Design token extraction',
      'Color palette detection',
      'Font information extraction',
      'Spacing and layout analysis',
      'Design system documentation',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/design/tokens', description: 'Extract design tokens' },
      { method: 'POST', path: '/v1/design/colors', description: 'Extract color palette' },
      { method: 'POST', path: '/v1/design/fonts', description: 'Extract font information' },
      { method: 'POST', path: '/v1/design/spacing', description: 'Extract spacing information' },
    ],
    overview: {
      title: 'Design Token Extractor',
      body: [
        'DesignSpy extracts design tokens from any live website. The Chrome extension analyzes CSS styles to extract colors, fonts, spacing, and other design information.',
        'Advanced CSS parsing algorithms identify design patterns and extract consistent design tokens. The extracted information can be used to create or update design systems.',
        'DesignSpy is ideal for designers, front-end developers, and design system maintainers. The Chrome extension makes it easy to extract design information from existing websites.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'copypilot',
    name: 'CopyPilot',
    category: 'ext',
    animateIn: 'slide-right',
    animateDelay: 1,
    tagline: 'AI writing assistant for every text field.',
    description: 'Chrome extension that adds an AI writing assistant to every text field. Generate content, rephrase, and summarize text anywhere.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'AI writing assistant for any text field',
      'Content generation',
      'Text rephrasing',
      'Text summarization',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/writing/generate', description: 'Generate text' },
      { method: 'POST', path: '/v1/writing/rephrase', description: 'Rephrase text' },
      { method: 'POST', path: '/v1/writing/summarize', description: 'Summarize text' },
    ],
    overview: {
      title: 'Universal Writing Assistant',
      body: [
        'CopyPilot adds an AI writing assistant to every text field. The Chrome extension works with any website or application, providing content generation, rephrasing, and summarization capabilities.',
        'Advanced natural language processing algorithms understand context and generate high-quality text. The extension is easy to use, with a simple interface that appears whenever you focus on a text field.',
        'CopyPilot simplifies writing tasks for any use case. Whether you\'re writing emails, social media posts, or documentation, CopyPilot can help you write faster and better.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'handoffready',
    name: 'HandoffReady',
    category: 'ext',
    tagline: 'Live webpage design QA auditor.',
    description: 'Chrome extension that audits live webpages for design QA. Check for design inconsistencies and accessibility issues.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Design QA auditing for webpages',
      'Design consistency checks',
      'Accessibility analysis',
      'Automated testing',
      'Easy-to-use Chrome extension interface',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/design/audit', description: 'Audit webpage design' },
      { method: 'POST', path: '/v1/design/check', description: 'Check design consistency' },
      { method: 'POST', path: '/v1/design/accessibility', description: 'Analyze accessibility' },
    ],
    overview: {
      title: 'Webpage Design QA Auditor',
      body: [
        'HandoffReady audits live webpages for design QA. The Chrome extension checks for design inconsistencies, accessibility issues, and other quality problems.',
        'Advanced design analysis algorithms identify issues such as broken links, inconsistent spacing, color contrast problems, and accessibility violations. The extension provides detailed reports and actionable recommendations.',
        'HandoffReady simplifies design QA and accessibility testing. Whether you\'re a designer, developer, or QA tester, HandoffReady can help you ensure your webpages are accessible and visually consistent.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'flowmapper',
    name: 'FlowMapper',
    category: 'ext',
    tagline: 'Website sitemap and user flow visualiser.',
    description: 'Chrome extension that generates a sitemap and visualizes user flows. Analyze website structure and navigation.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Website sitemap generation',
      'User flow visualization',
      'Website structure analysis',
      'Navigation mapping',
      'Interactive flow diagrams',
    ],
    endpoints: [
      { method: 'POST', path: '/v1/flow/map', description: 'Generate sitemap' },
      { method: 'POST', path: '/v1/flow/visualize', description: 'Visualize user flows' },
      { method: 'POST', path: '/v1/flow/analyze', description: 'Analyze website structure' },
    ],
    overview: {
      title: 'Website Structure and Flow Analysis',
      body: [
        'FlowMapper generates sitemaps and visualizes user flows. The Chrome extension crawls websites to create interactive diagrams of site structure and navigation.',
        'Advanced web crawling algorithms identify all pages and their relationships. User flows are visualized with interactive diagrams, making it easy to understand how users navigate through a website.',
        'FlowMapper simplifies website analysis and optimization. Whether you\'re redesigning a website, optimizing user experience, or conducting usability testing, FlowMapper provides valuable insights into website structure.',
      ],
    },
    channels: ['chrome-store', 'direct'],
    freeTier: 'Unlimited',
  },
  {
    slug: 'tender-command-center',
    name: 'Tender Command Center',
    category: 'app',
    tagline: 'SA government tender analysis platform.',
    description: 'Web application for analyzing South African government tenders. Get tender intelligence, supplier information, and bidding recommendations.',
    pricing: {
      label: 'Free',
      display: '$0',
      unit: 'free',
      tiers: [
        { name: 'Free', calls: 'Unlimited', price: '$0', highlight: true },
      ],
    },
    features: [
      'Tender intelligence dashboard',
      'Supplier information and profiles',
      'Bidding recommendations',
      'Tender analysis tools',
      'Real-time tender updates',
    ],
    endpoints: [
      { method: 'GET', path: '/v1/tenders', description: 'Get active tenders' },
      { method: 'POST', path: '/v1/tenders/analyze', description: 'Analyze tender documents' },
      { method: 'GET', path: '/v1/suppliers', description: 'Get supplier information' },
      { method: 'GET', path: '/v1/recommendations', description: 'Get bidding recommendations' },
    ],
    overview: {
      title: 'Tender Analysis Platform',
      body: [
        'Tender Command Center is a comprehensive platform for analyzing South African government tenders. The web application provides tender intelligence, supplier information, and bidding recommendations.',
        'Advanced analytics tools help you evaluate tenders, identify potential partners, and make informed bidding decisions. Real-time updates ensure you never miss an important tender opportunity.',
        'Tender Command Center simplifies the tender process for businesses of all sizes. Whether you\'re a small business looking for new opportunities or a large enterprise managing multiple bids, Tender Command Center can help.',
      ],
    },
    channels: ['direct'],
    freeTier: 'Unlimited',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') {
    return products;
  }
  return products.filter((product) => product.category === category);
}