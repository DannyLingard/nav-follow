export default class DropdownBackground {
  constructor(elem) {
    this.elem = elem;
    this._geometries = null;

    this._initialX = 0;
    this._x = 0;

    // Setter Methods
    this.geometries = this.elem.getBoundingClientRect();

    // this.elem.style.transform = `translateX(${this._x}px)`;

    // this.requestAnimationFrame = this.requestAnimationFrame.bind(this);
  }

  calculateGeometries() {
    this._geometries = this.elem.getBoundingClientRect();
  }

  expand() {
    this.elem.setAttribute('aria-expanded', 'true');
  }

  collapse() {
    this.elem.setAttribute('aria-expanded', 'false');
  }

  get geometries() {
    return this._geometries;
  }

  set geometries(obj) {
    this._geometries = obj;
  }


  move() {
    this.elem.style.transform = `translateX(${this._x}px)`;
    // console.log('====================================');
    // console.log('Move Trigger');
    // console.log(this._x);
    // console.log('====================================');
    // this.requestAnimationFrame(this.update);
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  update(deltaTime) {
    console.log('====================================');
    console.log(deltaTime);
    console.log('====================================');
    // this.requestAnimationFrame(this.update);
  }
}
