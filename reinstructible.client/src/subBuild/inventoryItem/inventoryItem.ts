import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

import { IElement } from '../../interfaces/rebrickable'

import { ButtonComponent } from '../../shared/button/button.component'
import { ImageCountComponent } from '../../shared/imageCount/imageCount.component';

@Component({
  selector: 'inventoryItem',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule, ButtonComponent, ImageCountComponent],
  templateUrl: './inventoryItem.html',
  styleUrls: ['./inventoryItem.css']
})
export class InventoryItem implements OnInit, OnChanges {
  @Input() element!: IElement;
  public countLeft: number = 0;
  @Output() addElementEvent = new EventEmitter<IElement>(); // Output event for button clicks
  @Output() removeElementEvent = new EventEmitter<IElement>(); // Output event for button clicks

  ngOnInit() {
    //getting the remain pieces to be assigned
    this.getCountLeft();
  }
  ngOnChanges() {
    //getting the remain pieces to be assigned
    this.getCountLeft();
  }

  getCountLeft() {
    let left = this.element.quantity;
    if (this.element.sub_inventory != null) {
      if (this.element.sub_inventory.length > 0) {
        const sum: number = this.element.sub_inventory.reduce((n, { quantity }) => n + quantity, 0);
        left -= sum;
      }
    }
    this.countLeft = left;
  }
  addToSelected() {
    this.addElementEvent.emit(this.element)
  }
  removeFromSelected(){
    this.removeElementEvent.emit(this.element)

  }
}
