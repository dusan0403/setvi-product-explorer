export const safeLocal = {
  get(key: string): string | null {
    try {
      if (typeof window === "undefined") return null;
      return window.localStorage.getItem(key);
    } catch (err) {
      console.warn?.(`[safeLocal.get] Failed for key "${key}"`, err);
      return null;
    }
  },
  set(key: string, value: string): boolean {
    try {
      if (typeof window === "undefined") return false;
      window.localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn?.(`[safeLocal.set] Failed for key "${key}"`, err);
      return false;
    }
  },
  remove(key: string): void {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn?.(`[safeLocal.remove] Failed for key "${key}"`, err);
    }
  },
};
