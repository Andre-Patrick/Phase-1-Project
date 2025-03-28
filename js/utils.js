const API = 'http://localhost:3000';
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API}/${endpoint}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch ${endpoint}: ${error.message}`);
  }
};

export const postData = async (endpoint, data) => {
  try {
    await fetch(`${API}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    throw new Error(`Failed to post to ${endpoint}: ${error.message}`);
  }
};

export const updateAuthState = () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const postForm = document.getElementById('postForm');
  
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    if (loginBtn) loginBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (postForm) postForm.style.display = 'grid';
  } else {
    localStorage.removeItem('currentUser');
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
    if (postForm) postForm.style.display = 'none';
  }
};

export const showMessage = (message, type = 'error') => {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${type}`;
  messageEl.textContent = message;
  document.body.prepend(messageEl);
  setTimeout(() => messageEl.remove(), 3000);
};
