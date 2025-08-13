// canvas 요소를 js로 가져오고, 2d 그리기 환경 구성, ctx를 통해 도형 색, 이미지 그리기
const canvas = document.getElementById('blobCanvas');
const ctx = canvas.getContext('2d', { alpha: true });

// 현재 브라우저 창 크기만큼 canvas 사이즈 설정
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// NEW: 디바이스 픽셀 비율 최적화(과부하 방지용 상한)
//  - 스타일 크기(px)는 뷰포트에 맞추고, 내부 해상도(canvas.width/height)는 DPR을 곱해 선명도 유지
function updateSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // 너무 높으면 과부하 → 1.5 상한
  width = window.innerWidth;
  height = window.innerHeight;

  // 스타일 사이즈(논리 px)
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // 실제 렌더 해상도(물리 px)
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);

  // 논리 좌표로 그릴 수 있게 변환 (ctx가 알아서 스케일 적용)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
updateSize();

// 브라우저 창 크기 변할 때마다 canvas 크기도 자동 조절 이벤트
window.addEventListener('resize', updateSize);

const radius = 420; //원형 반지름, 크기 조절
let angle = 0; //회전 각도 rad 단위, angle은 원을 계속 회전시키기 위한 변수
let showNoise = true; // 노이즈 표시 여부

// 노이즈 캔버스 생성 함수
function createNoiseCanvas(w, h, density = 255, alpha = 35) {
  const noiseCanvas = document.createElement('canvas');
  noiseCanvas.width = w;
  noiseCanvas.height = h;
  const nctx = noiseCanvas.getContext('2d');
  const imageData = nctx.createImageData(w, h);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const rand = Math.random() * density;
    const contrast = rand > 180 ? 255 : 0;
    imageData.data[i] = contrast;
    imageData.data[i + 1] = contrast;
    imageData.data[i + 2] = contrast;
    imageData.data[i + 3] = alpha;
  }
  nctx.putImageData(imageData, 0, 0);
  return noiseCanvas;
}

// 노이즈 텍스처 미리 생성
const noiseTexture = createNoiseCanvas(1000, 1000, 255, 35);

// draw 함수, 매 프레임마다 캔버스 초기화해서 잔상 없게 시작
// NEW: 격프레임으로 노이즈만 렌더(부하 절반)
let frame = 0;
function draw() {
  ctx.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;

  // 회전
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.translate(-centerX, -centerY);

  // 블루 그라데이션 원형
  const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius);
  gradient.addColorStop(0, '#A1E4FF');
  gradient.addColorStop(0.4, '#4DBEFF');
  gradient.addColorStop(0.8, '#1F66C1');
  gradient.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.closePath();

  // 노이즈 덮기 (초기엔 보이지만 나중엔 사라짐)
  if (showNoise && (frame % 2 === 0)) { // NEW: 격프레임만 그림
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
    ctx.clip();

    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.35;
    ctx.drawImage(noiseTexture, centerX - 500, centerY - 500);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
  }

  ctx.restore();

  // 애니메이션 루프
  angle += 0.003;
  frame++;
  requestAnimationFrame(draw);
}

draw();


// visual 섹션에서 확대
gsap.registerPlugin(ScrollTrigger);

gsap.to("#blobCanvas", {
  scale: 1.7, //intro 확대 조절
  ease: "power2.out",
  // NEW: transformOrigin 명시 (가운데 기준 확대)
  transformOrigin: "50% 50%",
  scrollTrigger: {
    trigger: ".visual",
    start: "top top",
    end: "bottom+=800 top",
    scrub: 1.2, // NEW: 살짝 더 자연스럽게
    onUpdate: (self) => {
      if (self.progress > 0.8) {
        showNoise = false;
      } else {
        showNoise = true;
      }
    },
    // NEW: 빠른 스크롤 시 잔상/틱 줄이기
    fastScrollEnd: true,
    invalidateOnRefresh: true
  }
});


// intro 섹션이 끝날 때 canvas 사라지기 (scale+opacity)
// NEW: 충돌 방지 - 여기서는 opacity만 조정 (scale은 위 트리거만 담당)
gsap.to("#blobCanvas", {
  opacity: 0,
  ease: "power1.out",
  scrollTrigger: {
    trigger: ".intro",
    start: "bottom bottom",
    end: "bottom+=300 top",
    scrub: true,
    fastScrollEnd: true,
    invalidateOnRefresh: true
  }
});



/* 1) 화살표 반복 */
const arrows = gsap.timeline({ repeat:-1, defaults:{ duration:0.6, ease:"power2.out" }, delay:0.5 });
arrows
  .fromTo(".arrow1",{ y:-10, opacity:0 },{ y:0, opacity:1 })
  .fromTo(".arrow2",{ y:-10, opacity:0 },{ y:0, opacity:1 },"-=0.3")
  .fromTo(".arrow3",{ y:-10, opacity:0 },{ y:0, opacity:1 },"-=0.3")
  .to(".arrow1",{ y:10, opacity:0 },"+=0.2")
  .to(".arrow2",{ y:10, opacity:0 },"-=0.3")
  .to(".arrow3",{ y:10, opacity:0 },"-=0.3");

/* 2) some 섹션 - 아래→위 스르륵 + 재진입 재생 */
gsap.set(".some .imglist",{ perspective:1000, transformStyle:"preserve-3d" });
gsap.set(".some .imglist .draw",{ transformOrigin:"50% 100%", willChange:"transform,opacity,filter" });

const tlSome = gsap.timeline({
  defaults:{ ease:"power2.out" },
  scrollTrigger:{
    trigger: ".some",
    start: "top 75%",
    end: "bottom 25%",
    toggleActions: "restart reset restart reset", // 들어올 때마다 다시 재생
    invalidateOnRefresh: true                     // 리프레시 시 from 값 재계산
  }
});

// ① 아래에서 위로 스르륵(진짜 이동)
tlSome.fromTo(".some .imglist .draw",
  {
    y: () => gsap.utils.random(200, 300), // ← 출발점 ‘아래’ 크게
    opacity: 0,
    rotateX: () => gsap.utils.random(-18, -10),
    rotateZ: () => gsap.utils.random(-4, 4),
    scale: 0.96,
    filter: "blur(12px)"
  },
  {
    y: 0,
    opacity: 1,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 1.25,
    ease: "power2.out",
    stagger: { each: 0.16, from: "start" },
    immediateRender: false
  }
);

// ② 도착 후 미세한 여운(점프 없음)
tlSome.to(".some .imglist .draw",{
  rotationZ: (i)=> gsap.utils.random(-0.6, 0.6),
  yoyo: true, repeat: 1,
  duration: 0.28,
  ease: "sine.inOut",
  stagger: 0.08
},"-=0.25");




// 메인타이틀 등장 - 마커 제거 + 섹션별 타임라인
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.titlepage, .titlepage_clone, .titlepage_process').forEach((section) => {
  const ennTargets = section.querySelectorAll('.maintitle .enn');
  const bottom = section.querySelector('.bottom');
  if (!ennTargets.length || !bottom) return;

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',    
      end: 'top 30%',     
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true
    }
  })
  .fromTo(
    ennTargets,
    { x: '-100%' },
    { x: '0%', ease: 'none', duration: 5, stagger: 0.05 },
    0
  )
  .fromTo(
    bottom,
    { x: '100%' },
    { x: '0%', ease: 'none', duration: 5},
    0
  );
});




// how 섹션 진입 시 .how-bg가 서서히 나타나기
gsap.to(".how-bg", {
  opacity: 1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".how",
    start: "top center",   // .how 섹션의 top이 화면 중간에 닿을 때
    end: "bottom center",  // 필요시 수정 가능
    scrub: true,
    // markers: true  // 디버깅할 때만 주석 해제
  }
});



// 기본설정
// motion
$(function(){
  $('.animate').scrolla({
    mobile:true,
    once:false
  })
})

//splitting.js
$(function(){
  Splitting();  //대문자로쓴다!!!
});



//스크립트 위로 튕기는것 방지
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});

// header 영역 스크롤 방향 감지 이벤트
$(function(){
  var prevScrollTop = 0;
  document.addEventListener('scroll', function(){
      var nowScrollTop = $(window).scrollTop();

      if(nowScrollTop > prevScrollTop){
          $('header').addClass('active');
      }else {
          $('header').removeClass('active');
      }

      prevScrollTop = nowScrollTop;
  })
});




// journey
$(function () {
  const journey = document.querySelector(".journey");
  const inner   = journey ? journey.querySelector(".inner") : null;
  const textSlides  = document.querySelectorAll(".text-slide");
  const imageSlides = document.querySelectorAll(".image-slide");
  if (!journey || !inner || !textSlides.length || !imageSlides.length) return;

  // 스크롤 길이 = 슬라이드 수 * 100vh (height 대신 min-height만 사용)
  const setJourneyHeight = () => {
    journey.style.minHeight = `${textSlides.length * 100}vh`;
  };
  setJourneyHeight();

  // 활성화 토글
  function activate(index) {
    textSlides.forEach((el, i) => el.classList.toggle("active", i === index));
    imageSlides.forEach((slide, i) => {
      slide.classList.remove("active", "prev", "next");
      if (i === index) slide.classList.add("active");
      else if (i === index - 1) slide.classList.add("prev");
      else if (i === index + 1) slide.classList.add("next");
    });
  }
  // 초기 상태
  activate(0);

  // 1) 섹션 자체를 pin: 마지막 슬라이드 끝날 때까지 고정
  ScrollTrigger.create({
    trigger: journey,
    start: "top top",
    end: () => `+=${textSlides.length * window.innerHeight}`,
    pin: inner,                 // .journey .inner를 고정
    anticipatePin: 1,
    invalidateOnRefresh: true,
    // 필요하면 스냅: 각 슬라이드에 착—착
    // snap: 1 / (textSlides.length - 1)
    // markers: true
  });

  // 2) 슬라이드 전환 트리거 (기존 로직 유지)
  textSlides.forEach((_, i) => {
    ScrollTrigger.create({
      trigger: journey,
      start: () => `top+=${i * window.innerHeight} top`,
      end:   () => `top+=${(i + 1) * window.innerHeight} top`,
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => activate(i),
      onEnterBack: () => activate(i),
      // markers: {startColor: "cyan", endColor: "magenta"}
    });
  });

  // 리사이즈/로드 시 길이 재계산 + 새로고침
  const refreshAll = () => { setJourneyHeight(); ScrollTrigger.refresh(); };
  window.addEventListener("resize", refreshAll);
  window.addEventListener("load",   refreshAll);
});




// work video
document.querySelectorAll('.hover-target .mainimg').forEach(box=>{
  const video=box.querySelector('video.preview'); if(!video) return;
  const container=box.closest('.hover-target');
  const play=()=>{ try{ video.currentTime=0; video.play(); }catch(e){} };
  const stop=()=>{ try{ video.pause(); video.currentTime=0; }catch(e){} };
  // 키보드 접근도 되게 탭 가능하게
  if(!container.hasAttribute('tabindex')) container.setAttribute('tabindex','0');
  container.addEventListener('mouseenter',play);
  container.addEventListener('mouseleave',stop);
  container.addEventListener('focusin',play);
  container.addEventListener('focusout',stop);
  // 터치 대응(모바일): 터치하면 재생, 떼면 정지
  container.addEventListener('touchstart',play,{passive:true});
  container.addEventListener('touchend',stop,{passive:true});
  container.addEventListener('touchcancel',stop,{passive:true});
});





// marquee 스크롤에 따라 속도 달라짐
function initMarquee(selector, direction = 1) {
  const el = document.querySelector(selector);
  const halfWidth = el.scrollWidth / 2;
  let x = direction === 1 ? -halfWidth : 0; // 윗줄도 화면 안에서 시작하게

  let speed = 0;
  let lastScroll = window.scrollY;

  const updateSpeed = () => {
    const currentScroll = window.scrollY;
    const delta = currentScroll - lastScroll;
    speed += delta * 0.4;
    lastScroll = currentScroll;
  };

  const animate = () => {
    x += direction * (1 + speed * 0.1);

    if (direction === 1 && x >= 0) x = -halfWidth;
    if (direction === -1 && x <= -halfWidth) x = 0;

    el.style.transform = `translateX(${x}px)`;
    speed *= 0.9;
    requestAnimationFrame(animate);
  };

  window.addEventListener("scroll", updateSpeed);
  animate();
}

initMarquee(".marquee-track.top .marquee-text", 1);    // 윗줄: 오른쪽으로
initMarquee(".marquee-track.bottom .marquee-text", -1); // 아랫줄: 왼쪽으로




// gallery
(function initGalleryMarquee() {
  const gallery = document.querySelector('.gallery');
  const inner   = gallery?.querySelector('.inner');
  if (!gallery || !inner) return;

  // 혹시 이전에 만든 갤러리 핀이 있으면 제거 (길이 과다의 원인)
  const oldPin = ScrollTrigger.getById('galleryPin');
  if (oldPin) oldPin.kill();

  // 보일 때만 마퀴 동작
  let active = false;
  const io = new IntersectionObserver((entries) => { active = entries[0].isIntersecting; }, { threshold: 0 });
  io.observe(gallery);

  function waitImagesLoaded(boxes) {
    const imgs = boxes.flatMap(box => Array.from(box.querySelectorAll('img')));
    if (!imgs.length) return Promise.resolve();
    return Promise.all(imgs.map(img => img.complete ? Promise.resolve() :
      new Promise(res => img.addEventListener('load', res, { once: true }))));
  }

  async function initColumn(selector, { direction = -1, pxPerSec = 22 } = {}) {
    const col = inner.querySelector(selector);
    if (!col || col.querySelector('.col-track')) return;

    const originals = Array.from(col.querySelectorAll(':scope > .imgbox'));
    if (!originals.length) return;

    await waitImagesLoaded(originals);

    const track = document.createElement('div');
    track.className = 'col-track';
    originals.forEach(n => track.appendChild(n));
    col.appendChild(track);

    const getGap = () => parseFloat(getComputedStyle(track).rowGap) || 0;
    const baseHeights = () => {
      const gap = getGap();
      const items = Array.from(track.children).slice(0, originals.length);
      return items.reduce((sum, el, i) => sum + el.offsetHeight + (i < items.length - 1 ? gap : 0), 0);
    };

    let base = baseHeights();

    // 끊김 방지: 트랙 길이 충분히 확보
    const target = col.clientHeight + base * 1.2;
    while (track.scrollHeight < target) originals.forEach(src => track.appendChild(src.cloneNode(true)));
    base = baseHeights();

    let offset = (direction === 1 ? -base : 0);
    let paused = false;
    col.addEventListener('mouseenter', () => paused = true);
    col.addEventListener('mouseleave', () => paused = false);

    let resizeRAF;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(() => {
        base = baseHeights();
        if (direction === -1) offset = -((Math.abs(offset)) % base);
        else offset = -((base - Math.abs(offset)) % base);
      });
    });

    let last = performance.now();
    function tick(now) {
      const dt = (now - last) / 1000; last = now;
      if (active && !paused && base > 0) {
        const d = pxPerSec * dt;
        if (direction === -1) { offset -= d; if (offset <= -base) offset += base; }
        else { offset += d; if (offset >= 0) offset -= base; }
        track.style.transform = `translateY(${offset}px)`;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  Promise.all([
    initColumn('.left',   { direction: -1, pxPerSec: 32 }),
    initColumn('.right',  { direction: -1, pxPerSec: 35 }),
    initColumn('.center', { direction:  1, pxPerSec: 33 })
  ]).then(() => {
    // 핀을 쓰지 않으므로 갱신만
    ScrollTrigger.refresh();
  });
})();





// coding 작업물 하나씩 등장
gsap.utils.toArray('.coding .worklist li').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 100%", 
      toggleActions: "play none none reverse",
    },
    y: 100, // 아래에서 위로 50px 이동
    opacity: 0, // 투명도 0에서 시작
    duration: 0.5,
    ease: "power2.out",
    delay: i * 0.2 // 순차적으로 등장
  });
});



// process 원형 하나씩 등장
gsap.utils.toArray('.titlepage_process .circlelist li').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: "top 100%", 
      toggleActions: "play none none reverse",
    },
    y: 100, // 아래에서 위로 50px 이동
    opacity: 0, // 투명도 0에서 시작
    duration: 0.5,
    ease: "power2.out",
    delay: i * 0.4 // 순차적으로 등장
  });
});








// mainvideo  scrolltrigger
$(function(){
  gsap.timeline({
      scrollTrigger: {
          trigger: '.video',
          start: '0% 80%',
          end: '100% 100%',
          scrub: 1,
          markers: false
      }
  })
  .fromTo('.videowrap video', {'clip-path': 'inset(60% round 30%'}, {'clip-path': 'inset(0% round 0%', ease: 'none', duration: 10} ,0) //비디오 점점 커지는 효과 ->clip path 사이트 참고 
})



/// Top Button 푸터에서만 보이기
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector('.to-top');
  const footer = document.querySelector('section.footer, .footer, footer'); // 푸터 선택자

  if (!btn || !footer) return;

  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { threshold: 0 }); // footer가 보이는 순간 show

  io.observe(footer);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});



// 마우스 커서
const cursor = document.querySelector('.custom-cursor');
let mx = 0, my = 0, x = 0, y = 0;
const speed = 0.18;

window.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function loop() {
  x += (mx - x) * speed;
  y += (my - y) * speed;
  cursor.style.setProperty('--x', x + 'px');
  cursor.style.setProperty('--y', y + 'px');
  requestAnimationFrame(loop);
}
loop();


// hover 대상 감지
document.querySelectorAll('.hover-target').forEach(target => {
  target.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
  });
  target.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
  });
});




// footer 버튼 효과
// .buttonlist a 안의 p 텍스트를 글자 단위로 span 쪼개고 hover 시 흔들림
document.querySelectorAll('.buttonlist a').forEach((btn) => {
  const p = btn.querySelector('p');
  if (!p) return;

  const text = p.textContent.trim();
  const letters = text.split('');
  const half = letters.length / 2;

  // p 안의 내용을 span들로 교체
  p.innerHTML = letters.map((letter, index) => {
    const part = index >= half ? -1 : 1;
    const position = index >= half ? half - index + (half - 1) : index;
    const move = position / half;
    const rotate = 1 - move;
    const ch = letter.trim() ? letter : '&nbsp;';

    return `<span style="--move:${move};--rotate:${rotate};--part:${part};">${ch}</span>`;
  }).join('');
  // hover in
  btn.addEventListener('mouseenter', () => {
    if (!btn.classList.contains('out')) btn.classList.add('in');
  });
  // hover out
  btn.addEventListener('mouseleave', () => {
    if (btn.classList.contains('in')) {
      btn.classList.add('out');
      setTimeout(() => btn.classList.remove('in', 'out'), 950);
    }
  });
});
// href="#" 클릭 방지
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault();
});




// 전체 스크롤 부드럽게
// Kaitonote 느낌에 맞춘 '탄탄한' 스크롤 프리셋
const lenis = new Lenis({
  duration: 0.78,                 // 기본 1.0보다 짧게 → 끌림 감소, 반응성↑
  easing: (t) => 1 - Math.pow(1 - t, 3), // cubicOut: 초반 가볍고 끝에서 딱 멈춤
  smoothWheel: true,
  wheelMultiplier: 1.18,          // 휠 스텝 반응 조금 키움 (1.1~1.2 권장)
  smoothTouch: false,             // 모바일 과한 관성 방지
  touchMultiplier: 1.0,           // 터치 감도 기본
  gestureDirection: 'vertical'
});

function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

lenis.on('scroll', () => { if (window.ScrollTrigger) ScrollTrigger.update(); });

// 모션 민감 사용자는 자동 약화 (선택)
if (matchMedia('(prefers-reduced-motion: reduce)').matches) lenis.stop();




// header 섹션이동 부드럽게 (Lenis scrollTo만 사용)
(function () {
  const header = document.querySelector('header');
  const pad = 14;
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0) + pad;
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

  // 메뉴 앵커 클릭 → 해당 섹션으로
  document.querySelectorAll('header .menu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();

      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(target, {
          offset: -headerOffset(),
          duration: 1.8,          // ← 더 느리고
          easing: easeOutQuint    // ← 더 부드럽게 멈춤
        });
      } else {
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });



  // 로고 → 맨 위로
  const logo = document.querySelector('header .logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(0, { duration: 1.4, easing: easeOutQuint });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
})();

