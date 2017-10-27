// Utils
import { calculateGeometry } from './utils/geometry';

export default class DropdownArrow {
  constructor(elem) {
    this._elem = null;
    this._geometries = null;
    this._x = 0;
    this._rotate = null;

    // Set Private Members
    this.elem = elem;
    this.geometries = calculateGeometry(this.elem);
    this.rotate = 45;

    this.init();
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

  get rotate() {
    return this._rotate;
  }

  set rotate(value) {
    this._rotate = value;
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
  }

  /*---------------
  Methods
  ----------------*/

  init() {
    this.move();
    this.collapse();
  }

  collapse() {
    this.elem.setAttribute('aria-expanded', 'false');
  }

  expand() {
    this.elem.setAttribute('aria-expanded', 'true');
  }

  move() {
    this.elem.style.transform = `translateX(${this._x}px) rotate(${this.rotate}deg)`;
  }
}
