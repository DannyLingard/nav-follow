document.addEventListener('DOMContentLoaded', documentReady);

function documentReady() {
  console.log('Hello');

  const navTriggers = document.querySelectorAll('.nav-menu_item');
  const navDropDown = document.querySelector('.nav-dropdown_background');

  navTriggers.forEach((trigger) => {
    trigger.addEventListener('mouseenter', function () { handleMouseEnter.call(this, navDropDown); });
    trigger.addEventListener('mouseleave', function () { handleMouseLeave.call(this, navDropDown); });
  });


  function handleMouseEnter() {
    // Funnel Input specific event to handler
    handleEnter.call(this, navDropDown);
  }

  function handleMouseLeave() {
    // Funnel Input specific event to handler
    handleLeave.call(this, navDropDown);
  }

  function handleEnter() {
    this.classList.add('trigger-enter');
    navDropDown.classList.add('open');
  }

  function handleLeave() {
    this.classList.remove('trigger-enter');
    navDropDown.classList.remove('open');
  }
}
