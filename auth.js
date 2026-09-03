const authLinks = document.querySelectorAll(
  '.auth-login-button, .auth-signup-button'
);
const isLoggedIn = localStorage.getItem('pharmafindLoggedIn') === 'true';

authLinks.forEach((link) => {
  link.hidden = isLoggedIn;
});
