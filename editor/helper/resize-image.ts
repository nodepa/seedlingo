/**
 * Resizes an image to keep it under the specified max size
 * @param {File} file - The image file to resize
 * @param {number} maxSizeInMB - Maximum size in MB
 * @returns {Promise<File>} - A promise that resolves to the resized file
 */

export const resizeImage = (file: File, maxSizeInMB: number = 1): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      return resolve(file);
    }
    
    if (file.size <= maxSizeInMB * 1024 * 1024) {
      return resolve(file);
    }
    
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let quality = 0.8;
        let width = image.width;
        let height = image.height;
        
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0, width, height);
        
        const processImage = (quality: number) => {
          const mime = file.type;
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            if (blob.size <= maxSizeInMB * 1024 * 1024 || quality <= 0.1) {
              // Create new file from blob
              const newFile = new File([blob], file.name, {
                type: mime,
                lastModified: Date.now()
              });
              resolve(newFile);
            } else {
              // Try with lower quality
              processImage(quality - 0.1);
            }
          }, mime, quality);
        };
        
        processImage(quality);
      };
      
      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      image.src = readerEvent.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};