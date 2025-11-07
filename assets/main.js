
// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');
if (toggle && menu){
  toggle.addEventListener('click', ()=> menu.classList.toggle('hidden'));
}

// Smooth scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1 && document.querySelector(id)){
      e.preventDefault();
      document.querySelector(id).scrollIntoView({behavior:'smooth'});
    }
  });
});
