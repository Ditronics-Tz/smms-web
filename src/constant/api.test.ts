import {
  API_BASE,
  CHILD_SPEND_URL,
  DEPOSIT_REQUESTS_URL,
  DEPOSIT_REQUEST_URL,
  IMPORT_COMMIT_URL,
  IMPORT_UPLOAD_URL,
  INACTIVE_USERS_URL,
  REVERSE_TRANSACTION_URL,
} from './api';

// FE-01: every application endpoint is served under the versioned prefix
// `/api/v1`, applied once via the shared base constant (API_VERSIONING.md).
describe('FE-01 versioned API base', () => {
  it('resolves the base to the /api/v1 prefix exactly once', () => {
    expect(API_BASE.endsWith('/api/v1')).toBe(true);
    expect(API_BASE).not.toMatch(/\/api\/v1\/api\/v1/);
  });

  const mappedEndpoints: Array<[string, string]> = [
    [CHILD_SPEND_URL, '/api/v1/dashboard/children-spend'],
    [IMPORT_UPLOAD_URL, '/api/v1/imports/upload'],
    [IMPORT_COMMIT_URL, '/api/v1/imports/commit'],
    [INACTIVE_USERS_URL, '/api/v1/resources/inactive-users-list/'],
    [DEPOSIT_REQUEST_URL, '/api/v1/wallet/deposit/create'],
    [DEPOSIT_REQUESTS_URL, '/api/v1/wallet/deposit/list'],
    [REVERSE_TRANSACTION_URL, '/api/v1/wallet/transaction/reverse'],
  ];

  it.each(mappedEndpoints)(
    'maps %s onto the versioned URL %s',
    (url, expected) => {
      expect(`${API_BASE}${url}`.endsWith(expected)).toBe(true);
    }
  );
});
