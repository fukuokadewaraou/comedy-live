// モバイルメニューの開閉
const btn = document.querySelector('.menu-btn');
const drawer = document.getElementById('drawer');

btn?.addEventListener('click', () => {
  const open = drawer.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
  drawer.setAttribute('aria-hidden', String(!open));
});

drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) drawer.classList.remove('open');
});

// 手引き（アコーディオン）
const guideAcc = document.getElementById('guide-acc');
guideAcc?.addEventListener('click', (e) => {
  const t = e.target.closest('.acc-btn');
  if (!t) return;
  const item = t.parentElement;
  const sign = t.querySelector('span');
  const isOpen = item.classList.toggle('open');
  if (sign) sign.textContent = isOpen ? '−' : '＋';
});

// （任意）スクロール時のフェードイン用：必要なら .reveal を各要素に付与して使う
const io = new IntersectionObserver((entries)=>{
  entries.forEach(ent => { if (ent.isIntersecting) ent.target.classList.add('show'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal')?.forEach(el => io.observe(el));
