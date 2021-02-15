import { IContainer, AppTask, IAttrSyntaxTransformer, NodeObserverLocator } from 'aurelia';
import { MdcTextField } from './mdc-text-field';
import { MdcTextFieldIcon } from './mdc-text-field-icon';
import { MdcTextFieldHelperLine } from './mdc-text-field-helper-line/mdc-text-field-helper-line';
import { MdcTextFieldHelperText } from './mdc-text-field-helper-text/mdc-text-field-helper-text';
import { MdcTextFieldCharacterCounter } from './mdc-text-field-character-counter';
import { FloatingLabelConfiguration } from '@aurelia-mdc-web/floating-label';
import { LineRippleConfiguration } from '@aurelia-mdc-web/line-ripple';
import { NotchedOutlineConfiguration } from '@aurelia-mdc-web/notched-outline';
import { RippleConfiguration } from '@aurelia-mdc-web/ripple';

export { MdcTextField, IMdcTextFieldElement } from './mdc-text-field';
export { IMdcTextFieldHelperLineElement } from './mdc-text-field-helper-line/mdc-text-field-helper-line';

let configured = false;

export const TextFieldConfiguration = {
  register(container: IContainer): IContainer {
    if (!configured) {
      AppTask.with(IContainer).beforeCreate().call(c => {
        const attrSyntaxTransformer = c.get(IAttrSyntaxTransformer);
        const nodeObserverLocator = c.get(NodeObserverLocator);
        attrSyntaxTransformer.useTwoWay((el, property) => (el.getAttribute('as-element') ?? el.tagName).toUpperCase() === 'MDC-TEXT-FIELD' ? property === 'value' : false);
        nodeObserverLocator.useConfig({ 'MDC-TEXT-FIELD': { value: { events: ['input', 'change'] } } });
      }).register(container);
      configured = true;
    }
    return container.register(MdcTextField, MdcTextFieldIcon, MdcTextFieldHelperLine, MdcTextFieldHelperText, MdcTextFieldCharacterCounter,
      FloatingLabelConfiguration, LineRippleConfiguration, NotchedOutlineConfiguration, RippleConfiguration);
  }
};

