// Asset & Network Strategy Manager for STARDUST COMPUTATIONAL LAB
// Enhanced with 3D model loading queue and priority-based concurrency

interface QueueTask {
  url: string;
  type: 'image' | 'video' | 'model';
  resolve: () => void;
  reject: (err: any) => void;
}

class AssetQueueManager {
  private concurrencyLimit = 4;
  private activeCount = 0;
  private queue: QueueTask[] = [];
  private cache = new Set<string>();
  private pending = new Set<string>();
  private modelCache = new Map<string, boolean>();
  private processingSequential = false;

  constructor() {
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.saveData) {
          this.concurrencyLimit = 1;
        } else if (conn.effectiveType === '4g') {
          this.concurrencyLimit = 3;
        } else if (conn.effectiveType === '3g') {
          this.concurrencyLimit = 2;
        }
      }
    }
  }

  public isLoaded(url: string): boolean {
    return this.cache.has(url) || this.modelCache.has(url);
  }

  public isPending(url: string): boolean {
    return this.pending.has(url);
  }

  public loadImage(url: string): Promise<void> {
    if (this.cache.has(url)) {
      return Promise.resolve();
    }

    if (this.pending.has(url)) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          url,
          type: 'image',
          resolve: () => {
            this.cache.add(url);
            resolve();
          },
          reject,
        });
      });
    }

    this.pending.add(url);

    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        type: 'image',
        resolve: () => {
          this.cache.add(url);
          this.pending.delete(url);
          resolve();
        },
        reject,
      });
      this.processQueue();
    });
  }

  public loadModel(url: string): Promise<void> {
    if (this.modelCache.has(url)) {
      return Promise.resolve();
    }

    if (this.pending.has(url)) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          url,
          type: 'model',
          resolve: () => {
            this.modelCache.set(url, true);
            resolve();
          },
          reject,
        });
      });
    }

    this.pending.add(url);

    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        type: 'model',
        resolve: () => {
          this.modelCache.set(url, true);
          this.pending.delete(url);
          resolve();
        },
        reject,
      });
      this.processQueue();
    });
  }

  private processQueue() {
    while (this.activeCount < this.concurrencyLimit && this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) break;

      this.activeCount++;

      if (task.type === 'model') {
        fetch(task.url)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load model: ${response.statusText}`);
            return response.blob();
          })
          .then(() => {
            this.activeCount--;
            task.resolve();
            this.processQueue();
          })
          .catch((err) => {
            this.activeCount--;
            this.pending.delete(task.url);
            task.reject(err);
            this.processQueue();
          });
      } else {
        const img = new Image();
        img.decoding = 'async';
        img.src = task.url;

        img.onload = () => {
          this.activeCount--;
          task.resolve();
          this.processQueue();
        };

        img.onerror = (err) => {
          this.activeCount--;
          this.pending.delete(task.url);
          task.reject(err);
          this.processQueue();
        };
      }
    }
  }

  public clearCache(url: string): void {
    this.cache.delete(url);
    this.modelCache.delete(url);
  }

  public clearAllCaches(): void {
    this.cache.clear();
    this.modelCache.clear();
  }

  public getQueueLength(): number {
    return this.queue.length;
  }

  public getActiveCount(): number {
    return this.activeCount;
  }

  /**
   * Load a 3D model (.glb) file sequentially (one at a time).
   * Models are loaded one by one in a chain to avoid network saturation.
   */
  public loadModelSequential(url: string): Promise<void> {
    if (this.modelCache.has(url)) {
      return Promise.resolve();
    }

    if (this.pending.has(url)) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          url,
          type: 'model',
          resolve: () => {
            this.modelCache.set(url, true);
            resolve();
          },
          reject,
        });
      });
    }

    this.pending.add(url);

    return new Promise((resolve, reject) => {
      this.queue.push({
        url,
        type: 'model',
        resolve: () => {
          this.modelCache.set(url, true);
          this.pending.delete(url);
          resolve();
        },
        reject,
      });
      this.processQueueSequential();
    });
  }

  private processQueueSequential() {
    if (this.processingSequential || this.queue.length === 0) return;

    const task = this.queue.shift();
    if (!task) return;

    this.processingSequential = true;

    if (task.type === 'model') {
      fetch(task.url)
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to load model: ${response.statusText}`);
          return response.blob();
        })
        .then(() => {
          this.processingSequential = false;
          task.resolve();
          this.processQueueSequential();
        })
        .catch((err) => {
          this.processingSequential = false;
          this.pending.delete(task.url);
          task.reject(err);
          this.processQueueSequential();
        });
    } else {
      this.processingSequential = false;
      this.queue.unshift(task);
      this.processQueue();
    }
  }
}

export const assetManager = new AssetQueueManager();

export function getOptimizedImageUrl(url: string, width = 800, height = 800): string {
  if (!url) return '';
  if (url.includes('picsum.photos')) {
    return url.replace(/\/500\/500/, `/${width}/${height}`);
  }
  return url;
}