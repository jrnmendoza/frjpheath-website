/**
 * FRJPHEATH.COM — PATH C (THE HYBRID): INTERACTION CONTROLLER
 * Lightweight, accessible, framework-free vanilla JavaScript (< 4 KB)
 */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.hybrid-header');
  const maritimeSection = document.getElementById('maritime');
  const menuToggle = document.querySelector('.menu-toggle');
  const closeDrawer = document.querySelector('.close-drawer');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  // 1. Header scroll detection
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Dark theme detection for Maritime Anchor
  if (maritimeSection && header) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          header.classList.add('dark-section');
        } else {
          header.classList.remove('dark-section');
        }
      });
    }, {
      rootMargin: '-10% 0px -85% 0px',
      threshold: 0
    });
    observer.observe(maritimeSection);
  }

  // 3. Homepage V3 Gallery Magazine Lens Filter
  const lensButtons = document.querySelectorAll('.v3-lens-btn');
  const galleryTiles = document.querySelectorAll('.v3-article-tile');
  const galleryContainer = document.querySelector('.v3-gallery-container');

  lensButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lensButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-lens');
      galleryTiles.forEach(tile => {
        const world = tile.getAttribute('data-world');
        if (filter === 'all' || world === filter) {
          tile.style.display = 'flex';
        } else {
          tile.style.display = 'none';
        }
      });

      if (galleryContainer) {
        galleryContainer.scrollTo({ left: 0, behavior: 'smooth' });
      }
    });
  });

  // 4. Moments of Serendipity ("Surprise Me / Discover Something Different")
  const serendipityBtn = document.querySelector('.v3-serendipity-trigger');
  const serendipityToast = document.querySelector('.v3-serendipity-toast');

  if (serendipityBtn) {
    serendipityBtn.addEventListener('click', () => {
      // Find all visible tiles
      const visibleTiles = Array.from(galleryTiles).filter(t => t.style.display !== 'none');
      if (visibleTiles.length === 0) return;

      const randomTile = visibleTiles[Math.floor(Math.random() * visibleTiles.length)];
      const tileTitle = randomTile.querySelector('.v3-tile-title')?.textContent.trim() || 'Featured Reflection';

      // Scroll to the selected tile
      if (galleryContainer) {
        const containerLeft = galleryContainer.getBoundingClientRect().left;
        const tileLeft = randomTile.getBoundingClientRect().left;
        const scrollOffset = tileLeft - containerLeft - 40;
        galleryContainer.scrollBy({ left: scrollOffset, behavior: 'smooth' });
      }

      // Add animation focus
      galleryTiles.forEach(t => t.classList.remove('serendipity-focus'));
      randomTile.classList.add('serendipity-focus');

      // Show toast
      if (serendipityToast) {
        serendipityToast.innerHTML = `✦ <strong>Resurfaced Discovery:</strong> “${tileTitle}”`;
        serendipityToast.classList.add('visible');
        setTimeout(() => {
          serendipityToast.classList.remove('visible');
        }, 3200);
      }
    });
  }

  // 5. Desktop Drag-to-Scroll for Visual Gallery
  if (galleryContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    galleryContainer.addEventListener('mousedown', (e) => {
      // Don't drag if clicking link or button
      if (e.target.closest('a') || e.target.closest('button')) return;
      isDown = true;
      galleryContainer.style.cursor = 'grabbing';
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener('mouseleave', () => {
      isDown = false;
      galleryContainer.style.cursor = '';
    });

    galleryContainer.addEventListener('mouseup', () => {
      isDown = false;
      galleryContainer.style.cursor = '';
    });

    galleryContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      galleryContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // 6. Accessible Mobile Navigation Drawer
  if (menuToggle && mobileDrawer) {
    const openMenu = () => {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      closeDrawer?.focus();
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      menuToggle?.focus();
      document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openMenu);
    closeDrawer?.addEventListener('click', closeMenu);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMenu();
      }
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }
});
