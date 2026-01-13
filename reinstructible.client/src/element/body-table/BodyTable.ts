import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IElement, IPart, IColor, IPartCategory, IStorage_updateList, } from '../../interfaces/rebrickable'

@Component({
  selector: 'bodyTable',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './BodyTable.html',
  styleUrl: './BodyTable.css'
})

export class BodyTable {
   /**
   * Currently displayed elements after applying filters.
   */
  public elements = input<IElement[]>([]);
  public itemForStorage = output<IElement>();

  /**
   * Element selected for editing/assigning storage.
   */
  public elementForStorage!: IElement;

  setStorage(value: IElement) {
    this.itemForStorage.emit(value);

  }

  protected readonly title = signal('reinstructible.client');
}
