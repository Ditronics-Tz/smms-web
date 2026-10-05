import {
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
  setCachedUser,
  getCachedUser,
  clearCachedUser,
  clearAllClientStorage,
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
});
