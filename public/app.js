// Main application script with mobile vibration feedback and info panel
// Uses the Vibration API to provide tactile feedback on mobile devices
// when responses start appearing or errors occur
document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  // Fade overlays removed for cleaner look
  const inputArea = document.getElementById('draggable-input-area');
  const dragHandle = document.querySelector('.drag-handle');

  // Rotating placeholder text for the input area
  const placeholders = [
    'Ask for reasoning...',
    'Explore logical connections...',
    'Seek deeper understanding...',
    'Analyze a concept...',
    'Examine assumptions...',
    'Investigate relationships...',
    'Clarify your thinking...',
    'Test a hypothesis...',
    'Develop an argument...',
    'Reason through a problem...'
  ];

  let currentPlaceholderIndex = 0;

  // Function to update the placeholder text with a smooth transition
  const updatePlaceholder = () => {
    // Fade out
    userInput.style.opacity = '0.4';

    setTimeout(() => {
      // Update placeholder
      currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
      userInput.setAttribute('placeholder', placeholders[currentPlaceholderIndex]);

      // Fade in
      userInput.style.opacity = '1';
    }, 500);
  };

  // Start the placeholder rotation after a delay
  setTimeout(() => {
    // Set initial placeholder
    userInput.setAttribute('placeholder', placeholders[0]);

    // Update placeholder every 4 seconds
    setInterval(updatePlaceholder, 4000);
  }, 1000);

  // Privacy badge functionality
  const privacyBadge = document.querySelector('.privacy-badge');

  if (privacyBadge) {
    // Toggle privacy mode when clicked
    privacyBadge.addEventListener('click', () => {
      // Toggle a class on the body to indicate privacy mode
      document.body.classList.toggle('privacy-mode');

      // Update the badge text and icon based on the current state
      if (document.body.classList.contains('privacy-mode')) {
        privacyBadge.querySelector('.privacy-text').textContent = 'PhD-Level Private Conversation (Pinned)';
        privacyBadge.title = 'PhD-level expertise with complete privacy (Pinned)';
        privacyBadge.classList.add('pinned');
      } else {
        privacyBadge.querySelector('.privacy-text').textContent = 'PhD-Level Private Conversation';
        privacyBadge.title = 'PhD-level expertise with complete privacy';
        privacyBadge.classList.remove('pinned');
      }

      // Trigger a subtle vibration when toggling privacy mode (mobile only)
      triggerSoftVibration();
    });
  }

  // Add a tooltip to show the input area is draggable
  setTimeout(() => {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Drag to move';
    inputArea.appendChild(tooltip);

    // Remove the tooltip after a few seconds
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 500);
    }, 3000);
  }, 1000);

  // Draggable input area functionality
  let isDragging = false;

  // Function to handle mouse down event on drag handle
  const handleMouseDown = (e) => {
    e.preventDefault(); // Prevent any default behavior

    // Mark as dragging
    isDragging = true;
    inputArea.classList.add('dragging');

    // Get the current position of the input area
    const rect = inputArea.getBoundingClientRect();

    // Calculate the offset from the mouse position to the center of the drag handle
    // This ensures the drag handle stays centered under the cursor
    const dragHandleRect = dragHandle.getBoundingClientRect();

    // Calculate the center of the drag handle
    const dragHandleCenterX = dragHandleRect.left + (dragHandleRect.width / 2);
    const dragHandleCenterY = dragHandleRect.top + (dragHandleRect.height / 2);

    // We want the cursor to be exactly at the center of the drag handle
    // We'll calculate the exact position to ensure the drag handle is centered under the cursor

    // Calculate how much we need to move to center the drag handle under the cursor
    const moveX = e.clientX - dragHandleCenterX;
    const moveY = e.clientY - dragHandleCenterY;

    // Calculate the new position by adding the movement to the current position
    const newX = rect.left + moveX;
    const newY = rect.top + moveY;

    // No need to check transform state since we're always setting absolute positioning

    // Disable transitions temporarily
    inputArea.style.transition = 'none';

    // Always convert to absolute positioning for consistent behavior
    inputArea.style.position = 'absolute';
    inputArea.style.left = newX + 'px';
    inputArea.style.top = newY + 'px';
    inputArea.style.transform = 'none';

    // Ensure other positioning properties are cleared
    inputArea.style.bottom = 'auto';
    inputArea.style.right = 'auto';
    inputArea.style.margin = '0';

    // Force a reflow to ensure the browser applies these changes immediately
    inputArea.offsetHeight;

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';

    // Trigger a subtle vibration for feedback
    if (isMobileDevice() && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  // Function to handle mouse move event
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    // Get the current dimensions and position of the input area
    const inputWidth = inputArea.offsetWidth;
    const inputHeight = inputArea.offsetHeight;

    // Get the current position of the drag handle
    const dragHandleRect = dragHandle.getBoundingClientRect();

    // Calculate the center of the drag handle
    const dragHandleCenterX = dragHandleRect.left + (dragHandleRect.width / 2);
    const dragHandleCenterY = dragHandleRect.top + (dragHandleRect.height / 2);

    // Calculate how much we need to move to center the drag handle under the cursor
    const moveX = e.clientX - dragHandleCenterX;
    const moveY = e.clientY - dragHandleCenterY;

    // Calculate the new position by adding the movement to the current position
    const rect = inputArea.getBoundingClientRect();
    const newX = rect.left + moveX;
    const newY = rect.top + moveY;

    // Apply new position with boundaries to keep it within the viewport
    // Add a small margin to ensure it's always accessible
    const margin = 10;

    // Calculate the maximum X and Y positions
    // Make sure we're using the actual window dimensions
    const maxX = Math.max(0, window.innerWidth - inputWidth - margin);
    const maxY = Math.max(0, window.innerHeight - inputHeight - margin);

    // Ensure we're not restricting movement unnecessarily
    // Allow full range of motion within the viewport boundaries
    const boundedX = Math.max(margin, Math.min(newX, maxX));
    const boundedY = Math.max(margin, Math.min(newY, maxY));

    // Apply the new position directly without any transforms
    // IMPORTANT: Set all position properties to ensure consistent behavior
    inputArea.style.position = 'absolute';
    inputArea.style.left = boundedX + 'px';
    inputArea.style.top = boundedY + 'px';
    inputArea.style.bottom = 'auto';
    inputArea.style.right = 'auto';
    inputArea.style.transform = 'none';
    inputArea.style.margin = '0';
  };

  // Function to handle mouse up event
  const handleMouseUp = () => {
    if (isDragging) {
      // End dragging state
      isDragging = false;
      inputArea.classList.remove('dragging');
      document.body.style.userSelect = '';

      // Restore transitions
      inputArea.style.transition = 'box-shadow var(--transition), transform var(--transition), opacity var(--transition), left var(--transition), top var(--transition)';

      // Save the position to local storage
      const position = {
        left: inputArea.style.left,
        top: inputArea.style.top
      };
      localStorage.setItem('inputAreaPosition', JSON.stringify(position));

      // Log for debugging
      console.log('Drag ended, saved position:', position);
    }
  };

  // Load the position from local storage if available
  const loadPosition = () => {
    const savedPosition = localStorage.getItem('inputAreaPosition');
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);

        // Disable transitions temporarily for immediate positioning
        inputArea.style.transition = 'none';

        // Apply the saved position
        inputArea.style.position = 'absolute';
        inputArea.style.left = position.left;
        inputArea.style.top = position.top;
        inputArea.style.bottom = 'auto';
        inputArea.style.right = 'auto';
        inputArea.style.transform = 'none';
        inputArea.style.margin = '0';

        // Log the loaded position
        console.log('Loaded position:', position);

        // Force a reflow to ensure the browser applies these changes immediately
        inputArea.offsetHeight;

        // Restore transitions after a short delay
        setTimeout(() => {
          inputArea.style.transition = 'box-shadow var(--transition), transform var(--transition), opacity var(--transition), left var(--transition), top var(--transition)';
        }, 50);

        console.log('Loaded saved position:', position);
      } catch (e) {
        console.error('Error loading saved position:', e);
        // Set default centered position if there's an error
        resetPosition();
      }
    } else {
      console.log('No saved position found, using default centered position');
      // Ensure the input area is centered by default
      inputArea.style.position = 'absolute';
      inputArea.style.left = '50%';
      inputArea.style.top = '50%';
      inputArea.style.bottom = 'auto';
      inputArea.style.right = 'auto';
      inputArea.style.transform = 'translate(-50%, -50%)';
      inputArea.style.margin = '0';
    }
  };

  // Function to check and fix the input area's position
  const checkAndFixPosition = () => {
    // Get the current position and dimensions
    const rect = inputArea.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const inputWidth = inputArea.offsetWidth;

    // Check if the input area is too far to the right
    if (rect.right > windowWidth - 10) {
      console.log('Fixing position - too far right');
      inputArea.style.left = (windowWidth - inputWidth - 10) + 'px';
    }

    // Check if the input area is too far to the left
    if (rect.left < 10) {
      console.log('Fixing position - too far left');
      inputArea.style.left = '10px';
    }

    // Log the current position
    console.log('Position check - left:', rect.left, 'right:', windowWidth - rect.right);
  };

  // Load the position after the animation completes
  setTimeout(() => {
    loadPosition();
    // Check and fix position after loading
    setTimeout(checkAndFixPosition, 100);
  }, 800);

  // Add window resize event listener to ensure the input area stays within bounds
  window.addEventListener('resize', checkAndFixPosition);

  // Function to reset the input area position
  const resetPosition = (e) => {
    // Prevent the event from bubbling if called from an event
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Clear the saved position
    localStorage.removeItem('inputAreaPosition');

    // Apply a smooth animation
    inputArea.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Animate to the default centered position
    inputArea.style.position = 'absolute';
    inputArea.style.left = '50%';
    inputArea.style.top = '50%';
    inputArea.style.bottom = 'auto';
    inputArea.style.right = 'auto';
    inputArea.style.transform = 'translate(-50%, -50%)';
    inputArea.style.margin = '0';

    // Log the reset position
    console.log('Reset to default position');

    // Reset transition after animation completes
    setTimeout(() => {
      inputArea.style.transition = 'box-shadow var(--transition), transform var(--transition), opacity var(--transition), left var(--transition), top var(--transition)';
    }, 500);

    // Show a confirmation tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Position reset';
    inputArea.appendChild(tooltip);

    // Remove the tooltip after a few seconds
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 500);
    }, 2000);

    console.log('Position reset to default');
  };

  // Add event listener for the reset button
  document.getElementById('reset-position').addEventListener('click', resetPosition);

  // Add event listeners for mouse dragging
  dragHandle.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);

  // Add touch support for mobile devices
  dragHandle.addEventListener('touchstart', (e) => {
    // Prevent default to avoid any browser handling
    e.preventDefault();

    const touch = e.touches[0];

    // Mark as dragging
    isDragging = true;
    inputArea.classList.add('dragging');

    // Get the current position of the input area
    const rect = inputArea.getBoundingClientRect();

    // Calculate the offset from the touch position to the center of the drag handle
    // This ensures the drag handle stays centered under the finger
    const dragHandleRect = dragHandle.getBoundingClientRect();

    // Calculate the center of the drag handle
    const dragHandleCenterX = dragHandleRect.left + (dragHandleRect.width / 2);
    const dragHandleCenterY = dragHandleRect.top + (dragHandleRect.height / 2);

    // We want the touch to be exactly at the center of the drag handle
    // We'll calculate the exact position to ensure the drag handle is centered under the touch

    // Calculate how much we need to move to center the drag handle under the touch
    const moveX = touch.clientX - dragHandleCenterX;
    const moveY = touch.clientY - dragHandleCenterY;

    // Calculate the new position by adding the movement to the current position
    const newX = rect.left + moveX;
    const newY = rect.top + moveY;

    // Disable transitions temporarily
    inputArea.style.transition = 'none';

    // Always convert to absolute positioning for consistent behavior
    inputArea.style.position = 'absolute';
    inputArea.style.left = newX + 'px';
    inputArea.style.top = newY + 'px';
    inputArea.style.transform = 'none';

    // Ensure other positioning properties are cleared
    inputArea.style.bottom = 'auto';
    inputArea.style.right = 'auto';
    inputArea.style.margin = '0';

    // Force a reflow to ensure the browser applies these changes immediately
    inputArea.offsetHeight;

    // Prevent text selection during drag
    document.body.style.userSelect = 'none';

    // Trigger a vibration for feedback on mobile
    triggerSoftVibration();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    // Prevent default to stop scrolling
    e.preventDefault();

    const touch = e.touches[0];

    // Get the current dimensions and position of the input area
    const inputWidth = inputArea.offsetWidth;
    const inputHeight = inputArea.offsetHeight;

    // Get the current position of the drag handle
    const dragHandleRect = dragHandle.getBoundingClientRect();

    // Calculate the center of the drag handle
    const dragHandleCenterX = dragHandleRect.left + (dragHandleRect.width / 2);
    const dragHandleCenterY = dragHandleRect.top + (dragHandleRect.height / 2);

    // Calculate how much we need to move to center the drag handle under the touch
    const moveX = touch.clientX - dragHandleCenterX;
    const moveY = touch.clientY - dragHandleCenterY;

    // Calculate the new position by adding the movement to the current position
    const rect = inputArea.getBoundingClientRect();
    const newX = rect.left + moveX;
    const newY = rect.top + moveY;

    // Apply new position with boundaries to keep it within the viewport
    const margin = 10;

    // Calculate the maximum X and Y positions
    // Make sure we're using the actual window dimensions
    const maxX = Math.max(0, window.innerWidth - inputWidth - margin);
    const maxY = Math.max(0, window.innerHeight - inputHeight - margin);

    // Ensure we're not restricting movement unnecessarily
    // Allow full range of motion within the viewport boundaries
    const boundedX = Math.max(margin, Math.min(newX, maxX));
    const boundedY = Math.max(margin, Math.min(newY, maxY));

    // Apply the new position directly without any transforms
    // IMPORTANT: Set all position properties to ensure consistent behavior
    inputArea.style.position = 'absolute';
    inputArea.style.left = boundedX + 'px';
    inputArea.style.top = boundedY + 'px';
    inputArea.style.bottom = 'auto';
    inputArea.style.right = 'auto';
    inputArea.style.transform = 'none';
    inputArea.style.margin = '0';
  }, { passive: false });

  document.addEventListener('touchend', () => {
    if (isDragging) {
      // End dragging state
      isDragging = false;
      inputArea.classList.remove('dragging');
      document.body.style.userSelect = '';

      // Restore transitions
      inputArea.style.transition = 'box-shadow var(--transition), transform var(--transition), opacity var(--transition), left var(--transition), top var(--transition)';

      // Save the position to local storage
      const position = {
        left: inputArea.style.left,
        top: inputArea.style.top
      };
      localStorage.setItem('inputAreaPosition', JSON.stringify(position));

      console.log('Touch ended, saved position:', position);
    }
  });

  document.addEventListener('touchcancel', () => {
    if (isDragging) {
      isDragging = false;
      inputArea.classList.remove('dragging');
      document.body.style.userSelect = '';
      console.log('Touch cancelled');
    }
  });

  // Prevent dragging when clicking/touching the textarea
  userInput.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  userInput.addEventListener('touchstart', (e) => {
    e.stopPropagation();
  });

  // Fade overlays and scroll effects removed for cleaner look

  // Remove auto-focus behavior
  // Only focus the input when clicking directly on it

  // Handle document clicks to remove focus when clicking outside the input area
  document.addEventListener('click', (e) => {
    // Check if the click is outside the input area
    if (!inputArea.contains(e.target)) {
      userInput.blur();
    }
  });

  // Prevent the above event from triggering when clicking inside the input area
  inputArea.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Function to render wave animation for text
  function renderWaveAnimation(element, content) {
    // First, process line breaks
    const lines = content.split('\n');

    // For each line, create the wave effect
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        // Add a line break between lines
        element.appendChild(document.createElement('br'));
      }

      // Split the line into words to preserve spacing
      const words = line.split(' ');

      words.forEach((word, wordIndex) => {
        // Add a space before each word (except the first word)
        if (wordIndex > 0) {
          element.appendChild(document.createTextNode(' '));
        }

        // Create a wave effect for each character in the word
        Array.from(word).forEach((char, charIndex) => {
          const charSpan = document.createElement('span');
          charSpan.textContent = char;
          charSpan.classList.add('wave-char');

          // Set the character index as a CSS variable for animation delay
          const overallIndex = wordIndex * 5 + charIndex; // Approximate position
          charSpan.style.setProperty('--char-index', overallIndex);

          // Add a subtle variation to the animation duration for a more organic feel
          const durationVariation = 0.95 + (Math.random() * 0.1); // Between 0.95 and 1.05
          charSpan.style.animationDuration = `calc(var(--wave-duration) * ${durationVariation})`;

          // Add gradient color variation
          const hueShift = Math.floor(Math.random() * 20) - 10; // -10 to +10
          charSpan.style.filter = `hue-rotate(${hueShift}deg)`;

          element.appendChild(charSpan);
        });
      });
    });
  }

  // Function to check if the user is on a mobile device
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  }

  // Function to trigger a soft vibration on mobile devices
  function triggerSoftVibration() {
    // Only vibrate if it's a mobile device and the Vibration API is supported
    if (isMobileDevice() && 'vibrate' in navigator) {
      // Trigger a gentle 40ms vibration
      navigator.vibrate(40);
    }
  }

  // Configure marked options
  marked.setOptions({
    breaks: true,         // Enable line breaks
    gfm: true,           // Enable GitHub Flavored Markdown
    headerIds: false,    // Disable header IDs for cleaner HTML
    mangle: false,       // Disable mangling for cleaner HTML
    pedantic: false,     // Use more relaxed rules
    smartLists: true,    // Use smarter list behavior
    smartypants: true,   // Use smart typography
    highlight: function(code, lang) {
      // Use highlight.js for syntax highlighting if available
      if (hljs && lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (e) {
          console.error('Highlight.js error:', e);
        }
      }
      return code; // Return original code if highlighting fails
    }
  });

  // Fix indentation issues in code blocks
  const fixCodeIndentation = (content) => {
    // Find all code blocks in the content
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

    // Replace each code block with a properly indented version
    return content.replace(codeBlockRegex, (_, language, code) => {
      // Remove common leading whitespace from all lines
      const lines = code.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);

      // Find the minimum indentation level
      const minIndent = nonEmptyLines.reduce((min, line) => {
        const indent = line.match(/^\s*/)[0].length;
        return indent < min ? indent : min;
      }, Infinity) || 0;

      // Remove the common indentation from each line
      const dedentedCode = lines.map(line => {
        if (line.trim().length === 0) return '';
        return line.substring(minIndent);
      }).join('\n');

      // Return the fixed code block
      return '```' + language + '\n' + dedentedCode + '\n```';
    });
  };

  // Function to add a message to the chat
  function addMessage(content, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');

    // Start with opacity 0 for a fade-in effect
    messageElement.style.opacity = '0';

    if (isUser) {
      // For user messages, just set the content directly
      // Process line breaks for better readability
      const formattedContent = content.replace(/\n/g, '<br>');
      messageElement.innerHTML = formattedContent;
    } else {
      // Trigger vibration when AI message starts to appear (mobile only)
      triggerSoftVibration();

      // Check if the content contains code blocks
      const hasCodeBlocks = content.includes('```');

      if (hasCodeBlocks) {
        // Create a container for the markdown content
        const markdownContainer = document.createElement('div');
        markdownContainer.classList.add('markdown-message');

        try {
          // Fix code block indentation before parsing markdown
          const fixedContent = fixCodeIndentation(content);

          // Process the content with marked for markdown formatting
          const formattedContent = marked.parse(fixedContent);

          // Extract code blocks and replace them with placeholders
          const codeBlocks = [];
          const contentWithPlaceholders = formattedContent.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (match) => {
            const placeholder = `CODE_BLOCK_${codeBlocks.length}`;
            codeBlocks.push(match);
            return placeholder;
          });

          // Split the content by placeholders
          const parts = contentWithPlaceholders.split(/CODE_BLOCK_\d+/);

          // Create a fragment to hold all the content
          const fragment = document.createDocumentFragment();

          // Add each part with wave animation, interspersed with code blocks
          parts.forEach((part, index) => {
            if (part.trim()) {
              // Create a container for the wave animation text
              const waveContainer = document.createElement('div');
              waveContainer.classList.add('wave-text');
              // Create a temporary div to properly decode HTML entities
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = part;
              const textContent = tempDiv.textContent || tempDiv.innerText || '';
              renderWaveAnimation(waveContainer, textContent);
              fragment.appendChild(waveContainer);
            }

            // Add the code block after this part (if there is one)
            if (index < codeBlocks.length) {
              const codeContainer = document.createElement('div');
              codeContainer.classList.add('code-block-container');
              codeContainer.innerHTML = codeBlocks[index];

              // Apply syntax highlighting
              const codeElement = codeContainer.querySelector('code');
              if (window.hljs && codeElement) {
                hljs.highlightElement(codeElement);
              }

              fragment.appendChild(codeContainer);
            }
          });

          markdownContainer.appendChild(fragment);
          messageElement.appendChild(markdownContainer);
        } catch (error) {
          console.error('Markdown parsing error:', error);
          // Fallback to wave animation if markdown parsing fails
          renderWaveAnimation(messageElement, content);
        }
      } else {
        // No code blocks, just use wave animation
        renderWaveAnimation(messageElement, content);
      }
    }

    chatMessages.appendChild(messageElement);

    // Fade in the message after a tiny delay
    setTimeout(() => {
      messageElement.style.opacity = '1';
    }, 10);

    // Smooth scroll to bottom
    setTimeout(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }, 10);
  }

  // Function to send a message to the API
  async function sendMessage(prompt) {
    try {
      // Show loading indicator
      const loadingElement = document.createElement('div');
      loadingElement.classList.add('message', 'ai-message', 'loading');
      loadingElement.textContent = 'Thinking';
      chatMessages.appendChild(loadingElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Trigger a subtle vibration when the thinking indicator appears
      triggerSoftVibration();

      // Send request to our backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      // Remove loading indicator
      chatMessages.removeChild(loadingElement);

      if (!response.ok) {
        const errorData = await response.json();

        // Check if it's a rate limit error
        if (response.status === 429 && errorData.message) {
          throw new Error('rate limit: ' + errorData.message);
        } else {
          throw new Error(errorData.error || 'Failed to get response');
        }
      }

      const data = await response.json();

      // Extract the AI's response
      let aiResponse = 'Sorry, I could not generate a response.';

      if (data.choices && data.choices[0] && data.choices[0].message) {
        aiResponse = data.choices[0].message.content;
      }

      // Check if the response might have been truncated due to token limits
      const isTruncated = aiResponse.endsWith('...') ||
                         aiResponse.endsWith('…') ||
                         aiResponse.endsWith('.') && aiResponse.length > 900;

      // Add AI response to chat
      addMessage(aiResponse);

      // If the response seems truncated, add a note about token limits
      if (isTruncated) {
        setTimeout(() => {
          const tokenLimitNote = document.createElement('div');
          tokenLimitNote.classList.add('token-limit-note');
          tokenLimitNote.textContent = 'Note: Response length is limited to conserve tokens.';
          chatMessages.appendChild(tokenLimitNote);

          // Scroll to the bottom
          chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);

      // Check if it's a rate limit error
      if (error.message && error.message.includes('rate limit')) {
        // Extract the actual message part after the prefix
        const rateLimitMessage = error.message.replace('rate limit: ', '');

        // Trigger a different vibration pattern for errors (mobile only)
        if (isMobileDevice() && 'vibrate' in navigator) {
          // Pattern: 60ms vibration, 50ms pause, 60ms vibration
          navigator.vibrate([60, 50, 60]);
        }

        // Display the formatted rate limit error message
        addRateLimitMessage(rateLimitMessage);
      } else {
        // Trigger a different vibration pattern for errors (mobile only)
        if (isMobileDevice() && 'vibrate' in navigator) {
          // Pattern: 60ms vibration, 50ms pause, 60ms vibration
          navigator.vibrate([60, 50, 60]);
        }

        // Display generic error
        addMessage(`Error: ${error.message}`, false);
      }
    }
  }

  // Function to add a rate limit error message with special formatting
  function addRateLimitMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'rate-limit-message');

    // Start with opacity 0 for a fade-in effect
    messageElement.style.opacity = '0';

    // Format the message with links
    const formattedMessage = message
      .replace('(https://docs.together.ai/docs/rate-limits)', '<a href="https://docs.together.ai/docs/rate-limits" target="_blank">Together AI rate limits documentation</a>')
      .replace('(https://www.together.ai/forms/contact-sales)', '<a href="https://www.together.ai/forms/contact-sales" target="_blank">contact our sales team</a>');

    // Create the content with proper formatting
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = formattedMessage;
    messageElement.appendChild(contentDiv);

    // Add to chat
    chatMessages.appendChild(messageElement);

    // Fade in the message after a tiny delay
    setTimeout(() => {
      messageElement.style.opacity = '1';
    }, 10);

    // Smooth scroll to bottom
    setTimeout(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }, 10);
  }

  // Function to estimate token count (very rough estimate)
  function estimateTokenCount(text) {
    // A very rough estimate: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  // Event listener for Enter key
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = userInput.value.trim();
      if (message) {
        // Animate the PhD badge to indicate response processing
        animatePhDBadge();

        // Estimate token count
        const estimatedTokens = estimateTokenCount(message);

        // Warn if the prompt is very long (likely to generate a long response)
        if (estimatedTokens > 200) {
          const tokenWarning = document.createElement('div');
          tokenWarning.classList.add('token-limit-note');
          tokenWarning.textContent = 'Note: Long prompts may result in truncated responses.';
          chatMessages.appendChild(tokenWarning);

          // Scroll to the bottom
          chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
          });

          // Short delay before showing the user message
          setTimeout(() => {
            addMessage(message, true);
            userInput.value = '';
            userInput.style.height = 'auto';
            sendMessage(message);
          }, 500);
        } else {
          // Normal flow for shorter prompts
          addMessage(message, true);
          userInput.value = '';
          userInput.style.height = 'auto';
          sendMessage(message);
        }
      }
    }
  });

  // Function to animate the PhD badge when a response is being processed
  function animatePhDBadge() {
    const privacyBadge = document.querySelector('.privacy-badge');
    if (privacyBadge) {
      // Add the pulse class to start the animation
      privacyBadge.classList.add('pulse');

      // Trigger a subtle vibration for haptic feedback
      triggerSoftVibration();

      // Update the badge text temporarily
      const badgeText = privacyBadge.querySelector('.privacy-text');
      if (badgeText) {
        const originalText = badgeText.textContent;
        badgeText.textContent = 'Reasoning in Progress';

        // Reset the badge after the animation completes
        setTimeout(() => {
          privacyBadge.classList.remove('pulse');
          badgeText.textContent = originalText;
        }, 2000);
      }
    }
  }

  // Auto-resize textarea as user types
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
  });

  // Initialize textarea height to a minimal value
  userInput.style.height = '36px';

  // Info panel functionality
  const infoButton = document.getElementById('info-button');
  const infoPanel = document.getElementById('info-panel');
  const closePanel = document.getElementById('close-panel');
  const expandPanel = document.getElementById('expand-panel');
  const panelDragHandle = document.getElementById('panel-drag-handle');
  const panelOverlay = document.getElementById('panel-overlay');

  // Function to open the panel
  const openPanel = () => {
    // First show the overlay with a slight delay
    panelOverlay.classList.add('visible');

    // Then open the panel after a tiny delay for smoother transition
    setTimeout(() => {
      infoPanel.classList.add('open');

      // Trigger a subtle vibration when panel opens (mobile only)
      triggerSoftVibration();
    }, 30);
  };

  // Function to close the panel
  const closeInfoPanel = () => {
    // First close the panel
    infoPanel.classList.remove('open');
    infoPanel.classList.remove('expanded');
    infoPanel.style.width = ''; // Reset width

    // Then hide the overlay after a tiny delay
    setTimeout(() => {
      panelOverlay.classList.remove('visible');
    }, 150);
  };

  // Function to toggle panel expansion
  const togglePanelExpansion = () => {
    infoPanel.classList.toggle('expanded');

    // Trigger a subtle vibration when panel expands/collapses (mobile only)
    triggerSoftVibration();
  };

  // Variables for panel resizing
  let isResizing = false;
  let startWidth = 0;
  let startX = 0;
  const minWidth = 280; // Minimum panel width
  const maxWidth = window.innerWidth * 0.8; // Maximum panel width

  // Function to handle panel resize start
  const startResize = (e) => {
    isResizing = true;
    startWidth = infoPanel.offsetWidth;
    startX = e.clientX || (e.touches && e.touches[0].clientX);

    // Add resize class to body for cursor styling
    document.body.classList.add('resizing');

    // Prevent default to avoid text selection
    e.preventDefault();

    // Trigger a subtle vibration when resizing starts (mobile only)
    triggerSoftVibration();
  };

  // Function to handle panel resizing
  const resizePanel = (e) => {
    if (!isResizing) return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!currentX) return;

    const diff = currentX - startX;

    // Calculate new width (moving right increases width)
    let newWidth = startWidth + diff;

    // Enforce min/max constraints
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

    // Apply the new width
    infoPanel.style.width = `${newWidth}px`;

    // If width is close to max, automatically expand to full screen
    if (newWidth > maxWidth * 0.9) {
      infoPanel.classList.add('expanded');
      isResizing = false;
      document.body.classList.remove('resizing');
    }

    // Prevent default to avoid scrolling on mobile
    e.preventDefault();
  };

  // Function to handle panel resize end
  const endResize = () => {
    if (isResizing) {
      isResizing = false;
      document.body.classList.remove('resizing');
    }
  };

  // Open panel when info button is clicked
  infoButton.addEventListener('click', openPanel);

  // Close panel when close button is clicked
  closePanel.addEventListener('click', closeInfoPanel);

  // Toggle expansion when expand button is clicked
  expandPanel.addEventListener('click', togglePanelExpansion);

  // Close panel when overlay is clicked

  // Event listeners for panel resizing
  panelDragHandle.addEventListener('mousedown', startResize);
  panelDragHandle.addEventListener('touchstart', startResize, { passive: false });

  document.addEventListener('mousemove', resizePanel);
  document.addEventListener('touchmove', resizePanel, { passive: false });

  document.addEventListener('mouseup', endResize);
  document.addEventListener('touchend', endResize);

  // Reset panel width when window is resized
  window.addEventListener('resize', () => {
    if (!infoPanel.classList.contains('expanded')) {
      infoPanel.style.width = ''; // Reset to default width
    }
  });

  // Close panel when clicking on the overlay
  panelOverlay.addEventListener('click', closeInfoPanel);

  // Close panel when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoPanel.classList.contains('open')) {
      closeInfoPanel();
    }
  });

  // Prevent panel from closing when clicking inside it
  infoPanel.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});
