import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../interfaces/rebrickable'

import { EDisplayGroup } from '../../interfaces/Enums'

import { ButtonComponent } from '../../shared/button/button.component';


@Component({
  selector: 'filterComponent',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule,],
  templateUrl: './filter.html',
  styleUrl: './filter.css'
})

export class FilterComponent implements OnInit, OnChanges {
  public type = input<string>();
  public options = input<IFilterOptions[]>([]);

  public onOptionsSent = output<number[]>();
  public onOptionsStringSent = output<string[]>();
  public onDisplayMode = output<string>();
  public onCurrentGrouping = output<EDisplayGroup>();

  public currentGrouping :EDisplayGroup = EDisplayGroup.Color
  public currentGroupText = EDisplayGroup[this.currentGrouping];
  
  constructor() {
    this.onDisplayMode.emit('TV');
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;
  }

  onSelected(option: IFilterOptions) {
    option.selected = !option.selected; // toggle the selected state
    this.elementFilter();
  }

  selectAll() {
    this.options().forEach(x => x.selected = true)
    this.elementFilter();
  }
  clearSelections() {
    this.options().forEach(x => x.selected = false)
    this.elementFilter();
  }
  toggleSelections() {
    this.options().forEach(x => x.selected = !x.selected)
    this.elementFilter();
  }
  toggleGrouping() {
    if (this.currentGrouping == Object.keys(EDisplayGroup).length / 2 - 1) {
      this.currentGrouping = 0;
    } else {
      this.currentGrouping++;
    }
    this.currentGroupText = EDisplayGroup[this.currentGrouping];
    this.onCurrentGrouping.emit(this.currentGrouping);
    
  }
  elementFilter() {
    //this determins if the option is numeric or string based.
    if (this.options()[0].id != -1) {
      let filteredIds = this.options().filter(f => f.selected).flatMap(o => o.id);
      this.onOptionsSent.emit(filteredIds); //emit the array
    } else {
      let filteredStringIds = this.options().filter(f => f.selected).flatMap(o => o.name);
      this.onOptionsStringSent.emit(filteredStringIds); //emit the array
    }

  }
  popUp(value: string) {
    this.onDisplayMode.emit(value);
  }

  protected readonly title = signal('reinstructible.client');
}
