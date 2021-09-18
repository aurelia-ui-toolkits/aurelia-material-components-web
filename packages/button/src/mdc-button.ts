import { inject, useView, PLATFORM, customElement } from 'aurelia-framework';
import { bindable } from 'aurelia-typed-observable-plugin';

/**
 * @selector button[mdc-button]
 * @selector a[mdc-button]
 * @selector mdc-button
 */
@inject(Element)
@useView(PLATFORM.moduleName('./mdc-button.html'))
@customElement('mdc-button')
export class MdcButton {
  constructor(public root: HTMLElement) { }

  /**
   * Set the component touch target to 48 x 48 px
   */
  @bindable.booleanAttr
  touch: boolean;

  /**
   * A contained button that is elevated upon the surface
   */
  @bindable.booleanAttr
  raised: boolean;

  /**
   * A contained button that is flush with the surface
   */
  @bindable.booleanAttr
  unelevated: boolean;

  /**
   * A contained button that is flush with the surface and has a visible border
   */
  @bindable.booleanAttr
  outlined: boolean;

  /**
   * Set the disabled property and trigger the blur event to reset the focus
   */
  @bindable.booleanAttr
  disabled: boolean;
  disabledChanged() {
    if (this.disabled) {
      this.root.blur();
      this.root.setAttribute('disabled', '');
    } else {
      this.root.removeAttribute('disabled');
    }
  }

  /**
   * Set the button label
   */
  @bindable
  label: string;

  // this is necessary for the route-href to work
  @bindable
  href: string;
  hrefChanged() {
    if (this.href) {
      this.root.setAttribute('href', this.href);
    } else {
      this.root.removeAttribute('href');
    }
  }

  attached() {
    const icons = this.root.querySelectorAll('mdc-icon');
    Array.from(icons).forEach(x => x.classList.add('mdc-button__icon'));
  }
}
