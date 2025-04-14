document.addEventListener('DOMContentLoaded', () => {
  // For a simpler, quieter experience, we directly display messages without animations
  const messagesContainer = document.getElementById('messages-container');
  
  if (messagesContainer) {
    // Add a demo user message after a short delay
    setTimeout(() => {
      // Create user message
      const userMessage = document.createElement('div');
      userMessage.classList.add('message', 'user-message');
      userMessage.textContent = 'Tell me about visual harmony';
      messagesContainer.appendChild(userMessage);
      
      // Create AI message after a further delay
      setTimeout(() => {
        const aiMessage = document.createElement('div');
        aiMessage.classList.add('message', 'ai-message');
        aiMessage.textContent = 'Visual harmony is achieved when all elements work together to create a sense of unity and balance. It\'s the perfect tension between form and space.';
        messagesContainer.appendChild(aiMessage);
      }, 1000);
    }, 2000);
  }
});
