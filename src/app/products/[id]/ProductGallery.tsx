"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ProductImage = {
  id: string;
  url: string;
};

export default function ProductGallery({ images, fallbackUrl }: { images: ProductImage[], fallbackUrl: string | null }) {
  const allImages = images.length > 0 ? images.map(img => img.url) : (fallbackUrl ? [fallbackUrl] : []);
  const [mainImage, setMainImage] = useState(allImages.length > 0 ? allImages[0] : null);

  if (allImages.length === 0) {
    return (
      <div className={styles.imagePlaceholder}>
        <span>No Image Available</span>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.mainImageWrapper}>
        <img src={mainImage!} alt="Product" className={styles.mainImage} />
      </div>
      
      {allImages.length > 1 && (
        <div className={styles.thumbnailsContainer}>
          {allImages.map((url, idx) => (
            <div 
              key={idx} 
              className={`${styles.thumbnailWrapper} ${mainImage === url ? styles.activeThumbnail : ''}`}
              onMouseEnter={() => setMainImage(url)}
              onClick={() => setMainImage(url)}
            >
              <img src={url} alt={`Thumbnail ${idx + 1}`} className={styles.thumbnail} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
