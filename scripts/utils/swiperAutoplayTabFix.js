const swiperAutoplayTabFix = (swiper, rootElement) => {
  rootElement.addEventListener('focusin', () => {
    swiper.autoplay.stop();
  });
  rootElement.addEventListener('focusout', () => {
    swiper.autoplay.start();
  });
  //в swiper есть баг с resume, поэтому пришлось использовать start.

  //Также у меня не работал нормально метод pause, когда я фокусировался на элементе
  //во время анимации смены слайдов, потому задействовал stop.
};

export default swiperAutoplayTabFix;
