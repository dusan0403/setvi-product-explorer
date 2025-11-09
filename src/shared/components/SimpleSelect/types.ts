export type Opt = { value: string; label: string };

export type SimpleSelectProps = {
  value: string;
  options: Opt[];
  placeholder?: string;
  onChange: (v: string) => void;
  className?: string;
  width?: number | string;
};
