function logout(redirect) {
  localStorage.removeItem("profile");
  localStorage.removeItem("access_token");
  localStorage.removeItem("access_token_expires_at");
  goToAuth(redirect);
}

function goToAuth(redirect) {
  redirect("/auth");
}

export default function authMiddleware({ redirect }) {
  const access_token = localStorage.getItem("access_token");
  if (!access_token) logout(redirect);
}

export { logout, goToAuth };
