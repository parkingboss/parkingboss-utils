export function never(): Promise<never> {
  return new Promise<never>(() => {});
}
