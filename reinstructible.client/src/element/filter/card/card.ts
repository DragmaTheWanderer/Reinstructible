import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../../interfaces/rebrickable';

import { EDisplayGroup, EFileOption, EFilterType, EDisplayMode } from '../../../interfaces/Enums';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'cardComponent',
  standalone: true,
  imports: [ButtonComponent, FormsModule,],
  templateUrl: './card.html',
  styleUrl: './card.css',
})

export class CardComponent {
  public filterType = input<EFilterType>();
  public options = input<IFilterOptions[]>([]);

  public onOptionsSent = output<{ filterType: EFilterType, options: IFilterOptions[] }>();

  onSelected(option: IFilterOptions, e: Event) {
    e.stopPropagation();
    option.selected = !option.selected; // toggle the selected state

    //check the childern to toggle all off or on
    option.subOptions.forEach(x => {
      x.selected = option.selected;
    })

    this.elementFilter();
  }

  onSubSelected(option: IFilterOptions, parent: IFilterOptions, e: Event) {
    e.stopPropagation();
    option.selected = !option.selected; // toggle the selected state

    //check if the parents childern are all deselected or not.
    parent.selected = parent.subOptions.some(x => x.selected);

    this.elementFilter();
  }

  elementFilter() {
    let ft: EFilterType = this.filterType() ?? EFilterType.color;
    let o: IFilterOptions[] = this.options();
    this.onOptionsSent.emit({ filterType: ft, options: o })
  }

  expandCompact(option: IFilterOptions, e: Event) {
    e.stopPropagation();
    option.compacted = !option.compacted;
  }
}

