import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

@Component({
  selector: 'app-button',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() icon: string = ''; // Input property for the button text
  @Input() color: string = ''; // Input for different styles
  @Input() toolTipClass: string = ''; // Input for tooltip CSS class
  @Input() toolTip: string = ''; // Input for tooltip text
  @Output() clickEvent = new EventEmitter<Event>(); // Output event for button clicks

  onClick(e: Event): void {
    this.clickEvent.emit(e);
  }
}
