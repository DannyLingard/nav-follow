import DropdownArrow from './DropdownArrow';
import DropdownBackground from './DropdownBackground';
import Trigger from './Trigger';

export default class FollowNav {
  constructor(elem, triggerSelector, triggerDropdownSelector, dropdownArrowSelector, dropdownBackgroundSelector) {
    this._elem = null;
    this._geometries = null;

    // Setters
    this.elem = elem;

    // Triggers
    this.triggerSelector = triggerSelector;
    this.triggerDropdownSelector = triggerDropdownSelector;
    this.triggerElems = [];
    this.triggers = [];
    this.activeTrigger = null;
    this.firstTriggerEntry = true;

    // Trigger Dropdown
    this.maxDropdownArea = null;
    this.maxDropdownAreaWidth = null;
    this.maxDropdownAreaHeight = null;

    // Active Trigger Dropdown
    this.dropdown = null;

    // Dropdown Arrow
    this.dropdownArrowSelector = dropdownArrowSelector;
    this.dropdownArrowElem = null;
    this.dropdownArrow = null;

    // Dropdown Background
    this.dropdownBackgroundSelector = dropdownBackgroundSelector;
    this.dropdownBackgroundElem = null;
    this.dropdownBackground = null;

    // Movements
    this.accumParentX = 0;
    this.parentX = null;

    this.initialX = null;
    this.distanceX = null;
    this.directionX = null;
    this.screenX = null;
    this.currentX = null;
    this.progressX = null;
    this.targetX = null;

    this.dropdownArrowInitialX = null;
    this.dropdownArrowDistanceX = null;
    this.dropdownArrowDirectionX = null;
    this.dropdownArrowScreenX = null;
    this.dropdownArrowCurrentX = null;
    this.dropdownArrowProgressX = null;
    this.dropdownArrowTargetX = null;

    // Dimensions
    this.initialWidth = null;
    this.initialHeight = null;
    this.targetWidth = null;
    this.targetHeight = null;
    this.widthDiff = null;
    this.heightDiff = null;
    this.isWider = null;
    this.isTaller = null;
    // this.screenWidth = null;
    // this.currentWidth = null;
    this.previousWidth = null;  // from previous trigger
    this.previousHeight = null; // from previous trigger
    this.progressWidth = null;
    // this.screenHeight = null;
    // this.currentHeight = null;
    this.progressHeight = null;

    // Scale X & Y
    this.initialScaleX = null;  // from previous trigger
    this.initialScaleY = null; // from previous trigger
    this.screenScaleX = null;
    this.screenScaleY = null;
    this.currentScaleX = null;
    this.currentScaleY = null;
    this.previousScaleX = null;  // from previous trigger
    this.previousScaleY = null; // from previous trigger
    this.progressScaleX = null;
    this.progressScaleY = null;
    this.scaleX = null;
    this.scaleY = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    this.targetScaleX = null;
    this.targetScaleY = null;

    // Game Times
    this._lastTime = 0;
    this._accumlator = 0;
    this.step = 1 / 120;
    this._frame = 0;

    this.requestAnimationFrameId = null;

    this.toggle = false;

    this.calculateGeometries();

    // Triggers Creation
    this.assignTriggerElems();
    this.createTriggers();

    // DropdownArrow Creation
    this.assignDropdownArrowElem();
    this.createDropdownArrow();

    // DropdownBackground Creation
    this.assignDropdownBackgroundElem();
    this.createDropdownBackground();

    this.addEventListeners();
  }

  get elem() {
    return this._elem;
  }

  set elem(obj) {
    this._elem = obj;
  }

  get geometries() {
    return this._geometries;
  }

  set geometries(obj) {
    this._geometries = obj;
  }

  addEventListeners() {
    this.elem.addEventListener('mouseenter', (evt) => {
      this.handleMouseEnter(evt);
    });

    this.elem.addEventListener('mouseleave', (evt) => {
      this.handleMouseLeave(evt);
    });
  }

  assignDropdownArrowElem() {
    this.dropdownArrowElem = this.elem.querySelector(this.dropdownArrowSelector);
  }

  createDropdownArrow() {
    this.dropdownArrow = new DropdownArrow(
      this.dropdownArrowElem,
      // this.maxDropdownAreaWidth,
      // this.maxDropdownAreaHeight,
    );
  }

  assignDropdownBackgroundElem() {
    this.dropdownBackgroundElem = this.elem.querySelector(this.dropdownBackgroundSelector);
  }

  createDropdownBackground() {
    this.dropdownBackground = new DropdownBackground(
      this.dropdownBackgroundElem,
      this.maxDropdownAreaWidth,
      this.maxDropdownAreaHeight,
    );
  }

  assignTriggerElems() {
    this.elem.querySelectorAll(this.triggerSelector)
    .forEach(elem => this.triggerElems.push(elem));
  }

  createTriggers() {
    this.triggerElems
      .forEach(elem =>
        this.triggers.push(
          new Trigger(
            elem,
            this.triggerDropdownSelector,
            // this.dropdownBackground,
            trigger => this.handleTriggerEntry(trigger),
            () => this.handleTriggerExit(),
            (width, height) => this.calculateMaxDropdownArea(width, height),
          ),
        ));
  }

  handleMouseEnter(evt) {
    this.onStart();
  }

  handleMouseLeave(evt) {
    this.onEnd();
  }

  handleTriggerEntry(trigger) {
    // Assign Active Trigger
    this.activeTrigger = trigger;
    // Assign Active Trigger Dropdown
    this.dropdown = this.activeTrigger.dropdown;

    this.calculateTargetX();
    this.calculateDropdownGeometries();
    this.calculateScaleX();
    this.calculateScaleY();

    if (this.firstTriggerEntry) {
      this.dropdownArrow.x = this.dropdownArrowTargetX;
      this.dropdownBackground.x = this.targetX;
      this.dropdownBackground.scaleX = this.targetScaleX;
      this.dropdownBackground.scaleY = this.targetScaleY;
    }


    // console.log('InitialX', this.initialX);
    // console.log('TargetX', this.targetX);
    // console.log('TargetScaleY', this.targetScaleY);

    this.initializeMeasures();
    this.initializeDimensions();

    console.log('====================================');
    console.log('-- ScaleX   ------------------------');
    console.log('currentScaleX', this.currentScaleX);
    console.log('initialScaleX', this.initialScaleX);
    console.log('screenScaleX', this.screenScaleX);
    console.log('scaleXDiff', this.scaleXDiff);
    console.log('TargetScaleX', this.targetScaleX);
    console.log('-- Width    ------------------------');
    console.log('isWider', this.isWider);
    console.log('previousWidth', this.previousWidth);
    console.log('targetWidth', this.targetWidth);
    console.log('initialWidth', this.initialWidth);
    console.log('====================================');


    this.dropdownBackground.expand();
  }

  handleTriggerExit() {
    // console.log('Trigger Exit ============');
    this.activeTrigger = null;
    // this.dropdownBackground.x = 0;

    this.dropdownBackground.collapse();

    // Persist Previous Trigger Attributes
    this.initialX = this.targetX;
    this.dropdownArrowInitialX = this.dropdownArrowTargetX;

    // Dimensions
    this.previousWidth = this.targetWidth;
    this.previousHeight = this.targetHeight;

    // Scale
    this.initialScaleX = this.targetScaleX;
    this.initialScaleY = this.targetScaleY;

    this.firstTriggerEntry = false;
  }

  calculateGeometries() {
    const geometries = this.elem.getBoundingClientRect();
    // console.log('====================================');
    // console.log(geometries);
    // console.log('====================================');
    this.geometries = geometries;

    // const elem = this.elem;

    this.calculateParentX(this.elem);

    // function getParentX(e) {
    //   const parent = e.parentNode;
    //   const geo = e.getBoundingClientRect();
    //   const { x, width } = geo;
    //   this.accumParentX += x;

    //   if (e.tagName !== 'BODY') {
    //     getParentX(parent);
    //   }
    // }

    // console.log('====================================');
    // console.log(accum - this.geometries.x);
    // console.log('====================================');
  }

  calculateParentX(e) {
    const parent = e.parentNode;
    const geo = e.getBoundingClientRect();
    const { x, width } = geo;
    // console.log('====================================');
    // console.log('Parent', e.tagName, x);
    // console.log('====================================');
    if (!this.parentX) {
      this.accumParentX += x;
    }

    if (!x === this.parentX) {
      this.accumParentX += x;
    }

    this.parentX = x;

    if (e.tagName !== 'BODY') {
      this.calculateParentX(parent);
    }
  }

  calculateMaxDropdownArea(width, height) {
    const area = width * height;
    if (!this.maxDropdownArea) {
      this.maxDropdownArea = area;
      this.maxDropdownAreaWidth = width;
      this.maxDropdownAreaHeight = height;

      // this.dropdownBackground.width
    }

    if (this.maxDropdownArea < area) {
      this.maxDropdownArea = area;
      this.maxDropdownAreaWidth = width;
      this.maxDropdownAreaHeight = height;
    }
  }

  calculateScaleX() {
    if (!this.firstTriggerEntry) {
      if (this.isWider !== 0) {
        // console.log('isWider');
        // this.targetScaleX = this.targetWidth / (this.previousWidth - this.initialWidth);
        this.targetScaleX = this.targetWidth / this.initialWidth;
      } else {
        this.targetScaleX = this.targetWidth / this.initialWidth;
      }
    } else {
      this.targetScaleX = this.targetWidth / this.initialWidth;
    }
  }

  calculateScaleY() {
    if (!this.firstTriggerEntry) {
      if (this.isTaller !== 0) {
        // this.targetScaleY = this.targetHeight / (this.previousHeight - this.initialHeight);
        this.targetScaleY = this.targetHeight / this.initialHeight;
      } else {
        this.targetScaleY = this.targetHeight / this.initialHeight;
      }
    } else {
      this.targetScaleY = this.targetHeight / this.initialHeight;
    }
  }

  calculateTargetX() {
    // Trigger Geometries
    const {
      x: triggerX,
      width: triggerWidth } = this.activeTrigger.geometries;

    // DropdownBackground Geometires
    const { width: dropdownArrowWidth } = this.dropdownArrow.geometries;

    // DropdownBackground Geometires
    const { width: dropdownBackgroundWidth } = this.dropdownBackground.geometries;

    // Parent Offsets
    const offset = this.accumParentX;

    this.dropdownArrowTargetX = triggerX + (triggerWidth / 2) - (dropdownArrowWidth / 2) - offset;
    this.targetX = triggerX + (triggerWidth / 2) - (dropdownBackgroundWidth / 2) - offset;
  }

  calculateDropdownGeometries() {
    const {
      width: dropdownWidth,
      height: dropdownHeight } = this.dropdown.geometries;

    this.targetWidth = dropdownWidth;
    this.targetHeight = dropdownHeight;

    if (this.firstTriggerEntry) {
      const {
        width: dropdownBackgroundWidth,
        height: dropdownBackgroundHeight } = this.dropdownBackground.geometries; // Possibly remove .geometries

      this.initialWidth = dropdownBackgroundWidth;
      this.initialHeight = dropdownBackgroundHeight;
    }
  }

  initializeMeasures() {
    const dropdownArrowDistance = this.dropdownArrowTargetX - this.dropdownArrowInitialX;
    const dropdownBackgroundDistance = this.targetX - this.initialX;

    // DropdownArrow
    this.dropdownArrowDistanceX = Math.abs(dropdownArrowDistance);
    this.dropdownArrowDirectionX = dropdownArrowDistance > 0 ? 1 : 0;
    this.dropdownArrowScreenX = this.dropdownArrowDistanceX;
    this.dropdownArrowCurrentX = this.dropdownArrowDistanceX;

    // DropdownBackground
    this.distanceX = Math.abs(dropdownBackgroundDistance);
    this.directionX = dropdownBackgroundDistance > 0 ? 1 : 0;
    this.screenX = this.distanceX;
    this.currentX = this.distanceX;
  }

  initializeDimensions() {
    const widthDiff = this.targetWidth - this.initialWidth;
    const heightDiff = this.targetHeight - this.initialHeight;

    const scaleXDiff = this.targetScaleX - this.initialScaleX;
    const scaleYDiff = this.targetScaleY - this.initialScaleY;
    // const widthDiff = this.targetWidth - this.previousWidth;
    // const heightDiff = this.targetHeight - this.previousHeight;

    this.widthDiff = Math.abs(widthDiff);
    this.heightDiff = Math.abs(heightDiff);

    this.scaleXDiff = Math.abs(scaleXDiff);
    this.scaleYDiff = Math.abs(scaleYDiff);

    // console.log('scaleXDiff', scaleXDiff);

    if (scaleXDiff > 0) {
      this.isWider = 2;
    } else if (scaleXDiff === 0) {
      this.isWider = 0;
    } else {
      this.isWider = 1;
    }

    if (scaleYDiff > 0) {
      this.isTaller = 2;
    } else if (scaleYDiff === 0) {
      this.isTaller = 0;
    } else {
      this.isTaller = 1;
    }

    // this.screenWidth = this.widthDiff;
    // this.screenHeight = this.heightDiff;
    // this.currentWidth = this.widthDiff;
    // this.currentHeight = this.heightDiff;

    this.screenScaleX = this.scaleXDiff;
    this.screenScaleY = this.scaleYDiff;
    this.currentScaleX = this.scaleXDiff;
    this.currentScaleY = this.scaleYDiff;
  }

  onStart() {
    console.log('Starting');
    this.resetTimers();
    this.resetMovements();
    this.resetDimensions();

    // Initiate Trigger Elements
    this.triggers.forEach((trigger) => {
      trigger.init();
    });

    this.toggle = true;

    const {
      x: dropdownArrowX,
    } = this.dropdownArrow;

    const {
      x: dropdownBackgroundX,
      width: dropdownBackgroundWidth,
      height: dropdownBackgroundHeight,
    } = this.dropdownBackground;

    this.dropdownArrowInitialX = dropdownArrowX;
    this.initialX = dropdownBackgroundX;

    this.initialWidth = dropdownBackgroundWidth;
    this.initialHeight = dropdownBackgroundHeight;

    this.onManageTime();
  }

  onEnd() {
    console.log('Ending');
    this.triggers.forEach((trigger) => {
      trigger.hybernate();
    });
    this.toggle = false;
    this.firstTriggerEntry = true;

    this.resetTimers();
    this.resetMovements();
    this.resetDimensions();
  }

  addRequestAnimationFrame = () => {
    this.requestAnimationFrameId = requestAnimationFrame((deltaTime) => {
      this.onManageTime(deltaTime);
    });
  }

  onManageTime(millis) {
    // console.log('Begin Loop ============');

    this.addRequestAnimationFrame();
    this._frame += 1;

    if (this._lastTime) {
      this.update((millis - this._lastTime) / 1000);
      this.draw();
    }
    this._lastTime = millis;
  }

  simulate(deltaTime) {
    const frameRate = deltaTime * (1000);

    if (!this.firstTriggerEntry) {
      // Easy Easing Timing Function
      this.dropdownArrowScreenX += 0 - this.dropdownArrowScreenX / frameRate;
      this.screenX += 0 - this.screenX / frameRate;
      this.screenWidth += 0 - this.screenWidth / frameRate;
      this.screenHeight += 0 - this.screenHeight / frameRate;
      this.screenScaleX += 0 - this.screenScaleX / frameRate;
      this.screenScaleY += 0 - this.screenScaleY / frameRate;

      // Convert to a progress amount
      this.dropdownArrowProgressX = (this.dropdownArrowDistanceX - this.dropdownArrowScreenX);
      this.progressX = (this.distanceX - this.screenX);
      this.progressWidth = (this.widthDiff - this.screenWidth);
      this.progressHeight = (this.heightDiff - this.screenHeight);
      this.progressScaleX = (this.scaleXDiff - this.screenScaleX);
      this.progressScaleY = (this.scaleYDiff - this.screenScaleY);

      // DropdownArrow X
      if (this.dropdownArrowDirectionX === 1) { // Navigate Forwards
        this.dropdownArrowCurrentX = this.dropdownArrowInitialX + this.dropdownArrowProgressX;
      } else { // Navigate Backwards
        this.dropdownArrowCurrentX = this.dropdownArrowInitialX - this.dropdownArrowProgressX;
      }

      // DropdownBackground X
      if (this.directionX === 1) { // Navigate Forwards
        this.currentX = this.initialX + this.progressX;
      } else { // Navigate Backwards
        this.currentX = this.initialX - this.progressX;
      }

      if (this.isWider !== 0) { // Not same width
        if (this.isWider === 1) { // Shrink
          this.currentScaleX = this.initialScaleX - this.progressScaleX;
        } else { // Grow
          this.currentScaleX = this.initialScaleX + this.progressScaleX;
        }
        this.scaleX = this.currentScaleX;
        this.dropdownBackground.scaleX = this.scaleX;
      }

      if (this.isTaller !== 0) { // Not same height
        if (this.isTaller === 1) { // Shrink
          this.currentScaleY = this.initialScaleY - this.progressScaleY;
        } else { // Grow
          this.currentScaleY = this.initialScaleY + this.progressScaleY;
        }
        this.scaleY = this.currentScaleY;
        this.dropdownBackground.scaleY = this.scaleY;
      }

      this.dropdownArrow.x = this.dropdownArrowCurrentX;
      this.dropdownBackground.x = this.currentX;
    }

    if (!this.toggle) {
      this.terminate();
    }
  }

  update(deltaTime) {
    // Manages the simulations
    this._accumlator += deltaTime;

    while (this._accumlator > this.step) {
      // console.log('updating accum');
      this.simulate(this.step);
      this._accumlator -= this.step;
    }
  }

  draw() {
    // Draw based on simulated results
    this.dropdownArrow.move();
    this.dropdownBackground.move();
  }

  logTimers() {
    console.log('==================');
    // console.log('Loop', this._frame);
    // console.log('Millies', millis);
    console.log('RAF', this.requestAnimationFrameId);
    console.log('lastTime', this._lastTime);
    console.log('Accum', this._accumlator);
    console.log('Step', this.step);
    console.log('==================');
  }

  resetDimensions() {
    // this.currentWidth = null;
    // this.currentHeight = null;
    this.currentScaleX = null;
    this.currentScaleY = null;
    this.initialWidth = null;
    this.initialHeight = null;
    this.isTaller = null;
    this.isWider = null;
    this.previousWidth = null;
    this.previousHeight = null;
    this.progressWidth = null;
    this.progressHeight = null;
    this.progressScaleX = null;
    this.progressScaleY = null;
    this.screenScaleX = null;
    this.screenScaleY = null;
    this.scaleX = null;
    this.scaleY = null;
    this.scaleXDiff = null;
    this.scaleYDiff = null;
    // this.screenWidth = null;
    // this.screenHeight = null;
    this.targetWidth = null;
    this.targetHeight = null;
    this.targetScaleX = null;
    this.targetScaleY = null;
  }

  resetMovements() {
    console.log('Reset Measures');
    this.currentX = null;
    this.directionX = null;
    this.distanceX = null;
    this.initialX = null;
    this.progressX = null;
    this.screenX = null;
    this.targetX = null;

    this.dropdownArrowInitialX = null;
    this.dropdownArrowDistanceX = null;
    this.dropdownArrowDirectionX = null;
    this.dropdownArrowScreenX = null;
    this.dropdownArrowCurrentX = null;
    this.dropdownArrowProgressX = null;
    this.dropdownArrowTargetX = null;
  }

  resetTimers() {
    // console.log('Reset Timers', this);
    this._frame = 0;
    this._lastTime = 0;
    this._accumlator = 0;
    this.requestAnimationFrameId = null;
  }

  terminate() {
    console.log('====================================');
    console.log('Terminated');
    console.log('====================================');
    this.firstTriggerEntry = true;
    console.log('Cancel RAF', this.requestAnimationFrameId);

    cancelAnimationFrame(this.requestAnimationFrameId);

    this.toggle = true;
    this.resetTimers();
  }
}
