export function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem("spa_user") || "{}"
    );
  } catch {
    return {};
  }
}

export function getToken() {
  return localStorage.getItem("spa_token");
}

export function logout() {
  localStorage.removeItem("spa_token");
  localStorage.removeItem("spa_user");

  window.location.href = "/login";
}
