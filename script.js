/* ── CURSOR ── */
const cur = document.getElementById("cur"),
  curR = document.getElementById("cur-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
(function loop() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cur.style.cssText = `left:${mx}px;top:${my}px`;
  curR.style.cssText = `left:${rx}px;top:${ry}px`;
  requestAnimationFrame(loop);
})();
document.querySelectorAll("a,button,.pd,.tl,.bnav-logo").forEach((el) => {
  el.addEventListener("mouseenter", () => document.body.classList.add("hov"));
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("hov"),
  );
});

/* ── BUILD CUBE GRID ── */
const grid = document.getElementById("cubeGrid");
for (let r = 0; r < 9; r++) {
  const row = document.createElement("div");
  row.className = "cube-row";
  row.style.cssText = `transform:rotateX(62deg) translateY(${r * -94}px);animation-delay:${r * 0.3}s`;
  for (let c = 0; c < 18; c++) {
    const cube = document.createElement("div");
    cube.className = "cube";
    cube.style.animationDelay = `${(r + c) * 0.12}s`;
    row.appendChild(cube);
  }
  grid.appendChild(row);
}

/* ── ACTIVE PAGE DETECTION ── */
const reel = document.getElementById("reel");
const pages = [...document.querySelectorAll(".pg")];
const dots = [...document.querySelectorAll(".pd")];
const tnav = document.getElementById("topnav");

/* ── NAV SCROLL HIDE/SHOW ── */
let lastScroll = 0;
reel.addEventListener("scroll", () => {
  const cur = reel.scrollTop;
  if (cur <= 60) {
    tnav.classList.remove("nav-hide");
    tnav.classList.add("nav-show");
  } else if (cur > lastScroll + 8) {
    // scrolling DOWN → pop out
    tnav.classList.add("nav-hide");
    tnav.classList.remove("nav-show");
  } else if (cur < lastScroll - 8) {
    // scrolling UP → pop in
    tnav.classList.remove("nav-hide");
    tnav.classList.add("nav-show");
  }
  lastScroll = cur;
});

/* ── CHILD SELECTORS ── */
const CHILD_SELS = [".c-num", "h2", "p", ".btn-row", ".stats"];
const LINE_SEL = ".c-line";

function resetChildren(pg) {
  pg.querySelectorAll(CHILD_SELS.map((s) => ".card3d " + s).join(",")).forEach(
    (el) => {
      el.classList.remove("child-enter");
      el.classList.add("child-hidden");
    },
  );
  const line = pg.querySelector(".card3d .c-line");
  if (line) {
    line.classList.remove("child-line-enter");
    line.classList.add("child-line-hidden");
  }
}

function animateChildren(pg) {
  /* stagger delays — fire AFTER card tumble (2.8s) */
  const delays = [0, 0.22, 0.44, 0.66, 0.88]; /* offset from 2.9s base */
  const BASE = 400;
  pg.querySelectorAll(CHILD_SELS.map((s) => ".card3d " + s).join(",")).forEach(
    (el, i) => {
      setTimeout(
        () => {
          el.classList.add("child-enter");
          el.classList.remove("child-hidden");
        },
        BASE + delays[i] * 1000,
      );
    },
  );
  const line = pg.querySelector(".card3d .c-line");
  if (line) {
    setTimeout(() => {
      line.classList.add("child-line-enter");
      line.classList.remove("child-line-hidden");
    }, BASE + 120);
  }
}

function setActive() {
  const mid = window.innerHeight / 2;
  pages.forEach((pg, i) => {
    const r = pg.getBoundingClientRect();
    const isOn = r.top < mid && r.bottom > mid;
    const wasOn = pg.classList.contains("on");

    if (isOn && !wasOn) {
      /* — page just entered — */
      const card = pg.querySelector(".card3d");
      if (card) {
        /* 1. kill any running animation */
        card.style.animation = "none";
        void card.offsetHeight; /* reflow */
        card.style.animation = "";

        /* 2. hide children instantly */
        resetChildren(pg);
      }
      /* 3. add .on → triggers CSS tumble keyframe */
      pg.classList.add("on");
      /* 4. schedule child reveal */
      animateChildren(pg);
    } else if (!isOn && wasOn) {
      /* — page just left — reset for next entry */
      pg.classList.remove("on");
      resetChildren(pg);
    }

    if (dots[i]) dots[i].classList.toggle("on", isOn);
  });
}
reel.addEventListener("scroll", setActive);
window.addEventListener("load", () => {
  /* hide all card children first */
  pages.forEach((pg) => resetChildren(pg));
  /* activate page 1 */
  pages[0].classList.add("on");
  dots[0].classList.add("on");
  /* pages 2/3/4 get child animation on first scroll-in */
});

/* ── DOT CLICK ── */
dots.forEach((d) =>
  d.addEventListener("click", () => {
    document
      .getElementById(d.dataset.t)
      ?.scrollIntoView({ behavior: "smooth" });
  }),
);

/* mouse tilt removed — conflicts with tumble animation */

/* ── STAT COUNTERS ── */
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = +el.dataset.count;
  let n = 0;
  const step = Math.ceil(target / 60);
  const iv = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n + (target >= 100 ? "+" : "");
    if (n >= target) clearInterval(iv);
  }, 24);
}
const cio = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting)
        e.target.querySelectorAll("[data-count]").forEach(countUp);
    });
  },
  { threshold: 0.5 },
);
pages.forEach((p) => cio.observe(p));

/* ── CANVAS LENS FLARE on hero cube grid ── */
(function heroGlow() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:10;opacity:.4;";
  document.getElementById("p1").appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let t = 0;
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // animated glowing orb
    const x = canvas.width * 0.5 + Math.sin(t * 0.4) * 80;
    const y = canvas.height * 0.45 + Math.cos(t * 0.3) * 40;
    const g = ctx.createRadialGradient(x, y, 0, x, y, 300);
    g.addColorStop(0, "rgba(201,168,76,.18)");
    g.addColorStop(0.5, "rgba(232,93,38,.06)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // scattered tiny gold sparks
    for (let i = 0; i < 8; i++) {
      const sx =
        canvas.width * (0.3 + 0.4 * Math.sin(t * 0.22 + i)) +
        Math.cos(t * 0.31 + i * 1.3) * 120;
      const sy =
        canvas.height * (0.4 + 0.2 * Math.cos(t * 0.18 + i)) +
        Math.sin(t * 0.25 + i * 0.9) * 80;
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 22);
      sg.addColorStop(0, "rgba(201,168,76,.5)");
      sg.addColorStop(1, "transparent");
      ctx.fillStyle = sg;
      ctx.fillRect(sx - 22, sy - 22, 44, 44);
    }
    t += 0.016;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── SPOTLIGHT follow on bg pages ── */
pages.forEach((pg) => {
  const spot = document.createElement("div");
  spot.style.cssText =
    "position:absolute;inset:0;z-index:4;pointer-events:none;transition:background .05s;";
  pg.appendChild(spot);
  pg.addEventListener("mousemove", (e) => {
    const r = pg.getBoundingClientRect();
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%";
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%";
    spot.style.background = `radial-gradient(circle 400px at ${x} ${y},rgba(255,255,255,.05) 0%,transparent 70%)`;
  });
  pg.addEventListener("mouseleave", () => {
    spot.style.background = "";
  });
});

/* ── TEXT SCRAMBLE on section enter ── */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
function scramble(el) {
  const orig = el.textContent;
  let i = 0;
  const iv = setInterval(() => {
    el.textContent = orig
      .split("")
      .map((c, j) => {
        if (c === " ") return " ";
        return j < i
          ? orig[j]
          : ALPHA[Math.floor(Math.random() * ALPHA.length)];
      })
      .join("");
    i += 0.9;
    if (i >= orig.length) {
      el.textContent = orig;
      clearInterval(iv);
    }
  }, 36);
}
const sio = new IntersectionObserver(
  (e) => {
    e.forEach((en) => {
      if (en.isIntersecting) setTimeout(() => scramble(en.target), 500);
    });
  },
  { threshold: 0.9 },
);
document.querySelectorAll(".c-num").forEach((el) => sio.observe(el));

/* ── PARALLAX bg image on scroll ── */
reel.addEventListener("scroll", () => {
  pages.forEach((pg) => {
    const img = pg.querySelector(".bg-shot img");
    if (!img) return;
    const r = pg.getBoundingClientRect();
    const progress = (window.innerHeight / 2 - r.top) / window.innerHeight;
    const y = progress * 25;
    if (pg.classList.contains("on")) {
      img.style.transform = `scale(1.0) translateY(${y}px)`;
    }
  });
});

/* ── FLOATING DUST PARTICLES on bg pages ── */
(function bgParticles() {
  const configs = [
    { id: "p2", color: "201,168,76" },
    { id: "p3", color: "77,166,255" },
    { id: "p4", color: "232,93,38" },
  ];
  configs.forEach(({ id, color }) => {
    const pg = document.getElementById(id);
    if (!pg) return;

    const cv = document.createElement("canvas");
    cv.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6;opacity:0;transition:opacity 2.5s ease 1s;";
    pg.appendChild(cv);
    const ctx = cv.getContext("2d");

    /* create particles */
    let W,
      H,
      pts = [];
    function init() {
      W = cv.width = pg.offsetWidth;
      H = cv.height = pg.offsetHeight;
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18 - 0.12 /* slight upward drift */,
        o: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    init();
    window.addEventListener("resize", init);

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.0008 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.o * pulse})`;
        ctx.fill();
      });
      /* draw faint connecting lines between nearby particles */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x,
            dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${color},${0.04 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    /* show canvas only when page is active */
    const obs = new MutationObserver(() => {
      cv.style.opacity = pg.classList.contains("on") ? "1" : "0";
    });
    obs.observe(pg, { attributes: true, attributeFilter: ["class"] });
  });
})();

/* ── LIGHT STREAK on active bg pages ── */
(function lightStreak() {
  const configs = [
    { id: "p2", color: "201,168,76" },
    { id: "p3", color: "77,166,255" },
    { id: "p4", color: "232,93,38" },
  ];
  configs.forEach(({ id, color }) => {
    const pg = document.getElementById(id);
    if (!pg) return;
    const cv = document.createElement("canvas");
    cv.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:7;";
    pg.appendChild(cv);
    const ctx = cv.getContext("2d");
    let W,
      H,
      streaks = [],
      lastTime = 0;

    function init() {
      W = cv.width = pg.offsetWidth;
      H = cv.height = pg.offsetHeight;
    }
    init();
    window.addEventListener("resize", init);

    function spawnStreak() {
      /* occasional diagonal light streak across bg */
      const side = Math.random() > 0.5;
      streaks.push({
        x: side ? -100 : W + 100,
        y: Math.random() * H * 0.6 + H * 0.1,
        vx: (side ? 1 : -1) * (1.2 + Math.random() * 1.8),
        vy: (Math.random() - 0.5) * 0.4,
        len: 80 + Math.random() * 140,
        o: 0,
        life: 0,
        maxLife: 100 + Math.random() * 80,
      });
    }

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);
      if (!pg.classList.contains("on")) {
        requestAnimationFrame(draw);
        return;
      }

      /* spawn occasionally */
      if (ts - lastTime > 2800 + Math.random() * 3000) {
        spawnStreak();
        lastTime = ts;
      }

      streaks = streaks.filter((s) => s.life < s.maxLife);
      streaks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        /* fade in/out */
        s.o =
          s.life < 20
            ? s.life / 20
            : s.life > s.maxLife - 20
              ? (s.maxLife - s.life) / 20
              : 1;
        const grad = ctx.createLinearGradient(
          s.x - (s.len * s.vx) / Math.abs(s.vx),
          s.y,
          s.x,
          s.y,
        );
        grad.addColorStop(0, `rgba(${color},0)`);
        grad.addColorStop(1, `rgba(${color},${0.18 * s.o})`);
        ctx.beginPath();
        ctx.moveTo(s.x - s.len * (s.vx > 0 ? 1 : -1), s.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  });
})();
