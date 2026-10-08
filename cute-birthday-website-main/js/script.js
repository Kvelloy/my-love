/* ================================================================
   PAGE-TO-PAGE BLUR TRANSITION — jalan di SEMUA halaman
================================================================= */
const MUSIC_STORAGE_KEY = 'bgMusicState';

let bgMusic = document.getElementById('bgMusic');

if (!bgMusic){
  bgMusic = document.createElement('audio');
  bgMusic.id = 'bgMusic';
  bgMusic.loop = true;
  bgMusic.preload = 'auto';

  const source = document.createElement('source');
  source.src = 'assets/music.mp3';
  source.type = 'audio/mpeg';

  bgMusic.appendChild(source);
  document.body.appendChild(bgMusic);
}

function saveMusicState(){
  sessionStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify({
    playing: !bgMusic.paused,
    time: bgMusic.currentTime || 0
  }));
}

function startMusic(){
  const savedState = JSON.parse(
    sessionStorage.getItem(MUSIC_STORAGE_KEY) || 'null'
  );

  if (savedState && savedState.time){
    bgMusic.currentTime = savedState.time;
  }

  bgMusic.play().catch(() => {
    // Браузер может заблокировать autoplay.
    // Музыка запустится после первого взаимодействия пользователя.
  });
}

/* Запускаем музыку */
if (bgMusic.readyState >= 1){
  startMusic();
} else {
  bgMusic.addEventListener('loadedmetadata', startMusic, { once: true });
}

/* Если браузер заблокировал autoplay,
   запускаем после первого клика/касания */
document.addEventListener('click', function(){
  if (bgMusic.paused){
    bgMusic.play().catch(() => {});
  }
}, { once: true });

/* Сохраняем позицию перед переходом */
window.addEventListener('beforeunload', saveMusicState);

(function(){
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.classList.remove('blur-in-start');
    });
  });
})();

document.body.addEventListener('click', function(e){
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('http')) return;

  e.preventDefault();
  document.body.classList.add('blur-out');
  if (typeof saveMusicState === 'function') saveMusicState()
  setTimeout(() => { window.location.href = href; }, 550);
});

/* ================================================================
   FLOATING HEARTS & STARS BACKGROUND
   Jalan otomatis di SEMUA halaman selama ada
   <div id="floating-bg"></div> di HTML-nya.
================================================================= */
const floatingBg = document.getElementById('floating-bg');
const floatEmojis = ['💖', '✨', '🩷', '💫', '💙', '💜'];

if (floatingBg){
  function spawnFloaty(){
    const el = document.createElement('div');
    el.className = 'floaty';
    el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (16 + Math.random() * 18) + 'px';
    const duration = 8 + Math.random() * 8;
    el.style.animationDuration = duration + 's';
    floatingBg.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000);
  }
  setInterval(spawnFloaty, 700);
}

/* ================================================================
   TYPEWRITER EFFECT — hanya jalan di letter.html
   -----------------------------------------------------------
   EDIT DI SINI: ganti isi teks di bawah (letterMessage) untuk
   menulis surat ulang tahunmu sendiri. Pakai \n\n untuk ganti
   paragraf baru.
================================================================= */
const letterMessage =
`Жаным,

осындай шексіз естеліктер саған үлкен рахмет!!! Осындай сен сияқты керемет, әдемі, мінсіз қызды кездестіргенім үшін мың алғыспын. Жай сөзбен бұл сезімді жеткізе ала алмаймын әрине. Бірақ, сені кездестіргеннен бері менің өмірім жайнап, көптеген керемет эмоцияларға толықталды. You fill my life everyday with happiness, joy, love and pleasure. You're All I Want. ты 100 из 100, только ты еще прекрасней. 

Мен сені сүйемін❤️
Я тебя люблю❤️
I love you❤️`;

const letterEl = document.getElementById('letter-text');
let typeIndex = 0;

function typeWriter(){
  if (!letterEl) return;
  if (typeIndex < letterMessage.length){
    const chunk = letterMessage.slice(0, typeIndex + 1).replace(/\n/g, '<br>');
    letterEl.innerHTML = chunk + '<span class="cursor">&nbsp;</span>';
    typeIndex++;
    setTimeout(typeWriter, 22);
  } else {
    letterEl.innerHTML = letterMessage.replace(/\n/g, '<br>');
  }
}

/* ================================================================
   CONFETTI EXPLOSION — hanya jalan di letter.html
================================================================= */
const canvas = document.getElementById('confetti-canvas');

if (canvas){
  const ctx = canvas.getContext('2d');
  let confettiPieces = [];
  const confettiColors = ['#ffd6e8', '#ff9fc7', '#d6ecff', '#a8d8ff', '#e6d9ff', '#c7a9ff', '#ffffff'];

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function createConfetti(){
    confettiPieces = [];
    const count = 140;
    for (let i = 0; i < count; i++){
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.5,
        size: 6 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
      });
    }
  }

  let confettiActive = false;
  let confettiFrames = 0;
  const maxConfettiFrames = 260;

  function animateConfetti(){
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiPieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle'){
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });

    confettiFrames++;
    if (confettiFrames < maxConfettiFrames){
      requestAnimationFrame(animateConfetti);
    } else {
      confettiActive = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function fireConfetti(){
    createConfetti();
    confettiActive = true;
    confettiFrames = 0;
    animateConfetti();
  }

  window.addEventListener('load', () => {
    typeWriter();
    fireConfetti();
  });
}