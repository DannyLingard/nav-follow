import DropdownBackground from './DropdownBackground';
import Trigger from './Trigger';

export default class FollowNav {
  constructor(elem, triggerSelector, triggerDropdownSelector, dropdownBackgroundSelector) {
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

    // Dropdown Background
    this.dropdownBackgroundSelector = dropdownBackgroundSelector;
    this.dropdownBackgroundElem = null;
    this.dropdownBackground = null;

    // Movements
    this.initialX = null;
    this.distanceX = null;
    this.directionX = null;
    this.screenX = null;
    this.currentX = null;
    this.progressX = null;
    this.targetX = null;

    // Dimensions
    this.initialWidth = null;
    this.initialHeight = null;
    this.targetWidth = null;
    this.targetHeight = null;
    this.widthDiff = null;
    this.heightDiff = null;
    this.isWider = null;
    this.isTaller = null;
    this.screenWidth = null;
    this.currentWidth = null;
    this.previousWidth = null;  // from previous trigger
    this.previousHeight = null; // from previous trigger
    this.progressWidth = null;
    this.screenHeight = null;
    this.currentHeight = null;
    this.progressHeight = null;
    this.scaleX = null;
    this.scaleY = null;
    this.targetScaleX = null;
    this.targetScaleY = null;

    // Game Times
    this._lastTime = 0;
    this._accumlator = 0;
    this.step = 1 / 120;
    this._frame = 0;

    this.requestAnimationFrameId = null;

    this.toggle = false;

    this.assignTriggerElems();
    this.createTriggers();

    this.assignDropdownBackgroundElem();
    this.createDropdownBackground();

    this.addEventListeners();
  }

  addEventListeners() {
    this.elem.addEventListener('mouseenter', (evt) => {
      this.handleMouseEnter(evt);
    });

    this.elem.addEventListener('mouseleave', (evt) => {
      this.handleMouseLeave(evt);
    });
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
    console.log('Trigger Entry ============');
    // Assign Active Trigger
    this.activeTrigger = trigger;
    // Assign Active Trigger Dropdown
    this.dropdown = this.activeTrigger.dropdown;

    this.calculateTargetX();
    this.calculateDropdownGeometries();
    this.calculateScaleX();
    this.calculateScaleY();

    if (this.firstTriggerEntry) {
      this.dropdownBackground.x = this.targetX;
      this.dropdownBackground.scaleX = this.targetScaleX;
      this.dropdownBackground.scaleY = this.targetScaleY;
    }

    // console.log('TargetScaleX', this.targetScaleX);
    // console.log('TargetScaleY', this.targetScaleY);
    // console.log('previousWidth', this.previousWidth);
    // console.log('targetWidth', this.targetWidth);
    // console.log('initialWidth', this.initialWidth);

    this.initializeMeasures();
    this.initializeDimensions();

    this.dropdownBackground.expand();
  }

  handleTriggerExit() {
    console.log('Trigger Exit ============');
    this.activeTrigger = null;
    // this.dropdownBackground.x = 0;

    this.dropdownBackground.collapse();

    // Persist Previous Trigger Attributes
    this.initialX = this.targetX;
    this.previousWidth = this.targetWidth;
    this.previousHeight = this.targetHeight;

    this.firstTriggerEntry = false;
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
        console.log('isWider');
        this.targetScaleX = this.targetWidth / (this.previousWidth - this.initialWidth);
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
        this.targetScaleY = this.targetHeight / (this.previousHeight - this.initialHeight);
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
    // DropdownBackgorund Geometires
    const { width: dropdownWidth } = this.dropdownBackground.geometries;

    this.targetX = triggerX + (triggerWidth / 2) - (dropdownWidth / 2);
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
    const distance = this.targetX - this.initialX;
    this.distanceX = Math.abs(distance);
    this.directionX = distance > 0 ? 1 : 0;
    this.screenX = this.distanceX;
    this.currentX = this.distanceX;
  }

  initializeDimensions() {
    const widthDiff = this.targetWidth - this.initialWidth;
    const heightDiff = this.targetHeight - this.initialHeight;
    // const widthDiff = this.targetWidth - this.previousWidth;
    // const heightDiff = this.targetHeight - this.previousHeight;

    this.widthDiff = Math.abs(widthDiff);
    this.heightDiff = Math.abs(heightDiff);

    console.log('widthDiff', widthDiff);

    if (widthDiff > 0) {
      this.isWider = 2;
    } else if (widthDiff === 0) {
      this.isWider = 0;
    } else {
      this.isWider = 1;
    }

    if (heightDiff > 0) {
      this.isTaller = 2;
    } else if (heightDiff === 0) {
      this.isTaller = 0;
    } else {
      this.isTaller = 1;
    }

    this.screenWidth = this.widthDiff;
    this.screenHeight = this.heightDiff;
    this.currentWidth = this.widthDiff;
    this.currentHeight = this.heightDiff;
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

    const { x, width, height } = this.dropdownBackground;

    this.initialX = x;
    this.initialWidth = width;
    this.initialHeight = height;

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
      this.screenX += 0 - this.screenX / frameRate;
      this.screenWidth += 0 - this.screenWidth / frameRate;
      this.screenHeight += 0 - this.screenHeight / frameRate;

      // Convert to a progress amount
      this.progressX = (this.distanceX - this.screenX);
      this.progressWidth = (this.widthDiff - this.screenWidth);
      this.progressHeight = (this.heightDiff - this.screenHeight);

      if (this.directionX === 1) { // Navigate Forwards
        this.currentX = this.initialX + this.progressX;
      } else { // Navigate Backwards
        this.currentX = this.initialX - this.progressX;
      }

      if (this.isWider !== 0) { // Not same width
        if (this.isWider === 1) { // Shrink
          this.currentWidth = this.initialWidth + this.progressWidth;
        } else { // Grow
          this.currentWidth = this.initialWidth - this.progressWidth;
        }
        this.scaleX = this.currentWidth / this.initialWidth;
        this.dropdownBackground.scaleX = this.scaleX;
      }

      if (this.isTaller !== 0) { // Not same height
        if (this.isTaller === 1) { // Shrink
          this.currentHeight = this.initialHeight + this.progressHeight;
        } else { // Grow
          this.currentHeight = this.initialHeight - this.progressHeight;
        }
        this.scaleY = this.currentHeight / this.initialHeight;
        this.dropdownBackground.scaleY = this.scaleY;
      }

      this.dropdownBackground.x = this.currentX;
    }

    if (!this.toggle) {
      this.terminate();
    }

    // console.log('initialWidth', this.initialWidth);
    // console.log('widthDiff', this.widthDiff);
    // console.log('heightDiff', this.heightDiff);
    // console.log('currentWidth', this.currentWidth);
    // console.log('currentHeight', this.currentHeight);
    // console.log('directionX', this.directionX);
    // console.log('targetWidth', this.targetWidth);
    // console.log('currenX', this.currentX);
    // console.log('progressWidth', this.progressWidth);
    // console.log('screenX', this.screenX);
    // console.log('Finish Loop --');
    // console.log('Finish Loop ======');
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
    this.currentWidth = null;
    this.currentHeight = null;
    this.initialWidth = null;
    this.initialHeight = null;
    this.isTaller = null;
    this.isWider = null;
    this.previousWidth = null;
    this.previousHeight = null;
    this.progressWidth = null;
    this.progressHeight = null;
    this.scaleX = null;
    this.scaleY = null;
    this.screenWidth = null;
    this.screenHeight = null;
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
