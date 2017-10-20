export default class DropdownBackground {
  constructor(elem, width, height) {
    this._elem = elem;
    this._geometries = null;
    this._x = 0;
    this._width = 0;
    this._height = 0;
    this._scaleX = 0;
    this._scaleY = 0;

    // Setter Methods
    this.width = width;
    this.height = height;

    this.init();
    this.calculateGeometries();
  }

  init() {
    this.elem.style.width = `${this.width}px`;
    this.elem.style.height = `${this.height}px`;
    this.collapse();
  }

  calculateGeometries() {
    this.geometries = this.elem.getBoundingClientRect();
  }

  expand() {
    this.elem.setAttribute('aria-expanded', 'true');
  }

  collapse() {
    this.elem.setAttribute('aria-expanded', 'false');
  }

  move() {
    this.elem.style.transform = `translateX(${this._x}px) scaleX(${this._scaleX}) scaleY(${this._scaleY})`;
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

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
  }

  get scaleX() {
    return this._scaleX;
  }

  set scaleX(value) {
    this._scaleX = value;
  }

  get scaleY() {
    return this._scaleY;
  }

  set scaleY(value) {
    this._scaleY = value;
  }
}
