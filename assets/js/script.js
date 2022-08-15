import SlideNav from "./_slide.js";

const slide = new SlideNav('.slides', '.slides-wrapper');
slide.init();
slide.addArrow('.prev', '.next');
slide.addControl('.custom-controls');
