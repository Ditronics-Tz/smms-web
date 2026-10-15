import {
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
  setCachedUser,
  getCachedUser,
  clearCachedUser,
  clearAllClientStorage,
  scrubPersistedAuth,
} from './sessionToken';

describe('sessionToken (FE-03)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('stores the refresh token in sessionStorage, never localStorage', () => {
    setRefreshToken('refresh-abc');
    expect(getRefreshToken()).toBe('refresh-abc');
    expect(window.sessionStorage.getItem('smms_refresh_token')).toBe('refresh-abc');
    expect(window.localStorage.getItem('smms_refresh_token')).toBeNull();
  });

  it('ignores an empty refresh token', () => {
    setRefreshToken(null);
    setRefreshToken('');
    expect(getRefreshToken()).toBeNull();
  });

  it('clears the refresh token', () => {
    setRefreshToken('refresh-abc');
    clearRefreshToken();
    expect(getRefreshToken()).toBeNull();
  });

  it('caches only the whitelisted user fields', () => {
    setCachedUser({
      id: 7,
      first_name: 'Amina',
      last_name: 'Juma',
      role: 'parent',
      is_superuser: false,
      profile_picture: '/p.png',
      password: 'super-secret',
      token: 'leaked-jwt',
    });

    const cached = getCachedUser();
    expect(cached).toEqual({
      id: 7,
      first_name: 'Amina',
      last_name: 'Juma',
      role: 'parent',
      is_superuser: false,
      profile_picture: '/p.png',
    });
    expect(cached).not.toHaveProperty('password');
    expect(cached).not.toHaveProperty('token');
  });

  it('clears the cached user', () => {
    setCachedUser({ id: 1, role: 'admin' });
    clearCachedUser();
    expect(getCachedUser()).toBeNull();
  });

  it('clearAllClientStorage removes the refresh token, cached user and persisted state', () => {
    setRefreshToken('refresh-abc');
    setCachedUser({ id: 1, role: 'admin' });
    window.localStorage.setItem('persist:root', '{"auth":{"accessToken":"leaked"}}');

    clearAllClientStorage();

    expect(getRefreshToken()).toBeNull();
    expect(getCachedUser()).toBeNull();
    expect(window.localStorage.getItem('persist:root')).toBeNull();
  });

  it('never writes a token into localStorage', () => {
    setRefreshToken('refresh-abc');
    setCachedUser({ id: 1, role: 'admin' });
    const dump = JSON.stringify(window.localStorage);
    expect(dump).not.toContain('refresh-abc');
  });

  it('scrubPersistedAuth removes a legacy auth slice but keeps the other slices', () => {
    window.localStorage.setItem(
      'persist:root',
      JSON.stringify({
        auth: JSON.stringify({
          accessToken: 'legacy-access',
          loginResult: { refresh: 'legacy-refresh' },
        }),
        user: JSON.stringify({ list: [1] }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );

    scrubPersistedAuth();

    const raw = window.localStorage.getItem('persist:root') as string;
    expect(raw).not.toBeNull();
    expect(raw).not.toContain('legacy-access');
    expect(raw).not.toContain('legacy-refresh');

    const parsed = JSON.parse(raw);
    expect(parsed).not.toHaveProperty('auth');
    expect(parsed.user).toBeDefined();
  });

  it('scrubPersistedAuth is a no-op when there is no persisted root', () => {
    expect(() => scrubPersistedAuth()).not.toThrow();
    expect(window.localStorage.getItem('persist:root')).toBeNull();
  });
});
