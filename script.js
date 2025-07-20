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
    delay: 8000,
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
  const wrapper = video.closest('.video-wrapper'); // ✅ this is new

  // Hover preview
  video.addEventListener('mouseenter', () => {
    swiper.autoplay.stop();

    videos.forEach(v => {
      if (v !== video) {
        v.pause();
        v.controls = false;
        v.muted = true;
        v.closest('.video-wrapper')?.classList.remove('playing'); // ✅ remove class from others
      }
    });

    video.controls = false;
    video.muted = true;
    video.play().catch(() => {});
    wrapper?.classList.add('playing'); // ✅ add play-hide class on hover
  });

  // Pause preview on leave
  video.addEventListener('mouseleave', () => {
    video.pause();
    video.controls = false;
    video.muted = true;

    wrapper?.classList.remove('playing'); // ✅ bring back the play icon

    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      swiper.autoplay.start();
    }, 2000);
  });

  // Fullscreen click behavior
  video.addEventListener('click', () => {
    video.muted = false;
    video.controls = true;

    wrapper?.classList.remove('playing'); // ✅ icon is hidden when clicked

    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
  });
});

// Handle exiting fullscreen
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    videos.forEach(v => {
      v.controls = false;
      v.pause();
      v.muted = true;

      v.closest('.video-wrapper')?.classList.remove('playing'); // ✅ show icon again
    });
  }
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





const donateModal = document.getElementById('donate-modal');
const donateBtns = document.querySelectorAll('[data-donate-btn]');
const donateModalCloseBtn = document.getElementById('close-donate-modal');

// Function to show modal with fade and pointer enable
let scrollY1 = 0;

function showDonateModal() {
  scrollY1 = window.scrollY;
  document.body.style.top = `-${scrollY1}px`;
  document.body.classList.add('noscroll-preserve');
  donateModal.classList.remove('pointer-events-none', 'opacity-0');
  donateModal.classList.add('opacity-100', 'pointer-events-auto');
}

function hideDonateModal() {
  document.body.classList.remove('noscroll-preserve');
  document.body.style.top = '';
  window.scrollTo(0, scrollY1);
  donateModal.classList.remove('opacity-100', 'pointer-events-auto');
  donateModal.classList.add('opacity-0', 'pointer-events-none');
}


// Open on any donate button click
donateBtns.forEach(btn => {
  btn.addEventListener('click', showDonateModal);
});

// Close on click of X
donateModalCloseBtn.addEventListener('click', hideDonateModal);

// Close on click outside modal content
donateModal.addEventListener('click', e => {
  if (e.target === donateModal) {
    hideDonateModal();
  }
});





const contactModal = document.getElementById('contact-modal');
const contactBtns = document.querySelectorAll('[data-contact-btn]');
const contactModalCloseBtn = document.getElementById('close-contact-modal');

// Function to show modal with fade and pointer enable
let scrollY2 = 0;

function showContactModal() {
  scrollY2 = window.scrollY;
  document.body.style.top = `-${scrollY2}px`;
  document.body.classList.add('noscroll-preserve');
  contactModal.classList.remove('pointer-events-none', 'opacity-0');
  contactModal.classList.add('opacity-100', 'pointer-events-auto');
}

function hideContactModal() {
  document.body.classList.remove('noscroll-preserve');
  document.body.style.top = '';
  window.scrollTo(0, scrollY2);
  contactModal.classList.remove('opacity-100', 'pointer-events-auto');
  contactModal.classList.add('opacity-0', 'pointer-events-none');
}


// Open on any donate button click
contactBtns.forEach(btn => {
  btn.addEventListener('click', showContactModal);
});

// Close on click of X
contactModalCloseBtn.addEventListener('click', hideContactModal);

// Close on click outside modal content
contactModal.addEventListener('click', e => {
  if (e.target === contactModal) {
    hideContactModal();
  }
});
