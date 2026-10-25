import Image from 'next/image';
import styles from './WorkshopGallery.module.css';

export default function WorkshopGallery() {
  return (
    <div className={styles.gallery}>
      <figure className={styles.photo}>
        <Image
          src="/images/workshop-repair-bench.webp"
          alt="GR Solution workshop repair bench with TV panels and diagnostic equipment"
          width={1200}
          height={900}
          sizes="(min-width: 768px) 56vw, 100vw"
          className={styles.image}
        />
      </figure>
      <figure className={styles.photo}>
        <Image
          src="/images/workshop-tv-diagnosis.webp"
          alt="GR Solution technician inspecting a TV at the workshop"
          width={720}
          height={960}
          sizes="(min-width: 768px) 32vw, 100vw"
          className={styles.image}
        />
      </figure>
    </div>
  );
}
