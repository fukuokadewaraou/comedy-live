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
})();

// ===== 手引き：白カード内蔵アコーディオン（スライド＋フェード） =====
(function(){
  const btns = Array.from(document.querySelectorAll('.tanzaku-wrap .tanzaku'));
  if(!btns.length) return;

  const closeAll = (exceptBtn) => {
    btns.forEach(b=>{
      if(b === exceptBtn) return;
      b.setAttribute('aria-expanded','false');
      const p = b.nextElementSibling;
      if(p && p.classList.contains('tpanel')){
        slideUp(p);
      }
    });
  };

  const slideDown = (el)=>{
    el.hidden = false;
    el.classList.add('show');
    // 自然高さを計測してmax-heightに反映
    const target = el.scrollHeight;
    el.style.maxHeight = target + 'px';
    // 遷移終了後にmax-heightをauto相当に（大きな値）しておく
    el.addEventListener('transitionend', function tidy(e){
      if(e.propertyName === 'max-height'){
        el.style.maxHeight = target + 'px';
        el.removeEventListener('transitionend', tidy);
      }
    });
  };

  const slideUp = (el)=>{
    const current = el.scrollHeight;
    el.style.maxHeight = current + 'px';
    requestAnimationFrame(()=>{
      el.classList.remove('show'); // opacity/paddingを戻す
      el.style.maxHeight = '0px';
    });
    el.addEventListener('transitionend', function done(e){
      if(e.propertyName === 'max-height'){
        el.hidden = true;
        el.removeEventListener('transitionend', done);
      }
    });
  };

  btns.forEach(btn=>{
    const panel = btn.nextElementSibling;
    if(panel && panel.classList.contains('tpanel')) panel.hidden = true;

    btn.addEventListener('click', ()=>{
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if(expanded){
        btn.setAttribute('aria-expanded','false');
        panel && slideUp(panel);
      }else{
        closeAll(btn);
        btn.setAttribute('aria-expanded','true');
        panel && slideDown(panel);
        panel?.scrollIntoView({behavior:'smooth', block:'start', inline:'nearest'});
      }
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
    const step = (w + gap); // SP/PCとも1枚ぶん（PCは3枚見せでも1枚ずつ送る）
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
