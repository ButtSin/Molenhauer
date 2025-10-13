//TODO: сделать переводы a11y на другие языки.

const rootSelector = '[data-js-slider-partners]';

class SliderPartners {
  selectors = {
    pagination: '[data-js-slider-partners-pagination]',
    wrapper: '[data-js-slider-partners-wrapper]',
    nextButton: '[data-js-slider-partners-button-next]',
    prevButton: '[data-js-slider-partners-button-prev]',
  };

  styleClasses = {
    borderBottom: 'dotted-border-bottom',
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.paginationElement = this.rootElement.querySelector(this.selectors.pagination);
    this.wrapperElement = this.rootElement.querySelector(this.selectors.wrapper);
    this.nextButton = this.rootElement.querySelector(this.selectors.nextButton);
    this.prevButton = this.rootElement.querySelector(this.selectors.prevButton);

    this.slidesPerView = 3;
    this.slidesPerGroup = 3;
    this.rows = 3;
    this.quantityPageSlides = this.slidesPerView * this.rows;
    this.quantityGridSlides = this.slidesPerView * this.slidesPerGroup * this.rows;
    this.hasBlankSlides = false;
    this.speed = 600;

    this.baseConfig = {
      direction: 'horizontal',
      speed: this.speed,

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
    };

    this.mobileConfig = {
      ...this.baseConfig,
      slidesPerView: this.slidesPerView,
      slidesPerGroup: this.slidesPerGroup,
      spaceBetween: 1,
      loopAddBlankSlides: false,
      rewind: true,

      grid: {
        rows: this.rows,
        fill: 'row',
      },

      on: {
        init: (swiper) => {
          this.updateBorders(swiper);
          this.addBlankSlides(swiper);
          this.oldTransformValue = this.getTransformValue();
        },

        sliderMove: (swiper) => {
          requestAnimationFrame(() => {
            const currentTransformValue = this.getTransformValue();

            if (
              this.oldTransformValue !== currentTransformValue &&
              !this.rootElement.classList.contains('swiping')
            ) {
              this.rootElement.classList.add('swiping');
            }
          });
        },

        transitionStart: (swiper) => {
          if (!this.rootElement.classList.contains('swiping')) {
            this.rootElement.classList.add('swiping');
          }
        },

        transitionEnd: (swiper) => {
          this.rootElement.classList.remove('swiping');
        },

        slideChange: (swiper) => {
          this.oldTransformValue = this.getTransformValue();
        },
      },
    };

    this.tabletConfig = {
      ...this.baseConfig,
      slidesPerView: 3,
      slidesPerGroup: 3,
      loopAddBlankSlides: true,
      loop: true,
      simulateTouch: true,

      on: {
        beforeInit: (swiper) => {
          this.deleteBlankSlides();
        },
      },
    };

    this.desktopConfig = {
      ...this.baseConfig,
      slidesPerView: 4,
      slidesPerGroup: 4,
      loop: true,
      loopAddBlankSlides: false,
      simulateTouch: true,

      on: {
        beforeInit: (swiper) => {
          this.deleteBlankSlides();
        },
      },
    };

    this.mediaQueries = {
      mobile: window.matchMedia('(max-width: 824.98px)'),
      tablet: window.matchMedia('(min-width: 824.98px) and (max-width: 1180.98px)'),
      desktop: window.matchMedia('(min-width: 1180.98px)'),
    };

    this.init();
    this.bindEvents();
  }

  addBlankSlides = (swiper) => {
    const allSLides = swiper.slides;
    const currentSlides = allSLides.length % this.quantityPageSlides;
    const neededBlanks = this.quantityPageSlides - currentSlides;

    if (neededBlanks % 9 === 0) {
      return;
    }

    for (let i = 0; i < neededBlanks; i++) {
      const blank = document.createElement('div');
      blank.className = 'swiper-slide blank-slide';
      blank.innerHTML = '<div class="partner-card"></div>';
      swiper.appendSlide(blank);
      this.hasBlankSlides = true;
    }
  };

  deleteBlankSlides = () => {
    if (this.hasBlankSlides) {
      const blankSlides = this.rootElement.querySelectorAll('.blank-slide');
      blankSlides.forEach((slide) => slide.remove());
    }
  };

  recreateSwiper = () => {
    if (this.swiper) {
      this.swiper.destroy();
    }

    this.init();
  };

  updateBorders(swiper) {
    requestAnimationFrame(() => {
      const allSlides = Array.from(swiper.slides).filter(
        (el) => !el.classList.contains('blank-slide'),
      );

      if (allSlides.length === 0) {
        return;
      }

      const rows = this.rows;
      const cols = this.slidesPerView;
      const slidesPerPage = rows * cols;

      const totalPages = Math.ceil(allSlides.length / slidesPerPage);

      allSlides.forEach((slide, index) => {
        const card = slide.querySelector('.partner-card');

        if (!card) {
          return;
        }

        const pageIndex = Math.floor(index / slidesPerPage);
        const positionOnPage = index % slidesPerPage;
        const rowOnPage = Math.floor(positionOnPage / cols);
        const isLastPage = pageIndex === totalPages - 1;
        const rowsOnPage = isLastPage
          ? Math.ceil((allSlides.length - pageIndex * slidesPerPage) / cols)
          : rows;
        const isLastRowOnPage = rowOnPage === rowsOnPage - 1;

        if (isLastRowOnPage) {
          card.classList.remove(this.styleClasses.borderBottom);
        } else {
          card.classList.add(this.styleClasses.borderBottom);
        }
      });
    });
  }

  getTransformValue() {
    const element = this.wrapperElement;
    const transformValue =
      element.style.transform ||
      element.style.webkitTransform ||
      element.style.mozTransform ||
      element.style.msTransform;

    return transformValue;
  }

  init() {
    const isMobile = this.mediaQueries.mobile.matches;
    const isTablet = this.mediaQueries.tablet.matches;

    if (isMobile) {
      this.swiper = new Swiper(this.rootElement, this.mobileConfig);
    } else if (isTablet) {
      this.swiper = new Swiper(this.rootElement, this.tabletConfig);
    } else {
      this.swiper = new Swiper(this.rootElement, this.desktopConfig);
    }
  }

  bindEvents() {
    for (let quary in this.mediaQueries) {
      this.mediaQueries[quary].addListener((event) => {
        if (event.matches) {
          this.recreateSwiper();
        }
      });
    }
  }
}

class SliderPartnersCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new SliderPartners(element);
    });
  }
}

export default SliderPartnersCollection;
