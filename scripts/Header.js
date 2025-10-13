import afterVisualUpdate from './utils/afterVisualUpdate.js';

const rootSelector = '[data-js-header]';

class Header {
  selectors = {
    headerMenu: '[data-js-header-menu]',
    burgerButton: '[data-js-header-burger-button]',
    modal: '[data-js-header-modal]',
    closeButton: '[data-js-header-modal-close-button]',
    focusableElements:
      'button, [href], input, select, textarea, ' + "[tabindex]:not([tabindex='-1'])",
  };

  stateClasses = {
    isActive: 'is-active',
    isLock: 'is-lock',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton);
    this.modalElement = this.rootElement.querySelector(this.selectors.modal);
    this.modalCloseButtonElement = this.rootElement.querySelector(this.selectors.closeButton);
    this.focusableElements = this.modalElement.querySelectorAll(this.selectors.focusableElements);

    this.bindEvents();
  }

  onBurgerButtonClick = () => {
    this.modalElement.classList.add(this.stateClasses.isActive);
    this.modalElement.showModal();

    document.documentElement.classList.add(this.stateClasses.isLock);

    document.addEventListener('keydown', this.onModalKeyDown);

    afterVisualUpdate(() => {
      this.modalCloseButtonElement.focus();
    });
  };

  onCloseButtonClick = () => {
    this.onModalClose();
  };

  //Модальное окно может быть закрыто также с помощью клавиши Esc, а не только
  //по клику. Независимо от способа закрытия мы должны убрать окну класс.
  onModalClose = () => {
    document.documentElement.classList.remove(this.stateClasses.isLock);
    this.modalElement.classList.remove(this.stateClasses.isActive);
    this.modalElement.close();
    document.removeEventListener('keydown', this.onModalKeyDown);
  };

  onModalKeyDown = (event) => {
    if (!this.modalElement.classList.contains(this.stateClasses.isActive)) {
      return;
    }

    switch (event.key) {
      case 'Tab':
        if (this.focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        if (event.shiftKey && document.activeElement === this.focusableElements[0]) {
          event.preventDefault();
          this.focusableElements[this.focusableElements.length - 1].focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === this.focusableElements[this.focusableElements.length - 1]
        ) {
          event.preventDefault();
          this.focusableElements[0].focus();
        }

        break;

      case 'Escape':
        this.onModalClose();

        break;
    }
  };

  bindEvents() {
    this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick);

    this.modalCloseButtonElement.addEventListener('click', this.onCloseButtonClick);
  }
}

class HeaderCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Header(element);
    });
  }
}

export default HeaderCollection;
