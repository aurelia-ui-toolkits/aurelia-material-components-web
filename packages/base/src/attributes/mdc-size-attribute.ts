import { customAttribute, bindingMode, inject, bindable } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

export interface Size {
  width: number;
  height: number;
}

@customAttribute('mdc-size')
@inject(Element)
export class MdcSizeCustomAttribute {

  private observer: { observe(element: Element): void; disconnect(): void } | undefined;
  @bindable({ defaultBindingMode: bindingMode.fromView, primaryProperty: true })
  public value: Size = { width: 0, height: 0 };

  @bindable({ defaultBindingMode: bindingMode.fromView }) public width: number = 0;
  @bindable({ defaultBindingMode: bindingMode.fromView }) public height: number = 0;

  constructor(private element: HTMLElement) {
  }

  public bind() {
    this.observer = this.getObserver();
    this.observer?.observe(this.element);
  }

  public unbind() {
    this.observer?.disconnect();
    this.observer = void 0;
  }

  public getObserver() {
    if (typeof PLATFORM.global.ResizeObserver === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new PLATFORM.global.ResizeObserver((records: { contentRect: DOMRectReadOnly }[]) => {
        const rect = records[0].contentRect;
        this.value = { width: rect.width, height: rect.height };
      });
    } else {
      return new ElementSizeDirtyChecker((size) => {
        this.value = size;
      });
    }
  }

  public valueChanged(size: Size) {
    this.value = size;
    this.width = size.width;
    this.height = size.height;
  }
}

class ElementSizeDirtyChecker {

  private callback: (size: Size) => unknown;
  private rate: number;
  private size: { width: number; height: number };
  private timerId: unknown;

  constructor(callback: (size: Size) => unknown, rate = 330 /* 3 times a second */) {
    this.callback = callback;
    this.rate = rate;
    this.size = { width: 0, height: 0 };
  }

  public observe(element: HTMLElement) {
    this.timerId = setInterval(() => {
      const { width, height } = element.getBoundingClientRect();
      const currentSize = this.size;
      if (width !== currentSize.width || height !== currentSize.height) {
        this.size = { width, height };
        if (typeof this.callback === 'function') {
          this.callback(this.size);
        }
      }
    }, this.rate);
  }

  public disconnect() {
    clearInterval(this.timerId as number);
  }
}
