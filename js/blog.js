document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('db.json');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    renderPosts(data.blogPosts);
    setupEventListeners();
  } catch (error) {
    console.error('Error loading blog posts:', error);
    showError('Failed to load blog posts. Please try again later.');
  }
});

function renderPosts(posts) {
  const container = document.getElementById('postsContainer');
  if (!container) return;

  container.innerHTML = posts.map(post => `
    <article class="post-card" data-id="${post.id}">
      <div class="post-header">
        <h3 class="post-title">${post.title}</h3>
        <div class="post-meta">
          <span class="author">${post.author}</span>
          <span class="post-date">${new Date(post.date).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      <div class="comments-section">
        <h4 class="comments-title">Comments (${post.comments.length})</h4>
        ${post.comments.map(comment => `
          <div class="comment-card">
            <div class="comment-header">
              <span class="comment-author">${comment.user}</span>
              <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function setupEventListeners() {
}

function showError(message) {
  const container = document.getElementById('postsContainer');
  if (container) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
  }
}