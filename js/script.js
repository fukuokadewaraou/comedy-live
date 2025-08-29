// ===== のれんイントロ：再生＆外す =====
(function(){
  const intro = document.querySelector('.noren-intro');
  if(!intro) return;
  document.body.classList.add('no-scroll');
  requestAnimationFrame(()=> intro.classList.add('play'));
  // 総尺 ~5.2s でDOMから除去
  setTimeout(()=>{
    intro.remove();
    document.body.classList.remove('no-scroll');
  }, 5200);
})();

// ===== ハンバーガーの開閉 =====
(function(){
  const burger = document.querySelector('.burger');
  const drawer = document.getElementById('drawer');
  const closeBtn = drawer?.querySelector('.drawer-close');
  const links = drawer?.querySelectorAll('.drawer-link');

  function open(){
    drawer.classList.add('open');
    burger.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }
  function close(){
    const panel = drawer.querySelector('.drawer-panel');
    panel.classList.add('closing');
    setTimeout(()=>{
      drawer.classList.remove('open');
      panel.classList.remove('closing');
      burger.setAttribute('aria-expanded','false');
      drawer.setAttribute('aria-hidden','true');
      document.body.classList.remove('no-scroll');
    }, 180);
  }
  burger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  drawer?.addEventListener('click', e => { if(e.target === drawer) close(); });
  links?.forEach(a => a.addEventListener('click', close));
})();

// ===== 手引き：横ボタンのアコーディオン =====
(function(){
  document.querySelectorAll('.gitem .ghead').forEach(head=>{
    head.addEventListener('click', ()=>{
      const item = head.closest('.gitem');
      const open = item.classList.contains('open');
      // 他を閉じる
      document.querySelectorAll('.gitem.open').forEach(it=>{
        if(it!==item) it.classList.remove('open');
      });
      // 自分をトグル
      item.classList.toggle('open', !open);
      // ＋／− 表示
      const plus = head.querySelector('.gplus');
      if(plus) plus.textContent = (!open ? '−' : '＋');
    });
  });
})();

// ===== インタビュー：カルーセル（自動＆左右ボタン） =====
(function(){
  const root = document.querySelector('.carousel');
  if(!root) return;
  const track = root.querySelector('.carousel-track');
  const cards = Array.from(root.querySelectorAll('.carousel-card'));
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  const interval = Number(root.dataset.interval || 4000);

  let index = 0;
  function update(i){
    index = (i + cards.length) % cards.length;
    const w = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    const step = w + gap; // PCもSPも同じ式（カード幅はCSS側で変化）
    track.style.transform = `translateX(${-index * step}px)`;
  }
  prev.addEventListener('click', ()=> update(index-1));
  next.addEventListener('click', ()=> update(index+1));
  window.addEventListener('resize', ()=> update(index));

  let timer = null;
  function play(){ stop(); timer = setInterval(()=> update(index+1), interval); }
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }

  if(root.dataset.autoplay === 'true') play();
  update(0);
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
})();

// ===== ハンバーガーの色を背景に合わせて自動切替（赤地ではクリーム色） =====
(function(){
  const burger = document.querySelector('.burger');
  if(!burger) return;
  const options = { root: null, threshold: 0.4 };
  function onIntersect(entries){
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        burger.classList.add('burger--light');
      }else{
        burger.classList.remove('burger--light');
      }
    });
  }
  document.querySelectorAll('.red-bg').forEach(sec=>{
    const io = new IntersectionObserver(onIntersect, options);
    io.observe(sec);
  });
})();
