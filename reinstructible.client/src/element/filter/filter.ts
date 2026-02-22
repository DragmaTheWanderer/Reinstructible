import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../interfaces/rebrickable'

import { EDisplayGroup, EFileOption, EFilterType, EDisplayMode } from '../../interfaces/Enums'

import { ButtonComponent } from '../../shared/button/button.component';


@Component({
  selector: 'filterComponent',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule,],
  templateUrl: './filter.html',
  styleUrl: './filter.css'
})

export class FilterComponent implements OnInit, OnChanges {
  enumDisplayMode: typeof EDisplayMode = EDisplayMode;

  public filterType = input<EFilterType>();
  public options = input<IFilterOptions[]>([]);
  public inCurrentGrouping = input<EDisplayGroup>(EDisplayGroup.Category);

  public onOptionsSent = output<number[]>();
  public onOptionsStringSent = output<string[]>();
  public onDisplayMode = output<EDisplayMode>();
  public onCurrentGrouping = output<EDisplayGroup>();

  public onFileOption = output<EFileOption>();


  public currentGrouping: EDisplayGroup = this.inCurrentGrouping();
  public currentGroupText = EDisplayGroup[this.inCurrentGrouping()];
  
  constructor() {
    this.onDisplayMode.emit(EDisplayMode.TV);
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;
    this.currentGrouping = this.inCurrentGrouping();
    this.currentGroupText = EDisplayGroup[this.inCurrentGrouping()];
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
    switch (this.filterType()) {
      case EFilterType.storage:
        let filteredStringIds = this.options().filter(f => f.selected).flatMap(o => o.name);
        this.onOptionsStringSent.emit(filteredStringIds); //emit the array
        break;
      default:
        let filteredIds = this.options().filter(f => f.selected).flatMap(o => o.id);
        this.onOptionsSent.emit(filteredIds); //emit the array
        break;
    }
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };

  fileSave() {
    this.onFileOption.emit(EFileOption.Save);
  }
  fileLoad() {
    this.onFileOption.emit(EFileOption.Load);
  }
  setDisplayMode(value: EDisplayMode) {
    this.onDisplayMode.emit(value);
  }

  protected readonly title = signal('reinstructible.client');
}
