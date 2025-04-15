// JavaScript for the Linux & Git page

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle background
    initParticles();

    // Initialize terminal typing effect
    initTerminal();

    // Add copy buttons to all command examples
    initCopyButtons();

    // Initialize search functionality
    initSearch();

    // Initialize section navigation
    initSectionNav();

    // Initialize theme toggle
    initThemeToggle();
});

// Function to initialize subtle particle background
function initParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 30, density: { enable: true, value_area: 900 } }, // Fewer particles
            color: { value: '#3366cc' },
            shape: { type: 'circle' },
            opacity: { value: 0.15, random: true, anim: { enable: true, speed: 0.3, opacity_min: 0.08, sync: false } }, // More subtle opacity
            size: { value: 2, random: true, anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false } }, // Smaller particles
            line_linked: { enable: true, distance: 150, color: '#3366cc', opacity: 0.12, width: 0.8 }, // Thinner, more subtle lines
            move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false } // Slower movement
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'grab' },
                onclick: { enable: false, mode: 'push' }, // Disable click interaction for less distraction
                resize: true
            },
            modes: {
                grab: { distance: 120, line_linked: { opacity: 0.3 } } // More subtle grab effect
            }
        },
        retina_detect: true
    });
}

// Function to initialize minimal terminal typing effect
function initTerminal() {
    const terminalText = document.getElementById('terminal-text');
    const commands = [
        'ls -la',
        'git status',
        'cd ~/projects',
        'git clone https://github.com/user/repo.git',
        'chmod +x script.sh',
        'git commit -m "Update documentation"',
        'git push origin main'
    ];

    let currentCommand = 0;
    let charIndex = 0;
    let typingInterval;

    function typeCommand() {
        if (charIndex < commands[currentCommand].length) {
            terminalText.textContent += commands[currentCommand].charAt(charIndex);
            charIndex++;
            // Slightly faster typing with less randomness
            typingInterval = setTimeout(typeCommand, 80 + Math.random() * 30);
        } else {
            // Shorter pause at the end of command
            setTimeout(resetCommand, 1500);
        }
    }

    function resetCommand() {
        // Clear the text with a faster backspace effect
        typingInterval = setInterval(() => {
            if (terminalText.textContent.length > 0) {
                terminalText.textContent = terminalText.textContent.slice(0, -1);
            } else {
                clearInterval(typingInterval);
                // Move to next command with shorter pause
                currentCommand = (currentCommand + 1) % commands.length;
                charIndex = 0;
                setTimeout(typeCommand, 400);
            }
        }, 25); // Faster backspace
    }

    // Start typing with shorter initial delay
    setTimeout(typeCommand, 800);
}

// Function to add copy buttons to all command examples
function initCopyButtons() {
    const commandExamples = document.querySelectorAll('.command-example');

    commandExamples.forEach(example => {
        const code = example.querySelector('code');

        // Skip if this example already has a copy button
        if (example.querySelector('.copy-button')) return;

        // Create copy button if it doesn't exist
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', 'Copy to clipboard');
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;

        // Add copy functionality
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(code.textContent).then(() => {
                // Show copied state
                copyButton.classList.add('copied');
                copyButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                // Reset after 2 seconds
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    `;
                }, 2000);
            });
        });

        // Add button to example
        example.appendChild(copyButton);
    });
}

// Function to initialize search functionality
function initSearch() {
    const searchBar = document.getElementById('search-bar');
    const commandExamples = document.querySelectorAll('.command-example');
    const commandCards = document.querySelectorAll('.command-card');

    searchBar.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        // If search is empty, show all
        if (searchTerm === '') {
            commandExamples.forEach(example => {
                example.style.display = 'block';
            });
            commandCards.forEach(card => {
                card.style.display = 'block';
            });
            return;
        }

        // Filter command examples
        commandExamples.forEach(example => {
            const code = example.querySelector('code').textContent.toLowerCase();
            const description = example.querySelector('p').textContent.toLowerCase();

            if (code.includes(searchTerm) || description.includes(searchTerm)) {
                example.style.display = 'block';
            } else {
                example.style.display = 'none';
            }
        });

        // Hide cards with no visible examples
        commandCards.forEach(card => {
            const visibleExamples = Array.from(card.querySelectorAll('.command-example')).filter(example => {
                return example.style.display !== 'none';
            });

            if (visibleExamples.length === 0) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
            }
        });
    });
}

// Function to initialize minimal section navigation
function initSectionNav() {
    const navItems = document.querySelectorAll('.section-nav-item');
    const sections = document.querySelectorAll('.section-container');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(navItem => navItem.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Get section ID
            const sectionId = this.getAttribute('data-section');

            // Fade out all sections with shorter transition
            sections.forEach(section => {
                section.classList.add('fade-out');
            });

            // After fade out, show only the selected section
            // Shorter timeout for quicker transitions
            setTimeout(() => {
                sections.forEach(section => {
                    if (section.id === sectionId) {
                        section.classList.remove('fade-out');
                        section.classList.remove('hidden');
                    } else {
                        section.classList.add('hidden');
                    }
                });
            }, 200); // Faster transition
        });
    });
}

// Function to initialize theme toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('light-theme');

        // Update icon
        if (body.classList.contains('light-theme')) {
            this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
        } else {
            this.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        }
    });
}
