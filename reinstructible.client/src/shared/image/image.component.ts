import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

@Component({
  selector: 'app-image',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {
  @Input() img_url: string = ''; 
  @Input() alt_img_url: string = ''; 
  @Input() id: string = ''; 
  @Input() imgClass: string = ''; 
  @Output() clickEvent = new EventEmitter<Event>(); // Output event for button clicks

  onClick(e: Event): void {
    this.clickEvent.emit(e);
  }
}
