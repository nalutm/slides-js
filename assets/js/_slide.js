import debounce from './_debounce.js';

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0 , movement: 0 }
    this.activeClass = 'active';
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform =  `translate3d(${distX}px, 0, 0)`
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(e) {
    let moveType;
    if (e.type === 'mousedown') {
      e.preventDefault();
      this.dist.startX = e.clientX;
      moveType = 'mousemove';
    } else {
      this.dist.startX = e.changedTouches[0].clientX;
      moveType = 'touchmove';
    }

    this.wrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  onMove(e) {
    const pointerPosition = e.type === 'mousemove' ? e.clientX : e.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(e) {
    const moveType = e.type === 'mouseup' ? 'mousemove' : 'touchmove';
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) this.activeNextSlide();
    else if (this.dist.movement < -120  && this.index.prev !== undefined) this.activePrevSlide();
    else this.changeSlide(this.index.active);
  }

  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass));
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

//Slides config

  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map(element => {
      const position = this.slidePosition(element);
      return { position, element}
    });
  }

  slidesIndexNav(i) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: i ? i - 1 : undefined,
      active: i,
      next: i === last ? undefined : i + 1,
    }
  }

  changeSlide(i) {
    const activeSlide = this.slideArray[i];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(i);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 300);
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    return this;
  }
}