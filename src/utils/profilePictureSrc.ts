import { FILE_BASE } from '../constant';

/**
 * Builds the URL for a profile picture, with an optional cache-busting version.
 *
 * The backend serves a user's photo from a fixed path (e.g.
 * /media/profile_pictures/user_7.png). When the same user uploads a new photo the
 * path does not change, so the browser and any proxy keep serving the old bytes
 * from cache and the UI appears to ignore the upload.
 *
 * Passing the `profilePictureVersion` counter from the auth store as `version`
 * appends it as a query string, which the backend ignores and caches treat as a
 * different resource. Bumping the counter is therefore enough to make every
 * screen show the new picture immediately, without the page having to know what
 * the backend named the file.
 *
 * Returns undefined when there is no picture, so Avatar falls back to initials.
 */
export const profilePictureSrc = (
  path: string | null | undefined,
  version?: number
): string | undefined => {
  if (!path) return undefined;

  const base = FILE_BASE + path;

  return version ? `${base}?v=${version}` : base;
};

export default profilePictureSrc;