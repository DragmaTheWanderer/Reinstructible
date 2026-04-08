import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../../interfaces/rebrickable';

import { EDisplayGroup, EFileOption, EFilterType, EDisplayMode } from '../../../interfaces/Enums';

@Component({
  selector: 'cardComponent',
  standalone: true,
  imports: [FormsModule, ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})

export class CardComponent {
  public filterType = input<EFilterType>();
  public options = input<IFilterOptions[]>([]);

  public onOptionsSent = output<{ filterType: EFilterType, options: IFilterOptions[] }>();

  onSelected(option: IFilterOptions) {
    option.selected = !option.selected; // toggle the selected state
    this.elementFilter();
  }

  elementFilter() {
    let ft: EFilterType = this.filterType() ?? EFilterType.color;
    let o: IFilterOptions[] = this.options();
    this.onOptionsSent.emit({ filterType: ft, options: o })
    }
  }

