// Environment setup for Cloudflare D1 in Next.js
// Bu file development'ta D1 database'i simüle eder

interface MockD1Database {
  prepare(sql: string): MockD1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch(statements: MockD1PreparedStatement[]): Promise<any[]>;
  exec(sql: string): Promise<any>;
}

interface MockD1PreparedStatement {
  bind(...values: any[]): MockD1PreparedStatement;
  first<T = any>(colName?: string): Promise<T | null>;
  run(): Promise<any>;
  all<T = any>(): Promise<any>;
}

// Development'ta kullanılacak mock database
class MockDatabaseService implements MockD1Database {
  private data: Record<string, any[]> = {
    products: [],
    blog_posts: [],
    faqs: [],
    testimonials: [],
    contact_messages: [],
    site_settings: []
  };

  prepare(sql: string): MockD1PreparedStatement {
    return new MockPreparedStatement(sql, this.data);
  }

  async dump(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0);
  }

  async batch(statements: MockD1PreparedStatement[]): Promise<any[]> {
    const results = [];
    for (const stmt of statements) {
      results.push(await stmt.run());
    }
    return results;
  }

  async exec(sql: string): Promise<any> {
    console.log('Mock DB exec:', sql);
    return { count: 0, duration: 0 };
  }
}

class MockPreparedStatement implements MockD1PreparedStatement {
  private sql: string;
  private values: any[] = [];
  private data: Record<string, any[]>;

  constructor(sql: string, data: Record<string, any[]>) {
    this.sql = sql;
    this.data = data;
  }

  bind(...values: any[]): MockD1PreparedStatement {
    this.values = values;
    return this;
  }

  async first<T = any>(colName?: string): Promise<T | null> {
    const results = await this.all<T>();
    return results.results?.[0] || null;
  }

  async run(): Promise<any> {
    console.log('Mock DB run:', this.sql, this.values);
    
    // INSERT queries için mock response
    if (this.sql.toLowerCase().includes('insert')) {
      return {
        success: true,
        meta: {
          duration: 1,
          size_after: 100,
          rows_read: 0,
          rows_written: 1,
          last_row_id: Date.now()
        }
      };
    }
    
    // UPDATE/DELETE queries için mock response
    return {
      success: true,
      meta: {
        duration: 1,
        size_after: 100,
        rows_read: 1,
        rows_written: 1
      }
    };
  }

  async all<T = any>(): Promise<any> {
    console.log('Mock DB all:', this.sql, this.values);
    
    // SELECT queries için mock data döndür
    if (this.sql.toLowerCase().includes('select')) {
      const tableName = this.extractTableName(this.sql);
      const mockData = this.data[tableName] || [];
      
      return {
        results: mockData,
        success: true,
        meta: {
          duration: 1,
          size_after: 100,
          rows_read: mockData.length,
          rows_written: 0
        }
      };
    }
    
    return {
      results: [],
      success: true,
      meta: {
        duration: 1,
        size_after: 100,
        rows_read: 0,
        rows_written: 0
      }
    };
  }

  private extractTableName(sql: string): string {
    const match = sql.toLowerCase().match(/from\s+(\w+)|into\s+(\w+)|update\s+(\w+)/);
    return match ? (match[1] || match[2] || match[3]) : 'unknown';
  }
}

// Global database binding için setup
export function setupDatabaseBinding() {
  if (typeof globalThis !== 'undefined') {
    // Development'ta mock database kullan
    if (!globalThis.ozmevsim_d1) {
      console.log('🔧 Setting up mock D1 database for development');
      globalThis.ozmevsim_d1 = new MockDatabaseService() as any;
    }
    
    // Backup binding
    if (!globalThis.DB) {
      globalThis.DB = globalThis.ozmevsim_d1;
    }
  }
}

// API route'larda kullanılmak üzere database instance döndür
export function getApiDatabase() {
  // Her durumda gerçek D1 binding'i kullanmaya çalış
  return globalThis.ozmevsim_d1 || globalThis.DB || null;
}

export default setupDatabaseBinding;