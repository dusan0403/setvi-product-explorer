import { useEffect, useState } from "react";
import { useProductDetail } from "../../hooks/useProducts";
import { useQuotesText } from "../../../quotes/hooks/useQuotes";
import styles from "./ProductDetailDrawer.module.css";
import { TypewriterText } from "../TypewriterText";

interface ProductDetailDrawerProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDrawer({
  productId,
  isOpen,
  onClose,
}: ProductDetailDrawerProps) {
  const [showSummary, setShowSummary] = useState(false);
  const { data: product, isLoading } = useProductDetail(productId);
  const { data: quotesText } = useQuotesText(productId);

  useEffect(() => {
    if (!isOpen) {
      setShowSummary(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close drawer"
        >
          ✕
        </button>

        {isLoading && (
          <div className={styles.loading}>Loading product details...</div>
        )}

        {product && (
          <div className={styles.content}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className={styles.image}
            />

            <h2 className={styles.title}>{product.title}</h2>

            <div className={styles.meta}>
              <span className={styles.price}>${product.price}</span>
              <span className={styles.rating}>⭐ {product.rating}</span>
              <span className={styles.category}>{product.category}</span>
            </div>

            <p className={styles.description}>{product.description}</p>

            {product.tags && (
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.summarySection}>
              <h3 className={styles.sectionTitle}>AI Summary</h3>
              {!showSummary ? (
                <button
                  className={styles.generateBtn}
                  onClick={() => setShowSummary(true)}
                >
                  Generate Summary
                </button>
              ) : (
                <div className={styles.summary}>
                  {quotesText && <TypewriterText text={quotesText} />}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
