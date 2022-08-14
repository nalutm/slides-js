import Slide from "./_slide.js";

const slide = new Slide('.slides', '.slides-wrapper');
slide.init();

slide.changeSlide(3);
slide.activePrevSlide();
