document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // CONFIG
  // ===============================
  const DEFAULT_IDLE_TIME = 60000; // 1 minute
  const WARNING_TIME = 10000;      // 10 seconds before idle

  const idleTime =
    parseInt(document.body.dataset.idle, 10) || DEFAULT_IDLE_TIME;

  let idleTimer = null;
  let warningTimer = null;
  let countdownTimer = null;

  // ===============================
  // ELEMENTS
  // ===============================
  const idleScreen = document.getElementById('idleScreen');
  const mainScreen = document.getElementById('mainScreen');
  const warning = document.getElementById('idleWarning');
  const countdown = document.getElementById('countdown');

  // ===============================
  // FUNCTIONS
  // ===============================
  function isHomePage() {
    const path = window.location.pathname;
    return (
      path === '/BukBot/' ||
      path === '/BukBot' ||
      path.endsWith('/BukBot/index.html')
    );
  }

  function goHome() {
    // If already on HOME → show idle screen
    if (isHomePage()) {
      if (idleScreen && mainScreen) {
        idleScreen.style.display = 'flex';
        mainScreen.style.display = 'none';
      }
      return;
    }

    // If on sub-page → redirect to HOME
    window.location.href = '../index.html';
  }

  function showWarning() {
    if (!warning || !countdown) return;

    let seconds = WARNING_TIME / 1000;
    countdown.textContent = seconds;
    warning.style.display = 'block';

    countdownTimer = setInterval(() => {
      seconds--;
      countdown.textContent = seconds;
    }, 1000);
  }

  function hideWarning() {
    if (!warning) return;
    warning.style.display = 'none';
    clearInterval(countdownTimer);
  }

  function wakeFromIdle() {
    if (idleScreen.style.display === 'flex') {
      idleScreen.style.display = 'none';
      mainScreen.style.display = 'block';
    }
    resetIdle();
  }


  function resetIdle() {
    clearTimeout(idleTimer);
    clearTimeout(warningTimer);
    hideWarning();

    warningTimer = setTimeout(showWarning, idleTime - WARNING_TIME);
    idleTimer = setTimeout(goHome, idleTime);
  }

  // ===============================
  // USER ACTIVITY
  // ===============================
  ['mousemove', 'mousedown', 'touchstart', 'keypress'].forEach(evt => {
    document.addEventListener(evt, wakeFromIdle, { passive: true });
  });


  // ===============================
  // PAUSE IDLE WHILE TYPING
  // ===============================
  document.addEventListener('focusin', e => {
    if (e.target.matches('input, textarea, select')) {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      hideWarning();
    }
  });

  document.addEventListener('focusout', e => {
    if (e.target.matches('input, textarea, select')) {
      resetIdle();
    }
  });

  // ===============================
  // INITIAL STATE
  // ===============================
  if (idleScreen && mainScreen) {
    idleScreen.style.display = 'none';
    mainScreen.style.display = 'block';
  }

  resetIdle();
});
