import { fetchData, postData, currentUser, showMessage, updateAuthState } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  updateAuthState();
  await loadInvestments();
  setupInvestmentInteractions();
});

async function loadInvestments() {
  try {
    const investments = await fetchData('investments');
    renderInvestments(investments);
  } catch (error) {
    showMessage(error.message);
  }
}

function renderInvestments(investments) {
  const container = document.getElementById('investmentsGrid');
  container.innerHTML = investments.map(investment => `
    <div class="investment-card" data-id="${investment.id}" data-type="${investment.type}">
      <div class="investment-header">
        <h3>${investment.name}</h3>
        <span class="symbol">${investment.symbol}</span>
      </div>
      <p class="price ${investment.change >= 0 ? 'stock-up' : 'stock-down'}">
        $${investment.price.toFixed(2)} (${investment.change}%)
      </p>
      <div class="investment-footer">
        <span class="risk-badge risk-${investment.riskLevel.toLowerCase()}">
          ${investment.riskLevel}
        </span>
        ${currentUser ? `
          <button class="watchlist-btn">
            ${investment.watchlisted ? '★' : '☆'} Watchlist
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

function setupInvestmentInteractions() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleFilter);
  });

  document.getElementById('investmentsGrid')?.addEventListener('click', async (e) => {
    if (e.target.classList.contains('watchlist-btn')) {
      await handleWatchlist(e);
    }
    if (e.target.closest('.investment-card')) {
      showInvestmentDetails(e.target.closest('.investment-card').dataset.id);
    }
  });
}

async function handleFilter(e) {
  const filterType = e.target.dataset.filter;
  document.querySelectorAll('.filter-btn').forEach(btn => 
    btn.classList.toggle('active', btn === e.target)
  );
  
  document.querySelectorAll('.investment-card').forEach(card => {
    card.style.display = filterType === 'all' || card.dataset.type === filterType 
      ? 'block' 
      : 'none';
  });
}

async function handleWatchlist(e) {
  if (!currentUser) {
    showMessage('Please login to use watchlist');
    return;
  }

  const investmentId = e.target.closest('.investment-card').dataset.id;
  try {
    await postData('watchlists', {
      userId: currentUser.id,
      investmentId,
      dateAdded: new Date().toISOString()
    });
    showMessage('Added to watchlist', 'success');
  } catch (error) {
    showMessage(error.message);
  }
}

async function showInvestmentDetails(investmentId) {
  try {
    const investment = await fetchData(`investments/${investmentId}`);
    // Implementation for showing details modal/chart
    console.log('Showing details for:', investment);
  } catch (error) {
    showMessage(error.message);
  }
}
// investments.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await fetch('/investments');
      const investments = await response.json();
      renderInvestments(investments);
  } catch (error) {
      console.error('Error loading investments:', error);
  }
});

function renderInvestments(investments) {
  const container = document.getElementById('investmentsGrid');
  container.innerHTML = investments.map(investment => `
      <div class="investment-card" data-type="${investment.type}">
          <div class="investment-header">
              <h3>${investment.name}</h3>
              <span class="symbol">${investment.symbol}</span>
          </div>
          <div class="price-row">
              <span class="price">$${investment.price.toFixed(2)}</span>
              <span class="change ${investment.change >= 0 ? 'positive' : 'negative'}">
                  ${investment.change >= 0 ? '+' : ''}${investment.change}%
              </span>
          </div>
          <div class="investment-footer">
              <span class="risk-level ${investment.riskLevel}">
                  ${investment.riskLevel.toUpperCase()}
              </span>
              <span class="type-badge">${investment.type.toUpperCase()}</span>
          </div>
      </div>
  `).join('');
}