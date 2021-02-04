
import styles from './index.less';

export default function Description({title, subtitle}: { title: string, subtitle: string}) {
  return (
    <div className={styles.description}>
      <span className={styles.title}>{title}:</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}
