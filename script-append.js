
// FAQ Toggle Functionality
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(faq => faq.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  }
});
