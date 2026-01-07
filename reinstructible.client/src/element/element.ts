import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Storage } from '../storage/storage';
import { IElement, IPart, IColor, IPartCategory, IStorage_updateList, } from '../interfaces/rebrickable'

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
  imports: [CommonModule, FormsModule, Storage],
  templateUrl: './element.html',
  styleUrl: './element.css'
})
export class Element implements OnInit, OnChanges {
  /**
   * Currently displayed elements after applying filters.
   */
  public elements: IElement[] = [];

  /**
   * Master list of loaded elements (unfiltered). Used as the source when applying filters.
   */
  public elementsBase: IElement[] = [];

  /**
   * Computed list of unique part categories present in `elementsBase`.
   * Used to populate category selection control.
   */
  public partCategory: IPartCategory[] = [];

  /**
   * Computed list of unique colors present in `elementsBase`.
   * Used to populate color selection control.
   */
  public partColor: IColor[] = [];

  /**
   * Indicates whether the initial data load completed successfully.
   */
  public Loaded: boolean = false;

  /**
   * Currently selected category value from the category picker.
   * Kept as `any` because the selection control returns an object with an `id` and `name`.
   */
  public selectedCategoryValue: any = null; // Bind the selected value here

  /**
   * Currently selected color value from the color picker.
   * Kept as `any` because the selection control returns an object with an `id` and `name`.
   */
  public selectedColorValue: any = null; // Bind the selected value here

  /**
   * Whether the storage popup/component is visible.
   */
  public storageVisable: boolean = false;

  /**
   * Element selected for editing/assigning storage.
   */
  public elementForStorage!: IElement;

  /**
   * Filter text input bound to an input control. Used when requesting elements from the API.
   */
  public filterValue: string = "";

  private downArrow: string = "&#x21E9;";
  private upArrow: string = "&#x21E7;";
  public colorCollapse: boolean = true;
  public categoryCollapse: boolean = true;
  public colorArrow: string = this.downArrow;
  public catergoryArrow: string = this.downArrow;
  // Input: optional id used when querying the backend for elements.
  @Input() idValue: string = "";

  /**
   * Event emitted when an element is selected for storage. Parent uses this to open/initialize storage UI.
   */
  @Output() loadStorageEvent = new EventEmitter<IElement>();

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
  }


  /**
   * Handler that receives storage updates from the storage component.
   * Updates matching elements in memory with the new storage location, then hides the storage UI.
   */
  addedStorage(newStorages: IStorage_updateList) {
    // Close popup and update existing elements
    newStorages.element_ids.forEach((elementId, index) => {
      this.elements.forEach((eleItem, index2) => {
        if (eleItem.element_id == elementId) {
          eleItem.storage_location.bin = newStorages.bin;
          eleItem.storage_location.drawer = newStorages.drawer;
        }
      });
    });
    this.storageVisable = false;
  }

  /**
   * Angular lifecycle hook: called once after component creation.
   * The initial load is intentionally deferred to ngOnChanges so it will run when `idValue` is set.
   */
  ngOnInit() {
    /*    this.getElement();*/
  }

  /**
   * Called when the category selection changes in the UI.
   * Invokes the filter routine.
   */
  onCategorySelected(): void {
    this.elementFilter();
  }

  /**
   * Called when the color selection changes in the UI.
   * Invokes the filter routine.
   */
  onColorSelected(): void {
    this.elementFilter();
  }

  /**
   * Applies the selected category and color filters to `elementsBase` and populates `elements`.
   * - If both selectors are null, resets to `elementsBase`.
   * - If only one selector is set, filters by that selector's id.
   * - If both are set, applies both filters (category then color).
   */
  elementFilter() {
    let categoryValue = this.selectedCategoryValue;
    let colorValue = this.selectedColorValue;
    console.log(categoryValue);
    console.log(colorValue);
    if (categoryValue === null && colorValue === null) {
      this.elements = this.elementsBase;
    } else {
      // Filter by category ID only
      if (categoryValue !== null && colorValue === null) {
        this.elements = this.elementsBase.filter(p => p.part.part_cat_id === categoryValue.id);
      }
      // Filter by color ID only
      else if (categoryValue === null && colorValue !== null) {
        this.elements = this.elementsBase.filter(p => p.color.id === colorValue.id);
      }
      // Filter by both category and color
      else {
        this.elements = this.elementsBase.filter(p => p.part.part_cat_id === categoryValue.id);
        this.elements = this.elements.filter(p => p.color.id === colorValue.id);
      }
    }
  }

  collapse(type: string) {
    if (type == "color") {
      this.colorCollapse = !this.colorCollapse;
      this.colorArrow = this.downArrow;
      if (!this.colorCollapse) {
        this.categoryCollapse = true;
        this.catergoryArrow = this.downArrow;
        this.colorArrow = this.upArrow;
      }
    }
    if (type == "category") {
      this.categoryCollapse = !this.categoryCollapse;
      this.catergoryArrow = this.downArrow;
      if (!this.categoryCollapse) {
        this.colorCollapse = true;
        this.colorArrow = this.downArrow;
        this.catergoryArrow = this.upArrow;
      }
    }
  }

  /**
   * Loads elements from the server API using the current `filterValue` and `idValue`.
   * - On success: stores results in `elementsBase` and `elements`, then populates category and color lists.
   * - On error: writes to console and sets `Loaded` to false.
   */
  getElement() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue); // Convert non-string values if needed

    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.elementsBase = result;
        this.elements = result;
        this.getCategory();
        this.getColor();
        this.Loaded = true;
      },
      error: (error) => {
        console.error(error);
        this.Loaded = false;
      }
    });
  }

  /**
   * Builds `partCategory` by:
   * - Gathering unique category ids from `elementsBase`.
   * - Requesting category objects from the API for each unique id.
   * - Sorting the resulting categories by name.
   *
   * Note: requests to the server are performed per-category id; consider batching on the server
   * if the number of unique categories becomes large.
   */
  getCategory() {
    this.partCategory = [];
    let categoryId: number[] = [];
    let elements = this.elementsBase;
    let item: IPartCategory;
    let cat: IPartCategory[] = [];

    // Filter the unique category IDs of elements in a set
    elements.forEach(element => {
      if (!categoryId.includes(element.part.part_cat_id)) {
        categoryId.push(element.part.part_cat_id);
      }
    });

    // Get the category objects for each ID
    categoryId.forEach(idValue => {
      let params = new HttpParams()
        .set('id', idValue); // Convert non-string values if needed
      this.http.get<IPartCategory[]>('/api/partcategory', { params: params }).subscribe({
        next: (result) => {
          item = result[0];
          cat.push(item);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          // Sort the new list
          this.partCategory = cat.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    });
  }

  /**
   * Builds `partColor` by:
   * - Scanning `elementsBase` for unique colors (by name).
   * - Sorting the resulting color list by name.
   *
   * Comments in the code show an alternate approach that requests color objects from the API;
   * the current implementation derives color objects directly from `elementsBase`.
   */
  getColor() {
    this.partColor = [];
    let elements = this.elementsBase;
    let item: IColor;
    let color: IColor[] = [];

    // Filter the unique color objects of elements in a set
    elements.forEach(element => {
      if (!color.some(item => item.name === element.color.name)) {
        color.push(element.color);
      }
    });
    // Sort the new list
    this.partColor = color.sort((a, b) => a.name.localeCompare(b.name));

    // The following commented code shows how to request color objects per id from the API.
    // It is retained for reference in case a switch to server-driven color lookup is desired.
  }

  /**
   * Simple reactive title signal used by the template (keeps string in a signal).
   */
  protected readonly title = signal('reinstructible.client');
}
