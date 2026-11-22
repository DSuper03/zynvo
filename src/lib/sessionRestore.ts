/**
 * Keeps users signed in across tabs and browser restarts.
 *
 * Login stores the backend JWT (30-day expiry) in localStorage, but pages also
 * require sessionStorage `activeSession === 'true'`, which the browser clears
 * whenever the tab/window closes — so every new visit looked logged out.
 *
 * SESSION_RESTORE_SCRIPT runs inline in <head>, before React hydrates, so it
 * is in place before any page's auth check: a present, unexpired token
 * re-marks the session active; an expired or malformed token is removed.
 * Logging out removes the token (see useAuth().hardLogout), so it can't be
 * restored afterwards.
 */
export const SESSION_RESTORE_SCRIPT = `(function () {
  try {
    var token = localStorage.getItem('token');
    if (!token) return;
    var part = token.split('.')[1];
    if (!part) return;
    var json = atob(part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '='));
    var payload = JSON.parse(json);
    if (!payload || !payload.id) return;
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('activeSession');
      return;
    }
    sessionStorage.setItem('activeSession', 'true');
  } catch (e) {
    /* storage blocked or unreadable token: leave things as they are */
  }
})();`;
