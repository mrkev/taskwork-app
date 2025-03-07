export function wait(ms: number) {
  return new Promise<void>((res) => setTimeout(() => res(), ms));
}

export function nullthrows<T>(x: T | null | undefined, msg: string): T {
  if (x == null) {
    throw new Error(msg);
  }
  return x;
}

export function parseIntOr(val: unknown, defaultNum: number) {
  if (typeof val !== "string") {
    return defaultNum;
  }

  const result = parseInt(val);
  if (Number.isNaN(result)) {
    return defaultNum;
  }

  return result;
}
