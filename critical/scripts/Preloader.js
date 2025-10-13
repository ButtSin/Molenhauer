(function () {
  const SELECTORS = {
    preloader: '.loader',
  };
  const PROPERTIES = {
    timeToDelete: '--loaderFullDurationDisappearance',
  };
  const STATE_CLASSES = {
    isActive: 'is-active',
  };
  const STORAGE_KEYS = {
    visit: 'visit',
  };
  const LOAD_TIMEOUT = 10000;

  let DELETE_PRELOADER_TIMEOUT = null;
  let timeoutId = null;

  function isFirstVisit() {
    return localStorage.getItem(STORAGE_KEYS.visit) === null;
  }

  function activeScroll() {
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
  }

  function deletePreloader(event) {
    const preloader = document.querySelector(SELECTORS.preloader);
    const preloaderStyles = getComputedStyle(preloader);
    DELETE_PRELOADER_TIMEOUT = preloaderStyles.getPropertyValue(PROPERTIES.timeToDelete);

    preloader.classList.remove(STATE_CLASSES.isActive);

    if (event) {
      clearTimeout(timeoutId);
    } else {
      window.removeEventListener('load', deletePreloader);
    }

    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.visit, true);

      preloader.remove();
      activeScroll();
    }, DELETE_PRELOADER_TIMEOUT);
  }

  if (!isFirstVisit()) {
    activeScroll();
    return;
  }

  document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <div class="loader is-active">
          <img 
              class="loader__logo" 
              src="/images/logo.svg" 
              width="263"
              height="46" 
              alt=""
              onload="this.classList.add('loaded')" 
          >
          <div class="loader__circles-container">
              <div class="loader__circle loader__circle--1"></div>
              <div class="loader__circle loader__circle--2"></div>
              <div class="loader__circle loader__circle--3"></div>
          </div>
      </div>
    `,
  );

  timeoutId = setTimeout(deletePreloader, LOAD_TIMEOUT);
  window.addEventListener('load', deletePreloader);
})();
