// ================== Data Hari & Bulan ==================

const hariID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const bulanID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// ================== Fungsi Pendukung ==================

function z(n) {
  return n < 10 ? "0" + n : n;
}

function getWITA() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Makassar" })
  );
}

// ================== Update Digital & Analog Clock ==================

function updateDigital() {
  const now = getWITA();

  const jam = z(now.getHours()),
    menit = z(now.getMinutes()),
    detik = z(now.getSeconds());

  const dEl = document.getElementById("digitalClock");
  const dateEl = document.getElementById("dateText");

  if (dEl) dEl.textContent = `${jam}:${menit}:${detik}`;

  if (dateEl) {
    const dayName = hariID[now.getDay()];
    const tgl = now.getDate();
    const monthName = bulanID[now.getMonth()];
    const year = now.getFullYear();

    dateEl.textContent = `${dayName}, ${tgl} ${monthName} ${year}`;
  }

  updateAnalog(now);
}

function updateAnalog(now) {
  const secondEl = document.getElementById("secondHand");
  const minuteEl = document.getElementById("minuteHand");
  const hourEl = document.getElementById("hourHand");

  if (!secondEl || !minuteEl || !hourEl) return;

  const detik = now.getSeconds() + now.getMilliseconds() / 1000;
  const menit = now.getMinutes() + detik / 60;
  const jam = (now.getHours() % 12) + menit / 60;

  // Rotasi jarum sesuai arah jam
  secondEl.style.transform = `rotate(${detik * 6}deg)`;
  minuteEl.style.transform = `rotate(${menit * 6}deg)`;
  hourEl.style.transform = `rotate(${jam * 30}deg)`;
}

// ================== Roman numerals ==================

function createRomanNumerals() {
  const analog = document.getElementById("analogClock");
  if (!analog) return;

  analog.querySelectorAll(".number").forEach(n => n.remove());

  if (!analog.querySelector(".center-dot")) {
    const cd = document.createElement("div");
    cd.className = "center-dot";
    analog.appendChild(cd);
  }

  const romans = [
    "XII", "I", "II", "III", "IV", "V",
    "VI", "VII", "VIII", "IX", "X", "XI"
  ];

  const radius = 105;
  const centerX = 140;
  const centerY = 140;

  for (let i = 0; i < 12; i++) {
    const angleDeg = i * 30;
    const angleRad = (angleDeg * Math.PI) / 180;

    const x = centerX + Math.sin(angleRad) * radius;
    const y = centerY - Math.cos(angleRad) * radius;

    const num = document.createElement("div");
    num.className = "number";
    num.style.left = `${x}px`;
    num.style.top = `${y}px`;
    num.textContent = romans[i];

    analog.appendChild(num);
  }
}

// ================== Musik playlist 3 lagu bergantian ==================

document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("main-music");
  const playlist = [
    "https://files.catbox.moe/g8upcu.mp3",
    "https://files.catbox.moe/9cllvf.mp3",
    "https://files.catbox.moe/va87jr.mp3"
  ];
  let currentIndex = 0;

  // ================== Welcome Panel ==================

  const welcome = document.getElementById("welcome-panel");
  const notif = document.getElementById("notif");

  // ================== Login / UI Flow ==================

  const btn = document.getElementById("btnLogin");
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");
  const overlay = document.getElementById("loginOverlay");
  const container = document.getElementById("clockContainer");
  const loginCard = overlay ? overlay.querySelector(".login-card") : null;

  let intervalId = null;

  function startClockOnce() {
    if (intervalId) return;
    createRomanNumerals();
    updateDigital();
    intervalId = setInterval(updateDigital, 1000);
  }

  function startMusic() {
    if (!music) return;

    music.pause();
    music.currentTime = 0;
    music.volume = 0.3;
    music.muted = false;

    function playCurrent() {
      music.src = playlist[currentIndex];
      music.load();
      music.play().catch(e => {
        console.warn("Audio play error:", e);
      });
    }

    music.onended = () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      playCurrent();
    };

    playCurrent();
  }

  function showWelcomePanel() {
    if (!welcome) return;
    welcome.classList.add("show");
    welcome.classList.remove("hide");

    setTimeout(() => {
      if (welcome) {
        welcome.classList.remove("show");
        welcome.classList.add("hide");
      }
    }, 3000);
  }

  function showNotif() {
    if (!notif) return;
    notif.classList.add("show");
    setTimeout(() => notif.classList.remove("show"), 5000);
  }

  function shakeLogin() {
    if (loginCard) {
      loginCard.classList.add("shake");
      setTimeout(() => loginCard.classList.remove("shake"), 450);
    }
  }

  function handleLogin() {
    const username = usernameEl ? usernameEl.value.trim() : "";
    const password = passwordEl ? passwordEl.value.trim() : "";

    if (!username || !password) {
      shakeLogin();
      return;
    }

    const USER = "VII";
    const PASS = "KETUA";

if (username === USER && password === PASS) {
      if (overlay) {
        overlay.classList.add("hide");
        setTimeout(() => {
          if (overlay) overlay.style.display = "none";
        }, 600);
      }

      if (container) container.classList.add("show");

      showWelcomePanel();
      showNotif();

      startClockOnce();
      startMusic();
    } else {
      shakeLogin();
    }
  }

  if (btn) btn.addEventListener("click", handleLogin);

  document.addEventListener("keydown", e => {
    if (e.key === "Enter") handleLogin();
  });
});