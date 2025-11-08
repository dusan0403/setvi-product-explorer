import styles from "./ProductTableSkeleton.module.css";

export function ProductTableSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerCell}>Image</div>
        <div className={styles.headerCell}>Title</div>
        <div className={styles.headerCell}>Category</div>
        <div className={styles.headerCell}>Price</div>
        <div className={styles.headerCell}>Rating</div>
      </div>

      {[...Array(10)].map((_, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.cell}>
            <div className={styles.imageSkeleton} />
          </div>
          <div className={`${styles.cell} ${styles.title}`}>
            <div className={styles.textSkeleton} style={{ width: "70%" }} />
          </div>
          <div className={styles.cell}>
            <div className={styles.textSkeleton} style={{ width: "60%" }} />
          </div>
          <div className={styles.cell}>
            <div className={styles.textSkeleton} style={{ width: "40%" }} />
          </div>
          <div className={styles.cell}>
            <div className={styles.textSkeleton} style={{ width: "30%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
