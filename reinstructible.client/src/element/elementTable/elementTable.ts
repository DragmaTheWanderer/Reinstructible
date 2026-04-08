import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IElement, IElementGroup, IFilterOptionGroups, IFilterOptions, } from '../../interfaces/rebrickable'
import { EDisplayGroup } from '../../interfaces/Enums'
import sorting from '../../Utilities/sorting';

import { ImageComponent } from '../../shared/image/image.component';


@Component({
  selector: 'elementTable',
  standalone: true,
  imports: [ImageComponent, CommonModule, FormsModule, ],
  templateUrl: './elementTable.html',
  styleUrl: './elementTable.css'
})

export class ElementTable {
   /**
   * Currently displayed elements after applying filters.
   */
  public currentGrouping = input<EDisplayGroup>();
  public elements = input<IElement[]>([]);
  public elementsDisp: IElement[] = [];

  public elementGrouped: IElementGroup[] = [];
  public itemForStorage = output<IElement>();

  public optionGroups = input<IFilterOptionGroups>();
  //public groupColor = input<IFilterOptions[]>([]);
  //public groupCategory = input<IFilterOptions[]>([]);
  //public groupStorage = input<IFilterOptions[]>([]);


  /**
   * Element selected for editing/assigning storage.
   */
  public elementForStorage!: IElement;

  public elementSelectedClass: string = 'w3-yellow';

  ngOnInit() {
    this.formatElements();
  }
  ngOnChanges() {
    this.formatElements();
  }

  formatElements() {
    this.elementsDisp = [];
    
    switch (this.currentGrouping()) {
      case EDisplayGroup.Color:
        let groupColor = this.optionGroups()?.partColorOptions!;
        this.elementGrouped = sorting.groupByColor(this.elements(), groupColor);
        this.elementsDisp = this.elements().sort((a, b) => a.color.name.localeCompare(b.color.name)
          || a.part.name.localeCompare(b.part.name));
        break;
      case EDisplayGroup.Category:
        let groupCategory = this.optionGroups()?.partCategoryOptions!;
        this.elementGrouped = sorting.groupByCategory(this.elements(), groupCategory);
        this.elementsDisp = this.elements().sort((a, b) => a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name));
        break;
      case EDisplayGroup.Storage:
        let groupStorage = this.optionGroups()?.partStorageOptions!;
        this.elementGrouped = sorting.groupByStorage(this.elements(), groupStorage);
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
