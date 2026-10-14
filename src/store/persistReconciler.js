/**
 * FE-03: redux-persist v6 applies `config.blacklist` only when *writing* state
 * (see createPersistoid). It does NOT strip blacklisted keys from an already
 * stored blob when *reading* (getStoredState keeps every key and
 * autoMergeLevel1 merges all of them). Because builds before FE-03 persisted the
 * whole root, an existing browser still has `auth` — including the JWT access
 * token and the refresh token in `loginResult.refresh` — inside `persist:root`.
 *
 * With the stock reconciler that legacy token is merged straight back into the
 * auth slice on the next load and the app can render as authenticated from a
 * token held in localStorage. This reconciler mirrors autoMergeLevel1 but
 * refuses to rehydrate any blacklisted slice, so persisted auth can never be
 * restored.
 */
const blacklistStateReconciler = (
  inboundState,
  originalState,
  reducedState,
  config = {}
) => {
  const newState = { ...reducedState };
  const blacklist = config.blacklist || [];

  if (inboundState && typeof inboundState === 'object') {
    Object.keys(inboundState).forEach((key) => {
      if (key === '_persist') return;
      if (blacklist.indexOf(key) !== -1) return;
      if (originalState[key] !== reducedState[key]) return;
      newState[key] = inboundState[key];
    });
  }

  return newState;
};

export default blacklistStateReconciler;
