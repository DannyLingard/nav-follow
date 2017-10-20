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
    // this.elem.addEventListener('mouseenter', () => {
    //   // this.handleMouseEnter(evt);
    //   this.testCallback();
    // });

    this.elem.addEventListener('mouseenter', this.handleMouseEnter);

    // this.elem.addEventListener('mouseleave', () => {
    //   // this.handleMouseLeave();
    //   this.testCallback();
    // });

    this.elem.addEventListener('mouseleave', this.handleMouseLeave);

    // this.elem.addEventListener('mouseenter', () => {
    //   this.handleTriggerEntry();
    // });

    // this.elem.addEventListener('mouseleave', () => {
    //   this.handleTriggerExit();
    // });
  }

  removeEventListeners() {
    // this.elem.removeEventListener('mouseenter', () => {
    //   // this.handleMouseEnter(e);
    //   this.testCallback();
    // });

    this.elem.removeEventListener('mouseenter', this.handleMouseEnter);

    // this.elem.removeEventListener('mouseleave', () => {
    //   // this.handleMouseLeave();
    //   this.testCallback();
    // });

    this.elem.removeEventListener('mouseleave', this.handleMouseLeave);

    // this.elem.removeEventListener('mouseenter', () => {
    //   this.handleTriggerEntry();
    // });

    // this.elem.removeEventListener('mouseleave', () => {
    //   this.handleTriggerExit();
    // });
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

  handleMouseEnter(evt) {
    console.log('====================================');
    console.log(evt);
    console.log('====================================');
    this.handleEnter();
    // console.log('====================================');
    // console.log(this.name, 'Dropdown Geometries');
    // console.log(this.dropdown.geometries);
    // console.log('====================================');
    // this.dropdownBackground.move(this.geometries.left);
  }

  handleMouseLeave() {
    this.handleLeave();
  }

  handleEnter() {
    this.handleTriggerEntry(this);
    // this.handleTriggerEntry(this);
    this.dropdown.expand();
    console.log('Trigger Entry');
    // this.dropdownBackground.expand();
  }

  handleLeave() {
    this.handleTriggerExit(this);
    this.dropdown.collapse();
    console.log('Trigger Exit');
    // this.dropdownBackground.collapse();
  }

  hybernate() {
    this.removeEventListeners();
    this.neutralizeElement();
  }
}
