import { Component, Input, Output, EventEmitter } from '@angular/core';
// Required for standalone components

import { ImageComponent } from '../image/image.component';

@Component({
  selector: 'app-imageCount',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [ImageComponent],
  templateUrl: './imageCount.component.html',
  styleUrls: ['./imageCount.component.css'],
})
export class ImageCountComponent {
  @Input() countLeft: string = '0';
  @Input() countTotal: string = '0';
  @Input() img_url: string = '';
  @Input() alt_img_url: string = '';
  @Input() id: string = '';
  @Input() toolTip: string = '';
  imgClass: string = 'element-img';
  @Output() clickEvent = new EventEmitter<Event>(); // Output event for button clicks

  onClick(e: Event): void {
    this.clickEvent.emit(e);
  }

  public showCountTotal() {
    let result = false;
    if (Number(this.countTotal) > 0) {
      result = true;
    }
    return result;
  }
}
