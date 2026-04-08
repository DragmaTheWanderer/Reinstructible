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
    subBuildNameOptions: [],
    subBuildPageOptions: [],
    subBuildStepOptions: [],
    categoryOptionType: EFilterType.category,
    colorOptionType: EFilterType.color,
    storageOptionType: EFilterType.storage,
    subBuildNameOptionType: EFilterType.subBuildName,
    subBuildPageOptionType: EFilterType.subBuildPage,
    subBuildStepOptionType: EFilterType.subBuildStep,

  };

  public onOptionsSent = output<IFilterOptionGroups>();


  //enumDisplayMode: typeof EDisplayMode = EDisplayMode;

  //public filterType = input<EFilterType>();
  //public optionGrpups = input<IFilterOptionGroups>();
  //public inCurrentGrouping = input<EDisplayGroup>(EDisplayGroup.Category);

  
  //public onOptionsStringSent = output<string[]>();
  //public onDisplayMode = output<EDisplayMode>();
  //public onCurrentGrouping = output<EDisplayGroup>();
  //public onSetSubBuild = output<string>()

  //public onFileOption = output<EFileOption>();

  //public currentGrouping: EDisplayGroup = this.inCurrentGrouping();
  //public currentGroupText = EDisplayGroup[this.inCurrentGrouping()];

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
      this.filterOptionGroups.partCategoryOptions = filterOption.partCategory(this.elements);
      this.filterOptionGroups.partColorOptions = filterOption.partColor(this.elements);
      this.filterOptionGroups.partStorageOptions = filterOption.partStorage(this.elements);
      this.filterOptionGroups.subBuildNameOptions = filterOption.subBuildName(this.elements);
      this.filterOptionGroups.subBuildPageOptions = filterOption.subBuildPage(this.elements);
      this.filterOptionGroups.subBuildStepOptions = filterOption.subBuildStep(this.elements);
    }

    
  //  this.currentGrouping = this.inCurrentGrouping();
  //  this.currentGroupText = EDisplayGroup[this.inCurrentGrouping()];
  //  this.options = this.optionGrpups()?.partCategoryOptions;
  }

  public filter(item: { filterType: EFilterType, options: IFilterOptions[] }) {
    let type: EFilterType = item.filterType;
    let fo: IFilterOptions[] = item.options;
    switch (type) {
      case EFilterType.category:
        this.filterOptionGroups.partCategoryOptions = fo;
        break;
      case EFilterType.color:
        this.filterOptionGroups.partColorOptions = fo;
        break;
      case EFilterType.storage:
        this.filterOptionGroups.partStorageOptions = fo;
        break;
      case EFilterType.subBuildName:
        this.filterOptionGroups.subBuildNameOptions = fo;
        break;
      case EFilterType.subBuildPage:
        this.filterOptionGroups.subBuildPageOptions = fo;
        break;
      case EFilterType.subBuildStep:
        this.filterOptionGroups.subBuildStepOptions = fo;
        break;
    }
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
  //selectAll() {
  //  this.options!.forEach((x) => (x.selected = true));
  //  this.elementFilter();
  //}
  //clearSelections() {
  //  this.options!.forEach((x) => (x.selected = false));
  //  this.elementFilter();
  //}
  //toggleSelections() {
  //  this.options!.forEach((x) => (x.selected = !x.selected));
  //  this.elementFilter();
  //}
  //toggleGrouping() {
  //  if (this.currentGrouping == Object.keys(EDisplayGroup).length / 2 - 1) {
  //    this.currentGrouping = 0;
  //  } else {
  //    this.currentGrouping++;
  //  }
  //  this.currentGroupText = EDisplayGroup[this.currentGrouping];
  //  this.onCurrentGrouping.emit(this.currentGrouping);
  //}
  //elementFilter() {
  //  //this determins if the option is numeric or string based.
  //  switch (this.filterType()) {
  //    case EFilterType.storage:
  //      let filteredStringIds = this.options!
  //        .filter((f) => f.selected)
  //        .flatMap((o) => o.name);
  //      this.onOptionsStringSent.emit(filteredStringIds); //emit the array
  //      break;
  //    default:
  //      let filteredIds = this.options!
  //        .filter((f) => f.selected)
  //        .flatMap((o) => o.id);
  //      this.onOptionsSent.emit(filteredIds); //emit the array
  //      break;
  //  }
  //}
  

  //private httpOptions = {
  //  headers: new HttpHeaders({
  //    'Content-Type': 'application/json',
  //  }),
  //  observe: 'response' as 'response', // To get the full HttpResponse
  //};

  //fileSave() {
  //  this.onFileOption.emit(EFileOption.Save);
  //}
  //fileLoad() {
  //  this.onFileOption.emit(EFileOption.Load);
  //}
  //setDisplayMode(value: EDisplayMode) {
  //  this.onDisplayMode.emit(value);
  //}
  //setSubBuild() {
  //  this.onSetSubBuild.emit("SetSubBuild");
  //}
  protected readonly title = signal('reinstructible.client');
}
