import authReducer from './reducers';
import { STATE, STATUS } from '../../constant';

const loggedInState = authReducer(undefined, {
  type: STATE.LOGIN_SUCCESS,
  payload: {
    token: 'access-1',
    refresh: 'refresh-1',
    user: { id: 1, role: 'admin' },
  },
});

describe('auth reducer session cleanup (FE-03)', () => {
  it('keeps the access token in the auth slice after login', () => {
    expect(loggedInState.accessToken).toBe('access-1');
  });

  it('LOGIN_RESET (logout) clears the access token, user and status', () => {
    const next = authReducer(loggedInState, { type: STATE.LOGIN_RESET });

    expect(next.accessToken).toBeNull();
    expect(next.loginResult).toBeNull();
    expect(next.loginStatus).toBe(STATUS.DEFAULT);
    expect(next.loginErrorMessage).toBe('');
  });

  it('LOGIN_FAILURE clears the access token', () => {
    const next = authReducer(loggedInState, {
      type: STATE.LOGIN_FAILURE,
      payload: 'bad credentials',
    });

    expect(next.accessToken).toBeNull();
    expect(next.loginResult).toBeNull();
    expect(next.loginStatus).toBe(STATUS.ERROR);
  });

  it('TOKEN_FAILURE drops the in-memory session as well as the token status', () => {
    const next = authReducer(loggedInState, {
      type: STATE.TOKEN_FAILURE,
      payload: 'refresh expired',
    });

    expect(next.accessToken).toBeNull();
    expect(next.loginResult).toBeNull();
    expect(next.loginStatus).toBe(STATUS.DEFAULT);
    expect(next.tokenStatus).toBe(STATUS.ERROR);
    expect(next.tokenResult).toBeNull();
  });
});

describe('auth reducer restoration (FE-03)', () => {
  it('rebuilds the session from restored_user on TOKEN_SUCCESS after a reload', () => {
    const state = authReducer(undefined, {
      type: STATE.TOKEN_SUCCESS,
      payload: { access: 'access-2', restored_user: { id: 9, role: 'parent' } },
    });

    expect(state.accessToken).toBe('access-2');
    expect(state.loginStatus).toBe(STATUS.SUCCESS);
    expect(state.loginResult.user).toEqual({ id: 9, role: 'parent' });
  });

  it('does not keep a refresh token in loginResult when restoring a session', () => {
    const state = authReducer(undefined, {
      type: STATE.TOKEN_SUCCESS,
      payload: {
        access: 'access-2',
        refresh: 'refresh-2',
        restored_user: { id: 9, role: 'parent' },
      },
    });

    // The refresh token belongs in sessionStorage, not in the redux user blob.
    expect(state.loginResult.refresh).toBeUndefined();
  });

  it('does not invent a user when TOKEN_SUCCESS carries no restored_user', () => {
    const state = authReducer(undefined, {
      type: STATE.TOKEN_SUCCESS,
      payload: { access: 'access-3' },
    });

    expect(state.loginResult).toBeNull();
    expect(state.loginStatus).toBe(STATUS.DEFAULT);
  });
});
