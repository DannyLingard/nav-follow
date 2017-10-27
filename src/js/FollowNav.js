import DropdownArrow from './DropdownArrow';
import DropdownBackground from './DropdownBackground';
import Trigger from './Trigger';

// Utils
import { calculateGeometry } from './utils/geometry';

export default class FollowNav {
  constructor(
    elem,
    triggerSelector,
    triggerDropdownSelector,
    dropdownArrowSelector,
    dropdownBackgroundSelector,
  ) {
    this._elem = null;
    this._geometries = null;

    // Setters
    this.elem = elem;
    this.geometries = calculateGeometry(this.elem);

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
    this.calculateParentX(this.elem);

    // Dimensions
    this.instantiateDimensions();

    // Scale X & Y
    this.instantiateMeasures();

    // Game Times
    this.step = 1 / 120;
    this.requestAnimationFrameId = null;
    this.toggle = false;
    this.instantiateTimers();

    // Validators & Checkers
    this.hasReachedTargetX = false;
    this.trackingThreshold = 0.01;
    this.trackingX = null;
    this.dropdownArrowTrackingX = null;

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

  /*---------------
  Getters & Setters
  ----------------*/

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

  /*---------------
  Private Members
  ----------------*/

  instantiateDimensions() {
    this.initialWidth = null;
    this.initialHeight = null;
    this.targetWidth = null;
    this.targetHeight = null;
    this.widthDiff = null;
    this.heightDiff = null;
    this.isWider = null;
    this.isTaller = null;
    this.previousWidth = null;  // from previous trigger
    this.previousHeight = null; // from previous trigger
    this.progressWidth = null;
    this.progressHeight = null;
  }

  instantiateMeasures() {
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
  }

  instantiateMovements() {
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
  }

  instantiateTimers() {
    this._lastTime = 0;
    this._accumlator = 0;
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

    this.initializeMeasures();
    this.initializeDimensions();

    // console.log('====================================');
    // console.log('-- Trigger  ------------------------');
    // console.log('activeTrigger', this.activeTrigger);
    // console.log('-- ScaleX   ------------------------');
    // console.log('currentScaleX', this.currentScaleX);
    // console.log('initialScaleX', this.initialScaleX);
    // console.log('screenScaleX', this.screenScaleX);
    // console.log('scaleXDiff', this.scaleXDiff);
    // console.log('TargetScaleX', this.targetScaleX);
    // console.log('initialX', this.initialX);
    // console.log('targetX', this.targetX);
    // console.log('-- Width    ------------------------');
    // console.log('isWider', this.isWider);
    // console.log('previousWidth', this.previousWidth);
    // console.log('targetWidth', this.targetWidth);
    // console.log('initialWidth', this.initialWidth);
    // console.log('====================================');

    this.dropdownBackground.expand();
    this.dropdownArrow.expand();
  }

  handleTriggerExit() {
    this.activeTrigger = null;
    // this.dropdownBackground.x = 0;

    this.dropdownBackground.collapse();
    this.dropdownArrow.collapse();

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

    // console.log('====================================');
    // console.log('Tigger Exit');
    // console.log('initialX', this.initialX);
    // console.log('targetX', this.targetX);
    // console.log('====================================');
  }

  calculateParentX(e) {
    const parent = e.parentNode;
    const geo = e.getBoundingClientRect();
    const { x } = geo;

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

    this.widthDiff = Math.abs(widthDiff);
    this.heightDiff = Math.abs(heightDiff);

    this.scaleXDiff = Math.abs(scaleXDiff);
    this.scaleYDiff = Math.abs(scaleYDiff);

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

    this.screenScaleX = this.scaleXDiff;
    this.screenScaleY = this.scaleYDiff;
    this.currentScaleX = this.scaleXDiff;
    this.currentScaleY = this.scaleYDiff;
  }

  onStart() {
    console.log('Starting');
    this.resetTimers();
    this.resetDimensions();
    this.resetMeasures();
    this.resetMovements();

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

    this.addRequestAnimationFrame();
  }

  onEnd() {
    console.log('Ending');
    this.triggers.forEach((trigger) => {
      trigger.hybernate();
    });
    this.toggle = false;
    // this.firstTriggerEntry = true;

    // this.resetDimensions();
    // this.resetMeasures();
    // this.resetMovements();
    // this.resetTimers();
  }

  addRequestAnimationFrame = () => {
    this.requestAnimationFrameId = requestAnimationFrame((deltaTime) => {
      this.onManageTime(deltaTime);
    });
  }

  onManageTime(millis) {
    if (this._lastTime) {
      this.update((millis - this._lastTime) / 1000);
      this.draw();
    }

    this._lastTime = millis;

    // Control Call of next loop
    if (this.toggle) {
      this.addRequestAnimationFrame();
    }
  }

  simulate(deltaTime) {
    const frameRate = deltaTime * (1000);

    if (this.activeTrigger) {
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

        this.trackingX = Math.abs(this.currentX - this.targetX);
        this.dropdownArrowTrackingX = Math.abs(this.dropdownArrowCurrentX - this.dropdownArrowTargetX);

        // Overwrite this.current values if less than threshold
        if (this.trackingX <= this.trackingThreshold) {
          this.dropdownBackground.x = this.targetX;
        } else {
          this.dropdownBackground.x = this.currentX;
        }

        if (this.dropdownArrowTrackingX <= this.trackingThreshold) {
          this.dropdownArrow.x = this.dropdownArrowTargetX;
        } else {
          this.dropdownArrow.x = this.dropdownArrowCurrentX;
        }

        // this.dropdownArrow.x = this.dropdownArrowCurrentX;
        // this.dropdownBackground.x = this.currentX;

        // console.log('====================================');
        // console.log('Check Target X');
        // console.log(this.currentX - this.targetX);
        // // console.log(this.currentX === this.targetX);
        // console.log('====================================');
        // console.log('====================================');
        // console.log('currentX', this.currentX);
        // console.log('distanceX', this.distanceX);
        // console.log('directionX', this.directionX);
        // console.log('progressX', this.progressX);
        // console.log('screenX', this.screenX);
        // console.log('====================================');
      }
    }


    if (!this.toggle) {
      this.terminate();
    }
  }

  update(deltaTime) {
    // Manages the simulations
    this._accumlator += deltaTime;

    while (this._accumlator > this.step) {
      this.simulate(this.step);
      this._accumlator -= this.step;
    }
  }

  draw() {
    this.dropdownArrow.move();
    this.dropdownBackground.move();
  }

  logTimers() {
    console.log('==================');
    // console.log('Millies', millis);
    console.log('RAF', this.requestAnimationFrameId);
    console.log('lastTime', this._lastTime);
    console.log('Accum', this._accumlator);
    console.log('Step', this.step);
    console.log('==================');
  }

  resetDimensions() {
    this.instantiateDimensions();
  }

  resetMeasures() {
    this.instantiateMeasures();
  }

  resetMovements() {
    this.instantiateMovements();
  }

  resetTimers() {
    this.instantiateTimers();
    this.requestAnimationFrameId = null;
  }

  terminate() {
    console.log('====================================');
    console.log('Terminated');
    console.log('====================================');
    // console.log('Cancel RAF', this.requestAnimationFrameId);

    cancelAnimationFrame(this.requestAnimationFrameId);

    this.firstTriggerEntry = true;
    this.resetTimers();
  }
}
