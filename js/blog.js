import { fetchData, postData, currentUser, showMessage, updateAuthState } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  updateAuthState();
  await loadBlogPosts();
  setupBlogInteractions();
});

async function loadBlogPosts() {
  try {
    const posts = await fetchData('blogPosts');
    renderPosts(posts);
  } catch (error) {
    showMessage(error.message);
  }
}

function renderPosts(posts) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = posts.map(post => `
    <article class="post-card" data-id="${post.id}">
      <h3>${post.title}</h3>
      <p class="post-meta">By ${post.author} • ${new Date(post.date).toLocaleDateString()}</p>
      <div class="post-content">${post.content}</div>
      <div class="comments-section">
        ${post.comments.map(comment => `
          <div class="comment">
            <strong>${comment.user}</strong>: ${comment.text}
          </div>
        `).join('')}
      </div>
      ${currentUser ? `
        <div class="comment-form">
          <input type="text" placeholder="Add a comment...">
          <button class="add-comment">Post Comment</button>
        </div>
      ` : ''}
    </article>
  `).join('');
}

function setupBlogInteractions() {
  document.getElementById('postForm')?.addEventListener('submit', createPost);
  document.getElementById('postsContainer')?.addEventListener('click', handleComments);
}

async function createPost(e) {
  e.preventDefault();
  if (!currentUser) return;

  const newPost = {
    title: e.target.postTitle.value,
    content: e.target.postContent.value,
    author: currentUser.name,
    date: new Date().toISOString(),
    comments: []
  };

  try {
    await postData('blogPosts', newPost);
    await loadBlogPosts();
    e.target.reset();
  } catch (error) {
    showMessage(error.message);
  }
}

async function handleComments(e) {
  if (!e.target.classList.contains('add-comment')) return;
  if (!currentUser) {
    showMessage('Please login to comment');
    return;
  }

  const postCard = e.target.closest('.post-card');
  const commentInput = postCard.querySelector('input');
  const commentText = commentInput.value.trim();

  if (commentText) {
    try {
      const posts = await fetchData('blogPosts');
      const post = posts.find(p => p.id === parseInt(postCard.dataset.id));
      post.comments.push({
        user: currentUser.name,
        text: commentText,
        date: new Date().toISOString()
      });
      
      await postData('blogPosts', post, 'PUT');
      commentInput.value = '';
      renderPosts(posts);
    } catch (error) {
      showMessage(error.message);
    }
  }
}
// blog.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await fetch('/blogPosts');
      const posts = await response.json();
      renderPosts(posts);
  } catch (error) {
      console.error('Error loading blog posts:', error);
  }
});

function renderPosts(posts) {
  const container = document.getElementById('postsContainer');
  container.innerHTML = posts.map(post => `
      <article class="post-card">
          <h3>${post.title}</h3>
          <div class="post-meta">
              <span>By ${post.author}</span>
              <span>•</span>
              <span>${new Date(post.date).toLocaleDateString()}</span>
          </div>
          <p class="post-content">${post.content}</p>
          <div class="comments-section">
              <h4>Comments (${post.comments.length})</h4>
              ${post.comments.map(comment => `
                  <div class="comment">
                      <strong>${comment.user}</strong>
                      <p>${comment.text}</p>
                  </div>
              `).join('')}
          </div>
      </article>
  `).join('');
}