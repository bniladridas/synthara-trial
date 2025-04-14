/**
 * Form submission handler for the application
 */
document.addEventListener('DOMContentLoaded', () => {
  // Find all forms that need submission handling
  setupFormSubmission();
  
  // Set up the main chat form
  setupChatForm();
});

/**
 * Sets up form submission for all standard forms
 */
function setupFormSubmission() {
  const forms = document.querySelectorAll('form:not(#chat-form)');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Show loading indicator
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : '';
      if (submitButton) {
        submitButton.innerHTML = '<span class="loading-dots">Processing...</span>';
        submitButton.disabled = true;
      }
      
      try {
        // Create form data
        const formData = new FormData(form);
        const formObject = {};
        
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        
        // Validate form data
        const validationResult = validateFormData(formObject, form);
        
        if (!validationResult.valid) {
          showValidationErrors(validationResult.errors, form);
          
          // Provide vibration feedback on error
          if (typeof triggerErrorVibration === 'function') {
            triggerErrorVibration();
          }
          
          return;
        }
        
        // Mock API call - replace with actual implementation
        const response = await mockFormSubmission(formObject);
        
        // Handle the response
        if (response.success) {
          // Show success message
          showFormMessage(form, response.message || 'Form submitted successfully!', 'success');
          
          // Success vibration
          if (typeof triggerSuccessVibration === 'function') {
            triggerSuccessVibration();
          }
          
          // Reset form after success
          form.reset();
        } else {
          // Show error message
          showFormMessage(form, response.message || 'An error occurred. Please try again.', 'error');
          
          // Error vibration
          if (typeof triggerErrorVibration === 'function') {
            triggerErrorVibration();
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showFormMessage(form, 'An unexpected error occurred. Please try again later.', 'error');
        
        // Error vibration
        if (typeof triggerErrorVibration === 'function') {
          triggerErrorVibration();
        }
      } finally {
        // Restore button state
        if (submitButton) {
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
      }
    });
  });
}

/**
 * Sets up the chat form for the main interface
 */
function setupChatForm() {
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const chatMessages = document.getElementById('chat-messages');
  
  if (!userInput || !sendButton || !chatMessages) return;
  
  // Function to handle message submission
  const handleSubmitMessage = () => {
    const message = userInput.value.trim();
    
    if (message) {
      // Add user message to the chat
      addMessageToChat('user', message);
      
      // Clear input
      userInput.value = '';
      
      // Soft vibration feedback
      if (typeof triggerSoftVibration === 'function') {
        triggerSoftVibration();
      }
      
      // Mock AI response - replace with actual API call
      mockAIResponse(message);
    }
  };
  
  // Submit on button click
  sendButton.addEventListener('click', handleSubmitMessage);
  
  // Submit on Enter key (but allow Shift+Enter for newlines)
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitMessage();
    }
  });
  
  // Auto-resize the textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
  });
}

/**
 * Adds a message to the chat interface
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - The message text
 */
function addMessageToChat(sender, text) {
  const chatMessages = document.getElementById('chat-messages');
  if (!chatMessages) return;
  
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  
  // For AI messages, add the typing effect
  if (sender === 'ai') {
    messageElement.classList.add('typing');
    
    // Simulate typing effect
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        messageElement.textContent += text.charAt(i);
        i++;
        
        // Auto-scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        clearInterval(typingEffect);
        messageElement.classList.remove('typing');
      }
    }, 30);
  } else {
    messageElement.textContent = text;
  }
  
  chatMessages.appendChild(messageElement);
  
  // Scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Mock AI response function - replace with actual API call
 * @param {string} userMessage - The user's message
 */
function mockAIResponse(userMessage) {
  // In a real app, this would be replaced with an API call
  setTimeout(() => {
    const responses = [
      "I understand your question about harmonious design principles.",
      "That's an interesting perspective on visual balance and clarity.",
      "When we consider the relationship between space and ideas, we find that simplicity often leads to elegant solutions.",
      "The concept of harmony extends beyond aesthetics into functionality and user experience.",
      "I'd suggest exploring how negative space creates rhythm and focus in your design work."
    ];
    
    // Choose a somewhat relevant response
    let responseIndex = 0;
    
    if (userMessage.toLowerCase().includes('design')) {
      responseIndex = 0;
    } else if (userMessage.toLowerCase().includes('balance')) {
      responseIndex = 1;
    } else if (userMessage.toLowerCase().includes('space')) {
      responseIndex = 2;
    } else if (userMessage.toLowerCase().includes('function')) {
      responseIndex = 3;
    } else {
      responseIndex = 4;
    }
    
    addMessageToChat('ai', responses[responseIndex]);
    
    // Success vibration
    if (typeof triggerSoftVibration === 'function') {
      triggerSoftVibration(20);
    }
  }, 1000);
}

/**
 * Validates form data
 * @param {Object} formData - The form data object
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Validation result with valid flag and errors
 */
function validateFormData(formData, form) {
  const errors = {};
  
  // Get all required fields
  const requiredFields = Array.from(form.querySelectorAll('[required]'));
  
  requiredFields.forEach(field => {
    const fieldName = field.name;
    const fieldValue = formData[fieldName];
    
    if (!fieldValue || fieldValue.trim() === '') {
      errors[fieldName] = 'This field is required';
    }
  });
  
  // Email validation
  const emailField = form.querySelector('input[type="email"]');
  if (emailField && formData[emailField.name]) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData[emailField.name])) {
      errors[emailField.name] = 'Please enter a valid email address';
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Shows validation errors on the form
 * @param {Object} errors - The validation errors object
 * @param {HTMLFormElement} form - The form element
 */
function showValidationErrors(errors, form) {
  // Remove existing error messages
  form.querySelectorAll('.error-message').forEach(el => el.remove());
  
  // Add new error messages
  Object.entries(errors).forEach(([fieldName, message]) => {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field) {
      // Mark field as invalid
      field.classList.add('invalid');
      
      // Add error message
      const errorElement = document.createElement('div');
      errorElement.classList.add('error-message');
      errorElement.textContent = message;
      
      // Insert after the field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
  });
}

/**
 * Shows a form message (success or error)
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The message to show
 * @param {string} type - 'success' or 'error'
 */
function showFormMessage(form, message, type) {
  // Remove existing form messages
  form.querySelectorAll('.form-message').forEach(el => el.remove());
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.classList.add('form-message', `form-message-${type}`);
  messageElement.textContent = message;
  
  // Add to the top of the form
  form.prepend(messageElement);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
    setTimeout(() => messageElement.remove(), 500);
  }, 5000);
}

/**
 * Mock form submission (replace with actual API call)
 * @param {Object} formData - The form data
 * @returns {Promise<Object>} Response object
 */
async function mockFormSubmission(formData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 90% success rate for demo
  const success = Math.random() < 0.9;
  
  if (success) {
    return {
      success: true,
      message: 'Thank you! Your submission has been received.'
    };
  } else {
    return {
      success: false,
      message: 'There was a problem with your submission. Please try again.'
    };
  }
}