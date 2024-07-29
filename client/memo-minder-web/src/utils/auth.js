let authInfo = null;

export function setAuthInfo(username, token, id) {
  authInfo = { username, token, id };
}

export function getAuthInfo() {
  return authInfo;
}

export function clearAuthInfo() {
  authInfo = null;
}
