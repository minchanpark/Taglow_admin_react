type DebugDetails = Record<string, unknown>;

const sensitiveKeyPattern = /password|token|secret|cookie|authorization|session/i;

const readDebugFlag = () => {
  const metaEnv = import.meta.env as Record<string, string | boolean | undefined>;
  const value = metaEnv.VITE_TAGLOW_DEBUG_AUTH;
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
};

const isAuthDebugEnabled = () => {
  const flag = readDebugFlag();
  if (flag === true || flag === 'true') return true;
  if (flag === false || flag === 'false') return false;
  return import.meta.env.DEV && import.meta.env.MODE !== 'test';
};

const redact = (details: DebugDetails) =>
  Object.fromEntries(
    Object.entries(details).map(([key, value]) => [
      key,
      sensitiveKeyPattern.test(key) ? '[redacted]' : value,
    ]),
  );

export const debugAuthFlow = (stage: string, details: DebugDetails = {}) => {
  if (!isAuthDebugEnabled()) return;
  console.debug(`[Taglow auth] ${stage}`, redact(details));
};
