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

function setActive() {
  const mid = window.innerHeight / 2;
  pages.forEach((pg, i) => {
    const r = pg.getBoundingClientRect();
    const isOn = r.top < mid && r.bottom > mid;
    pg.classList.toggle("on", isOn);
    if (dots[i]) dots[i].classList.toggle("on", isOn);
  });
}
reel.addEventListener("scroll", setActive);
window.addEventListener("load", () => {
  pages[0].classList.add("on");
  dots[0].classList.add("on");
});

/* ── DOT CLICK ── */
dots.forEach((d) =>
  d.addEventListener("click", () => {
    document
      .getElementById(d.dataset.t)
      ?.scrollIntoView({ behavior: "smooth" });
  }),
);

/* ── 3D CARD MOUSE TILT ── */
pages.forEach((pg) => {
  const card = pg.querySelector(".card3d");
  if (!card) return;
  pg.addEventListener("mousemove", (e) => {
    const r = pg.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const tx = pg.id === "p3" ? -2 : 2;
    card.style.transform = `translateY(-50%) perspective(1000px) rotateY(${tx + x * 12}deg) rotateX(${-1 + -y * 8}deg)`;
  });
  pg.addEventListener("mouseleave", () => {
    const tx = pg.id === "p3" ? "-2" : 2;
    card.style.transform = `translateY(-50%) perspective(1000px) rotateY(${tx}deg) rotateX(-1deg)`;
  });
});

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
    const y = progress * 30;
    img.style.transform = `scale(${pg.classList.contains("on") ? 1.0 : 1.08}) translateY(${y}px)`;
  });
});
