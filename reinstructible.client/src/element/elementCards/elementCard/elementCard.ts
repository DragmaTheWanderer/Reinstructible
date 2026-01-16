import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IElement } from '../../../interfaces/rebrickable'

@Component({
  selector: 'elementCard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './elementCard.html',
  styleUrl: './elementCard.css'
})

export class elementCard {
  public element = input<IElement | null>(null);
  public itemForStorage = output<IElement>();

  setStorage(value: IElement) {
    this.itemForStorage.emit(value);
  }
}
