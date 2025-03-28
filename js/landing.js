import { fetchData, currentUser, updateAuthState, showMessage } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    updateAuthState();
    try {
        const [posts, investments] = await Promise.all([
            fetchData('blogPosts?_limit=3'),
            fetchData('investments?_limit=3')
        ]);
        
        renderFeaturedPosts(posts);
        renderFeaturedInvestments(investments);
    } catch (error) {
        showMessage('Failed to load featured content');
    }
});

function renderFeaturedPosts(posts) {
    const container = document.getElementById('featuredPosts');
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h4>${post.title}</h4>
            <p class="excerpt">${post.content.substring(0, 100)}...</p>
            <a href="blog.html" class="read-more">Read More →</a>
        </div>
    `).join('');
}

function renderFeaturedInvestments(investments) {
    const container = document.getElementById('featuredInvestments');
    container.innerHTML = investments.map(investment => `
        <div class="investment-card">
            <h4>${investment.name}</h4>
            <p class="symbol">${investment.symbol}</p>
            <p class="price ${investment.change >= 0 ? 'stock-up' : 'stock-down'}">
                $${investment.price.toFixed(2)}
            </p>
        </div>
    `).join('');
}