import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { IElement, IFilterOptionGroups, IFilterOptions } from '../../interfaces/rebrickable';

import { EDisplayGroup, EFileOption, EFilterType, EDisplayMode } from '../../interfaces/Enums';

import { ButtonComponent } from '../../shared/button/button.component';
import { CardComponent } from './card/card'

import filterOption from '../../Utilities/filterOption';

@Component({
  selector: 'filterComponent',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule, CardComponent],
  templateUrl: './filter.html',
  styleUrl: './filter.css',
})
export class FilterComponent implements OnInit, OnChanges {
  public elementList = input<IElement[]>();
  public filterType = model<EFilterType>();
  
  public elements: IElement[] = [];
  public filterOptionGroups: IFilterOptionGroups = {
    partCategoryOptions: [],
    partColorOptions: [],
    partStorageOptions: [],
    subBuildOptions: [],
    categoryOptionType: EFilterType.category,
    colorOptionType: EFilterType.color,
    storageOptionType: EFilterType.storage,
    subBuildOptionType: EFilterType.subBuild,
  };

  public onOptionsSent = output<IFilterOptionGroups>();
  public onSetSubBuild = output<string>()

  public onCurrentGrouping = output<EDisplayGroup>();
  public inCurrentGrouping = input<EDisplayGroup>(EDisplayGroup.Category);
  public currentGrouping: EDisplayGroup = this.inCurrentGrouping();
  public currentGroupText = EDisplayGroup[this.inCurrentGrouping()];

  enumDisplayMode: typeof EDisplayMode = EDisplayMode;

  //public filterType = input<EFilterType>();
  //public optionGrpups = input<IFilterOptionGroups>();



  //public onOptionsStringSent = output<string[]>();
  public onDisplayMode = output<EDisplayMode>();
  

  public onFileOption = output<EFileOption>();

  //constructor() {
  //  this.onDisplayMode.emit(EDisplayMode.TV);
  //}
  ngOnInit() {
   
  }
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;

    if (this.elementList()!.length > 0) {
      this.elements = this.elementList()!;
      if (this.filterOptionGroups.partCategoryOptions.length == 0) {
        this.filterOptionGroups.partCategoryOptions = filterOption.partCategory(this.elements);
        this.filterOptionGroups.partColorOptions = filterOption.partColor(this.elements);
        this.filterOptionGroups.partStorageOptions = filterOption.partStorage(this.elements);
        this.filterOptionGroups.subBuildOptions = filterOption.subBuild(this.elements);
      }
    }

  
  }

  public filter(item: { filterType: EFilterType, options: IFilterOptions[] }) {
    let type: EFilterType = item.filterType;
    let fo: IFilterOptions[] = item.options;
    this.onOptionsSent.emit(this.filterOptionGroups);
  }

  public selectedControllTab = signal<EFilterType>(EFilterType.category);

  openControlTab(type: EFilterType) {
    this.filterType.set(type);
    this.selectedControllTab.set(type);

  }
  borderColor(type: EFilterType) {
    let result = "w3-border-red";
    if (type != this.selectedControllTab()) result = "";
    return (result);
  }
  selectedCard(type: EFilterType) {
    let result = type === this.selectedControllTab();
    return result;
  }

  ////onSelected(option: IFilterOptions) {
  ////  option.selected = !option.selected; // toggle the selected state
  ////  this.elementFilter();
  ////}

  //public options = this.optionGrpups()?.partCategoryOptions;
  selectAll() {
    switch (this.selectedControllTab()) {
      case EFilterType.category:
        this.filterOptionGroups.partCategoryOptions.forEach((x) => (x.selected = true));
        break;
      case EFilterType.color:
        this.filterOptionGroups.partColorOptions.forEach((x) => (x.selected = true));
        break;
      case EFilterType.storage:
        this.filterOptionGroups.partStorageOptions.forEach((x) => (x.selected = true));
        break;
      case EFilterType.subBuild:
        this.filterOptionGroups.subBuildOptions.forEach(x => {
          x.selected = true;
          x.subOptions.forEach(y => y.selected = true);
        });
        break;
    }
    this.onOptionsSent.emit(this.filterOptionGroups);
  }
  clearSelections() {
    switch (this.selectedControllTab()) {
      case EFilterType.category:
        this.filterOptionGroups.partCategoryOptions.forEach((x) => (x.selected = false));
        break;
      case EFilterType.color:
        this.filterOptionGroups.partColorOptions.forEach((x) => (x.selected = false));
        break;
      case EFilterType.storage:
        this.filterOptionGroups.partStorageOptions.forEach((x) => (x.selected = false));
        break;
      case EFilterType.subBuild:
        this.filterOptionGroups.subBuildOptions.forEach(x => {
          x.selected = false
          x.subOptions.forEach(y => y.selected = false);
        });
        break;
    }
    this.onOptionsSent.emit(this.filterOptionGroups);
  }
  toggleSelections() {
    switch (this.selectedControllTab()) {
      case EFilterType.category:
        this.filterOptionGroups.partCategoryOptions.forEach((x) => (x.selected = !x.selected));
        break;
      case EFilterType.color:
        this.filterOptionGroups.partColorOptions.forEach((x) => (x.selected = !x.selected));
        break;
      case EFilterType.storage:
        this.filterOptionGroups.partStorageOptions.forEach((x) => (x.selected = !x.selected));
        break;
      case EFilterType.subBuild:
        this.filterOptionGroups.subBuildOptions.forEach(x => {
          x.selected = !x.selected
          x.subOptions.forEach(y => {
            y.selected = !y.selected
            if (y.selected) { x.selected = true; }
          });
        });
        break;
    }
    this.onOptionsSent.emit(this.filterOptionGroups);
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
  setSubBuild() {
    this.onSetSubBuild.emit("SetSubBuild");
  }
  protected readonly title = signal('reinstructible.client');
}
