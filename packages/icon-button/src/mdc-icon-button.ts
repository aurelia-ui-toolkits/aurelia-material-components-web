import { children, customElement, useView, inject, bindingMode, PLATFORM } from 'aurelia-framework';
import { bindable } from 'aurelia-typed-observable-plugin';
import { MDCIconButtonToggleFoundation, MDCIconButtonToggleAdapter, MDCIconButtonToggleEventDetail, strings } from '@material/icon-button';
import { MdcComponent } from '@aurelia-mdc-web/base';
import { MdcIconButtonIcon } from './mdc-icon-button-icon/mdc-icon-button-icon';

/**
 * @selector button[mdc-icon-button]
 * @selector a[mdc-icon-button]
 * @selector mdc-icon-button
 */
@inject(Element)
@useView(PLATFORM.moduleName('./mdc-icon-button.html'))
@customElement('mdc-icon-button')
export class MdcIconButton extends MdcComponent<MDCIconButtonToggleFoundation> {
  /** Sets the toggle state to the provided value */
  @bindable.booleanAttr({ defaultBindingMode: bindingMode.twoWay })
  on: boolean;

  /** Optional. Set a Material icon as a non-toggle icon. */
  @bindable
  icon: string;

  @children('mdc-icon-button-icon')
  icons?: MdcIconButtonIcon[];

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

  /**
   * Set the component touch target to 48 x 48 px
   */
  @bindable.booleanAttr
  touch: boolean;

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

  async attached() {
    await this.initialise();
    if (this.icons?.length) {
      this.foundation = this.getDefaultFoundation();
      this.foundation.init();
    }
    this.initialisedResolve();
    this.initialSyncWithDOM();
  }

  handleClick() {
    this.foundation?.handleClick();
    return true;
  }

  getDefaultFoundation() {
    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
    const adapter: MDCIconButtonToggleAdapter = {
      addClass: (className) => this.root.classList.add(className),
      hasClass: (className) => this.root.classList.contains(className),
      notifyChange: (evtData) => {
        this.emit<MDCIconButtonToggleEventDetail>(strings.CHANGE_EVENT, evtData);
        this.on = evtData.isOn;
      },
      removeClass: (className) => this.root.classList.remove(className),
      getAttr: (attrName) => this.root.getAttribute(attrName),
      setAttr: (attrName, attrValue) => this.root.setAttribute(attrName, attrValue),
    };
    return new MDCIconButtonToggleFoundation(adapter);
  }

}
