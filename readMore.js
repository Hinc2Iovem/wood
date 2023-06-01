const readMoreBtns = document.querySelectorAll('.read-more-btn');

readMoreBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const showThis = this.parentElement.querySelector('.read-more-text');
    if (showThis.classList.contains('show')) {
      showThis.classList.remove('show');
      this.textContent = 'Читать полностью...';
    } else {
      showThis.classList.add('show');
      this.textContent = 'Скрыть';
    }
  })
});