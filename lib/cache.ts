interface CacheItem {
    value: any;
    expiresAt: number;
  }
  
  class Cache {
    private data: Record<string, CacheItem>;
  
    constructor() {
      this.data = {};
    }
  
    async get(key: string): Promise<any> {
      const item = this.data[key];
      if (item && item.expiresAt > Date.now()) {
        return item.value;
      } else {
        delete this.data[key];
        return null;
      }
    }
  
    async set(key: string, value: any, maxAgeInSeconds: number): Promise<void> {
      const expiresAt = Date.now() + maxAgeInSeconds * 1000;
      this.data[key] = { value, expiresAt };
    }
  }
  
  export const cache = new Cache();
  