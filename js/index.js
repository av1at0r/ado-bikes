const activeSlide = document.getElementsByClassName('social-slider__slide--active');
const activeButton = document.getElementsByClassName('social-slider__control--active');

document.querySelectorAll('.social-slider__control')
  .forEach(control => control.onclick = onControlClick);

function onControlClick(e) {
  if (activeSlide[0].id.split('-')[3] === e.target.dataset.slide) {
    return;
  }
  const slideToHide = activeSlide[0];
  const slideToShow = document.getElementById(`js-social-slider__slide-${e.target.dataset.slide}`);
  animateSlides(slideToHide, slideToShow);
  activeButton[0].classList.toggle('social-slider__control--active');
  e.target.classList.toggle('social-slider__control--active');
}

function animateSlides(toHide, toShow) {
  if (toHide.id.split('-')[3] < toShow.id.split('-')[3]) {
    TweenLite.fromTo(toShow, 0.5, {xPercent: 100}, {
      xPercent: 0,
      onStart: () => {toShow.style.opacity = 1},
      onComplete: () => {toShow.classList.toggle('social-slider__slide--active')}
    });
    TweenLite.fromTo(toHide, 0.5, {xPercent: 0}, {
      xPercent: -100,
      onComplete: () => {
        toHide.style.opacity = 0;
        toHide.classList.toggle('social-slider__slide--active');
      }
    });
  } else {
    TweenLite.fromTo(toShow, 0.5, {xPercent: -100}, {
      xPercent: 0,
      onStart: () => {toShow.style.opacity = 1},
      onComplete: () => {toShow.classList.toggle('social-slider__slide--active')}
    });
    TweenLite.fromTo(toHide, 0.5, {xPercent: 0}, {
      xPercent: 100,
      onComplete: () => {
        toHide.style.opacity = 0;
        toHide.classList.toggle('social-slider__slide--active');
      }
    });
  }
}

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
