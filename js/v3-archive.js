/**
 * FRJPHEATH.COM — VERSION 3: ARCHIVE & BIBLIOGRAPHY CONTROLLER
 * Full 93-article search, thematic filters, and instant client-side rendering.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const archiveList = document.getElementById('archive-list');
  const searchInput = document.getElementById('archive-search');
  const countDisplay = document.getElementById('archive-count');
  const filterButtons = document.querySelectorAll('.archive-filter-tabs .pill-btn');

  let allArticles = [];
  let currentFilter = 'all';
  let currentSearch = '';

  // 1. Fetch articles data
  try {
    const res = await fetch('data/articles.json');
    allArticles = await res.json();
  } catch (err) {
    console.error('Failed to load data/articles.json, checking window fallback', err);
    if (window.FALLBACK_ARTICLES) {
      allArticles = window.FALLBACK_ARTICLES;
    }
  }

  // 2. Render articles function
  const renderArticles = () => {
    if (!archiveList) return;

    const filtered = allArticles.filter(item => {
      const matchesFilter = (currentFilter === 'all') || 
                            (item.section === currentFilter) || 
                            (item.topic && item.topic.includes(currentFilter));
      
      const q = currentSearch.toLowerCase().trim();
      const matchesSearch = !q || 
                            item.title.toLowerCase().includes(q) || 
                            item.excerpt.toLowerCase().includes(q) || 
                            item.topic.toLowerCase().includes(q) || 
                            item.year.includes(q);

      return matchesFilter && matchesSearch;
    });

    if (countDisplay) {
      countDisplay.textContent = (currentSearch || currentFilter !== 'all') 
        ? `Showing ${filtered.length} matching pieces` 
        : 'Showing all published pieces';
    }

    if (filtered.length === 0) {
      archiveList.innerHTML = `
        <div style="padding: 4rem 1rem; text-align: center; color: var(--ink-muted);">
          <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">No writings match your criteria</p>
          <p style="font-size: 0.9rem;">Try clearing your search query or selecting another topic.</p>
        </div>
      `;
      return;
    }

    archiveList.innerHTML = filtered.map(item => `
      <article class="archive-row-item">
        <time class="archive-date" datetime="${item.date}">${item.date}</time>
        <h3 class="archive-title">
          <a href="${item.local_url}" class="archive-title-link">${item.title}</a>
        </h3>
        <span class="archive-topic-tag">${item.topic || item.section}</span>
        <span class="archive-reading-time">${item.reading_time}</span>
      </article>
    `).join('');
  };

  // 3. Setup event listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderArticles();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter') || 'all';
      renderArticles();
    });
  });

  // Initial render
  renderArticles();
});
