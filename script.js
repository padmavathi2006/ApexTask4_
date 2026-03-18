// ===== PROJECT SWITCHER =====
function showProject(name, btn) {
  document.querySelectorAll('.project-section').forEach(s => s.style.display = 'none');
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(name).style.display = 'block';
  btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (name === 'products') applyFilters();
  if (name === 'todo') renderTasks();
  if (name === 'portfolio') startTyping();
}

// ===== PORTFOLIO =====
function toggleMenu() { document.getElementById('navLinks').classList.toggle('open'); }
function closeMenu() { document.getElementById('navLinks').classList.remove('open'); }

// ===== SMOOTH SCROLL WITH OFFSET =====
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const targetId = link.getAttribute('href').slice(1);
  const target = document.getElementById(targetId);
  if (!target) return;
  const offset = 130;
  const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
  closeMenu();
});

// ===== TYPING EFFECT =====
const roles = ['Web Developer', 'Frontend Designer', 'Python Enthusiast', 'Problem Solver', 'Tech Explorer'];
let roleIdx = 0, charIdx = 0, deleting = false, typingTimer = null;

function startTyping() {
  clearTimeout(typingTimer); charIdx = 0; roleIdx = 0; deleting = false; typeNext();
}
function typeNext() {
  const el = document.getElementById('heroRole');
  if (!el) return;
  const current = roles[roleIdx];
  el.textContent = deleting ? current.substring(0, charIdx - 1) : current.substring(0, charIdx + 1);
  deleting ? charIdx-- : charIdx++;
  if (!deleting && charIdx === current.length) { deleting = true; typingTimer = setTimeout(typeNext, 2000); return; }
  if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  typingTimer = setTimeout(typeNext, deleting ? 60 : 110);
}

// ===== CONTACT FORM =====
function submitContact(e) {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const msg = document.getElementById('formMsg');
  msg.style.color = '#6ee7b7';
  msg.textContent = `Thank you, ${name}! Your message has been sent to Padmavathi. 💌`;
  e.target.reset();
  setTimeout(() => { msg.textContent = ''; }, 5000);
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const els = document.querySelectorAll('#portfolio .project-card, #portfolio .stat, #portfolio .skill-item');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }, i * 100);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
  });
}

// ===== TODO APP =====
let tasks = [], currentFilter = 'all';

function saveTasks() { localStorage.setItem('padmavathi_tasks', JSON.stringify(tasks)); }
function loadTasks() { const s = localStorage.getItem('padmavathi_tasks'); if (s) tasks = JSON.parse(s); }

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const text = input.value.trim();
  if (!text) { input.style.borderColor = '#fca5a5'; setTimeout(() => input.style.borderColor = '', 1200); return; }
  tasks.unshift({ id: Date.now(), text, priority, completed: false });
  saveTasks(); renderTasks(); input.value = ''; input.focus();
}

function toggleTask(id) { const t = tasks.find(t => t.id === id); if (t) { t.completed = !t.completed; saveTasks(); renderTasks(); } }
function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); saveTasks(); renderTasks(); }
function clearCompleted() { tasks = tasks.filter(t => !t.completed); saveTasks(); renderTasks(); }

function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); renderTasks();
}

function escapeHTML(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderTasks() {
  const list = document.getElementById('taskList');
  const emptyMsg = document.getElementById('emptyMsg');
  if (!list) return;
  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);
  list.innerHTML = '';
  emptyMsg.classList.toggle('visible', filtered.length === 0);
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}`;
    li.innerHTML = `
      <div class="task-check" onclick="toggleTask(${task.id})">${task.completed ? '✓' : ''}</div>
      <span class="task-text">${escapeHTML(task.text)}</span>
      <span class="task-priority priority-${task.priority}">${task.priority}</span>
      <button class="task-delete" onclick="deleteTask(${task.id})">✕</button>`;
    list.appendChild(li);
  });
  document.getElementById('totalCount').textContent = tasks.length;
  document.getElementById('activeCount').textContent = tasks.filter(t => !t.completed).length;
  document.getElementById('doneCount').textContent = tasks.filter(t => t.completed).length;
}

// ===== PRODUCT LISTING =====
const products = [
  { id:1,  name:'Wireless Headphones',  category:'electronics', price:2499, rating:4.5, emoji:'🎧', desc:'Premium noise-cancelling wireless headphones with 30hr battery.' },
  { id:2,  name:'Smart Watch',          category:'electronics', price:3999, rating:4.7, emoji:'⌚', desc:'Fitness tracking, heart rate monitor, and notifications.' },
  { id:3,  name:'Bluetooth Speaker',    category:'electronics', price:1499, rating:4.2, emoji:'🔊', desc:'Portable waterproof speaker with 360° sound.' },
  { id:4,  name:'USB-C Hub',            category:'electronics', price:899,  rating:4.0, emoji:'🔌', desc:'7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.' },
  { id:5,  name:'Laptop Stand',         category:'electronics', price:699,  rating:4.3, emoji:'💻', desc:'Adjustable aluminum laptop stand for better ergonomics.' },
  { id:6,  name:'Cotton T-Shirt',       category:'clothing',    price:349,  rating:4.1, emoji:'👕', desc:'Soft 100% cotton crew neck t-shirt, available in 8 colors.' },
  { id:7,  name:'Denim Jacket',         category:'clothing',    price:1799, rating:4.4, emoji:'🧥', desc:'Classic denim jacket with modern slim fit design.' },
  { id:8,  name:'Running Shoes',        category:'clothing',    price:2299, rating:4.6, emoji:'👟', desc:'Lightweight breathable running shoes with cushioned sole.' },
  { id:9,  name:'Winter Scarf',         category:'clothing',    price:499,  rating:3.9, emoji:'🧣', desc:'Warm woolen scarf, perfect for cold weather.' },
  { id:10, name:'JavaScript Guide',     category:'books',       price:399,  rating:4.8, emoji:'📗', desc:'Complete guide to modern JavaScript and ES6+ features.' },
  { id:11, name:'CSS Mastery',          category:'books',       price:349,  rating:4.5, emoji:'📘', desc:'Advanced CSS techniques, Flexbox, Grid and animations.' },
  { id:12, name:'Desk Lamp',            category:'home',        price:799,  rating:4.3, emoji:'💡', desc:'LED desk lamp with adjustable brightness and USB charging port.' },
  { id:13, name:'Coffee Maker',         category:'home',        price:2199, rating:4.6, emoji:'☕', desc:'Automatic coffee maker with programmable timer.' },
  { id:14, name:'Plant Pot Set',        category:'home',        price:649,  rating:4.2, emoji:'🪴', desc:'Set of 3 ceramic plant pots with drainage holes.' },
  { id:15, name:'Wall Clock',           category:'home',        price:599,  rating:4.0, emoji:'🕐', desc:'Minimalist wooden wall clock with silent quartz movement.' },
];

function getStars(r) { const f=Math.floor(r),h=r%1>=0.5?'½':'',e=5-f-(h?1:0); return '★'.repeat(f)+h+'☆'.repeat(e); }

function applyFilters() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const maxPrice = parseInt(document.getElementById('priceFilter')?.value || 5000);
  const sort = document.getElementById('sortSelect')?.value || 'default';
  let filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search)) &&
    (category === 'all' || p.category === category) && p.price <= maxPrice
  );
  if (sort==='price-asc') filtered.sort((a,b)=>a.price-b.price);
  else if (sort==='price-desc') filtered.sort((a,b)=>b.price-a.price);
  else if (sort==='rating-desc') filtered.sort((a,b)=>b.rating-a.rating);
  else if (sort==='name-asc') filtered.sort((a,b)=>a.name.localeCompare(b.name));
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  document.getElementById('resultCount').textContent = `Showing ${filtered.length} product${filtered.length!==1?'s':''}`;
  grid.innerHTML = '';
  document.getElementById('noResults').classList.toggle('visible', filtered.length===0);
  filtered.forEach((p,i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${i*0.04}s`;
    card.innerHTML = `
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">₹${p.price.toLocaleString()}</div>
          <div class="product-rating"><span class="stars">${getStars(p.rating)}</span><span class="rating-num">${p.rating}</span></div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function updatePrice() { document.getElementById('priceLabel').textContent = parseInt(document.getElementById('priceFilter').value).toLocaleString(); }

function resetFilters() {
  document.getElementById('searchInput').value='';
  document.getElementById('categoryFilter').value='all';
  document.getElementById('priceFilter').value=5000;
  document.getElementById('sortSelect').value='default';
  document.getElementById('priceLabel').textContent='5,000';
  applyFilters();
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  loadTasks(); renderTasks(); startTyping(); initScrollReveal();
  document.getElementById('taskInput')?.addEventListener('keydown', e => { if(e.key==='Enter') addTask(); });
});