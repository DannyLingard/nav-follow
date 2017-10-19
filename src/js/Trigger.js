import Dropdown from './Dropdown';

export default class Trigger {
  constructor(elem, dropdownSelector, dropdownBackground, handleTriggerEntry, handleTriggerExit) {
    this.elem = elem;
    this.name = this.elem.id;
    this.dropdownSelector = dropdownSelector;
    this.dropdownElem = null;
    this.dropdown = null;
    this.geometries = null;

    // Functions
    this.handleTriggerEntry = handleTriggerEntry;
    this.handleTriggerExit = handleTriggerExit;

    this.dropdownBackground = dropdownBackground;

    this.assignDropdownElem();
    this.createDropdown();

    this.calculateGeometries();

    // this.elem.addEventListener('mouseenter', () => {
    //   this.handleMouseEnter();
    // });

    // this.elem.addEventListener('mouseleave', () => {
    //   this.handleMouseLeave();
    // });
  }

  init() {
    this.addEventListeners();
    this.primeElement();
  }

  addEventListeners() {
    this.elem.addEventListener('mouseenter', () => {
      this.handleMouseEnter();
    });

    this.elem.addEventListener('mouseleave', () => {
      this.handleMouseLeave();
    });
  }

  removeEventListeners() {
    this.elem.removeEventListener('mouseenter', () => {
      this.handleMouseEnter();
    });

    this.elem.removeEventListener('mouseleave', () => {
      this.handleMouseLeave();
    });
  }

  primeElement() {
    this.dropdown.elem.style.willChange = 'opacity';
  }

  neutralizeElement() {
    this.dropdown.elem.style.willChange = 'auto';
  }

  calculateGeometries() {
    this.geometries = this.elem.getBoundingClientRect();
  }

  assignDropdownElem() {
    this.dropdownElem = this.elem.querySelector(this.dropdownSelector);
  }

  createDropdown() {
    this.dropdown = new Dropdown(
      this.dropdownElem,
    );
  }

  handleMouseEnter() {
    this.handleEnter();
    console.log('====================================');
    console.log('Geometries');
    console.log(this.geometries);
    console.log('====================================');
    this.dropdownBackground.move(this.geometries.left);
  }

  handleMouseLeave() {
    this.handleLeave();
  }

  handleEnter() {
    this.handleTriggerEntry(this);
    this.dropdown.expand();
    // this.dropdownBackground.expand();
  }

  handleLeave() {
    this.handleTriggerExit();
    this.dropdown.collapse();
    // this.dropdownBackground.collapse();
  }

  hybernate() {
    this.removeEventListeners();
    this.neutralizeElement();
  }
}
