import { Component, OnInit, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IElement } from '../../../interfaces/rebrickable'

@Component({
  selector: 'elementCard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './elementCard.html',
  styleUrl: './elementCard.css'
})

export class elementCard implements OnInit {
  public element = input<IElement | null>(null);
  public itemForStorage = output<IElement>();

  public partName: string = "";

  ngOnInit() {
    this.partName = this.element()!.part.name
      .replace(', ', ',<br>')
      .replace(' (', '<br>(')
      .replace(' [', '<br>[')
      .replace(' with', '<br>with');
  }

  setStorage(value: IElement) {
    this.itemForStorage.emit(value);
  }

  public elementSelectedClass: string = 'w3-yellow';
  foundElement(element: IElement, e: Event) {
    e.stopPropagation();
    element.selected = !element.selected;
  }
  foundElementBackground(element: IElement) {
    let result = '';
    if (element.selected) { result = this.elementSelectedClass; }
    return result;
  }
}
