export default class Dropdown {
  constructor(elem) {
    this.elem = elem;
    this.geometries = null;

    this._calculateGeometries();
  }

  _calculateGeometries() {
    this.geometries = this.elem.getBoundingClientRect();
  }

  get geometry() {
    return this.geometries;
  }

  get isExpanded() {
    this.elem.getAttribute('aria-expanded');
  }

  expand() {
    this.elem.setAttribute('aria-expanded', 'true');
  }
  collapse() {
    this.elem.setAttribute('aria-expanded', 'false');
  }
}
