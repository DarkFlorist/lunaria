export type HexString = `0x${string}`

// makes a single property optional
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
