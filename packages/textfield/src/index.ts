import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export { MdcTextField } from './mdc-textfield';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PLATFORM.moduleName('./mdc-textfield')
  ]);
}
