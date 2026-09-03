const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const loginStatus = document.getElementById('loginStatus');
const togglePassword = document.getElementById('togglePassword');
const forgotPassword = document.getElementById('forgotPassword');

function validarLogin() {
  const emailValido = emailInput.validity.valid;
  const senhaValida = passwordInput.value.length >= 6;

  emailError.textContent = emailValido ? '' : 'Informe um e-mail válido.';
  passwordError.textContent = senhaValida ? '' : 'A senha deve ter pelo menos 6 caracteres.';

  return emailValido && senhaValida;
}

togglePassword.addEventListener('click', () => {
  const mostrarSenha = passwordInput.type === 'password';
  passwordInput.type = mostrarSenha ? 'text' : 'password';
  togglePassword.textContent = mostrarSenha ? 'Ocultar' : 'Mostrar';
  togglePassword.setAttribute(
    'aria-label',
    mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'
  );
});

emailInput.addEventListener('input', validarLogin);
passwordInput.addEventListener('input', validarLogin);

forgotPassword.addEventListener('click', (event) => {
  event.preventDefault();
  loginStatus.textContent = 'Informe seu e-mail para recuperar o acesso.';
  emailInput.focus();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginStatus.textContent = '';

  if (!validarLogin()) {
    return;
  }

  localStorage.setItem('pharmafindLoggedIn', 'true');
  loginStatus.textContent = 'Acesso validado. Redirecionando para sua consulta...';
  window.setTimeout(() => {
    window.location.href = 'consulta.html';
  }, 700);
});
