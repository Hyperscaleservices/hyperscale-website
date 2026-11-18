const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');
menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menuButton.focus();
  }
});
const video = document.querySelector('#hero-video');
const videoButton = document.querySelector('#video-toggle');
if (video && videoButton) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let sourceLoaded = false;
  const syncButton = () => {
    videoButton.textContent = video.paused ? 'Play video' : 'Pause video';
    videoButton.setAttribute('aria-label', video.paused ? 'Play background video' : 'Pause background video');
  };
  const playVideo = async () => {
    if (!sourceLoaded) {
      const source = video.querySelector('source');
      source.src = source.dataset.src;
      sourceLoaded = true;
      video.load();
    }
    try {
      await video.play();
      videoButton.hidden = false;
    } catch {
      videoButton.hidden = false;
    }
    syncButton();
  };
  videoButton.hidden = false;
  videoButton.addEventListener('click', () => {
    if (video.paused) {
      userPaused = false;
      playVideo();
    } else {
      userPaused = true;
      video.pause();
    }
  });
  video.addEventListener('play', syncButton);
  video.addEventListener('pause', syncButton);
  video.addEventListener('error', () => { videoButton.hidden = true; });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) video.pause();
    else if (!userPaused) playVideo();
  });
  if (!reducedMotion.matches && !navigator.connection?.saveData) playVideo();
  syncButton();
}
