import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Storage } from '../storage/storage';
import { FilterComponent } from './filter/filter';
import { ElementCards } from './elementCards/elementCards'
import { ElementTable } from './elementTable/elementTable';
import { ILegoSet, IElement, IColor, IPartCategory, IStorage_updateList, IFilterOptionGroups, IFilterOptions, IElementOptions, ISubInventory } from '../interfaces/rebrickable';
import { EDisplayGroup, EFileOption, EFilterType, EDisplayMode } from '../interfaces/Enums';
import fileUtil from '../Utilities/file';
import updateInterfaces from '../Utilities/updateInterfaces';
import filterOption from '../Utilities/filterOption';

import { ImageComponent } from '../shared/image/image.component';

/**
 * Element component
 *
 * Displays and filters a list of elements (parts + color) retrieved from the backend.
 * Responsible for:
 * - Loading elements from the API
 * - Building category and color pick lists based on loaded elements
 * - Filtering the displayed elements by selected category and/or color
 * - Emitting an element to a storage child component when the user requests to set storage
 */
@Component({
  selector: 'element',
  standalone: true,
  imports: [CommonModule, FormsModule, Storage, FilterComponent, ElementTable, ElementCards, ImageComponent],
  templateUrl: './element.html',
  styleUrl: './element.css'
})
export class Element implements OnInit, OnChanges {
  enumDisplyMode: typeof EDisplayMode = EDisplayMode;
  /**
   * Currently displayed elements after applying filters.
   */
  public elements: IElement[] = [];

  /**
   * Master list of loaded elements (unfiltered). Used as the source when applying filters.
   */
  public elementsBase: IElement[] = [];

 

  /**
   * Indicates whether the initial data load completed successfully.
   */
  public Loaded: boolean = false;

  /**
   * Whether the storage popup/component is visible.
   */
  public storageVisable: boolean = false;
 
  
  //public currentGrouping: EDisplayGroup = EDisplayGroup.Color;

  /**
   * Element selected for editing/assigning storage.
   */
  public elementForStorage!: IElement;

  /**
   * Optional input containing set metadata. Defaults to an object with `id: 0` to avoid runtime errors
   * if the parent does not provide a `legoSet`. Use `Partial<ILegoSet>` to allow missing properties.
   */
  @Input() legoSet: Partial<ILegoSet> = { id: 0 };

  /**
   * Event emitted when an element is selected for storage. Parent uses this to open/initialize storage UI.
   */
  @Output() loadStorageEvent = new EventEmitter<IElement>();
  @Output() subSetBuildEvent = new EventEmitter<ILegoSet>();
  //@Output() loadCurrentGrouping = new EventEmitter<EDisplayGroup>();
  /**
  * Computed list of unique part categories present in `elementsBase`.
  * Used to populate category selection control.
  */
 
  constructor(private http: HttpClient) { }

  /**
   * Angular lifecycle hook: called when any bound input property changes.
   * Currently triggers a refresh of the element list from the server.
   */
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;
    this.getElement();
  }

  /**
   * Select an element to send to the storage component.
   * - Sets internal state to show storage UI and stores selected element.
   * - Emits `loadStorageEvent` with the selected element so child component can populate itself.
   */
  setStorage(value: IElement) {
    console.log("testing");
    this.elementForStorage = value;
    this.storageVisable = true;
    // transfer element to storage component
    this.loadStorageEvent.emit(value);
  }
  setStorageHidden(value: boolean) {
    this.storageVisable = false;
    //resort and filter
    this.elementFilter();
  }

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

  /**
   * Handler that receives storage updates from the storage component.
   * Updates matching elements in memory with the new storage location, then hides the storage UI.
   */
  addedStorage(newStorages: IStorage_updateList) {
    // Close popup and update existing elements
    let oldBin = ''
    newStorages.element_ids.forEach((elementId, index) => {
      this.elements.forEach((eleItem, index2) => {
        if (eleItem.element_id == elementId) {
          oldBin = eleItem.storage_location.bin;
          eleItem.storage_location.bin = newStorages.bin;
          eleItem.storage_location.drawer = newStorages.drawer;
        }
      });
    });
    // update the storage filter for if a storage group is removed (count = 0)
    //if (this.options.currentGrouping == EDisplayGroup.Storage) {
    //check if there are no more elements in the current listing in the bin
    const reassignedBin = this.elementsBase.filter(x => x.storage_location.bin == oldBin);
    const newAssignedBin = this.filterOptionGroups.partStorageOptions.filter(x => x.name == newStorages.bin);

    if (reassignedBin.length == 0) {
      //remove old bin from the part storage options list
      this.filterOptionGroups.partStorageOptions = this.filterOptionGroups.partStorageOptions.filter(x => x.name != oldBin);
    }
    if (newAssignedBin.length == 0) {
      //add new bin to the part storage options list
      this.filterOptionGroups.partStorageOptions.push({
        id: newStorages.bin == 'Unassigned' ? -1 : Number(newStorages.bin),
        name: newStorages.bin,
        subOptions: [],
        selected: true
      })
      this.filterOptionGroups.partStorageOptions.sort((a, b) => a.name.localeCompare(b.name));
    }
    //}


    this.storageVisable = false;
    this.elementFilter();
  }

  /**
   * Angular lifecycle hook: called once after component creation.
   * The initial load is intentionally deferred to ngOnChanges so it will run when `idValue` is set.
   */
  ngOnInit() {}

 
  filter(filterOptionGroups: IFilterOptionGroups) {
    this.filterOptionGroups = filterOptionGroups;
    this.elementFilter();
  }

  elementFilter() {
    this.elements = filterOption.applyFilter(this.elementsBase, this.filterOptionGroups);
  }
  
  public options: IElementOptions = {
    currentGrouping: EDisplayGroup.Color,
    displayMode: EDisplayMode.TV,
    filterType: EFilterType.category
  };

  setDisplayMode(value: EDisplayMode) {
    this.options.displayMode = value;
  }
  setCurrentGrouping(value: EDisplayGroup) {
    this.options.currentGrouping = value;
  }

 

  
  

  /**
   * Loads elements from the server API using the current `filterValue` and `idValue`.
   * - On success: stores results in `elementsBase` and `elements`, then populates category and color lists.
   * - On error: writes to console and sets `Loaded` to false.
   */
  getElement() {
   // let filterValue: string = this.filterValue;
    let idValue: string = (this.legoSet?.set_num ?? 0).toString();

    let params = new HttpParams()
      .set('id', idValue)
      .set('param','loadSetElements');
    // Convert non-string values if needed
    switch (this.legoSet.name) {
      case "All":
        //load all saved elements for a storage check or to assist with returning.
        params = new HttpParams()
          .set('id', idValue)
          .set('param', 'storageCheck');
        this.LoadElementsFromDB(params);
        break;
      case "File":
        this.triggerFileOption(EFileOption.Load);
        break;
      default:
        this.LoadElementsFromDB(params);
        break;
    }
  }

  private LoadElementsFromDB(params: HttpParams) {
    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.elementsBase = result;
        this.elements = this.elementsBase;
        this.filterOptionGroups.partCategoryOptions = filterOption.partCategory(this.elements);
        this.filterOptionGroups.partColorOptions = filterOption.partColor(this.elements);
        this.filterOptionGroups.partStorageOptions = filterOption.partStorage(this.elements);
        this.filterOptionGroups.subBuildOptions = filterOption.subBuild(this.elements);

      
        this.Loaded = true;
        
      },
      error: (error) => {
        console.error(error);
        this.Loaded = false;
      }
    });
  }

  setSubBuild(value: string) {
    let legoset: ILegoSet = updateInterfaces.populateLegoSetFromPartial(this.legoSet);
    this.subSetBuildEvent.emit(legoset);
  }


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };

  async triggerFileOption(value: EFileOption) {
    this.Loaded = false;
    switch (value) {
      case EFileOption.Load:
        //load legoset
        await fileUtil.loadLegoSetFile(this.http, "legoSet.rb", this.legoSet);

        //load elements
        await fileUtil.loadElementsFile(this.http, "elementsBase.rb", this.elementsBase);
        await fileUtil.loadElementsFile(this.http, "elements.rb", this.elements);

        //load filter option groups
        await fileUtil.loadpartCategoryOptionsFile(this.http, "partCategoryOptions.rb", this.filterOptionGroups.partCategoryOptions);
        await fileUtil.loadpartCategoryOptionsFile(this.http, "partStorageOptions.rb", this.filterOptionGroups.partStorageOptions);
        await fileUtil.loadpartCategoryOptionsFile(this.http, "partColorOptions.rb", this.filterOptionGroups.partColorOptions);
               
        ////load filter ids
        //await fileUtil.loadNumberFilteredFile(this.http, "colorIds.rb", this.colorIds);
        //await fileUtil.loadNumberFilteredFile(this.http, "categoryIds.rb", this.categoryIds);
        //await fileUtil.loadStringFilteredFile(this.http, "storageBins.rb", this.storageBins);

        //load current options
        await fileUtil.loadOptionsFile(this.http, "options.rb", this.options);
        //ensure the options are updating the correct paramaters
        //this.selectedControllTab.set(this.options.filterType);
        //this.openControlTab(this.options.filterType);

        break;
      case EFileOption.Save:
        //save legoset
        await fileUtil.saveFile(this.http, "legoSet.rb", JSON.stringify(this.legoSet));

        //save elements and option groups
        await fileUtil.saveFile(this.http, "elementsBase.rb", JSON.stringify(this.elementsBase));
        await fileUtil.saveFile(this.http, "elements.rb", JSON.stringify(this.elements));
        await fileUtil.saveFile(this.http, "partCategoryOptions.rb", JSON.stringify(this.filterOptionGroups.partCategoryOptions));
        await fileUtil.saveFile(this.http, "partColorOptions.rb", JSON.stringify(this.filterOptionGroups.partColorOptions));
        await fileUtil.saveFile(this.http, "partStorageOptions.rb", JSON.stringify(this.filterOptionGroups.partStorageOptions));

        ////save filtered ids
        //await fileUtil.saveFile(this.http, "categoryIds.rb", JSON.stringify(this.categoryIds));
        //await fileUtil.saveFile(this.http, "colorIds.rb", JSON.stringify(this.colorIds));
        //await fileUtil.saveFile(this.http, "storageBins.rb", JSON.stringify(this.storageBins));

        //save current options
        await fileUtil.saveFile(this.http, "options.rb", JSON.stringify(this.options));
        //fileUtil.saveFile(this.http, ".rb", JSON.stringify(this.));
        break;
    }
   this.Loaded = true;
  }


  /**
   * Simple reactive title signal used by the template (keeps string in a signal).
   */
  protected readonly title = signal('reinstructible.client');
}
