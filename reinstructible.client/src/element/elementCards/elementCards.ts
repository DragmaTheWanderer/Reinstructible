import { Component, OnInit, OnChanges, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IElement, IElementCards, IFilterOptions } from '../../interfaces/rebrickable'
import { elementCard } from './elementCard/elementCard';

@Component({
  selector: 'elementCards',
  standalone: true,
  imports: [CommonModule, elementCard],
  templateUrl: './elementCards.html',
  styleUrl: './elementCards.css'
})

export class ElementCards implements OnInit, OnChanges {
  public elements = input<IElement[]>([]);
  public elementCards: IElementCards[] = [];
  public itemForStorage = output<IElement>();

  public groupBy: string = "color";
  public groupColor = input<IFilterOptions[]>([]);
  public groupCategory = input<IFilterOptions[]>([]);
  public groupAlpha: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


  ngOnInit() { this.formatElements();}
  ngOnChanges() { this.formatElements();}

  setStorage(value: IElement) {
    this.itemForStorage.emit(value);
  }
  formatElements() {
    this.elementCards = [];
    switch (this.groupBy) {
      case "color":
        this.formatByColor();
        break;
      case "category":
        this.formatByCategory();
        break;
      case "alpha":
        this.formatByAlpha();
        break;
    }
  }
  formatByColor() {
    this.groupColor().forEach(c => {
      let elementCard: IElementCards = {
        grouping: c.name,
        elements: this.elements().filter(e => e.color.id === c.id)
      }
      this.elementCards.push(elementCard);
    });

  }
  formatByCategory() {
    this.groupCategory().forEach(c => {
      let elementCard: IElementCards = {
        grouping: c.name,
        elements: this.elements().filter(e => e.part.part_cat_id === c.id)
      }
      this.elementCards.push(elementCard);
    });

  }
  formatByAlpha() {

  }
}
