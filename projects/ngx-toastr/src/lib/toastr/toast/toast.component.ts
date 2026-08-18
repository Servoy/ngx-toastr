import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { ToastBase } from '../base-toast/base-toast.component';

@Component({
  selector: '[toast-component]',
  templateUrl: '../base-toast/base-toast.component.html',
  styleUrl: './toast.component.scss',
  host: {
    '[style.--animation-easing]': 'params.easing',
    '[style.--animation-duration]': 'params.easeTime + "ms"',
    '[style.--animation-hide-easing]': 'params.hideEasing',
    '[style.--animation-hide-duration]': 'params.hideEaseTime + "ms"',
    'animate.enter': 'toast-in',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast<ConfigPayload = unknown> extends ToastBase<ConfigPayload> {
  readonly params = {
    easeTime: this.toastPackage.config.easeTime,
    easing: this.toastPackage.config.easing || 'ease-in',
    hideEaseTime: this.toastPackage.config.hideEaseTime || this.toastPackage.config.easeTime,
    hideEasing: this.toastPackage.config.hideEasing || this.toastPackage.config.easing || 'ease-in',
  };
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  override remove(): void {
    if (this.state() === 'removed') return;

    clearTimeout(this.timeout);
    this.state.set('removed');
    this.elementRef.nativeElement.classList.add('toast-out');
    const hideTime = +(this.params.hideEaseTime || this.params.easeTime);
    this.timeout = this.timeoutsService.setTimeout(
      () => this.toastrService.remove(this.toastPackage.toastId),
      hideTime,
    );
  }
}
