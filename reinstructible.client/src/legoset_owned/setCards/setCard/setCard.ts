import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ILegoSet } from '../../../interfaces/rebrickable'

@Component({
  selector: 'setCard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './setCard.html',
  styleUrl: './setCard.css'
})

export class SetCard {
  public legoSet = input<ILegoSet | null>(null);
  public setNumOut = output<string>();

  loadSet(value: string) {
    this.setNumOut.emit(value);
  }
}

