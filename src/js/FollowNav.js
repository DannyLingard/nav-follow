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

    // Dropdown Background
    this.dropdownBackgroundSelector = dropdownBackgroundSelector;
    this.dropdownBackgroundElem = null;
    this.dropdownBackground = null;

    this.assignDropdownBackgroundElem();
    this.createDropdownBackground();

    this.assignTriggerElems();
    this.createTriggers();

    this.addEventListeners();

    this.requestAnimationFrameId = null;

    this.toggle = false;

    // Movements
    this.intitialX = null;
    this.targetX = null;

    // Game Times
    this._lastTime = 0;
    this._accumlator = 0;
    this.step = 1 / 120;
    this._frame = 0;
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
            this.dropdownBackground,
            trigger => this.handleTriggerEntry(trigger),
            () => this.handleTriggerExit(),
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
    this.activeTrigger = trigger;

    this.calculateTargetX();

    this.dropdownBackground.x = this.targetX;

    if (this.firstTriggerEntry) {
      this.dropdownBackground.move();
    }

    this.dropdownBackground.expand();
  }

  handleTriggerExit() {
    this.activeTrigger = null;
    this.dropdownBackground.x = 0;

    this.dropdownBackground.collapse();

    this.firstTriggerEntry = false;
  }

  calculateTargetX() {
    // Trigger Geometries
    const { x: triggerX, width: triggerWidth } = this.activeTrigger.geometries;
    // DropdownBackgorund Geometires
    const { width: dropdownWidth } = this.dropdownBackground.geometries;

    this.targetX = triggerX + (triggerWidth / 2) - (dropdownWidth / 2);
  }

  onStart() {
    console.log('Starting');
    this.logTimers();
    this.resetTimers();

    // Initiate Trigger Elements
    this.triggers.forEach((trigger) => {
      trigger.init();
    });

    this.toggle = true;

    const { x } = this.dropdownBackground.geometries;

    this.intitialX = x;

    this.onManageTime();
    // this.addRequestAnimationFrame();
  }

  onEnd() {
    this.triggers.forEach((trigger) => {
      trigger.hybernate();
    });
    this.toggle = false;
    this.firstTriggerEntry = true;
  }

  addRequestAnimationFrame() {
    // this.requestAnimationFrame = requestAnimationFrame((deltaTime) => { this.onManageTime(deltaTime); });
  }

  onManageTime(millis) {
    // console.log('frame', this._frame);
    console.log('Begin Loop ============');

    this.requestAnimationFrameId = requestAnimationFrame((deltaTime) => { this.onManageTime(deltaTime); });
    this._frame += 1;
    // this.logTimers();
    console.log('RAF', this.requestAnimationFrameId);
    // console.log('ALTRAF', attribB);

    // this.requestAnimationFrame = requestAnimationFrame(this.onManageTime.bind(this));
    if (this._lastTime) {
      this.update((millis - this._lastTime) / 1000);
      this.draw();
    }
    this._lastTime = millis;
    // Initiate Animation
    // this.requestAnimationFrame = requestAnimationFrame((deltaTime) => { this.onManageTime(deltaTime); });
    // this.requestAnimationFrame = requestAnimationFrame(this.onManageTime.bind(this));
    // this.requestAnimationFrame((deltaTime) => { this.onManageTime(deltaTime); });
    // requestAnimationFrame((deltaTime) => { this.onManageTime(deltaTime); });
  }

  simulate(deltaTime) {
    // Ensures all calculations completed at a consistent time step
    // console.log('Simulator');

    // Get Coords of Specific Trigger
    if (this.dropdownBackground.x === this.targetX) {
      this.toggle = false;
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
    this.dropdownBackground.move(this.targetX);
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

    // const test = this.requestAnimationFrame + 1;

    cancelAnimationFrame(this.requestAnimationFrameId);

    this.toggle = true;
    this.resetTimers();
    // this._lastTime = 0;
    // console.log('Class', this);
  }
}
