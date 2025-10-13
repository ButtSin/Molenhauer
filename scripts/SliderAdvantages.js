import pxToRem from './utils/pxToRem.js';

const rootSelector = '[data-js-slider-advantages]';

class SliderAdvantages {
  selectors = {
    pagination: '[data-js-slider-advantages-pagination]',
    nextButton: '[data-js-slider-advantages-button-next]',
    prevButton: '[data-js-slider-advantages-button-prev]',
  };

  styleClasses = {
    bullet: '.custom-bullet',
    bulletTitle: '.bullet-title',
    cardTitle: '.advantage-card__title',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.paginationElement = this.rootElement.querySelector(this.selectors.pagination);
    this.nextButton = this.rootElement.querySelector(this.selectors.nextButton);
    this.prevButton = this.rootElement.querySelector(this.selectors.prevButton);

    this.slideData = this.getOriginalSlideData();

    this.init();
    this.initObservers();
    this.bindEvents();
  }

  // Получаем данные оригинальных слайдов до инициализации swiper, чтобы не
  // было дубликатов из-за loop: true
  getOriginalSlideData() {
    const slides = Array.from(this.rootElement.querySelectorAll('.swiper-slide'));

    return slides.map((slide, index) => ({
      title: slide.querySelector(this.styleClasses.cardTitle).textContent,
      number: (index + 1).toString().padStart(2, '0'),
    }));
  }

  updatePaginationLang = () => {
    const titleElements = this.rootElement.querySelectorAll(this.styleClasses.cardTitle);
    const titleCardElements = [];

    titleElements.forEach((titleElement) => {
      titleCardElements.push(titleElement.parentNode);
    });

    titleElements.forEach((titleElement, index) => {
      const cardOfCurrentTitle = titleCardElements.find((cardElement) => {
        return index === Number(cardElement.dataset.swiperSlideIndex);
      });

      const currentCardTitle = cardOfCurrentTitle.querySelector(this.styleClasses.cardTitle);

      this.slideData[index].title = currentCardTitle.innerHTML.trim();
    });
  };

  onSwitchLang = (event) => {
    this.updateA11yLang(event);

    this.updatePaginationLang();
    this.updateNavigationLang(event);
  };

  updateA11yLang(event) {
    const currentLang = event.detail.lang;
    this.currentA11yMessages = event.detail.messages[currentLang];

    Object.assign(this.swiper.params.a11y, this.currentA11yMessages);
  }

  updateNavigationLang() {
    this.nextButton.setAttribute('aria-label', this.currentA11yMessages.nextSlideMessage);
    this.prevButton.setAttribute('aria-label', this.currentA11yMessages.prevSlideMessage);
  }

  init() {
    let context = this;

    this.swiper = new Swiper(this.rootElement, {
      direction: 'horizontal',
      loop: true,
      simulateTouch: false,
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 25,

      pagination: {
        el: this.paginationElement,
        type: 'custom',
        renderCustom: function (swiper, current, total) {
          let paginationHTML = '';

          for (let i = 0; i < total; i++) {
            const isActive = swiper.realIndex === i;
            const slide = context.slideData[i];

            paginationHTML += `
              <div 
                class=
                "
                  custom-bullet 
                  swiper-pagination-bullet 
                  ${isActive ? 'active swiper-pagination-bullet-active' : ''} 
                  dotted-border-right
                "
                data-index="${i}" 
                ${isActive ? 'tabindex=0 aria-current=true' : ''}
              >
                <span class="bullet-number">
                  ${slide.number}
                  <span class="cross cross--bottom"></span>
                </span>
                <span class="bullet-title">${slide.title}</span>
              </div>
              `;
          }
          return paginationHTML;
        },
      },

      navigation: {
        nextEl: this.nextButton,
        prevEl: this.prevButton,
      },

      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },

      autoplay: {
        delay: 5000,
        disableOnInteraction: true,
        pauseOnMouseEnter: true,
      },

      breakpoints: {
        834.98: {
          simulateTouch: false,
        },
      },
    });
  }

  initObservers() {
    this.paginationResizeObserver = new ResizeObserver((entires) => {
      for (let entry of entires) {
        const height = entry.contentRect.height.toFixed(2);
        this.rootElement.style = `--paginationHeight: ${pxToRem(height)}rem`;
      }
    });
    this.paginationResizeObserver.observe(this.paginationElement);
  }

  onBulletClick = (event) => {
    const bullet = event.target.closest(this.styleClasses.bullet);

    if (bullet) {
      this.swiper.slideToLoop(parseInt(bullet.dataset.index));
    }
  };

  bindEvents() {
    this.paginationElement.addEventListener('click', this.onBulletClick);

    document.addEventListener('switchlang', this.onSwitchLang);
  }
}

class SliderAdvantagesCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new SliderAdvantages(element);
    });
  }
}

export default SliderAdvantagesCollection;
