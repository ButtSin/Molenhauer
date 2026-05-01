const rootSelector = "[data-js-map]";

class Map {
  constructor(rootElement) {
    this.rootElement = rootElement;

    this.map = null;
    this.placemark = null;
    this.coordinates = {
      mobile: [52.517514, 13.401972],
      tablet: [52.518778, 13.398122],
      desktop: [52.518778, 13.401972],
    };
    this.placemarkCenter = this.coordinates.desktop;
    this.mediaQueries = {
      mobile: window.matchMedia("(max-width: 824.98px)"),
      tablet: window.matchMedia(
        "(min-width: 824.98px) and (max-width: 1180.98px)",
      ),
      desktop: window.matchMedia("(min-width: 1180.98px)"),
    };
    this.mapCenter = this.getCurrentCoordinates();

    this.init();
    this.bindEvents();
  }

  init() {
    // eslint-disable-next-line no-undef
    ymaps.ready(() => {
      // eslint-disable-next-line no-undef
      this.map = new ymaps.Map(this.rootElement, {
        center: this.mapCenter, // Укажите реальные координаты
        zoom: 16,
        height: 400,
      });

      this.hideControls();
      this.addPlacemark();

      this.map.behaviors.disable("dblClickZoom");
      this.map.behaviors.disable("multiTouch");
      this.map.behaviors.disable(["scrollZoom"]);
    });
  }

  getCurrentCoordinates = () => {
    if (this.mediaQueries.mobile.matches) {
      return this.coordinates.mobile;
    } else if (this.mediaQueries.tablet.matches) {
      return this.coordinates.tablet;
    }
    return this.coordinates.desktop;
  };

  hideControls() {
    this.map.controls.remove("geolocationControl");
    this.map.controls.remove("searchControl");
    this.map.controls.remove("trafficControl");
    this.map.controls.remove("typeSelector");
    this.map.controls.remove("fullscreenControl");
    this.map.controls.remove("zoomControl");
    this.map.controls.remove("rulerControl");
  }

  addPlacemark() {
    // eslint-disable-next-line no-undef
    this.placemark = new ymaps.Placemark(
      this.placemarkCenter,
      {},
      {
        iconLayout: "default#image",
        iconImageHref: "../../Molenhauer/images/footer-contacts/placemark.svg",
        iconImageSize: [50, 50],
        iconImageOffset: [-25, -45],
      },
    );
    this.map.geoObjects.add(this.placemark);
  }

  bindEvents() {
    for (let quary in this.mediaQueries) {
      this.mediaQueries[quary].addListener(() => {
        this.mapCenter = this.getCurrentCoordinates();
        this.map.setCenter(this.mapCenter);
      });
    }
  }
}

class MapCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Map(element);
    });
  }
}

export default MapCollection;
