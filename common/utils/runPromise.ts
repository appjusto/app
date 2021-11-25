export const runPromise = <T>(
  promise: Promise<T>,
  retries: number = 3,
  interval: number = 300
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await promise);
    } catch (error) {
      if (retries === 0) reject(error);
      else setTimeout(async () => resolve(await runPromise(promise, retries - 1)), interval);
    }
  });
};
