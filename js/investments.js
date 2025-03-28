document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('db.json');
    const data = await response.json();
    allInvestments = data.investments;

    renderInvestments(allInvestments);
    setupFilterButtons();
  } catch (error) {
    console.error('Error loading investments:', error);
  }
});

function setupFilterButtons() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {

      filterButtons.forEach(btn => btn.classList.remove('active'));
      

      button.classList.add('active');
      

      const filterType = button.dataset.filter;
      

      const filtered = filterType === 'all' 
        ? allInvestments 
        : allInvestments.filter(item => item.type === filterType);
      

        renderInvestments(filtered);
    });
  });
}

function renderInvestments(investments) {
  const container = document.getElementById('investmentsGrid');
  container.innerHTML = investments.map(investment => `
    <div class="investment-card" data-type="${investment.type}">
      <div class="investment-header">
        <h3>${investment.name}</h3>
        <span class="symbol">${investment.symbol}</span>
      </div>
      <div class="price-row">
        <span class="price">$${investment.price?.toFixed(2) || 'N/A'}</span>
        <span class="change ${investment.change >= 0 ? 'positive' : 'negative'}">
          ${investment.change ? `${investment.change >= 0 ? '+' : ''}${investment.change}%` : 'N/A'}
        </span>
      </div>
  `).join('');
}
