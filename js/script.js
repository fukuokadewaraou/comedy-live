// ===== のれんイントロ：再生→外す =====
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

// ===== ハンバーガー =====
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

  // 背景色によってバーの色を切り替える（赤ゾーン上ならクリーム）
  const redSections = document.querySelectorAll('.red-bg, .interviews');
  const io = new IntersectionObserver((entries)=>{
    // 画面上部に赤ゾーンが一定割合入ったら light を付与
    const onRed = entries.some(en => en.isIntersecting && en.intersectionRatio > 0.2);
    burger.classList.toggle('light', onRed);
  }, {threshold:[0.0,0.2,0.4,0.6,0.8,1.0]});
  redSections.forEach(sec => io.observe(sec));
})();

// ===== 手引き：横書きボタンの簡易アコーディオン =====
(function(){
  document.querySelectorAll('.guide-toggle').forEach(btn=>{
    const row = btn.closest('.guide-row');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      row.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded; // trueなら閉じる
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
    const step = w + gap; // PCは3枚幅に応じてCSSで調整される
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
