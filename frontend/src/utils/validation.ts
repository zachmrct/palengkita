export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordChecks = {
  length: boolean;
  number: boolean;
  letter: boolean;
};

export function checkPassword(password: string): PasswordChecks {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    letter: /[A-Za-z]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const c = checkPassword(password);
  return c.length && c.number && c.letter;
}

/** Login accepts an email or a username (no spaces, 3+ chars). */
export function isEmailOrUsername(value: string): boolean {
  const v = value.trim();
  if (v.includes('@')) return EMAIL_RE.test(v);
  return v.length >= 3 && !/\s/.test(v);
}
