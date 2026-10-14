# 6. Unconfirmed

Things that could **not** be verified from the code (no guessing):

- Whether the backend actually uses an `/api/v1/` prefix. No evidence either way in the repo;
  needs the reference or backend confirmation.
- Exact correct paths, request bodies, and response shapes for every endpoint — cannot be
  verified without `API_COMPLETE_REFERENCE.md`.
- Which HTTP verb each backend route expects for list/read endpoints.
- Whether the auth saga's expected error field (`res.data.code`) matches the backend's real
  error contract.
- Whether the login response really returns `refresh` and `user` in the shape the saga expects.
- The exact `force` parameter name used by `doDeleteCard` (the code comment marks it FE-06
  unconfirmed).
