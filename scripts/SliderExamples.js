import swiperTabulationFix from './utils/swiperTabulationFix.js';
import swiperAutoplayTabFix from './utils/swiperAutoplayTabFix.js';

const rootSelector = '[data-js-slider-examples]';

class SliderExamples {
  selectors = {
    slide: '.swiper-slide',
    bullet: '.swiper-pagination-bullet',
    pagination: '[data-js-slider-examples-pagination]',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;

    this.init();
  }

  init() {
    this.swiper = new Swiper(this.rootElement, {
      direction: 'horizontal',
      simulateTouch: true,
      speed: 600,
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 30,

      pagination: {
        el: this.selectors.pagination,
        clickable: true,
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
        500.98: {
          spaceBetween: 0,
          slidesPerView: 3,
          slidesPerGroup: 3,
        },

        834.98: {
          spaceBetween: 0,
          slidesPerView: 4,
          slidesPerGroup: 4,
        },

        1180.98: {
          spaceBetween: 0,
          slidesPerView: 6,
        },
      },

      on: {
        afterInit: () => {
          requestAnimationFrame(() => {
            swiperAutoplayTabFix(this.swiper, this.rootElement);

            swiperTabulationFix(this.swiper, this.rootElement);
            this.swiper.on('breakpoint', () => swiperTabulationFix(this.swiper));
          });
        },

        slideChange: () => {
          swiperTabulationFix(this.swiper);
        },
      },
    });
  }
}

class SliderExamplesCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new SliderExamples(element);
    });
  }
}

export default SliderExamplesCollection;
