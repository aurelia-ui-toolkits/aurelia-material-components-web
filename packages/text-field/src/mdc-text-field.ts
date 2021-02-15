import { inject, customElement, INode, bindable } from 'aurelia';
import {
  MDCTextFieldFoundation, MDCTextFieldRootAdapter, MDCTextFieldInputAdapter, MDCTextFieldLabelAdapter, MDCTextFieldAdapter, MDCTextFieldFoundationMap,
  MDCTextFieldLineRippleAdapter, MDCTextFieldOutlineAdapter
} from '@material/textfield';
import { applyPassive } from '@material/dom/events';
import { MdcComponent, IValidatedElement, IError, booleanAttr, number } from '@aurelia-mdc-web/base';
import { MdcFloatingLabel } from '@aurelia-mdc-web/floating-label';
import { MdcLineRipple } from '@aurelia-mdc-web/line-ripple';
import { MdcNotchedOutline } from '@aurelia-mdc-web/notched-outline';
import { MdcTextFieldIcon, mdcIconStrings, IMdcTextFieldIconElement } from './mdc-text-field-icon';
import { MdcTextFieldHelperText } from './mdc-text-field-helper-text/mdc-text-field-helper-text';
import { MdcTextFieldCharacterCounter } from './mdc-text-field-character-counter';
import { IMdcTextFieldHelperLineElement } from './mdc-text-field-helper-line/mdc-text-field-helper-line';
import { processContent, IPlatform } from '@aurelia/runtime-html';

let textFieldId = 0;

@inject(Element, IPlatform)
@customElement('mdc-text-field')
// @processContent(MdcTextField.processContent)
export class MdcTextField extends MdcComponent<MDCTextFieldFoundation> {
  constructor(root: HTMLElement, private platform: IPlatform) {
    super(root);
    defineMdcTextFieldElementApis(this.root);
  }

  static processContent(node: INode) {
    const element = node as HTMLElement;
    // move icons to slots - this allows omitting slot specification
    const leadingIcon = element.querySelector(`[${mdcIconStrings.ATTRIBUTE}][${mdcIconStrings.LEADING}]`);
    leadingIcon?.setAttribute('au-slot', 'leading-icon');
    const trailingIcon = element.querySelector(`[${mdcIconStrings.ATTRIBUTE}][${mdcIconStrings.TRAILING}]`);
    trailingIcon?.setAttribute('au-slot', 'trailing-icon');
  }

  id: string = `mdc-text-field-${++textFieldId}`;
  id1: string = `mdc-text-field-${textFieldId}`;
  input_: HTMLInputElement;
  label_?: MdcFloatingLabel = undefined;
  lineRipple_: MdcLineRipple;
  outline_!: MdcNotchedOutline | null; // assigned in html
  helperText_: MdcTextFieldHelperText | undefined;
  characterCounter_: MdcTextFieldCharacterCounter | undefined;
  errors = new Map<IError, boolean>();
  leadingIcon_: MdcTextFieldIcon | undefined;
  trailingIcon_: MdcTextFieldIcon | undefined;

  @bindable
  label: string;
  labelChanged() {
    this.platform.domWriteQueue.queueTask(() => {
      const openNotch = this.foundation!.shouldFloat;
      this.foundation!.notchOutline(openNotch);
    });
  }

  @bindable({ set: booleanAttr })
  textarea: boolean;

  @bindable({ set: booleanAttr })
  endAligned: boolean;

  @bindable({ set: booleanAttr })
  ltrText: boolean;

  @bindable({ set: booleanAttr })
  outlined: boolean;

  @bindable
  prefix: string;

  @bindable
  suffix: string;

  @bindable({ set: booleanAttr })
  required: boolean;
  requiredChanged() {
    this.input_.required = this.required;
    this.foundation!.setUseNativeValidation(true);
  }

  @bindable({ set: booleanAttr })
  disabled: boolean;
  disabledChanged() {
    this.input_.disabled = this.disabled;
    this.foundation?.setDisabled(this.disabled);
  }

  @bindable({ set: booleanAttr })
  readonly: boolean;
  readonlyChanged() {
    this.input_.readOnly = this.readonly;
  }

  /** Makes the element blur on Enter key press */
  @bindable({ set: booleanAttr })
  blurOnEnter: boolean;

  @bindable
  maxlength: string;
  maxlengthChanged() {
    if (this.maxlength) {
      this.input_.setAttribute('maxlength', this.maxlength);
    } else {
      this.input_.removeAttribute('maxlength');
    }
  }

  @bindable
  rows: string;
  rowsChanged() {
    if (this.rows) {
      this.input_.setAttribute('rows', this.rows);
    } else {
      this.input_.removeAttribute('rows');
    }
  }

  @bindable
  cols: string;
  colsChanged() {
    if (this.rows) {
      this.input_.setAttribute('cols', this.cols);
    } else {
      this.input_.removeAttribute('cols');
    }
  }

  @bindable
  max: string;
  maxChanged() {
    if (this.max === undefined) {
      this.input_.removeAttribute('max');
    } else {
      this.input_.max = this.max;
    }
  }

  @bindable
  min: string;
  minChanged() {
    if (this.min === undefined) {
      this.input_.removeAttribute('min');
    } else {
      this.input_.min = this.min;
    }
  }

  @bindable
  step: string;
  stepChanged() {
    if (this.step === undefined) {
      this.input_.removeAttribute('step');
    } else {
      this.input_.step = this.step;
    }
  }

  @bindable
  autocomplete: string;
  autocompleteChanged() {
    if (this.autocomplete === undefined) {
      this.input_.removeAttribute('autocomplete');
    } else {
      this.input_.autocomplete = this.autocomplete;
    }
  }

  @bindable({ set: number })
  tabindex: number;
  tabindexChanged() {
    if (isNaN(this.tabindex)) {
      this.input_.removeAttribute('tabindex');
    } else {
      this.input_.tabIndex = this.tabindex;
    }
  }

  @bindable
  type: string;
  typeChanged() {
    if (!this.textarea) {
      if (this.type === undefined) {
        this.input_.removeAttribute('type');
      } else {
        this.input_.type = this.type;
      }
    }
  }

  @bindable
  name: string;
  nameChanged() {
    if (this.name === undefined) {
      this.input_.removeAttribute('name');
    } else {
      this.input_.name = this.name;
    }
  }

  @bindable
  placeholder: string = ' '; // non empty placeholder solves the issue of misplaced labels in Safari

  private initialValue: string;
  get value(): string {
    if (this.foundation) {
      return this.foundation.getValue();
    } else {
      return this.initialValue;
    }
  }
  set value(value: string) {
    if (this.foundation) {
      if (this.foundation.getValue() !== value) {
        this.foundation.setValue(value === null || value === undefined ? '' : value.toString());
      }
    } else {
      this.initialValue = value;
    }
  }

  addError(error: IError) {
    this.errors.set(error, true);
    this.valid = false;
  }

  removeError(error: IError) {
    this.errors.delete(error);
    this.valid = this.errors.size === 0;
  }

  get valid(): boolean {
    return this.foundation?.isValid() ?? true;
  }

  set valid(value: boolean) {
    this.foundation?.setUseNativeValidation(false);
    this.foundation?.setValid(value);
  }

  renderErrors() {
    const helperLine = this.root.nextElementSibling as IMdcTextFieldHelperLineElement;
    if (helperLine?.tagName === 'MDC-TEXT-FIELD-HELPER-LINE') {
      helperLine.$au['au:resource:custom-element'].viewModel.errors = Array.from(this.errors.keys())
        .filter(x => x.message !== null).map(x => x.message!);
    }
  }

  beforeFoundationCreated() {
    const leadingIconEl = this.root.querySelector(`[${mdcIconStrings.ATTRIBUTE}][${mdcIconStrings.LEADING}]`) as IMdcTextFieldIconElement;
    this.leadingIcon_ = leadingIconEl?.$au['au:resource:custom-attribute:mdc-text-field-icon'].viewModel;
    const trailingIconEl = this.root.querySelector(`[${mdcIconStrings.ATTRIBUTE}][${mdcIconStrings.TRAILING}]`) as IMdcTextFieldIconElement;
    this.trailingIcon_ = trailingIconEl?.$au['au:resource:custom-attribute:mdc-text-field-icon'].viewModel;
  }

  initialSyncWithDOM() {
    this.requiredChanged();
    this.disabledChanged();
    this.readonlyChanged();
    this.tabindexChanged();
    this.maxlengthChanged();
    this.rowsChanged();
    this.colsChanged();
    this.minChanged();
    this.maxChanged();
    this.stepChanged();
    this.typeChanged();
    this.autocompleteChanged();
    this.nameChanged();
    // handle the case when attribute value was set, not bound, in html
    if (this.root.hasAttribute('value')) {
      this.value = this.root.getAttribute('value') ?? '';
    }

    this.value = this.initialValue;
    this.errors = new Map<IError, boolean>();
    this.valid = true;
  }

  getDefaultFoundation() {
    const adapter: Partial<MDCTextFieldAdapter> = {
      ...this.getRootAdapterMethods_(),
      ...this.getInputAdapterMethods_(),
      ...this.getLabelAdapterMethods_(),
      ...this.getLineRippleAdapterMethods_(),
      ...this.getOutlineAdapterMethods_(),
    };
    return new MDCTextFieldFoundation(adapter, this.getFoundationMap_());
  }

  private getRootAdapterMethods_(): MDCTextFieldRootAdapter {
    return {
      addClass: (className) => this.root.classList.add(className),
      removeClass: (className) => this.root.classList.remove(className),
      hasClass: (className) => this.root.classList.contains(className),
      registerTextFieldInteractionHandler: (evtType, handler) => this.listen(evtType, handler),
      deregisterTextFieldInteractionHandler: (evtType, handler) => this.unlisten(evtType, handler),
      registerValidationAttributeChangeHandler: (handler) => {
        const getAttributesList = (mutationsList: MutationRecord[]): string[] => {
          return mutationsList
            .map((mutation) => mutation.attributeName)
            .filter((attributeName) => attributeName) as string[];
        };
        const observer = new MutationObserver((mutationsList) => handler(getAttributesList(mutationsList)));
        const config = { attributes: true };
        observer.observe(this.input_, config);
        return observer;
      },
      deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect(),
    };
  }

  private getInputAdapterMethods_(): MDCTextFieldInputAdapter {
    return {
      getNativeInput: () => this.input_,
      setInputAttr: (attr, value) => {
        this.input_.setAttribute(attr, value);
      },
      removeInputAttr: (attr) => {
        this.input_.removeAttribute(attr);
      },
      isFocused: () => document.activeElement === this.input_,
      registerInputInteractionHandler: (evtType, handler) => this.input_.addEventListener(evtType, handler, applyPassive()),
      deregisterInputInteractionHandler: (evtType, handler) => this.input_?.removeEventListener(evtType, handler, applyPassive()),
    };
  }

  private getLabelAdapterMethods_(): MDCTextFieldLabelAdapter {
    return {
      floatLabel: (shouldFloat) => this.label_?.float(shouldFloat),
      getLabelWidth: () => this.label_ ? this.label_.getWidth() : 0,
      hasLabel: () => Boolean(this.label_),
      shakeLabel: (shouldShake) => this.label_?.shake(shouldShake),
      setLabelRequired: (isRequired) => this.label_?.setRequired(isRequired),
    };
  }

  private getLineRippleAdapterMethods_(): MDCTextFieldLineRippleAdapter {
    return {
      activateLineRipple: () => this.lineRipple_?.activate(),
      deactivateLineRipple: () => this.lineRipple_?.deactivate(),
      setLineRippleTransformOrigin: (normalizedX) => this.lineRipple_?.setRippleCenter(normalizedX)
    };
  }

  private getOutlineAdapterMethods_(): MDCTextFieldOutlineAdapter {
    return {
      closeOutline: () => this.outline_?.closeNotch(),
      hasOutline: () => Boolean(this.outline_),
      notchOutline: (labelWidth) => this.outline_?.notch(labelWidth),
    };
  }

  /**
   * @return A map of all subcomponents to subfoundations.
   */
  private getFoundationMap_(): Partial<MDCTextFieldFoundationMap> {
    return {
      characterCounter: this.characterCounter_ ? this.characterCounter_.foundationForTextField : undefined,
      helperText: this.helperText_ ? this.helperText_.foundationForTextField : undefined,
      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundationForTextField : undefined,
      trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundationForTextField : undefined,
    };
  }

  onInput(evt: Event): void {
    const value = (evt.target as HTMLInputElement).value;
    this.value = value;
  }

  onFocus() {
    this.foundation?.activateFocus();
    this.emit('focus', {}, true);
  }

  onChange(evt: Event): void {
    const value = (evt.target as HTMLInputElement).value;
    this.value = value;
  }

  onBlur(): void {
    this.foundation?.deactivateFocus();
    this.emit('blur', {}, true);
  }

  focus() {
    this.input_.focus();
  }

  blur() {
    this.input_.blur();
  }

  onKeyup(e: KeyboardEvent) {
    if (this.blurOnEnter && e.keyCode === 13) {
      this.blur();
    }
    return true;
  }
}

/** @hidden */
export interface IMdcTextFieldElement extends IValidatedElement {
  $au: {
    'au:resource:custom-element': {
      viewModel: MdcTextField;
    };
  };
}

function defineMdcTextFieldElementApis(element: HTMLElement) {
  Object.defineProperties(element, {
    value: {
      get(this: IMdcTextFieldElement) {
        return this.$au['au:resource:custom-element'].viewModel.value;
      },
      set(this: IMdcTextFieldElement, value: string) {
        this.$au['au:resource:custom-element'].viewModel.value = value;
      },
      configurable: true
    },
    disabled: {
      get(this: IMdcTextFieldElement) {
        return this.$au['au:resource:custom-element'].viewModel.disabled;
      },
      set(this: IMdcTextFieldElement, value: boolean) {
        this.$au['au:resource:custom-element'].viewModel.disabled = value;
      },
      configurable: true
    },
    readOnly: {
      get(this: IMdcTextFieldElement) {
        return this.$au['au:resource:custom-element'].viewModel.readonly;
      },
      set(this: IMdcTextFieldElement, value: boolean) {
        this.$au['au:resource:custom-element'].viewModel.readonly = value;
      },
      configurable: true
    },
    valid: {
      get(this: IMdcTextFieldElement) {
        return this.$au['au:resource:custom-element'].viewModel.valid;
      },
      set(this: IMdcTextFieldElement, value: boolean) {
        this.$au['au:resource:custom-element'].viewModel.valid = value;
      },
      configurable: true
    },
    addError: {
      value(this: IMdcTextFieldElement, error: IError) {
        this.$au['au:resource:custom-element'].viewModel.addError(error);
      },
      configurable: true
    },
    removeError: {
      value(this: IMdcTextFieldElement, error: IError) {
        this.$au['au:resource:custom-element'].viewModel.removeError(error);
      },
      configurable: true
    },
    renderErrors: {
      value(this: IMdcTextFieldElement): void {
        this.$au['au:resource:custom-element'].viewModel.renderErrors();
      },
      configurable: true
    },
    focus: {
      value(this: IMdcTextFieldElement) {
        this.$au['au:resource:custom-element'].viewModel.focus();
      },
      configurable: true
    },
    blur: {
      value(this: IMdcTextFieldElement) {
        this.$au['au:resource:custom-element'].viewModel.blur();
      },
      configurable: true
    }
  });
}
