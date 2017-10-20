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
    this.initialX = null;
    this.distanceX = null;
    this.directionX = null;
    this.screenX = null;
    this.currentX = null;
    this.progressX = null;
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

    if (this.firstTriggerEntry) {
      this.dropdownBackground.x = this.targetX;
    }

    console.log('Trigger Entry InitialX', this.initialX);
    const distance = this.targetX - this.initialX;

    this.distanceX = Math.abs(distance);
    this.directionX = distance > 0 ? 1 : 0;
    this.screenX = this.distanceX;
    this.currentX = this.distanceX;

    this.dropdownBackground.expand();
  }

  handleTriggerExit() {
    this.activeTrigger = null;
    // this.dropdownBackground.x = 0;

    this.dropdownBackground.collapse();
    this.initialX = this.targetX;
    this.firstTriggerEntry = false;
  }

  calculateTargetX() {
    // Trigger Geometries
    const { x: triggerX, width: triggerWidth } = this.activeTrigger.geometries;
    // DropdownBackgorund Geometires
    const { width: dropdownWidth } = this.dropdownBackground.geometries;

    this.targetX = triggerX + (triggerWidth / 2) - (dropdownWidth / 2);
    // this.targetX = triggerX;
  }

  onStart() {
    console.log('Starting');
    this.resetTimers();
    this.resetMovements();

    // Initiate Trigger Elements
    this.triggers.forEach((trigger) => {
      trigger.init();
    });

    this.toggle = true;

    const { x } = this.dropdownBackground.geometries;

    this.initialX = x;

    this.onManageTime();
  }

  onEnd() {
    this.triggers.forEach((trigger) => {
      trigger.hybernate();
    });
    this.toggle = false;
    this.firstTriggerEntry = true;
  }

  addRequestAnimationFrame = () => {
    this.requestAnimationFrameId = requestAnimationFrame((deltaTime) => {
      this.onManageTime(deltaTime);
    });
  }

  onManageTime(millis) {
    console.log('Begin Loop ============');

    this.addRequestAnimationFrame();
    this._frame += 1;

    // console.log('RAF', this.requestAnimationFrameId);

    // this.requestAnimationFrame = requestAnimationFrame(this.onManageTime.bind(this));
    if (this._lastTime) {
      this.update((millis - this._lastTime) / 1000);
      this.draw();
    }
    this._lastTime = millis;
  }

  simulate(deltaTime) {
    // Ensures all calculations completed at a consistent time step
    // console.log('Simulator');

    // Get Coords of Specific Trigger
    // if (this.dropdownBackground.x === this.targetX) {
    //   this.toggle = false;
    // }
    console.log('backgorundX', this.dropdownBackground.x);

    if (!this.firstTriggerEntry) {
      this.screenX += 0 - this.screenX / 20;
      this.progressX = (this.distanceX - this.screenX);

      if (this.directionX === 1) { // Forwards
        this.currentX = this.initialX + this.progressX;
      } else { // Backwards
        this.currentX = this.initialX - this.progressX;
      }

      this.dropdownBackground.x = this.currentX;
    }

    if (this.directionX === 1) { // Forwards

    }


    if (!this.toggle) {
      this.terminate();
    }

    console.log('initialX', this.initialX);
    console.log('distanceX', this.distanceX);
    console.log('directionX', this.directionX);
    console.log('targetX', this.targetX);
    console.log('currenX', this.currentX);
    console.log('progressX', this.progressX);
    console.log('screenX', this.screenX);
    console.log('Finish Loop ======');
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

  resetMovements() {
    console.log('Reset Measures');
    this.initialX = null;
    this.screenX = null;
    this.currentX = null;
    this.progressX = null;
    this.targetX = null;
    this.distanceX = null;
    this.directionX = null;
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
