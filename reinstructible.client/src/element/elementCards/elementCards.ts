import { Component, OnInit, OnChanges, input, output } from '@angular/core';

import { IElement, IElementGroup, IFilterOptionGroups, IFilterOptions } from '../../interfaces/rebrickable';
import { elementCard } from './elementCard/elementCard';
import { EDisplayGroup } from '../../interfaces/Enums';
import sorting from '../../Utilities/sorting';

@Component({
  selector: 'elementCards',
  standalone: true,
  imports: [elementCard],
  templateUrl: './elementCards.html',
  styleUrl: './elementCards.css',
})
export class ElementCards implements OnInit, OnChanges {
  public currentGrouping = input<EDisplayGroup>();
  public elements = input<IElement[]>([]);
  public elementCards: IElementGroup[] = [];
  public itemForStorage = output<IElement>();

  public optionGroups = input<IFilterOptionGroups>();
  //public groupColor = input<IFilterOptions[]>([]);
  //public groupCategory = input<IFilterOptions[]>([]);
  //public groupStorage = input<IFilterOptions[]>([]);

  ngOnInit() {
    this.formatElements();
  }
  ngOnChanges() {
    this.formatElements();
  }

  setStorage(value: IElement) {
    this.itemForStorage.emit(value);
  }
  formatElements() {
    this.elementCards = [];
    switch (this.currentGrouping()) {
      case EDisplayGroup.Color:
        //this.formatByColor();
        let groupColor = this.optionGroups()?.partColorOptions!;
        this.elementCards = sorting.groupByColor(this.elements(), groupColor);
        break;
      case EDisplayGroup.Category:
        //this.formatByCategory();
        let groupCategory = this.optionGroups()?.partCategoryOptions!;
        this.elementCards = sorting.groupByCategory(this.elements(), groupCategory);
        break;
      case EDisplayGroup.Storage:
        let groupStorage = this.optionGroups()?.partStorageOptions!;
        this.elementCards = sorting.groupByStorage(this.elements(), groupStorage);
        //this.formatByStorage();
        break;
      case EDisplayGroup.Alpha:
        //this.formatByAlpha();
        this.elementCards = sorting.groupByAlpha(this.elements());
        break;
    }
  }
  //formatByColor() {
  //  this.groupColor().forEach(c => {
  //    let elementsForGroup = this.elements().filter(e => e.color.id === c.id)
  //      .sort((a, b) => {
  //        const elementComparison = a.color.name.localeCompare(b.color.name);
  //        return elementComparison;
  //      });
  //    if (elementsForGroup.length > 0) {
  //      let elementCard: IElementCards = {
  //        grouping: c.name,
  //        elements: elementsForGroup
  //      }
  //      this.elementCards.push(elementCard);
  //    }
  //  });
  //}

  //formatByCategory() {
  //  this.groupCategory().forEach(c => {
  //    let elementsForGroup = this.elements().filter(e => e.part.part_cat_id === c.id)
  //      .sort((a, b) => {
  //        const elementComparison = a.part.name.localeCompare(b.part.name);
  //        return elementComparison || a.color.name.localeCompare(b.color.name);
  //      });
  //    if (elementsForGroup.length > 0) {
  //      let elementCard: IElementCards = {
  //        grouping: c.name,
  //        elements: elementsForGroup
  //      }
  //      this.elementCards.push(elementCard);
  //    }
  //  });
  //}
  //formatByStorage() {
  //  this.groupStorage().forEach(s => {
  //    let elementsForGroup = this.elements()
  //      .filter(e => e.storage_location.bin === s.name)
  //      .sort((a, b) =>
  //        a.storage_location.drawer.localeCompare(b.storage_location.drawer)
  //        || a.part.name.localeCompare(b.part.name)
  //        || a.color.name.localeCompare(b.color.name)
  //      );
  //    if (elementsForGroup.length > 0) {
  //      let elementCard: IElementCards = {
  //        grouping: s.name,
  //        elements: elementsForGroup
  //      }
  //      this.elementCards.push(elementCard);
  //    }
  //  });
  //}

  //formatByAlpha() {
  //  this.groupAlpha.forEach(a => {
  //    let elementsForGroup = this.elements().filter(e => e.part.name.startsWith(a))
  //      .sort((a, b) => {
  //        const elementComparison = a.part.name.localeCompare(b.part.name);
  //        return elementComparison || a.color.name.localeCompare(b.color.name);
  //      });
  //    if (elementsForGroup.length > 0) {
  //      let elementCard: IElementCards = {
  //        grouping: a,
  //        elements: elementsForGroup
  //      }
  //      this.elementCards.push(elementCard);
  //    }
  //  })
  //}
}
