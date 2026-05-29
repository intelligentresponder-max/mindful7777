function setLang(l) {
  var blocks = document.querySelectorAll('.lang');
  blocks.forEach(function(el, i) {
    el.style.display = (i === (l === 'de' ? 1 : 0)) ? 'none' : '';
  });
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === l);
  });
  localStorage.setItem('m7_lang', l);
}
document.addEventListener('DOMContentLoaded', function() {
  var l = localStorage.getItem('m7_lang') || 'de';
  setLang(l);
});
