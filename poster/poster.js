/**
 * Harmony Poster Design JavaScript
 * Controls poster appearance, animations, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements with null checking
    const posterFrame = document.querySelector('.poster-frame');
    const colorSchemeSelect = document.getElementById('color-scheme');
    const animationSpeedInput = document.getElementById('animation-speed');
    const showChatCheckbox = document.getElementById('show-chat');
    const showDesignCheckbox = document.getElementById('show-design');
    const showShowcaseCheckbox = document.getElementById('show-showcase');
    const downloadBtn = document.getElementById('download-poster');
    const resetBtn = document.getElementById('reset-poster');
    const featureCircles = document.querySelectorAll('.feature-circle');
    const navigationContainer = document.getElementById('navigation-container');

    // Initialize animation timers array to allow cleanup
    const animationTimers = [];

    // Initialize with a subtle animation if circles exist
    if (featureCircles.length > 0) {
        animateCircles();
    }

    // Check URL for noheader parameter
    if (window.location.search.includes('noheader') && navigationContainer) {
        navigationContainer.style.display = 'none';
    }

    // Color scheme selection
    if (colorSchemeSelect && posterFrame) {
        colorSchemeSelect.addEventListener('change', function() {
            // Remove all theme classes
            posterFrame.classList.remove('dark', 'vibrant', 'minimal');
            
            // Add selected theme class if not default
            if (this.value !== 'default') {
                posterFrame.classList.add(this.value);
            }
        });
    }

    // Animation speed adjustment
    if (animationSpeedInput) {
        animationSpeedInput.addEventListener('input', function() {
            const speed = 11 - this.value; // Invert so higher = faster
            document.documentElement.style.setProperty('--animation-duration', `${speed}s`);
        });
    }

    // Feature visibility toggles
    if (showChatCheckbox) {
        showChatCheckbox.addEventListener('change', function() {
            toggleFeatureVisibility('circle1', this.checked);
        });
    }

    if (showDesignCheckbox) {
        showDesignCheckbox.addEventListener('change', function() {
            toggleFeatureVisibility('circle2', this.checked);
        });
    }

    if (showShowcaseCheckbox) {
        showShowcaseCheckbox.addEventListener('change', function() {
            toggleFeatureVisibility('circle3', this.checked);
        });
    }

    // Download poster (mock functionality)
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            alert('In a production environment, this would generate a PNG or PDF of your poster design.');
        });
    }

    // Reset to default settings
    if (resetBtn && posterFrame) {
        resetBtn.addEventListener('click', function() {
            if (colorSchemeSelect) colorSchemeSelect.value = 'default';
            if (animationSpeedInput) animationSpeedInput.value = 5;
            if (showChatCheckbox) showChatCheckbox.checked = true;
            if (showDesignCheckbox) showDesignCheckbox.checked = true;
            if (showShowcaseCheckbox) showShowcaseCheckbox.checked = true;
            
            // Reset poster appearance
            posterFrame.classList.remove('dark', 'vibrant', 'minimal');
            document.documentElement.style.setProperty('--animation-duration', '8s');
            
            // Show all feature circles
            featureCircles.forEach(circle => {
                if (circle) circle.style.display = 'flex';
            });
        });
    }

    /**
     * Toggle visibility of a feature circle
     * @param {string} id - The ID of the circle element
     * @param {boolean} visible - Whether the circle should be visible
     */
    function toggleFeatureVisibility(id, visible) {
        const circle = document.getElementById(id);
        if (circle) {
            circle.style.display = visible ? 'flex' : 'none';
        }
    }

    /**
     * Add random movement to circles for more dynamic feel
     * with proper cleanup of timers
     */
    function animateCircles() {
        if (!featureCircles || featureCircles.length === 0) return;

        featureCircles.forEach(circle => {
            if (!circle) return;
            
            // Add subtle random movement to each circle
            const timerId = setInterval(() => {
                const randomX = (Math.random() - 0.5) * 5;
                const randomY = (Math.random() - 0.5) * 5;
                
                circle.style.transform = `translate(${randomX}px, ${randomY}px)`;
                
                // Reset after short delay
                const resetTimerId = setTimeout(() => {
                    circle.style.transform = 'translate(0, 0)';
                }, 500);
                
                // Store the reset timer for cleanup
                animationTimers.push(resetTimerId);
            }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
            
            // Store the animation timer for cleanup
            animationTimers.push(timerId);
        });
    }

    // Event delegation for feature circles
    if (featureCircles.length > 0) {
        // Create a single parent container for event delegation
        const circleContainer = featureCircles[0].parentElement;
        
        if (circleContainer) {
            circleContainer.addEventListener('mouseover', function(e) {
                if (e.target.classList.contains('feature-circle')) {
                    e.target.style.transform = 'scale(1.1)';
                }
            });
            
            circleContainer.addEventListener('mouseout', function(e) {
                if (e.target.classList.contains('feature-circle')) {
                    e.target.style.transform = 'scale(1)';
                }
            });
            
            circleContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('feature-circle')) {
                    // Pulse effect on click
                    e.target.style.animation = 'none';
                    setTimeout(() => {
                        e.target.style.animation = 'float var(--animation-duration) infinite ease-in-out';
                    }, 10);
                }
            });
        }
    }

    // Cleanup function to prevent memory leaks
    function cleanupTimers() {
        // Clear all stored timers
        animationTimers.forEach(timer => clearTimeout(timer));
        animationTimers.length = 0; // Empty the array
    }

    // Clean up timers when the page is unloaded
    window.addEventListener('beforeunload', cleanupTimers);
});
