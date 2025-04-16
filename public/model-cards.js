document.addEventListener('DOMContentLoaded', () => {
  const modelCards = document.querySelectorAll('.model-card');
  const ctaButton = document.querySelector('.cta-button');

  // Initialize from stored selection
  const storedModel = localStorage.getItem('selectedModel');
  if (storedModel) {
    const matchingCard = document.querySelector(`.model-card[data-model="${storedModel}"]`);
    if (matchingCard) {
      matchingCard.classList.add('selected');
      ctaButton && (ctaButton.textContent = `Try ${matchingCard.querySelector('h2').textContent}`);
    }
  }

  // Handle card selection
  modelCards.forEach(card => {
    card.addEventListener('click', () => {
      const modelType = card.getAttribute('data-model');
      localStorage.setItem('selectedModel', modelType);

      modelCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      ctaButton && (ctaButton.textContent = `Try ${card.querySelector('h2').textContent}`);
    });
  });

  // Handle CTA button
  ctaButton && ctaButton.addEventListener('click', e => {
    const selectedModel = localStorage.getItem('selectedModel');
    if (selectedModel) {
      e.preventDefault();
      window.location.href = `/?model=${selectedModel}`;
    }
  });
});
