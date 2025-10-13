const swiperTabulationFix = (swiper, root) => {
  /*
    TODO: не учитывается смещение по currentSlidesPerGroup, работает нормально только при 
    currentSlidesPerGroup = slidesPerView
  */

  /*
    TODO: если мы находились на предпоследнем значении breakpoint и фокус был на любом элементе из
    второго буллета, то при изменении значения breakpoint на последнее неправильно устанавливается 
    tabindex
  */

  const slides = swiper.slides;
  const slidesQuantity = slides.length;
  const bullets = swiper.pagination.bullets;
  const currentBulletIndex = bullets.findIndex((bullet) =>
    bullet.classList.contains('swiper-pagination-bullet-active'),
  );
  const currentSlidesPerView = swiper.params.slidesPerView;
  const currentSlidesPerGroup = swiper.params.slidesPerGroup;

  const maxIndexFocusSlide = currentSlidesPerView * (currentBulletIndex + 1);
  const duplicatedSlides = currentSlidesPerGroup - slidesQuantity;

  if (root) {
    root.addEventListener('focusout', () => {
      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
    });

    root.addEventListener('focusin', () => {
      swiper.allowSlideNext = false;
      swiper.allowSlidePrev = false;
    });

    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
      } else if (event.key === 'Tab') {
        swiper.allowSlideNext = false;
        swiper.allowSlidePrev = false;
      }
    });

    swiper.on('slideChangeTransitionStart', (swiper) => {
      swiper.allowSlideNext = false;
      swiper.allowSlidePrev = false;
    });

    swiper.on('slideChangeTransitionEnd', (swiper) => {
      swiper.allowSlideNext = true;
      swiper.allowSlidePrev = true;
    });
  }

  slides.forEach((slide, index) => {
    if (currentSlidesPerView === 1 && index === currentBulletIndex) {
      slide.setAttribute('tabindex', '0');
    } else if (
      currentSlidesPerView !== 1 &&
      maxIndexFocusSlide !== currentSlidesPerView &&
      bullets.length !== currentBulletIndex + 1 &&
      index >= maxIndexFocusSlide - currentSlidesPerView
    ) {
      slide.setAttribute('tabindex', '0');
    } else if (
      currentSlidesPerView !== 1 &&
      maxIndexFocusSlide !== currentSlidesPerView &&
      bullets.length === currentBulletIndex + 1 &&
      Math.abs(duplicatedSlides) !== currentSlidesPerView &&
      index - duplicatedSlides >= maxIndexFocusSlide - currentSlidesPerView
    ) {
      slide.setAttribute('tabindex', '0');
    } else if (
      currentSlidesPerView !== 1 &&
      maxIndexFocusSlide !== currentSlidesPerView &&
      bullets.length === currentBulletIndex + 1 &&
      index >= maxIndexFocusSlide - currentSlidesPerView
    ) {
      slide.setAttribute('tabindex', '0');
    } else if (
      currentSlidesPerView !== 1 &&
      maxIndexFocusSlide === currentSlidesPerView &&
      index < maxIndexFocusSlide
    ) {
      slide.setAttribute('tabindex', '0');
    } else {
      slide.setAttribute('tabindex', '-1');
    }
  });

  document.activeElement.blur();
};

export default swiperTabulationFix;
