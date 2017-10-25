import FollowNav from './FollowNav';

document.addEventListener('DOMContentLoaded', () => {
  const navSelector = '.nav-follow';
  const triggerSelector = '.nav-menu_item';
  const triggerDropdownSelector = '.nav-submenu';
  const dropdownArrowSelector = '.nav-dropdown_arrow';
  const dropDownBackgroundSelector = '.nav-dropdown_background';

  const followNav = new FollowNav(
    document.querySelector(navSelector),
    triggerSelector,
    triggerDropdownSelector,
    dropdownArrowSelector,
    dropDownBackgroundSelector,
  );
});
