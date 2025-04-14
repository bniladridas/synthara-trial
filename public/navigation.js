/**
 * Navigation system to connect all routes in the application
 * This script creates a navigation bar with links to all sections
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create navigation if it doesn't exist already
  if (!document.querySelector('.site-navigation')) {
    createNavigation();
  }
  
  // Set active navigation item based on current URL
  highlightActiveNavItem();
  
  // Add event listener for handling navigation clicks
  setupNavigationEventListeners();
});

/**
 * Creates the navigation component and inserts it into the page
 */
function createNavigation() {
  // Create the navigation container
  const nav = document.createElement('nav');
  nav.className = 'site-navigation';
  
  // Create navigation inner HTML
  nav.innerHTML = `
    <div class="nav-container">
      <div class="nav-brand">
        <a href="/">Harmony</a>
      </div>
      
      <button class="nav-toggle" aria-label="Toggle navigation">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div class="nav-links">
        <a href="/" class="nav-link" data-section="home">Home</a>
        <a href="/poster" class="nav-link" data-section="poster">Poster Design</a>
        <a href="/showcase" class="nav-link" data-section="showcase">Showcase</a>
        <a href="/showcase/cloud-native" class="nav-link" data-section="cloud-native">Cloud Native</a>
      </div>
    </div>
  `;
  
  // Add styles for the navigation
  const style = document.createElement('style');
  style.textContent = `
    .site-navigation {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(18, 18, 18, 0.8);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.8rem 1.5rem;
    }
    
    .nav-brand a {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 500;
      text-decoration: none;
      background: linear-gradient(90deg, #8a85ff, #5d6cce);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% auto;
    }
    
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    
    .nav-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 1rem;
      transition: color 0.3s ease;
      position: relative;
    }
    
    .nav-link:hover {
      color: #ffffff;
    }
    
    .nav-link.active {
      color: #ffffff;
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, #8a85ff, #5d6cce);
      border-radius: 2px;
    }
    
    .nav-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }
    
    .nav-toggle span {
      display: block;
      width: 25px;
      height: 2px;
      background-color: #ffffff;
      margin: 5px 0;
      border-radius: 2px;
      transition: all 0.3s ease;
    }
    
    @media (max-width: 768px) {
      .nav-toggle {
        display: block;
      }
      
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(18, 18, 18, 0.95);
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
        transform: translateY(-10px);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .nav-links.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
    }
    
    /* Light mode styles */
    @media (prefers-color-scheme: light) {
      .site-navigation {
        background: rgba(245, 245, 245, 0.8);
      }
      
      .nav-link {
        color: rgba(18, 18, 18, 0.7);
      }
      
      .nav-link:hover,
      .nav-link.active {
        color: rgba(18, 18, 18, 1);
      }
      
      .nav-toggle span {
        background-color: #121212;
      }
      
      @media (max-width: 768px) {
        .nav-links {
          background: rgba(245, 245, 245, 0.95);
        }
      }
    }
  `;
  
  // Insert the navigation at the beginning of the body
  document.body.prepend(nav);
  
  // Add the styles to the head
  document.head.appendChild(style);
  
  // Add padding to the body to prevent content from hiding behind the navigation
  document.body.style.paddingTop = '60px';
}

/**
 * Highlights the active navigation item based on the current URL
 */
function highlightActiveNavItem() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Remove active class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Find matching link and add active class
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    if (currentPath === linkPath || 
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    } else if (currentPath === '/' && linkPath === '/') {
      link.classList.add('active');
    }
  });
}

/**
 * Sets up event listeners for the navigation
 */
function setupNavigationEventListeners() {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Add animation to the toggle button
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(span => span.classList.toggle('active'));
    });
  }
  
  // Close mobile navigation when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
      if (!e.target.closest('.site-navigation')) {
        navLinks.classList.remove('active');
        
        // Reset toggle button
        if (navToggle) {
          const spans = navToggle.querySelectorAll('span');
          spans.forEach(span => span.classList.remove('active'));
        }
      }
    }
  });
  
  // Update active link when the URL changes (client-side routing)
  window.addEventListener('popstate', highlightActiveNavItem);
}

// Initialize navigation
// This is called by the DOMContentLoaded event at the top of the file