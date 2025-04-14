/**
 * Navigation system that starts hidden by default
 * This replaces the standard navigation.js
 */
document.addEventListener('DOMContentLoaded', () => {
  // Force the header to be hidden initially
  localStorage.setItem('header-visibility', 'hidden');
  
  // Create minimal floating navigation button
  createMinimalNavigation();
});

/**
 * Creates a minimal floating navigation button
 */
function createMinimalNavigation() {
  // Create the navigation button
  const navButton = document.createElement('button');
  navButton.className = 'floating-nav-button';
  navButton.title = 'Navigation';
  navButton.innerHTML = '≡';
  
  // Add the button to the page
  document.body.appendChild(navButton);
  
  // Create the navigation menu
  const navMenu = document.createElement('div');
  navMenu.className = 'floating-nav-menu';
  navMenu.innerHTML = `
    <div class="floating-nav-header">
      <span>Navigation</span>
      <button class="close-nav-menu" title="Close menu">×</button>
    </div>
    <div class="floating-nav-links">
      <a href="/" class="floating-nav-link" data-section="home">Home</a>
      <a href="/poster" class="floating-nav-link" data-section="poster">Poster Design</a>
      <a href="/showcase" class="floating-nav-link" data-section="showcase">Showcase</a>
      <a href="/showcase/cloud-native" class="floating-nav-link" data-section="cloud-native">Cloud Native</a>
    </div>
  `;
  
  // Add the menu to the page
  document.body.appendChild(navMenu);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .floating-nav-button {
      position: fixed;
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(18, 18, 18, 0.7);
      color: #fff;
      border: none;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
    }
    
    .floating-nav-button:hover {
      background: rgba(18, 18, 18, 0.9);
      transform: scale(1.05);
    }
    
    .floating-nav-menu {
      position: fixed;
      top: 60px;
      right: 10px;
      background: rgba(18, 18, 18, 0.85);
      border-radius: 8px;
      width: 200px;
      max-width: 80vw;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transition: all 0.3s ease;
      transform: translateY(-10px);
      opacity: 0;
      pointer-events: none;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .floating-nav-menu.active {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    
    .floating-nav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .floating-nav-header span {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .close-nav-menu {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
    }
    
    .close-nav-menu:hover {
      color: #fff;
    }
    
    .floating-nav-links {
      display: flex;
      flex-direction: column;
      padding: 10px 0;
    }
    
    .floating-nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 8px 15px;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }
    
    .floating-nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    
    .floating-nav-link.active {
      border-left-color: #8a85ff;
      background: rgba(138, 133, 255, 0.1);
      color: #fff;
    }
    
    /* Light mode styles */
    @media (prefers-color-scheme: light) {
      .floating-nav-button {
        background: rgba(245, 245, 245, 0.8);
        color: #121212;
      }
      
      .floating-nav-button:hover {
        background: rgba(245, 245, 245, 0.9);
      }
      
      .floating-nav-menu {
        background: rgba(245, 245, 245, 0.9);
      }
      
      .floating-nav-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .floating-nav-header span {
        color: rgba(0, 0, 0, 0.9);
      }
      
      .close-nav-menu {
        color: rgba(0, 0, 0, 0.7);
      }
      
      .close-nav-menu:hover {
        color: #000;
      }
      
      .floating-nav-link {
        color: rgba(0, 0, 0, 0.8);
      }
      
      .floating-nav-link:hover {
        background: rgba(0, 0, 0, 0.05);
        color: #000;
      }
      
      .floating-nav-link.active {
        background: rgba(138, 133, 255, 0.1);
        color: #000;
      }
    }
  `;
  
  // Add the styles to the head
  document.head.appendChild(style);
  
  // Add event listeners
  navButton.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  const closeButton = navMenu.querySelector('.close-nav-menu');
  closeButton.addEventListener('click', () => {
    navMenu.classList.remove('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.floating-nav-menu') && !e.target.closest('.floating-nav-button')) {
      navMenu.classList.remove('active');
    }
  });
  
  // Set active link based on current URL
  const currentPath = window.location.pathname;
  const navLinks = navMenu.querySelectorAll('.floating-nav-link');
  
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