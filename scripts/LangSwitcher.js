const rootSelector = '[data-js-lang-switcher]';

class LangSwitcher {
  selectors = {
    loader: '.loader',
    modal: '[data-js-header-modal]',

    button: '[data-js-lang-switcher-button]',

    i88n: '[data-js-i18n]',
    i88nLabel: '[data-js-i18n-aria-label]',
    i88nTitle: '[data-js-i18n-aria-title]',
    i88nAria: '[data-js-i18n-aria]',
  };

  dataAttrs = {
    i88n: 'jsI18n',
    label: 'jsI18nAriaLabel',
    alt: 'jsI18nAriaAlt',
  };

  langs = {
    jsLangSwitcherEn: 'en',
    jsLangSwitcherDe: 'de',
    jsLangSwitcherFr: 'fr',
  };

  messages = {
    en: {
      nextSlideMessage: 'Next slide',
      prevSlideMessage: 'Previous slide',
      paginationBulletMessage: 'Go to slide {{index}}',
      firstSlideMessage: 'This is the first slide',
      lastSlideMessage: 'This is the last slide',
    },

    de: {
      nextSlideMessage: 'Nächste Folie',
      prevSlideMessage: 'Vorherige Folie',
      paginationBulletMessage: 'Gehe zu Folie {{index}}',
      firstSlideMessage: 'Dies ist die erste Folie',
      lastSlideMessage: 'Dies ist die letzte Folie',
    },

    fr: {
      nextSlideMessage: 'Slide suivante',
      prevSlideMessage: 'Slide précédente',
      paginationBulletMessage: 'Aller à la slide {{index}}',
      firstSlideMessage: 'Ceci est la première slide',
      lastSlideMessage: 'Ceci est la dernière slide',
    },
  };

  propertiesCSS = {
    timeToDelete: '--loaderFullDurationDisappearance',
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'is-lock',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.modalElement = document.body.querySelector(this.selectors.modal);
    this.buttonElements = document.body.querySelectorAll(this.selectors.button);
    this.selectedLanguage = null;
    this.selectedLanguageText = null;
    this.switchLangEvent = null;

    this.bindEvents();
  }

  closeModal = () => {
    this.modalElement.close();
    this.modalElement.classList.remove(this.stateClasses.isActive);
    document.documentElement.classList.remove(this.stateClasses.isLock);
  };

  onButtonClick = async (event) => {
    const target = event.target;

    if (target.tagName !== 'BUTTON' || event.target.classList.contains(this.stateClasses.isActive))
      return;

    if (this.modalElement.classList.contains(this.stateClasses.isActive)) this.closeModal();
    this.determineSwitchingLang(target);
    await this.switchLang();
    this.switchLangEvent = new CustomEvent('switchlang', {
      bubbles: true,
      detail: {
        lang: this.selectedLanguage,
        messages: this.messages,
      },
    });
    this.rootElement.dispatchEvent(this.switchLangEvent);
    this.updateButtons(target);
  };

  updateButtons(activeButton) {
    this.buttonElements.forEach((button) => {
      if (!activeButton.isEqualNode(button)) {
        button.classList.remove(this.stateClasses.isActive);
      }

      if (button.dataset.jsI18n === activeButton.dataset.jsI18n) {
        activeButton.classList.add(this.stateClasses.isActive);
        button.classList.add(this.stateClasses.isActive);
      }
    });
  }

  createLoader() {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `
          <div class='loader is-active'>
              <img 
                  class='loader__logo loaded' 
                  src='/images/logo.svg' 
                  width='263'
                  height='46' 
                  alt=''
              >
              <div class='loader__circles-container'>
                  <div class='loader__circle loader__circle--1'></div>
                  <div class='loader__circle loader__circle--2'></div>
                  <div class='loader__circle loader__circle--3'></div>
              </div>
          </div>
      `,
    );
  }

  deleteLoader() {
    const loader = document.querySelector(this.selectors.loader);
    const loaderStyles = getComputedStyle(loader);
    const deletePreloaderTime = loaderStyles.getPropertyValue(this.propertiesCSS.timeToDelete);

    loader.classList.remove(this.stateClasses.isActive);

    setTimeout(() => {
      loader.remove();
      this.activeScroll();
    }, deletePreloaderTime);
  }

  determineSwitchingLang(button) {
    for (const key in button.dataset) {
      if (key in this.langs) {
        this.selectedLanguage = this.langs[key];
        break;
      }
    }
  }

  activeScroll() {
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
  }

  blockScroll() {
    document.documentElement.style = 'overflow: hidden; scrollbar-gutter: stable';
    document.body.style = 'overflow: hidden';
  }

  async switchLang() {
    if (!this.selectedLanguage) return;

    this.blockScroll();
    this.createLoader();
    await this.loadLang();
    this.changeContent();
    this.changeAria();
    this.deleteLoader();

    document.documentElement.lang = this.selectedLanguage.toLocaleLowerCase();
  }

  async loadLang() {
    const basePath = '../langs/';

    let loadLangPromise = await import(basePath + this.selectedLanguage + '.js');
    this.selectedLanguageText = loadLangPromise.default;
  }

  changeContent() {
    const translatableElements = document.querySelectorAll(this.selectors.i88n);

    translatableElements.forEach((item) => {
      item.textContent = this.selectedLanguageText[item.dataset.jsI18n];
    });
  }

  changeAria() {
    const translatableAriaElements = document.querySelectorAll(this.selectors.i88nAria);

    translatableAriaElements.forEach((item) => {
      if (item.hasAttribute('aria-label')) {
        ('aria-label', this.selectedLanguageText[item.dataset[this.dataAttrs.label]]);

        if (item.hasAttribute('title')) {
          item.setAttribute('title', this.selectedLanguageText[item.dataset[this.dataAttrs.label]]);
        }
      }

      if (item.hasAttribute('alt')) {
        item.setAttribute('alt', this.selectedLanguageText[item.dataset[this.dataAttrs.alt]]);
      }

      /*
        TODO: Реализовать в слайдерах изменение a11y в navigation
      */
    });
  }

  // TODO: Сделать сохранение выбранного языка в кеш

  bindEvents() {
    this.rootElement.addEventListener('click', this.onButtonClick);
  }
}

class LangSwitcherCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new LangSwitcher(element);
    });
  }
}

export default LangSwitcherCollection;
