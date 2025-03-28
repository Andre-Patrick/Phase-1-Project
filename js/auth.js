
document.addEventListener('DOMContentLoaded', () => {
  setupAuthForms();
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
});

function setupAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    document.getElementById('showSignup')?.addEventListener('click', toggleAuthForms);
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
    document.getElementById('showLogin')?.addEventListener('click', toggleAuthForms);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = {
    email: e.target.loginEmail.value,
    password: e.target.loginPassword.value
  };

  try {
    const users = await fetchData('users');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      currentUser = user;
      updateAuthState();
      window.location.href = 'blog.html';
    } else {
      showMessage('Invalid email or password');
    }
  } catch (error) {
    showMessage(error.message);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const newUser = {
    name: e.target.signupName.value,
    email: e.target.signupEmail.value,
    password: e.target.signupPassword.value
  };

  try {
    const existingUsers = await fetchData('users');
    if (existingUsers.some(u => u.email === newUser.email)) {
      showMessage('Email already registered');
      return;
    }

    await postData('users', newUser);
    currentUser = newUser;
    updateAuthState();
    window.location.href = 'blog.html';
  } catch (error) {
    showMessage(error.message);
  }
}

function handleLogout() {
  currentUser = null;
  updateAuthState();
  window.location.href = 'login.html';
}

function toggleAuthForms(e) {
  e.preventDefault();
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('signupForm').classList.toggle('hidden');
}