import FollowNav from './FollowNav';
import DropdownBackground from './DropdownBackground';
import Trigger from './Trigger';
import Dropdown from './Dropdown';

'use-strict';

document.addEventListener('DOMContentLoaded', () => {
  const navSelector = '.nav-follow';
  const triggerSelector = '.nav-menu_item';
  const triggerDropdownSelector = '.nav-submenu';
  const dropDownBackgroundSelector = '.nav-dropdown_background';

  const followNav = new FollowNav(
		document.querySelector(navSelector),
		triggerSelector,
		triggerDropdownSelector,
		dropDownBackgroundSelector,
	);
});
