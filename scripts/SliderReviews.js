const rootSelector = '[data-js-slider-reviews]';

class SliderReviews {
  selectors = {
    main: '[data-js-slider-reviews-main]',
    pagination: '[data-js-slider-reviews-pagination]',
    nextButton: '[data-js-slider-reviews-button-next]',
    prevButton: '[data-js-slider-reviews-button-prev]',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.mainElement = this.rootElement.querySelector(this.selectors.main);
    this.nextButton = this.rootElement.querySelector(this.selectors.nextButton);
    this.prevButton = this.rootElement.querySelector(this.selectors.prevButton);

    this.init();
  }

  init() {
    new Swiper(this.mainElement, {
      direction: 'horizontal',
      simulateTouch: false,
      speed: 600,
      spaceBetween: 30,
      slidesPerView: 1,
      loop: true,
      effect: 'fade',

      fadeEffect: {
        crossFade: true,
      },

      pagination: {
        el: this.selectors.pagination,
        clickable: true,
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
    });
  }
}

class SliderReviewsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new SliderReviews(element);
    });
  }
}

export default SliderReviewsCollection;
