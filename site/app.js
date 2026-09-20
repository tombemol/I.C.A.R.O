document.getElementById('year').textContent = new Date().getFullYear();

const header = document.querySelector('.nav-shell');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
