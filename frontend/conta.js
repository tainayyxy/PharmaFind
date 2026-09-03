const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const accountForm = document.getElementById('accountForm');
const accountFeedback = document.getElementById('accountFeedback');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.hidden = !mobileMenu.hidden;
    mobileMenuButton.setAttribute('aria-expanded', String(!mobileMenu.hidden));
  });
}

if (!accountForm || !accountFeedback) {
  throw new Error('Formulário de cadastro não encontrado.');
}

accountForm.addEventListener('submit', (event) => {
  event.preventDefault();
  accountFeedback.className = 'account-feedback';
  accountFeedback.textContent = '';

  const formData = new FormData(accountForm);
  const password = formData.get('password');
  const confirmation = formData.get('passwordConfirmation');

  if (!accountForm.checkValidity()) {
    accountFeedback.classList.add('is-error');
    accountFeedback.textContent = 'Revise os campos destacados antes de continuar.';
    accountForm.reportValidity();
    return;
  }

  if (password !== confirmation) {
    accountFeedback.classList.add('is-error');
    accountFeedback.textContent = 'As senhas precisam ser iguais.';
    document.getElementById('passwordConfirmation').focus();
    return;
  }

  localStorage.setItem('pharmafindAccountName', formData.get('name'));
  localStorage.setItem('pharmafindLoggedIn', 'true');
  accountFeedback.classList.add('is-success');
  accountFeedback.textContent = 'Conta criada neste protótipo. Bem-vindo ao PharmaFind!';
  accountForm.reset();
});