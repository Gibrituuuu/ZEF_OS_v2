let quizBgRunning = true;

const QUIZ = [
  { q: "в каком году познакомились Зефун и Руби?", opts: ["2022", "2023", "2024", "2025"], a: 2 },
  { q: "в какой игре всё началось?", opts: ["REPO", "CS2", "Lethal Company", "Minecraft"], a: 2 },
  { q: "примерно сколько часов вы провели вместе в игре?", opts: ["50+", "100+", "200+", "500+"], a: 2 },
  { q: "это уже какой сайт от Руби?", opts: ["первый", "второй", "третий", "четвёртый"], a: 1 },
  { q: "прошлый сайт был сделан на какой праздник?", opts: ["новый год", "8 марта и день рождения", "14 февраля", "просто так"], a: 1 },
  { q: "что писалось при первом клике на подарок?", opts: ["'подарок внутри!'", "'нету ручек — нет конфетки'", "'ошибка 404'", "'попробуй ещё раз'"], a: 1 },
  { q: "как называлась нарезка на новый год?", opts: ["'Спасибо за лето & RuBi.mp4'", "'Лучшее лето.mp4'", "'Memories.mp4'", "'LC_moments.mp4'"], a: 0 },
  { q: "какую игру Руби советовал — но так и не поиграла?", opts: ["REPO", "Lethal Company", "Black Mesa", "Minecraft"], a: 2 },
  { q: "какая игра нравится Зефун больше всего?", opts: ["CS2", "REPO", "Lethal Company", "Zort"], a: 1 },
  { q: "какой трек Руби сделал специально для Зефун?", opts: ["Doom Eternal", "Japan4", "Phonk Zefuun", "AngelCore"], a: 2 },
  { q: "какой последний трек выпустил Руби?", opts: ["Dream Bound", "Black Mesa V2", "Japan4", "Empty"], a: 3 },
  { q: "какой трек Руби — любимый у Зефун?", opts: ["Doom Eternal", "Dream Bound", "AngelCore", "Phonk Zefuun"], a: 1 },
];

let quizIdx = 0;
let quizErrors = 0;
const MAX_ERRORS = 5;

function renderQuiz() {
  const body = document.getElementById('quiz-body');
  const err = document.getElementById('quiz-error');
  err.textContent = '';

  if (quizIdx >= QUIZ.length) {
    body.innerHTML = `
      <div class="quiz-finish">
        <div class="quiz-finish-title">доступ разрешён ✦</div>
        <div class="quiz-finish-sub">ну раз уж ты это прошла...<br>добро пожаловать, Зефун.</div>
        <div class="quiz-finish-sub" style="margin-top:8px; color:#c95f3a; font-size:0.9rem; letter-spacing:1px">последний вопрос</div>
        <div class="quiz-finish-sub" style="color:#c8c0b8; font-size:1rem; margin-top:4px">какую тему хочешь?</div>
        <div class="quiz-finish-sub" style="font-size:0.8rem; color:#5a5450; margin-top:2px">сайт сделан в основном для тёмной — советую её.<br>но выбор твой. переключить можно всегда — кнопка внизу на панели.</div>
        <div style="display:flex; gap:14px; justify-content:center; margin-top:16px">
          <button class="quiz-opt" id="theme-dark" style="border-color:#c95f3a; color:#c95f3a">🌙 тёмная</button>
          <button class="quiz-opt" id="theme-light" style="border-color:#9a9088; color:#9a9088">☀️ светлая</button>
        </div>
      </div>`;

    document.getElementById('theme-dark').addEventListener('click', () => {
      document.body.classList.add('dark');
      document.getElementById('theme-toggle').textContent = '🌙';
      launchOS();
    });
    document.getElementById('theme-light').addEventListener('click', () => {
      document.body.classList.remove('dark');
      document.getElementById('theme-toggle').textContent = '☀️';
      launchOS();
    });
    return;
  }

  const q = QUIZ[quizIdx];
  const pct = (quizIdx / QUIZ.length) * 100;

  body.innerHTML = `
    <div class="quiz-progress">
      <span>вопрос ${quizIdx + 1} / ${QUIZ.length}</span>
      <span>${quizIdx > 0 ? '✓ '.repeat(quizIdx) : 'начинаем'}</span>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o, i) => `<button class="quiz-opt" data-i="${i}">${o}</button>`).join('')}
    </div>`;

  body.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', e => {
      const chosen = parseInt(btn.dataset.i);
      if (chosen === q.a) {
        btn.classList.add('correct');
        document.getElementById('quiz-error').textContent = '';
        if (window.quizCorrectBurst) window.quizCorrectBurst(e.clientX, e.clientY);
        setTimeout(() => { quizIdx++; renderQuiz(); }, 600);
      } else {
        btn.classList.add('wrong');
        quizErrors++;
        const msgs = [
          'попытка 1',
          'попытка 2',
          `осталось 3`,
          `осталось 2`,
          'последний шанс, брат!',
        ];
        err.textContent = msgs[Math.min(quizErrors - 1, msgs.length - 1)];

        if (quizErrors > MAX_ERRORS) {
          const screen = document.getElementById('quiz-screen');
          screen.classList.add('glitch-crash');

          setTimeout(() => {
            screen.classList.remove('glitch-crash');
            screen.style.background = '#000';

            const canvas = document.getElementById('quiz-bg-canvas');
            if (canvas) canvas.style.display = 'none';
            const scanlines = document.querySelector('.quiz-scanlines');
            if (scanlines) scanlines.style.display = 'none';

            document.getElementById('quiz-box').style.display = 'none';

            const msg = document.createElement('div');
            msg.style.cssText = `
              position: absolute;
              top: 50%; left: 50%;
              transform: translate(-50%, -50%);
              font-family: 'JetBrains Mono', monospace;
              font-size: 22px;
              color: #c95f3a;
              letter-spacing: 3px;
              text-align: center;
              line-height: 2.2;
            `;
            msg.innerHTML = `ДОСТУП ЗАПРЕЩЁН<br><span style="font-size:14px;color:#3a3530;letter-spacing:1px">слишком много ошибок. ты точно Зефун?<br>обнови страницу чтобы попробовать снова</span>`;
            screen.appendChild(msg);

            quizBgRunning = false;
            if (window._starInterval) clearInterval(window._starInterval);
          }, 1500);
          return;
        }
      }
    });
  });
}

function launchOS() {
  const qs = document.getElementById('quiz-screen');
  const mp = document.getElementById('music-player');
  const boot = document.getElementById('boot');
  
  boot.style.display = 'flex';
  setTimeout(() => boot.classList.remove('hide'), 10);

  qs.classList.add('hide');
  if (mp && mp.classList.contains('quiz-mode')) {
    mp.style.transition = 'opacity 0.7s ease';
    mp.style.opacity = '0';
  }
  quizBgRunning = false;
  if (window._starInterval) clearInterval(window._starInterval);
  setTimeout(() => {
    qs.style.display = 'none';
    if (mp && mp.classList.contains('quiz-mode')) {
      mp.style.display = 'none';
    }
    runBoot();
  }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function enterFS() {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen && el.requestFullscreen();
    }
    document.removeEventListener('click', enterFS);
  }, { once: true });
  
  const delays = [
    { id: 'gl1', delay: 600 },
    { id: 'gl2', delay: 1400 },
    { id: 'gl3', delay: 3200 },
    { id: 'gl4', delay: 4000 },
    { id: 'gl5', delay: 4700 },
  ];
  delays.forEach(({ id, delay }) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('show');
    }, delay);
  });

  const gateYes = document.getElementById('gate-yes');
  if (gateYes) {
    gateYes.addEventListener('click', () => {
      const gate = document.getElementById('quiz-gate');
      const qs = document.getElementById('quiz-screen');
      gate.classList.add('fade-out');
      setTimeout(() => {
        gate.style.display = 'none';
        showMusicScreen();
      }, 500);
    });
  } else {
    console.error('gate-yes element NOT FOUND');
  }

  let noCount = 0;
  document.getElementById('gate-no').addEventListener('click', () => {
    const btn = document.getElementById('gate-no');
    noCount++;

    if (noCount === 1) {
      btn.textContent = 'серьёфно фтоли??';
    } else if (noCount === 2) {
      btn.textContent = 'ну и кто ты тогда?';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 1500);
    } else if (noCount === 3) {
      const btns = document.getElementById('gl5');
      btns.style.opacity = '0';
      setTimeout(() => {
        btns.innerHTML = `
          <button class="gate-btn gate-yes" id="gate-yes2">дааа я Зефун</button>
          <button class="gate-btn gate-no"  id="gate-no2">нееет я не Зефун</button>
        `;
        btns.style.transition = 'opacity 0.6s ease';
        btns.style.opacity = '1';
        document.getElementById('gate-yes2').addEventListener('click', () => {
          crashSite();
        });
        document.getElementById('gate-no2').addEventListener('click', () => crashSite());
      }, 400);
    }
  });

  function crashSite() {
    const screen = document.getElementById('quiz-screen');
    screen.classList.add('glitch-crash');

    setTimeout(() => {
      screen.classList.remove('glitch-crash');
      screen.style.background = '#000';
      const canvas = document.getElementById('quiz-bg-canvas');
      if (canvas) canvas.style.display = 'none';
      const scanlines = document.querySelector('.quiz-scanlines');
      if (scanlines) scanlines.style.display = 'none';
      document.getElementById('quiz-gate').style.display = 'none';

      const msg = document.createElement('div');
      msg.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 22px;
      color: #c95f3a;
      letter-spacing: 3px;
      text-align: center;
    `;
      msg.textContent = 'ДОСТУП ЗАПРЕЩЁН';
      screen.appendChild(msg);

      quizBgRunning = false;
      if (window._starInterval) clearInterval(window._starInterval);
    }, 1500);
  }
});

const GALLERY_FILES = window.GALLERY_FILES || [];

const README_TEXT =
  `Зефун,

ты говорила — не надо ничего.
я помню.

но блин.

как не надо, если надо?

это не подарок, это просто...
ну вот. сайт. снова.
потому что иначе не умею.

с днём рождения, крейзи-вумен. 🌿

— Руби`;

(function initQuizBg() {
  const canvas = document.getElementById('quiz-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let mouseX = -9999, mouseY = -9999;

  const COUNT = 10000;
  const dots = [];

  function makeDot() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    return {
      x, y, homeX: x, homeY: y,
      r: Math.random() * 1.2 + 0.3,
      vx: 0, vy: 0,
      driftX: (Math.random() - 0.5) * 0.08,
      driftY: (Math.random() - 0.5) * 0.08,
      alpha: Math.random() * 0.5 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
    };
  }
  for (let i = 0; i < COUNT; i++) dots.push(makeDot());

  function resize() {
    const sw = canvas.width || window.innerWidth;
    const sh = canvas.height || window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const sx = canvas.width / sw;
    const sy = canvas.height / sh;
    dots.forEach(d => {
      if (d.burst) return;
      d.x *= sx; d.y *= sy;
      d.homeX *= sx; d.homeY *= sy;
    });
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  window.quizCorrectBurst = function (cx, cy) {
    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * Math.random() * 15 + 1;
      const life = 20 + Math.random() * 80;
      dots.push({
        x: cx, y: cy,
        homeX: cx, homeY: cy,
        r: Math.random() * 1.5 + 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        burst: true,
        life: life,
        maxLife: life,
        friction: 0.85 + Math.random() * 0.12
      });
    }
  };

  const stars = [];
  function spawnStar() {
    const qs = document.getElementById('quiz-screen');
    if (!qs || qs.style.display === 'none') return;
    const W = canvas.width;
    stars.push({
      x: Math.random() * W,
      y: -10,
      len: 70 + Math.random() * 90,
      speed: 2.5 + Math.random() * 2,
      angle: Math.PI / 2 + (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }
  window._starInterval = setInterval(spawnStar, 2200);

  function drawFrame() {
    if (!quizBgRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i];

      const mdx = d.x - mouseX;
      const mdy = d.y - mouseY;
      const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < 120 && md > 0) {
        const f = (120 - md) / 120 * 2.2;
        d.vx += (mdx / md) * f;
        d.vy += (mdy / md) * f;
      }

      if (d.burst) {
        d.life--;
        d.alpha = d.life / (d.maxLife || 80);
        if (d.life <= 0) { dots.splice(i, 1); continue; }
        d.vx *= (d.friction || 0.80); d.vy *= (d.friction || 0.80);
        d.x += d.vx; d.y += d.vy;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,200,80,${d.alpha})`;
        ctx.fill();
      } else {
        d.vx += (d.homeX - d.x) * 0.018;
        d.vy += (d.homeY - d.y) * 0.018;
        d.vx *= 0.85; d.vy *= 0.85;
        d.x += d.vx; d.y += d.vy;

        d.homeX += d.driftX;
        d.homeY += d.driftY;
        if (d.homeX < 0 || d.homeX > canvas.width) d.driftX *= -1;
        if (d.homeY < 0 || d.homeY > canvas.height) d.driftY *= -1;

        d.twinklePhase += d.twinkleSpeed;
        d.alpha = d.baseAlpha + Math.sin(d.twinklePhase) * 0.25;
        d.alpha = Math.max(0.05, Math.min(1, d.alpha));

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,215,200,${d.alpha})`;
        ctx.fill();
      }
    }

    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.016;
      if (s.life <= 0) { stars.splice(i, 1); continue; }
      const tail = { x: s.x - Math.cos(s.angle) * s.len, y: s.y - Math.sin(s.angle) * s.len };
      const grad = ctx.createLinearGradient(s.x, s.y, tail.x, tail.y);
      grad.addColorStop(0, `rgba(255,220,120,${s.life * 0.95})`);
      grad.addColorStop(1, 'rgba(255,220,120,0)');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tail.x, tail.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    requestAnimationFrame(drawFrame);
  }
  drawFrame();
  window._restartQuizBg = function() {
    if (!quizBgRunning) { quizBgRunning = true; drawFrame(); }
  };
})();

function runBoot() {
  const lines = document.querySelectorAll('.boot-line');
  const bar = document.getElementById('boot-bar');
  const boot = document.getElementById('boot');
  const desktop = document.getElementById('desktop');

  lines.forEach(line => {
    const delay = parseInt(line.dataset.delay || 0);
    setTimeout(() => line.classList.add('show'), delay);
  });

  let pct = 0;
  const barTimer = setInterval(() => {
    pct = Math.min(pct + Math.random() * 1.5 + 0.3, 100);
    bar.style.width = pct + '%';
    if (pct >= 100) clearInterval(barTimer);
  }, 50);

  setTimeout(() => {
    boot.classList.add('hide');
    setTimeout(() => {
      boot.style.display = 'none';
      desktop.classList.add('show');
      
      const mp = document.getElementById('music-player');
      const wp = document.getElementById('win-player-body');
      if (mp && wp) {
        mp.classList.remove('quiz-mode');
        mp.style.transition = '';
        mp.style.opacity = '1';
        wp.appendChild(mp);
        mp.style.display = '';
        mp.style.zIndex = '';
      }
      
      initDesktop();
      showWelcomeToast();
    }, 800);
  }, 5800);
}

function updateClock() {
  const el = document.getElementById('tb-clock');
  if (!el) return;
  const n = new Date();
  const time = String(n.getHours()).padStart(2,'0') + ':' + String(n.getMinutes()).padStart(2,'0');
  const days = ['вс','пн','вт','ср','чт','пт','сб'];
  const day = days[n.getDay()];
  const date = String(n.getDate()).padStart(2,'0') + '.' + String(n.getMonth()+1).padStart(2,'0');
  el.innerHTML = `<span style="color:var(--text-muted);font-size:10px">${day} ${date}</span><br>${time}`;
}
setInterval(updateClock, 10000);
updateClock();

let winZTop = 200;

function getWorkArea() {
  const tbH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--taskbar-h')) || 38;
  return { w: window.innerWidth, h: window.innerHeight - tbH };
}

function clampWindow(win) {
  const wa = getWorkArea();
  let l = parseInt(win.style.left) || 0;
  let t = parseInt(win.style.top) || 0;
  l = Math.max(0, Math.min(l, wa.w - 60));
  t = Math.max(0, Math.min(t, wa.h - 32));
  win.style.left = l + 'px';
  win.style.top = t + 'px';
}

function focusWindow(id) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.add('focused');
  win.style.zIndex = ++winZTop;
  updateTaskbar();
}

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (!win.classList.contains('open')) {
    const wa = getWorkArea();
    const openN = document.querySelectorAll('.window.open').length;
    const baseT = Math.min(40 + openN * 24, wa.h - 200);
    const baseL = Math.min(140 + openN * 24, wa.w - 340);
    const hasPos = win.style.top || win.style.left || getComputedStyle(win).right !== 'auto';
    if (!hasPos || win.style.top === '0px') {
      win.style.top = baseT + 'px';
      win.style.left = baseL + 'px';
    }
    win.classList.add('open');
    clampWindow(win);

    if (id === 'win-readme') initReadme();
    if (id === 'win-memories') initMemories();
    if (id === 'win-video') initVideo();
    if (id === 'win-wallpaper') initWallpaper();
    if (id === 'win-moon') loadThreeJS(initMoon);
    if (id === 'win-about') initAbout();
  }
  focusWindow(id);
}

function closeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.remove('open', 'focused', 'maximized');
  if (id === 'win-video') {
    const container = win.querySelector('#video-container');
    if (container) {
      const iframe = container.querySelector('iframe');
      if (iframe) iframe.remove();
      const warn = container.querySelector('.video-warning');
      if (warn) warn.remove();
      const ph = document.getElementById('video-placeholder');
      if (ph) ph.style.display = '';
    }
  }
  if (id === 'win-game') stopGame();
  updateTaskbar();
}

function minimizeWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  win.classList.remove('open', 'focused');
  updateTaskbar();
}

function toggleMaximize(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.classList.contains('maximized')) {
    win.classList.remove('maximized');
    win.style.top = win.dataset.prevTop || '40px';
    win.style.left = win.dataset.prevLeft || '140px';
    win.style.width = win.dataset.prevW || '';
    win.style.height = win.dataset.prevH || '';
    win.style.borderRadius = '';
  } else {
    win.dataset.prevTop = win.style.top;
    win.dataset.prevLeft = win.style.left;
    win.dataset.prevW = win.style.width;
    win.dataset.prevH = win.style.height;
    win.classList.add('maximized');
  }
  focusWindow(id);
}

const TASK_LABELS = {
  'win-video': '🎬 video',
  'win-readme': '📄 readme',
  'win-memories': '🖼️ gallery',
  'win-game': '🎮 zefun',
  'win-about': '🖥️ о сист.',
  'win-error': '⚠️ ошибка',
  'win-moon': '🌙 луна',
};
function updateTaskbar() {
  const c = document.getElementById('taskbar-tasks');
  c.innerHTML = '';
  document.querySelectorAll('.window.open').forEach(win => {
    const btn = document.createElement('div');
    btn.className = 'tb-task' + (win.classList.contains('focused') ? ' active' : '');
    btn.textContent = TASK_LABELS[win.id] || win.id;
    btn.addEventListener('click', () => {
      if (win.classList.contains('focused')) minimizeWindow(win.id);
      else openWindow(win.id);
    });
    c.appendChild(btn);
  });
}

function makeDraggable(win) {
  const tb = win.querySelector('.titlebar');
  if (!tb) return;
  let dragging = false, sx, sy, ol, ot;

  function start(cx, cy) {
    if (win.classList.contains('maximized')) return;
    dragging = true; sx = cx; sy = cy;
    ol = parseInt(win.style.left) || 0;
    ot = parseInt(win.style.top) || 0;
    focusWindow(win.id);
  }
  function move(cx, cy) {
    if (!dragging) return;
    const wa = getWorkArea();
    win.style.left = Math.max(0, Math.min(ol + cx - sx, wa.w - 60)) + 'px';
    win.style.top = Math.max(0, Math.min(ot + cy - sy, wa.h - 32)) + 'px';
  }
  function stop() { dragging = false; }

  tb.addEventListener('mousedown', e => { if (!e.target.classList.contains('tbtn')) { start(e.clientX, e.clientY); e.preventDefault(); } });
  tb.addEventListener('touchstart', e => { if (!e.target.classList.contains('tbtn')) { const t = e.touches[0]; start(t.clientX, t.clientY); } }, { passive: true });
  document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive: true });
  document.addEventListener('mouseup', stop);
  document.addEventListener('touchend', stop);
}

function initVideo() {
  const container = document.getElementById('video-container');
  const oldIframe = container.querySelector('iframe');
  if (oldIframe) oldIframe.remove();
  const oldWarning = container.querySelector('.video-warning');
  if (oldWarning) oldWarning.remove();
  const ph = document.getElementById('video-placeholder');
  if (ph) ph.style.display = '';

  const warning = document.createElement('div');
  warning.className = 'video-warning';
  warning.style.cssText = `
    position:absolute; inset:0;
    background:rgba(0,0,0,0);
    display:flex; align-items:center; justify-content:center;
    z-index:10; transition: background 1.2s ease;
    font-family:'JetBrains Mono',monospace;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background:rgba(13,12,11,0.97);
    border:1px solid #c95f3a;
    border-radius:6px;
    padding:28px 32px;
    max-width:420px;
    width:90%;
    text-align:center;
    display:flex; flex-direction:column; gap:18px;
    opacity:0; transform:translateY(12px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  `;

  let step = 0;

  const STEPS = [
    {
      title: '⚠️ ВНИМАНИЕ',
      text: 'Нажимая кнопку <b>ДАЛЬШЕ</b>, ты Зефун соглашаешься с моей политикой просмотра этого видео.',
      btn: 'ДАЛЬШЕ',
      btn2: null,
    },
    {
      title: '🎬 ПОЛИТИКА ПРОСМОТРА',
      text: 'Это видео я делал давно, но недавно доработал — и вложил в него много сил.<br>Очень не хочется чтобы что-то помешало тебе его прочувствовать.<br><br>📌 В видео есть светлые моменты, тёмные сцены и быстрая смена кадров.<br><br>Прошу тебя:<br>— уделить <b>5 минут</b> только этому<br>— развернуть на весь экран<br>— убрать всё что может отвлечь<br><br>И да... я знаю что ты сейчас всей душой ненавидишь Илюху.<br>Но на момент создания всё было хорошо — так что прошу не злиться во время просмотра, а просто посмотреть видик и всё. 🌿',
      btn: 'ГОТОВА',
      btn2: 'нет, не сейчас',
    },
    {
      title: '📺 КАК СМОТРЕТЬ?',
      text: 'Я рекомендую <b>Google Drive</b> — видео откроется прямо здесь, внутри сайта, со своей атмосферой. Качество при этом почти не теряется.<br><br><span style="color:#5a9e5a">✅ Google Drive</span> — открывается здесь, атмосферно, качество хорошее.<br>Перед просмотром: останови, подожди 10 сек, поставь <b>1080p</b>.<br><br><span style="color:#9a9088">↗ YouTube</span> — откроется в новой вкладке, без атмосферы сайта. Выбирай только если Drive совсем не грузит.',
      btn: '▶ Google Drive',
      btn2: '↗ YouTube',
    },
  ];

  function renderStep() {
    const s = STEPS[step];
    box.innerHTML = `
      <div style="color:#c95f3a;font-size:15px;letter-spacing:2px;font-weight:700">${s.title}</div>
      <div style="color:#e8e4de;font-size:13px;line-height:2">${s.text}</div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:4px">
        <button class="dialog-btn primary" id="vw-btn1" style="font-size:12px;padding:8px 20px">${s.btn}</button>
        ${s.btn2 ? `<button class="dialog-btn" id="vw-btn2" style="font-size:12px;padding:8px 20px">${s.btn2}</button>` : ''}
      </div>
    `;

    box.querySelector('#vw-btn1').addEventListener('click', () => {
      if (step === 0) { step++; renderStep(); }
      else if (step === 1) { step++; renderStep(); }
      else if (step === 2) {
        loadVideo('drive');
      }
    });

    const btn2 = box.querySelector('#vw-btn2');
    if (btn2) {
      btn2.addEventListener('click', () => {
        if (step === 1) {
          closeWindow('win-video');
        } else if (step === 2) {
          loadVideo('youtube');
        }
      });
    }
  }

  function showBackToPlayerBtn() {
    const old = document.getElementById('back-to-player-btn');
    if (old) old.remove();

    const winEl = document.getElementById('win-video');
    const btn = document.createElement('button');
    btn.id = 'back-to-player-btn';
    btn.innerHTML = '↩ вернуться к выбору плеера?';
    btn.style.cssText = `
      display: block;
      margin: 10px auto 4px auto;
      background: rgba(13,12,11,0.92);
      border: 1px solid rgba(200,169,110,0.35);
      color: rgba(200,169,110,0.75);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 1.5px;
      padding: 8px 22px;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.22s ease;
      backdrop-filter: blur(6px);
      position: relative;
      z-index: 5;
    `;
    btn.onmouseenter = () => {
      btn.style.borderColor = '#c8a96e';
      btn.style.color = '#e2c98a';
      btn.style.boxShadow = '0 4px 18px rgba(200,169,110,0.18)';
      btn.style.transform = 'translateY(-1px)';
    };
    btn.onmouseleave = () => {
      btn.style.borderColor = 'rgba(200,169,110,0.35)';
      btn.style.color = 'rgba(200,169,110,0.75)';
      btn.style.boxShadow = 'none';
      btn.style.transform = 'translateY(0)';
    };
    btn.addEventListener('click', () => {
      btn.remove();
      const existingIframe = container.querySelector('iframe');
      if (existingIframe) existingIframe.remove();
      const ph = document.getElementById('video-placeholder');
      if (ph) ph.style.display = '';
      initVideoPlayerChoice();
    });

    const winBody = winEl.querySelector('.win-body');
    winEl.insertBefore(btn, winBody.nextSibling);
  }

  function loadVideo(source) {
    warning.style.background = 'rgba(0,0,0,0)';
    box.style.opacity = '0';
    box.style.transform = 'translateY(12px)';
    setTimeout(() => {
      warning.remove();
      if (source === 'youtube') {
        window.open('https://youtu.be/KhfCigTa7I4', '_blank');
        const ph = document.getElementById('video-placeholder');
        if (ph) ph.style.display = '';
        showBackToPlayerBtn();
        return;
      }
      const placeholder = document.getElementById('video-placeholder');
      if (placeholder) placeholder.style.display = 'none';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://drive.google.com/file/d/1dpaBZYc-CsDhSPtnptJyzqa0CFtdBaJv/preview';
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
      showBackToPlayerBtn();
    }, 600);
  }

  container.style.position = 'relative';
  container.appendChild(warning);

  setTimeout(() => {
    warning.style.background = 'rgba(0,0,0,0.85)';
    renderStep();
    warning.appendChild(box);
    setTimeout(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
    }, 100);
  }, 400);
}

function initVideoPlayerChoice() {
  const container = document.getElementById('video-container');

  const warning = document.createElement('div');
  warning.className = 'video-warning';
  warning.style.cssText = `
    position:absolute; inset:0;
    background:rgba(0,0,0,0);
    display:flex; align-items:center; justify-content:center;
    z-index:10; transition: background 1.2s ease;
    font-family:'JetBrains Mono',monospace;
  `;

  const box = document.createElement('div');
  box.style.cssText = `
    background:rgba(13,12,11,0.97);
    border:1px solid #c95f3a;
    border-radius:6px;
    padding:28px 32px;
    max-width:420px;
    width:90%;
    text-align:center;
    display:flex; flex-direction:column; gap:18px;
    opacity:0; transform:translateY(12px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  `;

  function loadVideoAgain(source) {
    warning.style.background = 'rgba(0,0,0,0)';
    box.style.opacity = '0';
    setTimeout(() => {
      warning.remove();
      if (source === 'youtube') {
        window.open('https://youtu.be/KhfCigTa7I4', '_blank');
        const ph = document.getElementById('video-placeholder');
        if (ph) ph.style.display = '';
        showChoiceBackBtn();
        return;
      }
      const ph = document.getElementById('video-placeholder');
      if (ph) ph.style.display = 'none';
      const iframe = document.createElement('iframe');
      iframe.src = 'https://drive.google.com/file/d/1dpaBZYc-CsDhSPtnptJyzqa0CFtdBaJv/preview';
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
      showChoiceBackBtn();
    }, 400);
  }

  function showChoiceBackBtn() {
    const old = document.getElementById('back-to-player-btn');
    if (old) old.remove();
    const winEl = document.getElementById('win-video');
    const btn = document.createElement('button');
    btn.id = 'back-to-player-btn';
    btn.innerHTML = '↩ вернуться к выбору плеера?';
    btn.style.cssText = `
      display: block;
      margin: 10px auto 4px auto;
      background: rgba(13,12,11,0.92);
      border: 1px solid rgba(200,169,110,0.35);
      color: rgba(200,169,110,0.75);
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      letter-spacing: 1.5px;
      padding: 8px 22px;
      border-radius: 999px;
      cursor: pointer;
      transition: all 0.22s ease;
      backdrop-filter: blur(6px);
    `;
    btn.onmouseenter = () => { btn.style.borderColor='#c8a96e'; btn.style.color='#e2c98a'; btn.style.transform='translateY(-1px)'; };
    btn.onmouseleave = () => { btn.style.borderColor='rgba(200,169,110,0.35)'; btn.style.color='rgba(200,169,110,0.75)'; btn.style.transform='translateY(0)'; };
    btn.addEventListener('click', () => {
      btn.remove();
      const existingIframe = container.querySelector('iframe');
      if (existingIframe) existingIframe.remove();
      const ph = document.getElementById('video-placeholder');
      if (ph) ph.style.display = '';
      initVideoPlayerChoice();
    });
    const winBody = winEl.querySelector('.win-body');
    winEl.insertBefore(btn, winBody.nextSibling);
  }

  box.innerHTML = `
    <div style="color:#c95f3a;font-size:15px;letter-spacing:2px;font-weight:700">📺 КАК СМОТРЕТЬ?</div>
    <div style="color:#e8e4de;font-size:13px;line-height:2">
      Выбери плеер заново:<br><br>
      <span style="color:#5a9e5a">✅ Google Drive</span> — открывается здесь, атмосферно.<br>
      <span style="color:#9a9088">↗ YouTube</span> — откроется в новой вкладке.
    </div>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:4px">
      <button class="dialog-btn primary" id="vpc-drive" style="font-size:12px;padding:8px 20px">▶ Google Drive</button>
      <button class="dialog-btn" id="vpc-youtube" style="font-size:12px;padding:8px 20px">↗ YouTube</button>
    </div>
  `;

  container.style.position = 'relative';
  container.appendChild(warning);

  setTimeout(() => {
    warning.style.background = 'rgba(0,0,0,0.85)';
    warning.appendChild(box);
    setTimeout(() => {
      box.style.opacity = '1';
      box.style.transform = 'translateY(0)';
      box.querySelector('#vpc-drive').addEventListener('click', () => loadVideoAgain('drive'));
      box.querySelector('#vpc-youtube').addEventListener('click', () => loadVideoAgain('youtube'));
    }, 100);
  }, 200);
}

function initReadme() {
  const el = document.getElementById('notepad-text');
  if (el.dataset.typed) return;
  el.dataset.typed = '1';
  el.innerHTML = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  el.appendChild(cursor);
  let i = 0;
  function typeNext() {
    if (i >= README_TEXT.length) return;
    const ch = README_TEXT[i++];
    el.insertBefore(document.createTextNode(ch), cursor);
    setTimeout(typeNext, ch === '\n' ? 60 : Math.random() * 30 + 18);
  }
  setTimeout(typeNext, 300);
}

function initMemories() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '';
  GALLERY_FILES.forEach(file => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    const img = document.createElement('img');
    img.src = 'gallery/' + file;
    img.alt = file;
    img.loading = 'lazy';
    const cap = document.createElement('span');
    cap.className = 'gallery-item-caption';
    cap.textContent = file;
    item.appendChild(img);
    item.appendChild(cap);
    item.addEventListener('click', () => showLightbox('gallery/' + file, file, GALLERY_FILES.indexOf(file)));
    grid.appendChild(item);
  });
}

let lbIndex = 0;
let lbFiles = [];

function showLightbox(src, filename, index) {
  lbIndex = index !== undefined ? index : 0;
  lbFiles = GALLERY_FILES;
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-caption').textContent = filename || '';
  document.getElementById('lightbox').classList.add('show');
}

function lbNavigate(dir) {
  lbIndex = (lbIndex + dir + lbFiles.length) % lbFiles.length;
  const file = lbFiles[lbIndex];
  document.getElementById('lb-img').src = 'gallery/' + file;
  document.getElementById('lb-caption').textContent = file;
}
document.getElementById('lb-close').addEventListener('click', () => document.getElementById('lightbox').classList.remove('show'));
document.getElementById('lightbox').addEventListener('click', e => { if (e.target === e.currentTarget) e.currentTarget.classList.remove('show'); });
document.getElementById('lb-prev').addEventListener('click', e => { e.stopPropagation(); lbNavigate(-1); });
document.getElementById('lb-next').addEventListener('click', e => { e.stopPropagation(); lbNavigate(1); });
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('show')) return;
  if (e.key === 'ArrowLeft') lbNavigate(-1);
  if (e.key === 'ArrowRight') lbNavigate(1);
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('show');
});

let shooterRunning = false;
let shooterAF = null;

document.getElementById('shooter-start').addEventListener('click', startShooter);

function startShooter() {
  shooterRunning = true;
  shooterAF = null;
  
  const canvas = document.getElementById('shooterCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 480;
  const overlay = document.getElementById('shooter-overlay');
  const hud = document.getElementById('shooter-hud');
  if (overlay) overlay.style.display = 'none';
  if (hud) hud.style.display = 'flex';
  const hpEl = document.getElementById('sh-hp');
  const waveEl = document.getElementById('sh-wave');
  const scoreEl = document.getElementById('sh-score');
  const upgrades = {
    speed:    { level: 0, max: 5, label: '⚡ скорость',    desc: '+0.4 к скорости движения' },
    damage:   { level: 0, max: 5, label: '🔥 урон',        desc: 'тройной выстрел раньше' },
    fireRate: { level: 0, max: 5, label: '🔫 скорострельность', desc: '-2 кулдаун выстрела' },
    hp:       { level: 0, max: 3, label: '❤️ здоровье',    desc: '+1 макс HP' },
    magnet:   { level: 0, max: 3, label: '🧲 магнит',      desc: 'притягивает очки' },
    bullet:   { level: 0, max: 4, label: '💥 размер пули', desc: '+2 радиус пули' },
    pierce:   { level: 0, max: 3, label: '🌀 пробитие',    desc: 'пуля не исчезает при попадании' },
  };
  let xp = 0, xpToLevel = 5, playerLevel = 1;
  let maxHp = 3;
  let player = { x: canvas.width / 2, y: canvas.height / 2, r: 12, hp: maxHp, speed: 2.8 };
  let enemies = [];
  let bullets = [];
  let particles = [];
  let points = [];
  let wave = 1;
  let waveTimer = 0;
  let waveBreak = false;
  let mouseX = player.x, mouseY = player.y;
  let shootCD = 0;
  let score = 0;

  const W = canvas.width, H = canvas.height;

  const gridCanvas = document.createElement('canvas');
  gridCanvas.width = W; gridCanvas.height = H;
  const gctx = gridCanvas.getContext('2d');
  gctx.strokeStyle = 'rgba(201,95,58,0.06)';
  gctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { gctx.beginPath(); gctx.moveTo(x, 0); gctx.lineTo(x, H); gctx.stroke(); }
  for (let y = 0; y < H; y += 40) { gctx.beginPath(); gctx.moveTo(0, y); gctx.lineTo(W, y); gctx.stroke(); }

  player = { x: W / 2, y: H / 2, r: 14, speed: 2.8, hp: 3, angle: 0, vx: 0, vy: 0, iframes: 0 };
  let frameN = 0;
  const keys = {};

  const onKey = e => { keys[e.code] = e.type === 'keydown'; };
  window.addEventListener('keydown', onKey);
  window.addEventListener('keyup', onKey);

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouseX = (e.clientX - r.left) * (W / r.width);
    mouseY = (e.clientY - r.top) * (H / r.height);
  });
  canvas.addEventListener('mousedown', e => { if (e.button === 0) shoot(); });

  let touchShootInterval = null;
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0], r = canvas.getBoundingClientRect();
    mouseX = (t.clientX - r.left) * (W / r.width);
    mouseY = (t.clientY - r.top) * (H / r.height);
    touchShootInterval = setInterval(shoot, 180);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0], r = canvas.getBoundingClientRect();
    mouseX = (t.clientX - r.left) * (W / r.width);
    mouseY = (t.clientY - r.top) * (H / r.height);
  }, { passive: false });
  canvas.addEventListener('touchend', () => clearInterval(touchShootInterval));

  function shoot() {
    if (shootCD > 0) return;
    shootCD = Math.max(4, 12 - upgrades.fireRate.level * 2);
    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
    const spread = (wave >= 3 || upgrades.damage.level >= 2) ? [-0.12, 0, 0.12] : [0];
    const bSize = 4 + upgrades.bullet.level * 2;
    spread.forEach(off => bullets.push({
      x: player.x, y: player.y,
      vx: Math.cos(angle + off) * 7, vy: Math.sin(angle + off) * 7,
      r: bSize, life: 60, friendly: true,
      pierce: upgrades.pierce.level > 0, pierceLeft: upgrades.pierce.level
    }));
    spawnParticles(player.x, player.y, '#c8962a', 3, 2);
  }

  function spawnWave(w) {
    const count = 3 + w * 2;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const side = Math.floor(Math.random() * 4);
        let ex, ey;
        if (side === 0) { ex = Math.random() * W; ey = -20; }
        else if (side === 1) { ex = W + 20; ey = Math.random() * H; }
        else if (side === 2) { ex = Math.random() * W; ey = H + 20; }
        else { ex = -20; ey = Math.random() * H; }
        const types = ['basic', 'fast', 'tank', 'bomber'];
        const type = w <= 1 ? 'basic' : w <= 2 ? (Math.random() < .5 ? 'basic' : 'fast') : types[Math.floor(Math.random() * types.length)];
        const cfg = {
          basic: { emoji: '🐦', hp: 1, maxHp: 1, speed: 0.7 + w * .05, r: 14, pts: 10, shoot: false },
          fast: { emoji: '🦅', hp: 1, maxHp: 1, speed: 1.4 + w * .07, r: 12, pts: 15, shoot: false },
          tank: { emoji: '🦆', hp: 4, maxHp: 4, speed: 0.5, r: 18, pts: 30, shoot: false },
          bomber: { emoji: '💀', hp: 2, maxHp: 2, speed: 0.85, r: 14, pts: 25, shoot: true },
        };
        enemies.push({ x: ex, y: ey, ...cfg[type], shootCD: 80 + Math.random() * 60 });
      }, i * 300);
    }
  }

  function spawnParticles(x, y, color, n, speed) {
    if (particles.length > 200) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = speed * (.5 + Math.random());
      particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 20 + Math.random() * 15, color, r: 2 + Math.random() * 2 });
    }
  }

  function showUpgradeScreen() {
  const available = Object.entries(upgrades)
    .filter(([k, u]) => u.level < u.max)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const overlay = document.createElement('div');
  overlay.id = 'upgrade-overlay';
  overlay.style.cssText = `
    position:absolute; inset:0; z-index:20;
    background:rgba(10,10,10,0.92);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:18px;
    font-family:'JetBrains Mono',monospace;
  `;
  overlay.innerHTML = `
    <div style="color:#c95f3a;font-size:16px;letter-spacing:3px;font-weight:700">ПРОКАЧКА</div>
    <div style="color:#5a5450;font-size:10px;letter-spacing:1px">волна ${wave} пройдена · выбери улучшение</div>
    <div id="upgrade-cards" style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;padding:0 16px"></div>
    <div style="color:#3a3530;font-size:9px">уровень персонажа: ${playerLevel}</div>
  `;

  function resume() {
    overlay.remove();
    waveBreak = false;
    waveTimer = 0;
    wave++;
    spawnWave(wave);
    const waveEl = document.getElementById('sh-wave');
    if (waveEl) waveEl.textContent = wave;
    shooterRunning = true;
    shooterAF = requestAnimationFrame(loop);
  }

  const cards = overlay.querySelector('#upgrade-cards');
  if (available.length === 0) {
    cards.innerHTML = `<div style="color:#c8962a;font-size:12px">все улучшения максимальны ✦</div>`;
    setTimeout(resume, 2000);
  } else {
    available.forEach(([key, upg]) => {
      const card = document.createElement('div');
      card.style.cssText = `
        width:140px; padding:16px 12px;
        background:#1a1714; border:1px solid #38342e;
        border-radius:6px; cursor:pointer; text-align:center;
        transition:border-color 0.15s, transform 0.12s;
        display:flex; flex-direction:column; gap:8px;
      `;
      card.innerHTML = `
        <div style="font-size:22px">${upg.label.split(' ')[0]}</div>
        <div style="color:#c8c0b8;font-size:11px;letter-spacing:1px">${upg.label.slice(2)}</div>
        <div style="color:#5a5450;font-size:9px;line-height:1.5">${upg.desc}</div>
        <div style="color:#c95f3a;font-size:9px">ур. ${upg.level} → ${upg.level + 1} / ${upg.max}</div>
      `;
      card.addEventListener('mouseenter', () => { card.style.borderColor = '#c95f3a'; card.style.transform = 'scale(1.04)'; });
      card.addEventListener('mouseleave', () => { card.style.borderColor = '#38342e'; card.style.transform = 'none'; });
      card.addEventListener('click', () => {
        upg.level++;
        playerLevel++;
        if (key === 'speed') player.speed = 2.8 + upgrades.speed.level * 0.4;
        if (key === 'hp') { maxHp++; player.hp = Math.min(player.hp + 1, maxHp); const h = document.getElementById('sh-hp'); if(h) h.textContent = '❤️'.repeat(player.hp); }
        resume();
      });
      cards.appendChild(card);
    });
  }

  document.getElementById('shooter-wrap').appendChild(overlay);
}

  function loop() {
    if (!shooterRunning) return;
    frameN++; if (shootCD > 0) shootCD--; if (player.iframes > 0) player.iframes--;

    player.vx = 0; player.vy = 0;
    if (keys['KeyW'] || keys['ArrowUp']) player.vy = -player.speed;
    if (keys['KeyS'] || keys['ArrowDown']) player.vy = player.speed;
    if (keys['KeyA'] || keys['ArrowLeft']) player.vx = -player.speed;
    if (keys['KeyD'] || keys['ArrowRight']) player.vx = player.speed;
    if (player.vx && player.vy) { player.vx *= .707; player.vy *= .707; }
    player.x = Math.max(player.r, Math.min(W - player.r, player.x + player.vx));
    player.y = Math.max(player.r, Math.min(H - player.r, player.y + player.vy));
    player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);

    if (enemies.length === 0 && !waveBreak) {
      waveBreak = true;
      if (wave % 2 === 0) {
        waveTimer = 99999;
        shooterRunning = false;
        cancelAnimationFrame(shooterAF);
        setTimeout(() => showUpgradeScreen(), 600);
      } else {
        waveTimer = 100;
      }
    }
    if (waveBreak && waveTimer !== 99999) {
      waveTimer--;
      if (waveTimer <= 0) {
        waveBreak = false;
        wave++;
        spawnWave(wave);
        if (waveEl) waveEl.textContent = wave;
      }
    }
    const lvlEl = document.getElementById('sh-level');
    if (lvlEl) lvlEl.textContent = playerLevel;

    for (let ei = enemies.length - 1; ei >= 0; ei--) {
    const e = enemies[ei];
    const dx = player.x - e.x, dy = player.y - e.y, d = Math.sqrt(dx * dx + dy * dy);
    e.x += (dx / d) * e.speed; e.y += (dy / d) * e.speed;
    if (e.shoot) {
      e.shootCD--;
      if (e.shootCD <= 0) {
        e.shootCD = 90 + Math.random() * 60;
        const ang = Math.atan2(dy, dx), inac = (Math.random() - .5) * .3;
        bullets.push({ x: e.x, y: e.y, vx: Math.cos(ang + inac) * 3.5, vy: Math.sin(ang + inac) * 3.5, r: 5, life: 90, friendly: false });
      }
    }
    if (player.iframes === 0 && d < player.r + e.r) {
      player.hp--;
      player.iframes = 60;
      if (hpEl) hpEl.textContent = '❤️'.repeat(Math.max(0, player.hp));
      spawnParticles(player.x, player.y, '#c95f3a', 8, 3);
      if (player.hp <= 0) {
        shooterRunning = false;
        endShooter(canvas, ctx, score, onKey);
        return;
      }
    }
  }

    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      if (!b.friendly) continue;
      for (let ei = enemies.length - 1; ei >= 0; ei--) {
        const e = enemies[ei];
        const dx = b.x - e.x, dy = b.y - e.y;
        if (dx * dx + dy * dy < (b.r + e.r) * (b.r + e.r)) {
          e.hp--;
          spawnParticles(e.x, e.y, '#c8962a', 5, 2.5);
          if (e.hp <= 0) {
            score += e.pts;
            spawnParticles(e.x, e.y, '#e8e4de', 10, 3);
            const scoreEl = document.getElementById('sh-score');
            if (scoreEl) scoreEl.textContent = score;
            enemies.splice(ei, 1);
          }
          if (b.pierce && b.pierceLeft > 0) {
            b.pierceLeft--;
          } else {
            bullets.splice(bi, 1);
          }
          break;
        }
      }
    }

    bullets = bullets.filter(b => {
      b.x += b.vx; b.y += b.vy; b.life--;
      if (b.life <= 0 || b.x < -10 || b.x > W + 10 || b.y < -10 || b.y > H + 10) return false;
      if (!b.friendly) {
        const dx = b.x - player.x, dy = b.y - player.y;
        if (player.iframes === 0 && dx * dx + dy * dy < (b.r + player.r) * (b.r + player.r)) {
          player.hp--; player.iframes = 60;
          const hpEl = document.getElementById('sh-hp');
          if (hpEl) hpEl.textContent = '❤️'.repeat(Math.max(0, player.hp));
          spawnParticles(player.x, player.y, '#c95f3a', 8, 3);
          if (player.hp <= 0) endShooter(canvas, ctx, score, onKey);
          return false;
        }
      }
      return true;
    });

    particles = particles.filter(p => { p.x += p.vx; p.y += p.vy; p.vx *= .92; p.vy *= .92; p.life--; return p.life > 0; });

    ctx.fillStyle = '#0d0b0a'; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(gridCanvas, 0, 0);

    particles.forEach(p => {
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#c95f3a';
    bullets.filter(b => !b.friendly).forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });

    ctx.shadowColor = '#c8962a'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#f0d080';
    bullets.filter(b => b.friendly).forEach(b => {
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0;

    ctx.font = '22px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    enemies.forEach(e => {
      if (e.hp > 1) {
        const bw = 28, bh = 3;
        ctx.fillStyle = '#3a3530'; ctx.fillRect(e.x - bw / 2, e.y - e.r - 7, bw, bh);
        ctx.fillStyle = '#5a9e5a'; ctx.fillRect(e.x - bw / 2, e.y - e.r - 7, bw * (e.hp / e.maxHp), bh);
      }
      ctx.fillStyle = '#e8e4de';
      ctx.fillText(e.emoji, e.x, e.y);
    });

    ctx.save();
    ctx.translate(player.x, player.y); ctx.rotate(player.angle);
    if (player.iframes > 0 && Math.floor(player.iframes / 6) % 2 === 0) ctx.globalAlpha = .4;
    ctx.shadowColor = wave >= 3 ? '#c95f3a' : '#9a9088'; ctx.shadowBlur = 12;
    ctx.font = '26px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🛸', 0, 0);
    ctx.restore();

    ctx.strokeStyle = 'rgba(240,208,128,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mouseX - 10, mouseY); ctx.lineTo(mouseX + 10, mouseY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mouseX, mouseY - 10); ctx.lineTo(mouseX, mouseY + 10); ctx.stroke();
    ctx.beginPath(); ctx.arc(mouseX, mouseY, 5, 0, Math.PI * 2); ctx.stroke();

    if (waveBreak && waveTimer < 90) {
      ctx.globalAlpha = Math.min(1, (90 - waveTimer) / 20);
      ctx.font = 'bold 1.3rem JetBrains Mono,monospace'; ctx.fillStyle = '#c8962a'; ctx.textAlign = 'center';
      ctx.fillText(`ВОЛНА ${wave} ПРОЙДЕНА`, W / 2, H / 2);
      ctx.globalAlpha = 1;
    }

    if (shooterRunning) shooterAF = requestAnimationFrame(loop);
  }

  spawnWave(1);
  document.getElementById('sh-wave').textContent = 1;
  document.getElementById('sh-score').textContent = 0;
  document.getElementById('sh-hp').textContent = '❤️❤️❤️';
  shooterAF = requestAnimationFrame(loop);
}

function endShooter(canvas, ctx, finalScore, onKey) {
  shooterRunning = false;
  cancelAnimationFrame(shooterAF);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('keyup', onKey);
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = 'rgba(10,10,10,0.92)'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#c95f3a'; ctx.font = 'bold 18px JetBrains Mono,monospace';
  ctx.textAlign = 'center'; ctx.fillText('GAME OVER', W / 2, H / 2 - 36);
  ctx.fillStyle = '#e8e4de'; ctx.font = '12px JetBrains Mono,monospace';
  ctx.fillText('Счёт: ' + finalScore, W / 2, H / 2 - 8);
  const wrap = document.getElementById('shooter-wrap');
  const old = document.getElementById('restart-btn'); if (old) old.remove();
  const btn = document.createElement('button');
  btn.id = 'restart-btn'; btn.className = 'game-btn'; btn.textContent = 'ЗАНОВО';
  btn.style.cssText = 'position:absolute;left:50%;top:57%;transform:translate(-50%,-50%);z-index:10;padding:10px 28px;font-size:12px;letter-spacing:2px;';
  btn.addEventListener('click', () => {
  btn.remove();
  const upOverlay = document.getElementById('upgrade-overlay');
  if (upOverlay) upOverlay.remove();
  const shooterOverlay = document.getElementById('shooter-overlay');
  const shooterHud = document.getElementById('shooter-hud');
  if (shooterOverlay) shooterOverlay.style.display = 'none';
  if (shooterHud) shooterHud.style.display = 'flex';
  startShooter();
});
  wrap.appendChild(btn);
}

const tooltip = document.getElementById('tooltip');
document.querySelectorAll('[data-tip]').forEach(el => {
  el.addEventListener('mouseenter', () => { tooltip.textContent = el.dataset.tip; tooltip.classList.add('show'); });
  el.addEventListener('mousemove', e => { tooltip.style.left = (e.clientX + 12) + 'px'; tooltip.style.top = (e.clientY - 28) + 'px'; });
  el.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
});

const ctxMenu = document.getElementById('ctx-menu');
document.getElementById('desktop').addEventListener('contextmenu', e => {
  e.preventDefault();
  if (e.target.closest('.window')) return;
  ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 170) + 'px';
  ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 140) + 'px';
  ctxMenu.classList.add('show');
});
document.addEventListener('click', () => ctxMenu.classList.remove('show'));
ctxMenu.querySelectorAll('[data-ctx]').forEach(item => {
  item.addEventListener('click', () => {
    const a = item.dataset.ctx;
    if (a === 'video') openWindow('win-video');
    if (a === 'readme') openWindow('win-readme');
    if (a === 'about') openWindow('win-about');
    if (a === 'arrange') arrangeIcons();
    ctxMenu.classList.remove('show');
  });
});

function arrangeIcons() {
  const wa = getWorkArea();
  const icons = document.querySelectorAll('.icon');
  const stepY = 110, stepX = 86, startX = 20, startY = 30;
  const maxRows = Math.floor((wa.h - startY - 20) / stepY);
  let col = 0, row = 0;
  icons.forEach(ic => {
    ic.style.left = (startX + col * stepX) + 'px';
    ic.style.top = (startY + row * stepY) + 'px';
    row++;
    if (row >= maxRows) { row = 0; col++; }
  });
}

function initDesktop() {
  document.querySelectorAll('.window').forEach(win => {
    makeDraggable(win);
    win.addEventListener('mousedown', () => focusWindow(win.id));
  });
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); closeWindow(btn.dataset.close); });
  });
  document.querySelectorAll('[data-min]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); minimizeWindow(btn.dataset.min); });
  });
  document.querySelectorAll('[data-full]').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); toggleMaximize(btn.dataset.full); });
  });
  document.querySelectorAll('.icon').forEach(icon => {
    let lastTap = 0;
    function activate() {
      if (icon.dataset.win) openWindow(icon.dataset.win);
      if (icon.dataset.action === 'error') openWindow('win-error');
    }
    icon.addEventListener('dblclick', activate);
    icon.addEventListener('click', () => { const n = Date.now(); if (n - lastTap < 350) activate(); lastTap = n; });
    icon.addEventListener('mousedown', () => icon.classList.add('active'));
    icon.addEventListener('mouseup', () => icon.classList.remove('active'));
  });
  document.getElementById('error-ok-btn').addEventListener('click', () => {
    document.getElementById('error-text').innerHTML = 'Я же сказал — нечего смотреть.<br><br>Иди лучше видео открой. 🎬';
  });
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.getElementById('theme-toggle').textContent = document.body.classList.contains('dark') ? '🌙' : '☀️';
  });
  arrangeIcons();
  updateTaskbar();
}

const SONGS = window.SONGS_FILES || [];
let playerIdx = 0;
let playerPlaying = false;
let playerMuted = false;

function updateVolSlider(slider) {
  if (!slider) return;
  const val = parseFloat(slider.value);
  const pct = val * 100;
  slider.style.background = `linear-gradient(to right, #c95f3a ${pct}%, #2a2520 ${pct}%)`;
}

let _musicScreenShown = false;
function showMusicScreen() {
  if (_musicScreenShown) return;
  _musicScreenShown = true;
  const ms = document.getElementById('music-screen');
  if (!ms) return;
  ms.style.display = 'flex';
  setTimeout(() => { ms.style.opacity = '1'; }, 50);
  if (SONGS.length > 0) loadTrack(0, true);

  setTimeout(() => document.getElementById('ms-last').classList.add('show'), 500);
  setTimeout(() => document.getElementById('ms-please').classList.add('show'), 1200);
  setTimeout(() => {
    document.getElementById('ms-last').classList.remove('show');
    document.getElementById('ms-please').classList.remove('show');
  }, 3200);
  setTimeout(() => document.getElementById('ms-q1').classList.add('show'), 4000);
  setTimeout(() => document.getElementById('ms-vol-wrap').classList.add('show'), 4400);
  setTimeout(() => document.getElementById('ms-btns1').classList.add('show'), 4700);

  const msVol = document.getElementById('ms-vol-slider');
  if (msVol) {
    msVol.addEventListener('input', e => {
      if (window._fadeInt) clearInterval(window._fadeInt);
      const audio = document.getElementById('main-audio');
      if (audio) audio.volume = parseFloat(e.target.value);
      updateVolSlider(e.target);
      const plVol = document.getElementById('pl-vol');
      if (plVol) { plVol.value = e.target.value; updateVolSlider(plVol); }
    });
    updateVolSlider(msVol);
  }

  function pauseAndGo() {
    const audio = document.getElementById('main-audio');
    audio.pause();
    playerPlaying = false;
    const btn = document.getElementById('pl-play');
    if (btn) btn.textContent = '▶';
    closeMusicToQuiz(true);
  }

  document.getElementById('ms-hear-yes').onclick = () => {
    document.getElementById('main-audio').play().catch(()=>{});
    playerPlaying = true;
    const btn = document.getElementById('pl-play');
    if (btn) btn.textContent = '⏸';
    closeMusicToQuiz(true);
  };
  
  document.getElementById('ms-hear-no').onclick = () => {
    document.getElementById('ms-q1').classList.remove('show');
    document.getElementById('ms-btns1').classList.remove('show');
    setTimeout(() => {
      const overlay = document.getElementById('shooter-overlay');
      const hud = document.getElementById('shooter-hud');
      if (overlay) overlay.style.display = 'none';
      if (hud) hud.style.display = 'flex';
      const q2 = document.getElementById('ms-q2');
      const b2 = document.getElementById('ms-btns2');
      q2.style.display = 'block';
      b2.style.display = 'flex';
      setTimeout(() => { q2.classList.add('show'); b2.classList.add('show'); }, 50);
    }, 500);
  };

  document.getElementById('ms-sure-yes').onclick = () => {
    pauseAndGo();
  };

  document.getElementById('ms-sure-no').onclick = () => {
    document.getElementById('ms-q2').classList.remove('show');
    document.getElementById('ms-btns2').classList.remove('show');
    setTimeout(() => {
      document.getElementById('ms-q2').style.display = 'none';
      document.getElementById('ms-btns2').style.display = 'none';
      const q3 = document.getElementById('ms-q3');
      const b3 = document.getElementById('ms-btns3');
      q3.style.display = 'block';
      b3.style.display = 'flex';
      setTimeout(() => { q3.classList.add('show'); b3.classList.add('show'); }, 50);
    }, 500);
  };

  document.getElementById('ms-final-yes').onclick = () => {
    document.getElementById('main-audio').play().catch(()=>{});
    playerPlaying = true;
    const btn = document.getElementById('pl-play');
    if (btn) btn.textContent = '⏸';
    closeMusicToQuiz(true);
  };

  document.getElementById('ms-final-no').onclick = () => {
    pauseAndGo();
  };
}

function closeMusicToQuiz(withMusic) {
  const ms = document.getElementById('music-screen');
  ms.style.opacity = '0';
  setTimeout(() => {
    ms.style.display = 'none';
    const qs = document.getElementById('quiz-screen');
    qs.style.display = 'flex';
    qs.style.opacity = '1';
    qs.classList.remove('hide');
    if (window._restartQuizBg) window._restartQuizBg();
    const box = document.getElementById('quiz-box');
    box.style.display = 'flex';
    box.classList.add('fade-in');
    renderQuiz();
    if (withMusic) {
      initPlayer();
      const mp = document.getElementById('music-player');
      document.body.appendChild(mp);
      mp.classList.add('quiz-mode');
      mp.style.display = 'flex';
      mp.style.zIndex = '13500';
      mp.style.opacity = '0';
      setTimeout(() => {
        mp.style.transition = 'opacity 0.7s ease';
        mp.style.opacity = '1';
      }, 50);
    }
  }, 700);
}

function loadTrack(idx, autoplay) {
  if (!SONGS.length) return;
  playerIdx = idx;
  const audio = document.getElementById('main-audio');
  audio.src = 'songs/' + SONGS[idx];
  const volVal = parseFloat(document.getElementById('pl-vol')?.value || 0.7);
  const name = SONGS[idx].replace(/\.[^/.]+$/, '');
  const title = document.getElementById('player-title');
  if (title) title.textContent = name;
  document.querySelectorAll('.pl-item').forEach((el, i) => el.classList.toggle('active', i === idx));
  
  if (autoplay) { 
    audio.volume = 0;
    audio.play().catch(() => { }); 
    playerPlaying = true; 
    const btn = document.getElementById('pl-play'); 
    if (btn) btn.textContent = '⏸'; 
    
    if (window._fadeInt) clearInterval(window._fadeInt);
    let cv = 0;
    window._fadeInt = setInterval(() => {
      cv += 0.005;
      if (cv >= volVal) { 
        cv = volVal;  
        clearInterval(window._fadeInt); 
      }
      audio.volume = cv;
    }, 50);
  } else {
    audio.volume = volVal;
  }
}

function initPlayer() {
  if (!SONGS.length) return;
  const audio = document.getElementById('main-audio');
  const plList = document.getElementById('pl-list');
  plList.innerHTML = '';
  SONGS.forEach((s, i) => {
    const item = document.createElement('div');
    item.className = 'pl-item' + (i === playerIdx ? ' active' : '');
    item.textContent = s.replace(/\.[^/.]+$/, '');
    item.addEventListener('click', () => loadTrack(i, true));
    plList.appendChild(item);
  });
  document.getElementById('player-title').textContent = SONGS[playerIdx].replace(/\.[^/.]+$/, '');
  const playBtn = document.getElementById('pl-play');
  playBtn.textContent = playerPlaying ? '⏸' : '▶';
  playBtn.addEventListener('click', () => {
    if (playerPlaying) { audio.pause(); playerPlaying = false; playBtn.textContent = '▶'; }
    else { audio.play().catch(() => { }); playerPlaying = true; playBtn.textContent = '⏸'; }
  });
  document.getElementById('pl-prev').addEventListener('click', () => loadTrack((playerIdx - 1 + SONGS.length) % SONGS.length, true));
  document.getElementById('pl-next').addEventListener('click', () => loadTrack((playerIdx + 1) % SONGS.length, true));
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    document.getElementById('pl-fill').style.width = (audio.currentTime / audio.duration * 100) + '%';
    document.getElementById('pl-cur').textContent = fmtTime(audio.currentTime);
    document.getElementById('pl-dur').textContent = fmtTime(audio.duration);
  });
  document.getElementById('pl-bar').addEventListener('click', e => {
    audio.currentTime = (e.offsetX / e.currentTarget.offsetWidth) * audio.duration;
  });
  const volSlider = document.getElementById('pl-vol');
  if (volSlider) {
    updateVolSlider(volSlider);
    volSlider.addEventListener('input', e => {
      if (window._fadeInt) clearInterval(window._fadeInt);
      audio.volume = parseFloat(e.target.value);
      updateVolSlider(e.target);
      const msVol = document.getElementById('ms-vol-slider');
      if (msVol) { msVol.value = e.target.value; updateVolSlider(msVol); }
    });
  }
  audio.addEventListener('ended', () => loadTrack((playerIdx + 1) % SONGS.length, true));
}

function fmtTime(s) {
  if (!s || isNaN(s)) return '0:00';
  return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
}

function initMusicBg() {
  const canvas = document.getElementById('music-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const dots = Array.from({ length: 300 }, () => {
    const x = Math.random() * canvas.width, y = Math.random() * canvas.height;
    return {
      x, y, r: Math.random() * 1.2 + 0.3, alpha: Math.random() * 0.5 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3, twinkleSpeed: Math.random() * 0.025 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - .5) * 0.04, driftY: (Math.random() - .5) * 0.04,
      homeX: x, homeY: y, vx: 0, vy: 0
    };
  });

  let running = true;
  function frame() {
    if (!running || document.getElementById('music-screen').style.display === 'none') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.homeX += d.driftX; d.homeY += d.driftY;
      if (d.homeX < 0 || d.homeX > canvas.width) d.driftX *= -1;
      if (d.homeY < 0 || d.homeY > canvas.height) d.driftY *= -1;
      d.vx += (d.homeX - d.x) * 0.018; d.vy += (d.homeY - d.y) * 0.018;
      d.vx *= 0.85; d.vy *= 0.85;
      d.x += d.vx; d.y += d.vy;
      d.twinklePhase += d.twinkleSpeed;
      d.alpha = Math.max(0.05, Math.min(1, d.baseAlpha + Math.sin(d.twinklePhase) * 0.25));
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220,215,200,${d.alpha})`; ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
};

const WALLPAPERS = window.WALLPAPER_FILES || [];
let currentWallpaper = WALLPAPERS[0] || null;

function initWallpaper() {
  const grid = document.getElementById('wp-grid');
  if (grid.children.length > 0) return;

  if (!WALLPAPERS.length) {
    grid.innerHTML = '<div class="wp-none">Добавь файлы в папку wallpapers/ и запусти build-wallpapers.py</div>';
    return;
  }

  document.getElementById('desktop').style.background = 'none';

  if (currentWallpaper) setWallpaper(currentWallpaper);

  WALLPAPERS.forEach(file => {
    const item = document.createElement('div');
    item.className = 'wp-item' + (file === currentWallpaper ? ' active' : '');
    item.dataset.file = file;

    const ext = file.split('.').pop().toLowerCase();
    if (ext === 'gif') {
      const img = document.createElement('img');
      img.src = 'wallpapers/' + file;
      item.appendChild(img);
    } else {
      const vid = document.createElement('video');
      vid.src = 'wallpapers/' + file;
      vid.autoplay = true;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      item.appendChild(vid);
    }

    const label = document.createElement('div');
    label.className = 'wp-label';
    label.textContent = file.replace(/\.[^/.]+$/, '');
    item.appendChild(label);

    item.addEventListener('click', () => {
      setWallpaper(file);
      document.querySelectorAll('.wp-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });

    grid.appendChild(item);
  });

  document.getElementById('wp-reset').onclick = () => {
    const bg = document.getElementById('desktop-wallpaper');
    if (bg) { bg.src = ''; if (bg.tagName==='VIDEO') bg.pause(); }
    currentWallpaper = null;
    document.getElementById('desktop').style.background = '';
    document.querySelectorAll('.wp-item').forEach(el => el.classList.remove('active'));
  };
}

function setWallpaper(file) {
  const oldHint = document.getElementById('umbra-hint');
  if (oldHint) oldHint.remove();
  umbraMode = false;
  
  currentWallpaper = file;
  const bg = document.getElementById('desktop-wallpaper');
  if (!bg) return;
  const ext = file.split('.').pop().toLowerCase();
  if (ext === 'gif') {
    const img = document.createElement('img');
    img.id = 'desktop-wallpaper';
    img.src = 'wallpapers/' + file;
    bg.replaceWith(img);
  } else {
    bg.src = 'wallpapers/' + file;
    bg.load();
    bg.play().catch(() => {});
  }
}

const UMBRA_WALLPAPER = 'LXST CXNTURY - UMBRA [get.gt]';
const UMBRA_TRACK = 'LXST CXNTURY - UMBRA';
let umbraMode = false;

function checkUmbra() {
  const bg = document.getElementById('desktop-wallpaper');
  if (!bg) return;
  const isUmbraWallpaper = currentWallpaper && currentWallpaper.replace(/\.[^/.]+$/, '') === UMBRA_WALLPAPER;
  const audio = document.getElementById('main-audio');
  const currentTrackName = SONGS[playerIdx] ? SONGS[playerIdx].replace(/\.[^/.]+$/, '') : '';
  const isUmbraTrack = currentTrackName === UMBRA_TRACK;

  if (isUmbraWallpaper && isUmbraTrack && !audio.paused) {
    if (!umbraMode) {
      umbraMode = true;
      bg.currentTime = audio.currentTime % bg.duration;
      bg.play().catch(()=>{});
    }
    bg.currentTime = audio.currentTime % (bg.duration || 1);
    bg.playbackRate = 1;
  } else if (isUmbraWallpaper && (!isUmbraTrack || audio.paused)) {
    bg.pause();
    umbraMode = false;
  }
}

const _origSetWallpaper = setWallpaper;
window.setWallpaper = function(file) {
  _origSetWallpaper(file);
  umbraMode = false;
  const name = file.replace(/\.[^/.]+$/, '');
  if (name === UMBRA_WALLPAPER) {
    setTimeout(() => {
      const bg = document.getElementById('desktop-wallpaper');
      if (bg && bg.tagName === 'VIDEO' && !_umbraAudio.paused) {
        bg.pause();
        bg.currentTime = 0;
        showUmbraHint();
      }
    }, 300);
  }
};

function showUmbraHint() {
  const old = document.getElementById('umbra-hint');
  if (old) old.remove();
  const hint = document.createElement('div');
  hint.id = 'umbra-hint';
  hint.innerHTML = `ЭТИ ОБОИ ПРОСТО ТАК ПОСТАВИТЬ НЕЛЬЗЯ!<br>НАЙДИТЕ НУЖНУЮ ПЕСНЮ ДЛЯ ЗАПУСКА ВИДЕО.`;
  hint.style.cssText = `
    position: fixed;
    bottom: 56px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    color: #c95f3a;
    background: rgba(13,12,11,0.92);
    border: 1px solid #c95f3a;
    border-radius: 4px;
    padding: 12px 20px;
    letter-spacing: 1px;
    text-align: center;
    line-height: 1.8;
    pointer-events: none;
    white-space: nowrap;
  `;
  document.body.appendChild(hint);
}

const _umbraAudio = document.getElementById('main-audio');
_umbraAudio.addEventListener('play', () => {
  const trackName = SONGS[playerIdx] ? SONGS[playerIdx].replace(/\.[^/.]+$/, '') : '';
  const wallpaperName = currentWallpaper ? currentWallpaper.replace(/\.[^/.]+$/, '') : '';

  if (trackName === UMBRA_TRACK && wallpaperName === UMBRA_WALLPAPER) {
    const hint = document.getElementById('umbra-hint');
    if (hint) {
      hint.style.transition = 'opacity 0.5s ease';
      hint.style.opacity = '0';
      setTimeout(() => hint.remove(), 600);
    }
    const bg = document.getElementById('desktop-wallpaper');
    if (bg && bg.tagName === 'VIDEO') {
      bg.currentTime = _umbraAudio.currentTime % (bg.duration || 1);
      bg.play().catch(()=>{});
      umbraMode = true;
    }
  }
});

_umbraAudio.addEventListener('pause', () => {
  const wallpaperName = currentWallpaper ? currentWallpaper.replace(/\.[^/.]+$/, '') : '';
  if (wallpaperName === UMBRA_WALLPAPER) {
    const bg = document.getElementById('desktop-wallpaper');
    if (bg && bg.tagName === 'VIDEO') {
      bg.pause();
      umbraMode = false;
    }
  }
});

_umbraAudio.addEventListener('timeupdate', () => {
  if (!umbraMode) return;
  const bg = document.getElementById('desktop-wallpaper');
  if (bg && bg.tagName === 'VIDEO' && !_umbraAudio.paused) {
    if (Math.abs(bg.currentTime - (_umbraAudio.currentTime % (bg.duration || 1))) > 0.5) {
      bg.currentTime = _umbraAudio.currentTime % (bg.duration || 1);
    }
  }
});

function showWelcomeToast() {
  const toast = document.createElement('div');
  toast.className = 'window open focused';
  toast.id = 'welcome-toast';
  toast.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;
    min-width: 300px;
    max-width: 340px;
    opacity: 0;
    transition: opacity 0.4s ease;
  `;
  toast.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-title">🎉 добро пожаловать</div>
      <div class="titlebar-btns">
        <button class="tbtn tbtn-close" id="welcome-close">&#x2715;</button>
      </div>
    </div>
    <div class="win-body" style="display:flex; flex-direction:column; gap:12px; text-align:center;">
      <div class="error-text" style="text-align:center; line-height:1.9;">
        для начала советую зайти в <b>wallpaper.exe</b><br>
        и выбрать себе классные обои.<br>удачи!
      </div>
      <div class="error-btns" style="justify-content:center;">
        <button class="dialog-btn primary" id="welcome-open-btn">открыть wallpaper.exe</button>
        <button class="dialog-btn" id="welcome-close-btn">закрыть</button>
      </div>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.opacity = '1'; }, 300);

  function closeToast() {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }

  const openBtn = toast.querySelector('#welcome-open-btn');
  const closeBtn1 = toast.querySelector('#welcome-close');
  const closeBtn2 = toast.querySelector('#welcome-close-btn');
  if (openBtn) openBtn.addEventListener('click', () => { openWindow('win-wallpaper'); closeToast(); });
  if (closeBtn1) closeBtn1.addEventListener('click', closeToast);
  if (closeBtn2) closeBtn2.addEventListener('click', closeToast);
}

function initAbout() {
  const start = Date.now();
  const uptimeEl = document.getElementById('about-uptime');
  if (uptimeEl && !uptimeEl.dataset.started) {
    uptimeEl.dataset.started = '1';
    setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const m = Math.floor(s / 60), sec = s % 60;
      uptimeEl.textContent = `${m}м ${sec}с`;
    }, 1000);
  }

  const copyBtn = document.getElementById('about-copy-btn');
  if (copyBtn && !copyBtn.dataset.bound) {
    copyBtn.dataset.bound = '1';
    copyBtn.addEventListener('click', () => {
      const info = `ZEFUN OS v20.0\nПользователь: Zefuun\nВидеопамять: 8 ГБ\nПроцессор: Котики × 16 ядер\nСделал: Руби ❤`;
      navigator.clipboard.writeText(info).then(() => {
        copyBtn.textContent = '✓ скопировано';
        setTimeout(() => copyBtn.textContent = '📋 копировать инфо', 2000);
      });
    });
  }

  const pingBtn = document.getElementById('about-ping-btn');
  if (pingBtn && !pingBtn.dataset.bound) {
    pingBtn.dataset.bound = '1';
    pingBtn.addEventListener('click', () => {
      pingBtn.textContent = '📡 ping...';
      pingBtn.disabled = true;
      setTimeout(() => {
        pingBtn.textContent = `✓ ${Math.floor(Math.random()*8+1)}ms`;
        setTimeout(() => { pingBtn.textContent = '📡 ping zefun'; pingBtn.disabled = false; }, 2000);
      }, 600 + Math.random() * 400);
    });
  }

  const diagBtn = document.getElementById('about-diag-btn');
  if (diagBtn && !diagBtn.dataset.bound) {
    diagBtn.dataset.bound = '1';
    diagBtn.addEventListener('click', () => runDiagnostics());
  }
}

function getLogLine() {
  const ok = [
    '[ OK ]  проверка целостности RAM: 8192 МБ — норма',
    '[ OK ]  температура CPU: 41°C — стабильно',
    '[ OK ]  сетевой интерфейс zef0: активен, 1Gbps',
    '[ OK ]  файловая система: /zefun/memories — смонтирована',
    '[ OK ]  процесс котики_v16.ko: работает',
    '[ OK ]  аудио-демон: music_player.exe — активен',
    '[ OK ]  шифрование воспоминаний: AES-256 — включено',
    '[ OK ]  галерея: индексирование завершено',
    '[ OK ]  планировщик задач: cron запущен',
    '[ OK ]  DNS: zefun.local → 127.0.0.1',
    '[ OK ]  рабочий стол: все окна отрисованы',
    '[ OK ]  таймер аптайма: синхронизирован',
    '[ OK ]  swap: воспоминания.img — 94% заполнено',
    '[ OK ]  буфер обмена: очищен',
    '[ OK ]  видеодрайвер: zefun_gpu — загружен',
  ];
  const warn = [
    '[ ?? ]  обнаружен ruby_was_here.exe — разрешён системой',
    '[ ?? ]  laughing_daemon использует 94% CPU',
    '[ ?? ]  /tmp/мемы — переполнено, очистка...',
    '[ ?? ]  UMBRA.exe ожидает активации трека',
    '[ ?? ]  ruby_heartbeat.service — работает в фоне',
    '[ ?? ]  обнаружен неизвестный процесс: zort.exe',
    '[ ?? ]  предупреждение: слишком много котиков в памяти',
    '[ ?? ]  входящее соединение: ruby@192.168.1.1',
  ];
  const all = [...ok, ...ok, ...warn];
  return all[Math.floor(Math.random() * all.length)];
}

let diagRunning = false;

function runDiagnostics() {
  ['win-diag-1','win-diag-2','win-diag-3'].forEach(id => {
    const ex = document.getElementById(id);
    if (ex) ex.remove();
  });
  diagRunning = false;
  setTimeout(() => {
    diagRunning = true;
spawnDiagWindow('win-diag-1', '💻 system — ядро и процессы',  '50px',  '20px',              getSystemLogs);
spawnDiagWindow('win-diag-2', '🌐 network — соединения',      '50px',  'calc(50% - 230px)', getNetworkLogs);
spawnDiagWindow('win-diag-3', '📊 memory — память и диск',    '50px',  'calc(100% - 500px)', getMemoryLogs);
  }, 100);
}

function spawnDiagWindow(id, title, top, left, logFn) {
  const win = document.createElement('div');
  win.className = 'window open focused';
  win.id = id;
  win.style.cssText = `width:min(460px,92vw); position:fixed; top:${top}; left:${left}; z-index:${++winZTop}; max-height:calc(100vh - 100px);`;
  win.innerHTML = `
    <div class="titlebar">
      <div class="titlebar-title">${title}</div>
      <div class="titlebar-btns">
        <button class="tbtn tbtn-close" data-diagclose="${id}">&#x2715;</button>
      </div>
    </div>
    <div class="win-body" style="background:#0d0c0b;padding:12px;font-size:10.5px;height:calc(100vh - 340px);max-height:360px;overflow-y:auto;" id="body-${id}"></div>
  `;
  document.body.appendChild(win);
  makeDraggable(win);
  win.addEventListener('mousedown', () => focusWindow(id));
  win.querySelector(`[data-diagclose="${id}"]`).addEventListener('click', () => {
    win.remove();
  });

  const body = document.getElementById(`body-${id}`);
  function addLine() {
    if (!document.getElementById(id)) return;
    const [type, text] = logFn();
    const line = document.createElement('div');
    line.style.cssText = `font-family:'JetBrains Mono',monospace;line-height:1.8;white-space:pre;color:${
      type==='ok'?'#6a8a6a':type==='warn'?'#c8962a':type==='err'?'#c95f3a':'#5a7a9a'};`;
    line.textContent = text;
    body.appendChild(line);
    while (body.children.length > 300) body.removeChild(body.firstChild);
    body.scrollTop = body.scrollHeight;
    setTimeout(addLine, 50 + Math.random() * 200);
  }
  addLine();
}

function getSystemLogs() {
  const lines = [
    ['ok',   '[ OK ]  PID 1    init — running'],
    ['ok',   '[ OK ]  PID 42   zefun_core.service — active'],
    ['ok',   '[ OK ]  PID 88   kotiki_daemon v16 — 16 потоков'],
    ['ok',   '[ OK ]  PID 113  music_player.exe — играет'],
    ['warn', '[ ?? ]  PID 214  laughing_daemon — CPU 94%'],
    ['ok',   '[ OK ]  PID 256  memory_manager — стабильно'],
    ['ok',   '[ OK ]  PID 310  desktop_renderer — 60fps'],
    ['warn', '[ ?? ]  PID 404  ruby_was_here.exe — разрешён'],
    ['ok',   '[ OK ]  PID 512  gallery_indexer — завершён'],
    ['ok',   '[ OK ]  PID 600  wallpaper_engine — активен'],
    ['warn', '[ ?? ]  PID 666  zort.exe — неизвестный процесс'],
    ['ok',   '[ OK ]  PID 777  cron — запланировано 3 задачи'],
    ['ok',   '[ OK ]  PID 888  audio_subsystem — latency 4ms'],
    ['ok',   '[ OK ]  PID 999  zefun_watchdog — мониторинг'],
    ['ok',   `[ OK ]  uptime: ${Math.floor(Math.random()*60)}м ${Math.floor(Math.random()*60)}с`],
    ['ok',   `[ OK ]  CPU temp: ${(38+Math.random()*8).toFixed(1)}°C — норма`],
    ['ok',   `[ OK ]  load avg: ${(Math.random()*0.8).toFixed(2)} ${(Math.random()*0.5).toFixed(2)} ${(Math.random()*0.3).toFixed(2)}`],
    ['warn', '[ ?? ]  ruby_heartbeat.service — фоновый сигнал'],
    ['ok',   '[ OK ]  UMBRA.exe — ожидает активации'],
    ['ok',   '[ OK ]  планировщик: следующая задача через 60с'],
  ];
  return lines[Math.floor(Math.random()*lines.length)];
}

function getNetworkLogs() {
  const ip = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
  const ms = () => Math.floor(Math.random()*120+1);
  const lines = [
    ['ok',   '[ OK ]  интерфейс zef0: UP 1Gbps full-duplex'],
    ['ok',   `[ OK ]  IP: 192.168.zefun.1 — активен`],
    ['ok',   `[ OK ]  gateway: 192.168.1.1 — ping ${ms()}ms`],
    ['ok',   `[ OK ]  DNS 1.1.1.1 — ответ ${ms()}ms`],
    ['ok',   `[ OK ]  DNS 8.8.8.8 — ответ ${ms()}ms`],
    ['ok',   `[ OK ]  ping google.com — ${ms()}ms TTL 118`],
    ['ok',   `[ OK ]  ping zefun.local — ${Math.floor(Math.random()*5)+1}ms`],
    ['info', `[ >> ]  входящий пакет: ${ip()}:${Math.floor(Math.random()*9000+1000)}`],
    ['info', `[ >> ]  исходящий пакет → ${ip()}:443`],
    ['ok',   `[ OK ]  скорость: ↓ ${(Math.random()*80+20).toFixed(1)} Mbps ↑ ${(Math.random()*40+5).toFixed(1)} Mbps`],
    ['warn', `[ ?? ]  неизвестный хост: ruby@192.168.1.${Math.floor(Math.random()*254+1)}`],
    ['ok',   `[ OK ]  TLS: сертификат zefun.local — валиден`],
    ['ok',   `[ OK ]  firewall: активен, 3 правила`],
    ['ok',   `[ OK ]  WebSocket: connected — latency ${ms()}ms`],
    ['warn', '[ ?? ]  новое подключение: ruby_remote.service'],
    ['ok',   `[ OK ]  пакетов получено: ${Math.floor(Math.random()*9000+1000)}`],
    ['ok',   `[ OK ]  пакетов отправлено: ${Math.floor(Math.random()*9000+1000)}`],
    ['info', `[ >> ]  HTTP GET /api/memories — 200 OK`],
    ['info', `[ >> ]  HTTP GET /songs/ — 200 OK`],
    ['ok',   '[ OK ]  интернет-соединение: стабильно ✦'],
  ];
  return lines[Math.floor(Math.random()*lines.length)];
}

function getMemoryLogs() {
  const mb = () => Math.floor(Math.random()*500+100);
  const lines = [
    ['ok',   '[ OK ]  RAM: 8192 МБ установлено'],
    ['ok',   `[ OK ]  RAM используется: ${Math.floor(Math.random()*3000+2000)} МБ`],
    ['ok',   `[ OK ]  RAM свободно: ${Math.floor(Math.random()*2000+500)} МБ`],
    ['ok',   '[ OK ]  swap: воспоминания.img — активен'],
    ['ok',   `[ OK ]  swap использован: ${(Math.random()*40+10).toFixed(1)}%`],
    ['ok',   '[ OK ]  диск /zefun: 512 ГБ'],
    ['ok',   `[ OK ]  диск занято: ${(Math.random()*60+20).toFixed(1)}%`],
    ['ok',   `[ OK ]  /zefun/memories: ${Math.floor(Math.random()*200+50)} файлов`],
    ['ok',   `[ OK ]  /zefun/songs: ${Math.floor(Math.random()*30+10)} треков`],
    ['ok',   `[ OK ]  /zefun/gallery: ${Math.floor(Math.random()*100+20)} фото`],
    ['warn', '[ ?? ]  /tmp/мемы: переполнено — очистка...'],
    ['ok',   `[ OK ]  кэш браузера: ${mb()} МБ`],
    ['ok',   `[ OK ]  буфер GPU: ${mb()} МБ — норма`],
    ['ok',   `[ OK ]  страниц в памяти: ${Math.floor(Math.random()*50000+10000)}`],
    ['warn', `[ ?? ]  утечка памяти: котики_daemon +${Math.floor(Math.random()*10+1)} МБ`],
    ['ok',   `[ OK ]  GC: собрано ${mb()} МБ мусора`],
    ['ok',   `[ OK ]  heap: ${Math.floor(Math.random()*200+100)} МБ / 512 МБ`],
    ['ok',   `[ OK ]  стек: ${Math.floor(Math.random()*8+1)} МБ`],
    ['ok',   '[ OK ]  memoria integra — всё под контролем ✦'],
    ['warn', '[ ?? ]  воспоминания занимают больше всего места'],
  ];
  return lines[Math.floor(Math.random()*lines.length)];
}

let moonInitialized = false;
let moonAF = null;
let moonCurrentObj = 'moon';

const SPACE_OBJECTS = {
  moon: {
    label: 'Луна',
    radius: 1,
    segments: 64,
    tex: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg',
    bump: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/ldem_3_8bit.jpg',
    bumpScale: 0.04,
    shininess: 5,
    camZ: 4.5,
    info: ['Луна', 'Расстояние до Земли: 384 400 км', 'Радиус: 1 737 км', 'Период вращения: 27.3 дня', 'Температура: -173°C / +127°C'],
    details: `🌙 ЛУНА\n\nЕдинственный естественный спутник Земли. Образовалась около 4.5 млрд лет назад в результате столкновения Земли с телом размером с Марс.\n\n📏 Радиус: 1 737 км\n📍 Расстояние: 384 400 км\n🔄 Оборот вокруг Земли: 27.3 дня\n🌡️ Температура: от -173°C до +127°C\n🌊 Влияет на приливы и отливы\n✨ Видна с Земли только одна сторона\n👨‍🚀 Последний человек на Луне: 1972 год\n🌿 Зефун любит луну больше всего ✦`,
  },
  earth: {
    label: 'Земля',
    radius: 1,
    segments: 64,
    tex: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_atmos_2048.jpg',
    bump: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_normal_2048.jpg',
    bumpScale: 0.05,
    shininess: 15,
    camZ: 4.5,
    info: ['Земля', 'Радиус: 6 371 км', 'Масса: 5.97 × 10²⁴ кг', 'Спутников: 1 (Луна)', 'Температура: -89°C / +57°C'],
    details: `🌍 ЗЕМЛЯ\n\nТретья планета от Солнца и единственная известная планета с жизнью. 71% поверхности покрыто водой.\n\n📏 Радиус: 6 371 км\n☀️ Расстояние до Солнца: 149.6 млн км\n🔄 Оборот вокруг Солнца: 365.25 дня\n🌡️ Средняя температура: +15°C\n🌊 Воды: 71% поверхности\n🌙 Спутников: 1 (Луна)\n👥 Население: ~8 млрд человек\n🌿 Возраст: 4.54 млрд лет`,
  },
  system: {
    label: 'Система',
    info: ['Солнечная система', '8 планет', 'Масштаб условный', 'Крути мышкой', ''],
    details: `☀️ СОЛНЕЧНАЯ СИСТЕМА\n\nВозраст: 4.6 млрд лет\nПланет: 8\nКарликовых планет: 5+\nСпутников: 200+\n\n🪐 Юпитер — самая большая планета\n💍 Сатурн — кольца из льда и камней\n❄️ Нептун — самые сильные ветры\n☀️ Солнце — 99.86% массы системы`,
  },
};

function initMoon() {
  if (moonInitialized) return;
  moonInitialized = true;

  const canvas = document.getElementById('moon-canvas');
  const win = document.getElementById('win-moon');
  canvas.width = win.clientWidth;
  canvas.height = win.clientHeight - 32;

  const THREE = window.THREE;
  if (!THREE) { loadThreeJS(() => { moonInitialized = false; initMoon(); }); return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
  camera.position.z = 4.5;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const starGeo = new THREE.BufferGeometry();
  const starCount = 3000;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 200;
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.8 })));

  const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.4);
  sunLight.position.set(5, 3, 3);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x111122, 0.8));

  let currentMesh = null;
  let systemObjects = [];
  let isDragging = false, prevX = 0, prevY = 0, velX = 0, velY = 0;
  let rotX = 0, rotY = 0;

  const loader = new THREE.TextureLoader();

  function clearScene() {
    if (currentMesh) { scene.remove(currentMesh); currentMesh = null; }
    systemObjects.forEach(o => {
      scene.remove(o);
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
    systemObjects = [];
    scene.background = null;
  }

  function loadObject(key) {
    moonCurrentObj = key;
    clearScene();
    document.querySelectorAll('.moon-btn').forEach(b => b.classList.toggle('active', b.dataset.obj === key));
    const obj = SPACE_OBJECTS[key];
const infoEl = document.getElementById('moon-info');
infoEl.innerHTML = '';

const infoText = document.createElement('div');
infoText.innerHTML = obj.info.map((l,i) => i===0
  ? `<span style="color:#c95f3a;font-size:11px;font-weight:bold">${l}</span>` 
  : `<span>${l}</span>` 
).join('<br>');
infoEl.appendChild(infoText);

const toggle = document.createElement('span');
toggle.textContent = '📖 подробнее';
toggle.style.cssText = 'color:#c95f3a;cursor:pointer;border-bottom:1px solid #c95f3a;font-size:10px;margin-top:6px;display:inline-block';
infoEl.appendChild(document.createElement('br'));
infoEl.appendChild(toggle);

const detText = document.createElement('div');
detText.style.cssText = 'display:none;margin-top:8px;color:#9a9088;font-size:10px;line-height:1.8;white-space:pre-wrap;max-width:220px';
detText.textContent = obj.details || '';
infoEl.appendChild(detText);

toggle.addEventListener('click', () => {
  const open = detText.style.display === 'none';
  detText.style.display = open ? 'block' : 'none';
  toggle.textContent = open ? '📖 скрыть' : '📖 подробнее';
});

    if (key === 'system') {
      loadSolarSystem();
      camera.position.set(0, 0, 18);
      return;
    }
    camera.position.z = SPACE_OBJECTS[key].camZ;
    rotX = 0; rotY = 0; velX = 0; velY = 0;
    camera.position.set(0, 0, obj.camZ);

    const geo = new THREE.SphereGeometry(obj.radius, obj.segments, obj.segments);
    const matProps = { shininess: obj.shininess };
    if (obj.tex) matProps.map = loader.load(obj.tex);
    if (obj.bump) { matProps.bumpMap = loader.load(obj.bump); matProps.bumpScale = obj.bumpScale; }
    if (obj.color) matProps.color = new THREE.Color(obj.color);
    currentMesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial(matProps));
    scene.add(currentMesh);
  }

  const PLANETS = [
    { name: 'Меркурий', r: 0.15, dist: 2.5,  speed: 0.047, color: '#a0907a' },
    { name: 'Венера',   r: 0.22, dist: 3.5,  speed: 0.035, color: '#c8a96a' },
    { name: 'Земля',    r: 0.24, dist: 4.8,  speed: 0.030, color: '#4a8aca' },
    { name: 'Марс',     r: 0.18, dist: 6.2,  speed: 0.024, color: '#c0603a' },
    { name: 'Юпитер',   r: 0.55, dist: 8.5,  speed: 0.013, color: '#c8a07a' },
    { name: 'Сатурн',   r: 0.45, dist: 11.0, speed: 0.009, color: '#d4b87a', rings: true },
    { name: 'Уран',     r: 0.32, dist: 13.5, speed: 0.006, color: '#7ab8c8' },
    { name: 'Нептун',   r: 0.30, dist: 15.5, speed: 0.005, color: '#3a5acc' },
  ];

  function loadSolarSystem() {
  scene.background = new THREE.Color(0x000008);

  const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc22 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);
  systemObjects.push(sun);

  [1.5, 1.9, 2.4].forEach((scale, i) => {
    const glowGeo = new THREE.SphereGeometry(1.2 * scale, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.06 - i * 0.015,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);
    systemObjects.push(glow);
  });

  const sunPoint = new THREE.PointLight(0xffdd44, 3, 80);
  scene.add(sunPoint);
  systemObjects.push(sunPoint);

  PLANETS.forEach((p, idx) => {
    const points = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * p.dist, 0, Math.sin(a) * p.dist));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x2a2a28, transparent: true, opacity: 0.5 });
    const orbit = new THREE.Line(orbitGeo, orbitMat);
    scene.add(orbit);
    systemObjects.push(orbit);

    const geo = new THREE.SphereGeometry(p.r, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ color: p.color, shininess: 10 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData = { dist: p.dist, speed: p.speed, angle: (idx / PLANETS.length) * Math.PI * 2, name: p.name, isPlanet: true };
    scene.add(mesh);
    systemObjects.push(mesh);

    if (p.rings) {
      const ringGeo = new THREE.RingGeometry(p.r * 1.5, p.r * 2.4, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xb89a5a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      mesh.add(ring);
    }

  });
}

  canvas.addEventListener('mousedown', e => {
  if (e.target !== canvas) return;
  isDragging = true;
  prevX = e.clientX;
  prevY = e.clientY;
});
  canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    velX = (e.clientX - prevX) * 0.005;
    velY = (e.clientY - prevY) * 0.005;
    if (moonCurrentObj === 'system') {
      camera.position.x -= velX * 2;
      camera.position.y += velY * 2;
      camera.lookAt(0, 0, 0);
    } else {
      rotX += velY; rotY += velX;
    }
    prevX = e.clientX; prevY = e.clientY;
  });
  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; });
  canvas.addEventListener('wheel', e => {
    if (moonCurrentObj === 'system') {
      camera.position.z = Math.max(10, Math.min(30, camera.position.z + e.deltaY * 0.02));
    } else {
      camera.position.z = Math.max(1.8, Math.min(3.0, camera.position.z + e.deltaY * 0.003));
    }
  });

  document.querySelectorAll('.moon-btn').forEach(btn => {
    btn.addEventListener('click', () => loadObject(btn.dataset.obj));
  });

  const ro = new ResizeObserver(() => {
    const w = win.clientWidth, h = win.clientHeight - 32;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(win);

  let frame = 0;
  function animate() {
    moonAF = requestAnimationFrame(animate);
    frame++;
    if (moonCurrentObj === 'system') {
      systemObjects.forEach(o => {
        if (o.userData.dist) {
          o.userData.angle += o.userData.speed * 0.3;
          o.position.x = Math.cos(o.userData.angle) * o.userData.dist;
          o.position.z = Math.sin(o.userData.angle) * o.userData.dist;
          o.rotation.y += 0.01;
        }
      });
      camera.position.x += (-camera.position.x) * 0.02;
    } else {
      if (!isDragging) { velX *= 0.95; velY *= 0.95; rotY += velX; rotX += velY; rotY += 0.0008; }
      if (currentMesh) { currentMesh.rotation.x = rotX; currentMesh.rotation.y = rotY; }
    }
    renderer.render(scene, camera);
  }

  loadObject('moon');
  animate();
}

function loadThreeJS(cb) {
  if (window.THREE) { cb(); return; }
  cb();
}
