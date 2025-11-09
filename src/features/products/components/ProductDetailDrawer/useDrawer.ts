import { useEffect, useMemo, useRef, useState } from "react";
import { useProductDetail } from "../../hooks/useProducts";
import { useQuotesText } from "../../../quotes/hooks/useQuotes";
import { safeLocal } from "../../../../shared/utils/safeLocalStorage";

export function useProductDetailDrawer(
  productId: number | null,
  isOpen: boolean
) {
  const [showSummary, setShowSummary] = useState(false);
  const [typingThisSession, setTypingThisSession] = useState(false);
  const [persistArmed, setPersistArmed] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);

  const { data: product, isLoading } = useProductDetail(productId);
  const { data: quotesText, isFetching: quotesLoading } = useQuotesText(
    !!productId
  );

  const cachedSummary = useMemo(() => {
    if (productId == null) return null;
    return safeLocal.get(`summary:${productId}`);
  }, [productId]);

  useEffect(() => {
    if (!isOpen) {
      setShowSummary(false);
      setTypingThisSession(false);
      setPersistArmed(false);
      return;
    }
    if (isOpen && productId != null) {
      titleRef.current?.focus();
      if (cachedSummary) {
        setShowSummary(true);
        setTypingThisSession(false);
      }
    }
  }, [isOpen, productId, cachedSummary]);

  useEffect(() => {
    if (!persistArmed) return;
    if (productId != null && quotesText) {
      safeLocal.set(`summary:${productId}`, quotesText);
      setPersistArmed(false);
    }
  }, [persistArmed, productId, quotesText]);

  const handleGenerate = () => {
    setShowSummary(true);
    setTypingThisSession(true);
    if (productId != null && quotesText) {
      safeLocal.set(`summary:${productId}`, quotesText);
      setPersistArmed(false);
    } else {
      setPersistArmed(true);
    }
  };

  return {
    product,
    isLoading,
    quotesText,
    quotesLoading,
    cachedSummary,
    showSummary,
    typingThisSession,
    titleRef,
    handleGenerate,
  };
}
