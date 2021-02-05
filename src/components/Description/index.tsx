import styles from './index.less';

export interface IDescription {
  title: string;
  subtitle: string;
}
export default function Description({ title, subtitle }: IDescription) {
  return (
    <div className={styles.description}>
      <span className={styles.title}>{title}:</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}
