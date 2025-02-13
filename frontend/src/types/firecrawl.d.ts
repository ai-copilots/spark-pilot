declare module '@mendable/firecrawl-js' {
  interface FirecrawlConfig {
    apiKey?: string | null;
    apiUrl?: string | null;
    agent?: import('http').Agent;
  }

  interface CrawlOptions {
    maxDepth?: number;
    allowExternalLinks?: boolean;
    scrapeOptions?: ScrapeOptions;
    limit?: number;
  }

  interface ScrapeOptions {
    formats?: string[];
    onlyMainContent?: boolean;
    extract?: {
      prompt?: string;
      systemPrompt?: string;
    };
    timeout?: number;
  }

  interface SearchLocation {
    country?: string;
    languages?: string[];
  }

  interface SearchOptions {
    limit?: number;
    scrapeOptions?: ScrapeOptions;
    location?: SearchLocation;
  }

  interface FirecrawlDocument {
    url?: string;
    title?: string;
    description?: string;
    markdown?: string;
    html?: string;
    links?: string[];
    metadata?: Record<string, unknown>;
  }

  interface CrawlResponse {
    success: boolean;
    data: FirecrawlDocument[];
    error?: string;
  }

  export interface ScrapeResponse {
    success: boolean;
    data: FirecrawlDocument;
    error?: string;
  }

  interface SearchResponse {
    success: boolean;
    data: FirecrawlDocument[];
    error?: string;
  }

  export default class FirecrawlApp {
    constructor(config?: FirecrawlConfig);
    scrapeUrl(url: string, options?: ScrapeOptions): Promise<ScrapeResponse>;
    crawlUrl(url: string, options?: CrawlOptions): Promise<CrawlResponse>;
    search(query: string, options?: SearchOptions): Promise<SearchResponse>;
  }
} 