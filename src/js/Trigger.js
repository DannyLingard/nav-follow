import Dropdown from './Dropdown';

export default class Trigger {
  constructor(
    elem,
    dropdownSelector,
    // dropdownBackground,
    handleTriggerEntry,
    handleTriggerExit,
    calculateMaxDropdownArea) {
    this.elem = elem;
    this.name = this.elem.id;
    this.dropdownSelector = dropdownSelector;
    this.dropdownElem = null;
    this.dropdown = null;
    this.geometries = null;

    // Functions
    this.handleTriggerEntry = handleTriggerEntry;
    this.handleTriggerExit = handleTriggerExit;
    this.calculateMaxDropdownArea = calculateMaxDropdownArea;

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.assignDropdownElem();
    this.createDropdown();

    this.calculateGeometries();
  }

  init() {
    this.addEventListeners();
    this.primeElement();
  }

  addEventListeners() {
    this.elem.addEventListener('mouseenter', this.handleMouseEnter);
    this.elem.addEventListener('mouseleave', this.handleMouseLeave);
  }

  removeEventListeners() {
    this.elem.removeEventListener('mouseenter', this.handleMouseEnter);
    this.elem.removeEventListener('mouseleave', this.handleMouseLeave);
  }

  primeElement() {
    this.dropdown.elem.style.willChange = 'opacity';
  }

  neutralizeElement() {
    this.dropdown.elem.style.willChange = 'auto';
  }

  calculateGeometries() {
    this.geometries = this.elem.getBoundingClientRect();

    // Improve this code - how it's called
    const { width, height } = this.dropdown.geometries;
    this.calculateMaxDropdownArea(width, height);
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
    this.handleTriggerExit(this);
    this.dropdown.collapse();
    // this.dropdownBackground.collapse();
  }

  hybernate() {
    this.removeEventListeners();
    this.neutralizeElement();
  }
}
