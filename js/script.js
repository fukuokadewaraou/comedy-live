// ========== ハンバーガー / ドロワー ==========
(function(){
  const btn     = document.querySelector('.menu-btn');
  const drawer  = document.getElementById('drawer');
  const panel   = drawer ? drawer.querySelector('.drawer-panel') : null;
  const closeBtn= drawer ? drawer.querySelector('.drawer-close') : null;
  const links   = drawer ? drawer.querySelectorAll('.drawer-link') : [];

  function open(){
    if (!drawer) return;
    drawer.classList.add('open');
    document.body.classList.add('no-scroll');
  }
  function closeWithAnimation(){
    if (!drawer || !panel) return;
    if (!drawer.classList.contains('open')) return;
    if (panel.classList.contains('closing')) return;
    panel.classList.add('closing');
    const onEnd = () => {
      panel.classList.remove('closing');
      drawer.classList.remove('open');
      document.body.classList.remove('no-scroll');
      panel.removeEventListener('animationend', onEnd);
    };
    panel.addEventListener('animationend', onEnd);
  }

  btn && btn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', closeWithAnimation);
  drawer && drawer.addEventListener('click', (e)=>{ if (e.target === drawer) closeWithAnimation(); });
  links.forEach(a => a.addEventListener('click', closeWithAnimation));
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeWithAnimation(); });
})();

// ========== 手引き（アコーディオン） ==========
(function(){
  const acc = document.getElementById('guide-acc');
  if (!acc) return;
  acc.addEventListener('click', (e)=>{
    const btn = e.target.closest('.acc-btn');
    if (!btn) return;
    const item = btn.parentElement;
    const sign = btn.querySelector('span');
    const isOpen = item.classList.toggle('open');
    if (sign) sign.textContent = isOpen ? '−' : '＋';
  });
})();

// ========== インタビュー・カルーセル（自動＋左右ボタン） ==========
(function(){
  const root = document.querySelector('#interviews .carousel, #featured-interviews .carousel');
  if (!root) return;

  const viewport = root.querySelector('.carousel-viewport');
  const track    = root.querySelector('.carousel-track');
  const btnPrev  = root.querySelector('.carousel-btn.prev');
  const btnNext  = root.querySelector('.carousel-btn.next');

  // 実スライド（最初の状態）
  let cards = Array.from(track.children);
  if (!cards.length) return;

  // 無限ループ用に前後を複製（1枚ずつ）
  const first = cards[0].cloneNode(true);
  const last  = cards[cards.length - 1].cloneNode(true);
  track.insertBefore(last, cards[0]);
  track.appendChild(first);

  // 再取得
  cards = Array.from(track.children); // [last(clone), real1, real2, ..., realN, first(clone)]
  let index = 1; // real1 から開始
  let slideWidth = 0;
  let gap = 16;
  let centerOffset = 0;
  let timer = null;
  const interval = Number(root.getAttribute('data-interval') || 4000);
  const autoplay = root.getAttribute('data-autoplay') !== 'false';

  function measure(){
    const real = track.children[1]; // real1
    const rect = real.getBoundingClientRect();
    slideWidth = rect.width;

    const stylesTrack = getComputedStyle(track);
    gap = parseFloat(stylesTrack.columnGap || stylesTrack.gap) || 16;

    const stylesVp = getComputedStyle(viewport);
    const vpWidth  = viewport.getBoundingClientRect().width;
    const padLeft  = parseFloat(stylesVp.paddingLeft) || 0;

    centerOffset = (vpWidth - slideWidth)/2 - padLeft;

    // 初期配置
    moveTo(index, false);
    markCenter();
  }

  function moveTo(i, animate=true){
    if (!animate) track.style.transition = 'none';
    const x = -(i * (slideWidth + gap)) + centerOffset;
    track.style.transform = `translateX(${x}px)`;
    if (!animate){
      requestAnimationFrame(()=>{ track.style.transition = 'transform .5s ease'; });
    }
  }

  function markCenter(){
    Array.from(track.children).forEach(el => el.classList.remove('is-center'));
    const el = track.children[index];
    if (el) el.classList.add('is-center');
  }

  function next(){ index++; moveTo(index, true); }
  function prev(){ index--; moveTo(index, true); }

  track.addEventListener('transitionend', ()=>{
    const total = track.children.length;
    if (index === total - 1){ // last is first-clone
      index = 1; moveTo(index, false);
    }else if (index === 0){   // first is last-clone
      index = total - 2; moveTo(index, false);
    }
    markCenter();
  });

  btnNext && btnNext.addEventListener('click', ()=>{ stop(); next(); start(); });
  btnPrev && btnPrev.addEventListener('click', ()=>{ stop(); prev(); start(); });

  function start(){ if (autoplay){ stop(); timer = setInterval(next, interval); } }
  function stop(){ if (timer){ clearInterval(timer); timer = null; } }

  window.addEventListener('resize', measure, { passive:true });

  // 初期化
  measure();
  start();
})();
