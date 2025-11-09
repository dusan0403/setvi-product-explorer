export const quotesQueryKeys = {
  all: ["quotes"] as const,
  combined: () => [...quotesQueryKeys.all, "combined-text"] as const,
  list: () => [...quotesQueryKeys.all, "all"] as const,
} as const;
