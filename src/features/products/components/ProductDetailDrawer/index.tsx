import styles from "./ProductDetailDrawer.module.css";
import { TypewriterText } from "../TypewriterText";
import { useProductDetailDrawer } from "./useDrawer";

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
  const {
    product,
    isLoading,
    quotesLoading,
    cachedSummary,
    quotesText,
    showSummary,
    typingThisSession,
    titleRef,
    handleGenerate,
  } = useProductDetailDrawer(productId, isOpen);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
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
              width={320}
              height={320}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

            <h2
              id="drawer-title"
              ref={titleRef}
              tabIndex={-1}
              className={styles.title}
            >
              {product.title}
            </h2>

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
                  onClick={handleGenerate}
                  disabled={quotesLoading}
                >
                  {quotesLoading ? "Preparing..." : "Generate Summary"}
                </button>
              ) : (
                <div className={styles.summary}>
                  {productId != null && (
                    <TypewriterText
                      key={productId}
                      text={cachedSummary ?? quotesText ?? ""}
                      productId={productId}
                      ignoreCacheThisSession={typingThisSession}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
