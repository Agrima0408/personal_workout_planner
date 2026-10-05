// Auth state lives in sessionStorage: cleared when the tab/browser closes.
// The password is never stored; only the JWT.
const KEY = "maximizecrm.jwt";

export const getToken = () => sessionStorage.getItem(KEY);
export const setToken = (t) => sessionStorage.setItem(KEY, t);
export const clearAuth = () => sessionStorage.removeItem(KEY);

function payload() {
  try {
    const b = getToken().split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b));
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const t = getToken();
  if (!t) return false;
  const p = payload();
  if (p && p.exp && p.exp * 1000 < Date.now()) {
    clearAuth();
    return false;
  }
  return true;
}

export const currentUserEmail = () => (payload() && payload().sub) || "";
