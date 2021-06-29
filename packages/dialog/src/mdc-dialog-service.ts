import { MdcDialog } from './mdc-dialog';
import { inject, IPlatform, IContainer, IAppRoot, LifecycleFlags, createElement, CustomAttribute } from 'aurelia';
import { MDCDialogCloseEvent } from '@material/dialog';
import { Scope } from '@aurelia/runtime';
import { CustomElement } from '@aurelia/runtime-html';
import { Constructable } from '@aurelia/kernel';
import { IMdcRippleElement, MdcRipple } from '@aurelia-mdc-web/ripple';

/** Dialog service open method options */
export interface IMdcDialogOptions {
  /** A class represeting the dialog content view model */
  viewModel: Constructable;

  /** Data to pass to the view model's activate method */
  model?: unknown;
}

interface IMdcDialogBindingContext {
  handleClosed(evt: MDCDialogCloseEvent): void;
  handleOpened(): void;
}

/** Service to open MDC dialogs */
@inject(IPlatform, IContainer, IAppRoot)
export class MdcDialogService {
  constructor(private platform: IPlatform, private container: IContainer, private appRoot: IAppRoot) { }

  /** Opens the dialog specified in the options */
  async open(options: IMdcDialogOptions) {
    let closedResolver: (action?: string | PromiseLike<string> | undefined) => void;
    const closedPromise = new Promise<string>(r => closedResolver = r);
    let openedResolver: (value?: unknown) => void;
    const openedPromise = new Promise(r => openedResolver = r);
    const bindingContext: IMdcDialogBindingContext = {
      handleClosed: (evt: MDCDialogCloseEvent) => {
        closedResolver(evt.detail.action);
        sv.deactivate(sv, this.appRoot.controller, LifecycleFlags.none);
        dialogVm.root.removeEventListener('mdcdialog:closed', bindingContext.handleClosed);
        dialogVm.root.removeEventListener('mdcdialog:opened', bindingContext.handleOpened);
        dialogEl.remove();
      },
      handleOpened: () => {
        openedResolver();
      }
    };

    const renderPlan = createElement(this.platform, options.viewModel);
    const sv = renderPlan.createView(this.container);
    const dialogEl = sv.children![0].host!;
    sv.activate(sv, this.appRoot.controller, LifecycleFlags.none, Scope.create(bindingContext));
    document.body.appendChild(dialogEl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = sv.children![0].viewModel as any;
    const dialogVm = CustomElement.for<MdcDialog>(dialogEl.querySelector('mdc-dialog')!).viewModel;
    dialogVm.root.addEventListener('mdcdialog:closed', bindingContext.handleClosed);
    dialogVm.root.addEventListener('mdcdialog:opened', bindingContext.handleOpened);
    if (vm.activate) {
      const activateResult = vm.activate(options.model);
      if (activateResult instanceof Promise) {
        await activateResult;
      }
    }
    await dialogVm.initialised;
    dialogVm.open();

    await openedPromise;
    // re-layout ripple elements because dialogs use `transform: scale(.8)` and initial layout is incorrect
    const ripples = Array.from(dialogVm.root.querySelectorAll<IMdcRippleElement>('.mdc-ripple-upgraded'));
    await Promise.all(ripples.map(async x => {
      const ripple = CustomAttribute.for<MdcRipple>(x, 'mdc-ripple');
      await ripple?.viewModel.initialised;
      ripple?.viewModel.foundation?.layout();
    }));
    dialogVm.createFocusTrap();
    this.platform.taskQueue.queueTask(() => dialogVm.focusTrap?.trapFocus());
    return closedPromise;
  }
}
