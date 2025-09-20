export type Engine = typeof Engines[number];

export const Engines = ['yoda', 'pirate'] as const;

export const isEngine = (value: unknown): value is Engine => {
  return Engines.includes(value as any);
}