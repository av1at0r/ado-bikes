'use strict';

class Slider {
  constructor(sliderElem) {
    this.detecting = false;
    this.started = false;

    this.slider = sliderElem;
    this.leftSlides = sliderElem.getElementsByClassName('slider__slide--left');
    this.rightSlides = sliderElem.getElementsByClassName('slider__slide--right');
    this.centralSlides = sliderElem.getElementsByClassName('slider__slide--central');
    this.slides = sliderElem.getElementsByClassName('slider__slide');
    for(let i = 0; i < this.slides.length; i++) {
      this.slides[i].dataset.slide = i + 1;
      if (i === 0) {
        this.slides[i].classList.add('slider__slide--central');
        continue;
      }
      this.slides[i].classList.add('slider__slide--right');
    }

    this.slider.addEventListener('touchstart', (e) => this.touchStart(e))
    this.slider.addEventListener('touchmove', (e) => this.touchMove(e))
    this.slider.addEventListener('touchend', (e) => this.touchEnd(e))
    this.slider.addEventListener('touchcancel', (e) => this.touchEnd(e))

    this.sliderControls = sliderElem.getElementsByClassName('slider__control');
    this.sliderControls[0].classList.add('slider__control--active');
    this.activeSliderControls = sliderElem.getElementsByClassName('slider__control--active');
    for(let i = 0; i < this.sliderControls.length; i++) {
      this.sliderControls[i].dataset.slide = i + 1;
      if (i === 0) {
        this.sliderControls[i].classList.add('slider__control--active');
      }
      this.sliderControls[i].onclick = e => this.onControlClick(e);
    }
  }

  get leftSlide() {
    return this.leftSlides[this.leftSlides.length - 1];
  }

  get rightSlide() {
    return this.rightSlides[0];
  }

  get centralSlide() {
    return this.centralSlides[0];
  }
  get activeSliderControl() {
    return this.activeSliderControls[0];
  }

  onControlClick(e) {
    const slideNumber = e.target.dataset.slide;
    const slideToShow = this.slides[slideNumber - 1];
    if (this.centralSlide.dataset.slide === slideToShow.dataset.slide) {
      return;
    }
    const prevIndex = this.centralSlide.dataset.slide - 1;
    this.swipe(slideToShow);

    // debugger;
    const centralIndex = this.centralSlide.dataset.slide - 1;
    if (Math.abs(centralIndex - prevIndex) <= 1) {
      return;
    }
    let startIndex, endIndex, direction, rDirection;
    if (centralIndex > prevIndex) {
      startIndex = prevIndex + 1;
      endIndex = centralIndex - 1;
      direction = 'left';
      rDirection = 'right';
    } else {
      startIndex = centralIndex + 1;
      endIndex = prevIndex - 1;
      direction = 'right';
      rDirection = 'left';
    }
    for(let i = startIndex; i <= endIndex; i++) {
      this.slides[i].classList.remove(`slider__slide--${rDirection}`);
      this.slides[i].classList.add(`slider__slide--${direction}`);
    }
  }


  touchStart(e) {
    if (e.touches.length != 1 || this.started){
      return;
    }

    this.detecting = true;
    this.touch = e.changedTouches[0];
    this.x = this.touch.clientX;
    this.y = this.touch.clientY;
  }

  touchMove(e) {
    if (!this.started && !this.detecting){
      return;
    }
    if (this.detecting){
    	this.detect(e);
    }
    if (this.started){
    	this.draw(e);
    }
  }

  detect(e) {
    let changedTouch = e.changedTouches.item(this.touch.identifier);
  	if (!changedTouch){
  		return;
  	}

  	if (Math.abs(this.x - changedTouch.clientX) >= Math.abs(this.y - changedTouch.clientY)) {
  		e.preventDefault();
  		this.started = true;
  	}
  	this.detecting = false;
  }

  draw(e) {
    e.preventDefault();
    let changedTouch = e.changedTouches.item(this.touch.identifier);
    if (!changedTouch) {
  		return;
  	}
    this.delta = this.x - changedTouch.clientX;
    if (this.delta > 0 && !this.rightSlide || this.delta < 0 && !this.leftSlide){
  		this.delta = this.delta / 5;
  	}
    this.moveTo(this.delta);
  }

  moveTo(delta) {
    const central = this.centralSlide;
    central.style.transform = `translateX(${-delta}px)`;
    let nextSlide = delta < 0 ? this.leftSlide : this.rightSlide;
    if (!nextSlide) {
      return;
    }
    if (delta < 0) {
      // nextSlide.style.transform = `translateX(calc(-100% + ${delta}))`;
      nextSlide.style.transform = `translateX(calc(-100% + ${Math.abs(delta)}px))`;
    } else {
      nextSlide.style.transform = `translateX(calc(100% - ${Math.abs(delta)}px))`;
    }
  }

  touchEnd(e) {
    if (!e.changedTouches.item(this.touch.identifier) || !this.started){
    	return;
    }
    e.preventDefault();
    const showSlide =  this.delta < 0 ? this.leftSlide : this.rightSlide;

    this.swipe(showSlide);
    this.started = false;
  }


  swipe(toShow) {
    const toHide = this.centralSlide;
    this.prepareAnimation(toShow);

    if (!toShow) {
      return;
    }

    this.activateControl(+toShow.dataset.slide);

    const swipeDirection = +toHide.dataset.slide > +toShow.dataset.slide ? 'right' : 'left';
    const rSwipeDirection = +toHide.dataset.slide < +toShow.dataset.slide ? 'right' : 'left';

    toHide.classList.remove('slider__slide--central')
    toHide.classList.add(`slider__slide--${swipeDirection}`);
    toShow.classList.remove(`slider__slide--${rSwipeDirection}`);
    toShow.classList.add('slider__slide--central');

  }


  prepareAnimation(toShow) {
    const toHide = this.centralSlide;
    toHide.classList.add('slider__slide--animating');
    toHide.addEventListener('transitionend', e => e.target.classList.remove('slider__slide--animating'));
    toHide.removeAttribute('style');

    if (toShow) {
      toShow.classList.add('slider__slide--animating');
      toShow.addEventListener('transitionend', e => e.target.classList.remove('slider__slide--animating'));
      toShow.removeAttribute('style');
    }

  }
  activateControl(slideNumber) {
    this.activeSliderControl.classList.remove('slider__control--active');
    this.sliderControls[slideNumber - 1].classList.add('slider__control--active');
  }
}


const sliderElem = document.getElementById('js-slider');
const slider = new Slider(sliderElem);


const menuButton = document.getElementById('js-main-nav__menu-toggle');
const mainNav = document.getElementById('js-main-nav');
const mainNavList = mainNav.querySelector('ul.main-nav__list');
menuButton.onclick = (e) => {
  menuButton.classList.toggle('main-nav__menu-toggle--opened');
  if (mainNav.classList.contains('main-nav--opened')) {
    TweenLite.fromTo(mainNavList, 0.3, { yPercent: 0 }, {
      yPercent: -100,
      onComplete: () => mainNav.classList.remove('main-nav--opened'),
      clearProps:"all",
    })
  } else {
    TweenLite.fromTo(mainNavList, 0.3, { yPercent: -100 }, {
      yPercent: 0,
      onStart: () => mainNav.classList.add('main-nav--opened'),
      clearProps:"all",
    })
  }
}
