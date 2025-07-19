const swiper = new Swiper(".mySwiper", {
  loop: true,
  spaceBetween: 24,
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },
  autoplay: {
    delay: 6000,
    disableOnInteraction: false
  },
  breakpoints: {
    1024: { slidesPerView: 3 },
    768: { slidesPerView: 2 },
    0:    { slidesPerView: 1 }
  }
});

const videos = document.querySelectorAll('.carousel-video');
let hoverTimeout = null;

videos.forEach(video => {
  // Hover preview
  video.addEventListener('mouseenter', () => {
    swiper.autoplay.stop();

    videos.forEach(v => {
      if (v !== video) {
        v.pause();
        v.controls = false;
        v.muted = true; // force mute others
      }
    });

    video.controls = false;
    video.muted = true; // preview is always muted
    video.play().catch(() => {});
  });

  // Pause preview on leave
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.controls = false;
    video.muted = true; // always keep it muted when leaving

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      swiper.autoplay.start();
    }, 2000);
  });

  // Fullscreen click behavior
  video.addEventListener('click', () => {
    video.muted = false; // unmute in fullscreen
    video.controls = true;

    // request fullscreen
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  });

  // Handle exiting fullscreen
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      videos.forEach(v => {
        v.controls = false;
        v.pause();
        v.muted = true; // return to muted preview
      });
    }
  });
});





document.querySelectorAll('.group').forEach(group => {
  let currentAngle = 0;
  let animationFrame = null;
  let animating = false;

  const duration = 400;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateTo(targetAngle, onComplete) {
    let start = null;
    let initialAngle = currentAngle;

    function step(time) {
      if (!start) start = time;
      const elapsed = time - start;
      const rawProgress = Math.min(elapsed / duration, 1);
      const progress = easeInOutCubic(rawProgress);

      const newAngle = initialAngle + (targetAngle - initialAngle) * progress;
      currentAngle = newAngle;
      group.style.setProperty('--angle', `${currentAngle}deg`);

      if (rawProgress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        animationFrame = null;
        if (onComplete) onComplete();
      }
    }

    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(step);
  }

  group.addEventListener('mouseenter', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animateTo(360);
  });

  group.addEventListener('mouseleave', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animateTo(0);
  });
});





const modal = document.getElementById('donate-modal');
const donateBtns = document.querySelectorAll('[data-donate-btn]');
const closeBtn = document.getElementById('close-modal');

// Function to show modal with fade and pointer enable
let scrollY = 0;

function showModal() {
  scrollY = window.scrollY;
  document.body.style.top = `-${scrollY}px`;
  document.body.classList.add('noscroll-preserve');
  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.classList.add('opacity-100', 'pointer-events-auto');
}

function hideModal() {
  document.body.classList.remove('noscroll-preserve');
  document.body.style.top = '';
  window.scrollTo(0, scrollY);
  modal.classList.remove('opacity-100', 'pointer-events-auto');
  modal.classList.add('opacity-0', 'pointer-events-none');
}


// Open on any donate button click
donateBtns.forEach(btn => {
  btn.addEventListener('click', showModal);
});

// Close on click of X
closeBtn.addEventListener('click', hideModal);

// Close on click outside modal content
modal.addEventListener('click', e => {
  if (e.target === modal) {
    hideModal();
  }
});
