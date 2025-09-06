import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePreloaderService {
  private preloadedImages: Map<string, HTMLImageElement> = new Map();

  constructor() { }

  /**
   * Preload a single image
   * @param src Image source URL
   * @returns Promise that resolves when image is loaded
   */
  preloadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // Check if image is already preloaded
      if (this.preloadedImages.has(src)) {
        resolve(this.preloadedImages.get(src)!);
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        this.preloadedImages.set(src, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  /**
   * Preload multiple images
   * @param srcs Array of image source URLs
   * @returns Promise that resolves when all images are loaded
   */
  preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
    const promises = srcs.map(src => this.preloadImage(src));
    return Promise.all(promises);
  }

  /**
   * Preload images that are likely to be needed soon
   */
  preloadCriticalImages(): void {
    const criticalImages = [
      './assets/banner.png',
      './assets/Coalition.png',
      './assets/multi-piece/Coalition_Reforger_Spiral_Blur_USSR_Tunnel.png',
      './assets/multi-piece/Coalition_Reforger_Cutout_USSR_Tunnel.png',
      './assets/images/charlet_bay_dusk.jpg'
    ];

    this.preloadImages(criticalImages).catch(error => {
      console.warn('Some critical images failed to preload:', error);
    });
  }

  /**
   * Check if an image is already preloaded
   * @param src Image source URL
   * @returns Boolean indicating if image is preloaded
   */
  isImagePreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Get preloaded image
   * @param src Image source URL
   * @returns HTMLImageElement if preloaded, undefined otherwise
   */
  getPreloadedImage(src: string): HTMLImageElement | undefined {
    return this.preloadedImages.get(src);
  }
}
