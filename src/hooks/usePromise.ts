const store: Record<string, any> = {};

export default function usePromise<T>(
  key: string,
  promise: () => Promise<T>
): T {
  if (!store[key]) throw promise().then((value) => (store[key] = value));
  return store[key];
}
