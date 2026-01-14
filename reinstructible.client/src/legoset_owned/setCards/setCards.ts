import { Component, OnInit, OnChanges, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ILegoSet, ILegoSetCards, IFilterOptions } from '../../interfaces/rebrickable'
import { SetCard } from './setCard/setCard';

@Component({
  selector: 'setCards',
  standalone: true,
  imports: [CommonModule, SetCard],
  templateUrl: './setCards.html',
  styleUrl: './setCards.css'
})

export class SetCards implements OnInit, OnChanges {
  public legoSets = input<ILegoSet[]>([]);
  public currentTheme = input<string>();
  public setThemes = input<IFilterOptions[]>([]);
  public setAlpha: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  public legoSetCards: ILegoSetCards[] = [];
  public setNumOut = output<string>();

  public setGroup: string = "theme";

  ngOnInit() {
    this.formatLegoSets();
  }
  ngOnChanges() {
    this.formatLegoSets();
  }
  loadSet(value: string) {
    this.setNumOut.emit(value);
  }

  formatLegoSets() {
    this.legoSetCards = [];
    //set up the card interface to equate to the grouping needed,  defaults to category.
    if (this.setGroup === "theme") {
      if (this.currentTheme() === "All") {
        this.setThemes().forEach(t => {
          let legoSetCard: ILegoSetCards = {
            grouping: t.name,
            legoSets: this.legoSets().filter(s => s.theme_id === t.id)
          }
          this.legoSetCards.push(legoSetCard);
        });
      } else {
        let legoSetCard: ILegoSetCards = {
          grouping: this.currentTheme()!,
          legoSets: this.legoSets().filter(s => s.theme[0].name === this.currentTheme())
        }
        this.legoSetCards.push(legoSetCard);
      }

    }
  }
}
