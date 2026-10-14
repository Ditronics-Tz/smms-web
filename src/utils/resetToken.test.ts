import { readResetTokenFromHash, resolveResetToken } from './resetToken';

describe('resetToken (FE-02)', () => {
  it('reads a token from the URL query before the fragment', () => {
    expect(resolveResetToken('query-token', '#token=hash-token')).toBe('query-token');
  });

  it('falls back to a token in the URL fragment (invite links)', () => {
    expect(resolveResetToken(null, '#token=hash-token')).toBe('hash-token');
  });

  it('accepts a hash with or without the leading #', () => {
    expect(readResetTokenFromHash('#token=abc')).toBe('abc');
    expect(readResetTokenFromHash('token=abc')).toBe('abc');
  });

  it('decodes URL-encoded token values', () => {
    expect(readResetTokenFromHash('#token=a%2Bb%2Fc%3D')).toBe('a+b/c=');
  });

  it('returns null when no token is present', () => {
    expect(resolveResetToken(null, '')).toBeNull();
    expect(readResetTokenFromHash('#mode=invite')).toBeNull();
  });
});
