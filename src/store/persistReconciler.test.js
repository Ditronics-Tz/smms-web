import blacklistStateReconciler from './persistReconciler';

describe('blacklistStateReconciler (FE-03)', () => {
  const config = { blacklist: ['auth', 'ledger'] };
  const reducedState = {
    auth: { accessToken: null },
    user: { list: [] },
    ledger: {},
  };

  it('never rehydrates a blacklisted slice, even when the stored blob has one', () => {
    const inbound = {
      auth: { accessToken: 'legacy-token' },
      user: { list: [1] },
    };

    const next = blacklistStateReconciler(inbound, reducedState, reducedState, config);

    expect(next.auth).toEqual({ accessToken: null });
    expect(next.user).toEqual({ list: [1] });
  });

  it('ignores _persist bookkeeping', () => {
    const next = blacklistStateReconciler(
      { _persist: { rehydrated: true } },
      reducedState,
      reducedState,
      config
    );

    expect(next).not.toHaveProperty('_persist');
  });

  it('skips a slice the reducer already modified', () => {
    const original = { user: { list: [] } };
    const reduced = { user: { list: ['changed'] } };
    const inbound = { user: { list: ['stored'] } };

    const next = blacklistStateReconciler(inbound, original, reduced, config);

    expect(next.user).toEqual({ list: ['changed'] });
  });

  it('tolerates a missing blacklist config', () => {
    const next = blacklistStateReconciler(
      { user: { list: [1] } },
      reducedState,
      reducedState,
      {}
    );

    expect(next.user).toEqual({ list: [1] });
  });
});
