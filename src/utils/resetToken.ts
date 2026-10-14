export const RESET_TOKEN_QUERY_KEY = 'token';

export const readResetTokenFromHash = (hash: string): string | null => {
    if (!hash) {
        return null;
    }

    const fragment = hash.startsWith('#') ? hash.slice(1) : hash;
    if (!fragment) {
        return null;
    }

    const params = new URLSearchParams(fragment);
    const token = params.get(RESET_TOKEN_QUERY_KEY);
    return token || null;
};

export const resolveResetToken = (queryToken: string | null, hash: string): string | null =>
    queryToken || readResetTokenFromHash(hash) || null;
