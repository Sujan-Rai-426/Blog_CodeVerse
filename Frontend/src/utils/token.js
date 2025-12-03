// utils/token.js

// ================================
// PERMANENT TOKEN KEY NAMES
// ================================

// USER AUTH TOKENS
export const USER_ACCESS_TOKEN = "USER_ACCESS_TOKEN";
export const USER_REFRESH_TOKEN = "USER_REFRESH_TOKEN";
export const USER_TOKEN = "USER_TOKEN"; // Optional bundle

// ADMIN AUTH TOKENS
export const ADMIN_ACCESS_TOKEN = "ADMIN_ACCESS_TOKEN";
export const ADMIN_REFRESH_TOKEN = "ADMIN_REFRESH_TOKEN";
export const ADMIN_TOKEN = "ADMIN_TOKEN"; // Optional bundle

export const TokenService = {
  // -------- USER TOKENS --------
  saveUserTokens(access, refresh) {
    if (access) localStorage.setItem(USER_ACCESS_TOKEN, access);
    if (refresh) localStorage.setItem(USER_REFRESH_TOKEN, refresh);

    const bundle = JSON.stringify({ access, refresh });
    localStorage.setItem(USER_TOKEN, bundle);
  },

  getUserAccess() {
    return localStorage.getItem(USER_ACCESS_TOKEN);
  },

  getUserRefresh() {
    return localStorage.getItem(USER_REFRESH_TOKEN);
  },

  logoutUser() {
    localStorage.removeItem(USER_ACCESS_TOKEN);
    localStorage.removeItem(USER_REFRESH_TOKEN);
    localStorage.removeItem(USER_TOKEN);
  },

  // -------- ADMIN TOKENS --------
  saveAdminTokens(access, refresh) {
    if (access) localStorage.setItem(ADMIN_ACCESS_TOKEN, access);
    if (refresh) localStorage.setItem(ADMIN_REFRESH_TOKEN, refresh);

    const bundle = JSON.stringify({ access, refresh });
    localStorage.setItem(ADMIN_TOKEN, bundle);
  },

  getAdminAccess() {
    return localStorage.getItem(ADMIN_ACCESS_TOKEN);
  },

  getAdminRefresh() {
    return localStorage.getItem(ADMIN_REFRESH_TOKEN);
  },

  logoutAdmin() {
    localStorage.removeItem(ADMIN_ACCESS_TOKEN);
    localStorage.removeItem(ADMIN_REFRESH_TOKEN);
    localStorage.removeItem(ADMIN_TOKEN);
  },

  // -------- UNIVERSAL --------
  clearAllTokens() {
    this.logoutUser();
    this.logoutAdmin();
  },
};
