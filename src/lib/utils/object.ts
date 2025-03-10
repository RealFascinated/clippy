/**
 * Get a value from an object using a key path
 *
 * @param object the object to get the value from
 * @param key the key path to get the value from
 * @returns the value from the object
 */
export function getValueFromKey<
  T extends Record<string, any>,
  K extends string,
>(
  object: T,
  key: K
): K extends keyof T
  ? T[K]
  : K extends `${infer F}.${infer R}`
    ? F extends keyof T
      ? T[F] extends Record<string, any>
        ? R extends keyof T[F]
          ? T[F][R]
          : never
        : never
      : never
    : never {
  return key.split(".").reduce((obj, k) => obj?.[k], object) as any;
}
