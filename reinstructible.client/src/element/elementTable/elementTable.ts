import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IElement, IElementCards, IFilterOptions, } from '../../interfaces/rebrickable'
import { EDisplayGroup } from '../../interfaces/Enums'
import sorting from '../../Utilities/sorting';


@Component({
  selector: 'elementTable',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './elementTable.html',
  styleUrl: './elementTable.css'
})

export class ElementTable {
   /**
   * Currently displayed elements after applying filters.
   */
  public elements = input<IElement[]>([]);
  public elementsDisp: IElement[] = [];

  public elementGrouped: IElementCards[] = [];
  public itemForStorage = output<IElement>();

  public groupColor = input<IFilterOptions[]>([]);
  public groupCategory = input<IFilterOptions[]>([]);
  public groupStorage = input<IFilterOptions[]>([]);

  public currentGrouping = input<EDisplayGroup>();

  /**
   * Element selected for editing/assigning storage.
   */
  public elementForStorage!: IElement;

  public elementSelectedClass: string = 'w3-yellow';

  ngOnInit() { this.formatElements(); }
  ngOnChanges() { this.formatElements(); }

  formatElements() {
    this.elementsDisp = [];
    switch (this.currentGrouping()) {
      case EDisplayGroup.Color:
        this.elementGrouped = sorting.groupByColor(this.elements(), this.groupColor());
        this.elementsDisp = this.elements().sort((a, b) => a.color.name.localeCompare(b.color.name)
          || a.part.name.localeCompare(b.part.name));
        break;
      case EDisplayGroup.Category:
        this.elementGrouped = sorting.groupByCategory(this.elements(), this.groupCategory());
        this.elementsDisp = this.elements().sort((a, b) => a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name));
        break;
      case EDisplayGroup.Storage:
        this.elementGrouped = sorting.groupByStorage(this.elements(), this.groupStorage());
        //set up 2 groups, then sort each group, then concat the 2 for the display
        let unassigned = this.elements().filter(x => x.storage_location.bin == 'Unassigned')
          .sort((a, b) =>
          a.storage_location.bin.localeCompare(b.storage_location.bin)
          || a.storage_location.drawer.localeCompare(b.storage_location.drawer)
          || a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name));;
        let assigned = this.elements().filter(x => x.storage_location.bin != 'Unassigned').sort((a, b) =>
          a.storage_location.bin.localeCompare(b.storage_location.bin)
          || a.storage_location.drawer.localeCompare(b.storage_location.drawer)
          || a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name));

        this.elementsDisp = unassigned;
        this.elementsDisp.push(...assigned);
        break;
      case EDisplayGroup.Alpha:
        this.elementGrouped = sorting.groupByAlpha(this.elements());
        this.elementsDisp = this.elements().sort((a, b) => a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name));
        break;
    }
  }



  setStorage(value: IElement, e: Event) {
    e.stopPropagation();
    this.itemForStorage.emit(value);
  }

  foundElement(element: IElement, e: Event) {
    e.stopPropagation();
    element.selected = !element.selected;
  }
  foundElementBackground(element: IElement) {
    let result = '';
    if (element.selected) { result = this.elementSelectedClass; }
    return result;
  }


  protected readonly title = signal('reinstructible.client');
}
