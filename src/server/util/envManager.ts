export function extractEnv<K extends readonly string[]>(
  keys: K,
  defaluts?: Readonly<Partial<Record<K[number], string>>>
): Record<K[number], string> {
  const env: Partial<Record<K[number], string>> = {};
  for (let i = 0; i < keys.length; i++) {
    const key: K[number] = keys[i];
    if (process.env[key] !== undefined && process.env[key] !== '') {
      env[key] = process.env[key];
    } else if (defaluts && defaluts[key] !== undefined) {
      env[key] = defaluts[key];
    } else {
      throw new Error(`${key} is not defined`);
    }
  }

  return env as Record<K[number], string>;
}
