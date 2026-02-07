import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IElement, IStorage_updateList } from '../interfaces/rebrickable';

@Component({
    selector: 'storage',
    templateUrl: './storage.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrl: './storage.css'
})
export class Storage implements OnInit, OnChanges {
  public elementList: IElement[] = [];
  public selectedElement!: IElement;
  public storageLoaded: boolean = false;

  public partValue: string = "";
  public colorValue: string = "";

  private httpOptions  = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };

  constructor(private http: HttpClient) {}

  @Input() elementValue!: IElement;
  ngOnChanges(changes: SimpleChanges) {
    let change = changes;
    this.partValue = this.elementValue.part.part_num;
    this.colorValue = this.elementValue.color.id.toString();
    this.getStorage();
  }

  @Output() saveStorageEvent = new EventEmitter<IStorage_updateList>();
  @Output() closeModalEvent = new EventEmitter<boolean>();
  closeModal() {
    this.closeModalEvent.emit(false);
  }

  ngOnInit() {
    this.getStorage();
  }

  toggleSelections() {
    // toggles all elements in the list
    this.elementList.forEach(element => {
      element.selected = !element.selected;
    })
  }

  copySelected() {
    // copies the selected element's storage location to all other selected elements in the list
    this.elementList.forEach(element => {
      if (element.selected) {
        element.storage_location.bin = this.selectedElement.storage_location.bin;
        element.storage_location.drawer = this.selectedElement.storage_location.drawer;
      }
    })
  }

  clearSelected() {
    //clears the listed elements
    this.elementList.forEach(element => {
      element.selected = false;
    })
  }

  getStorage() {
    let partValue = this.partValue;
    let colorValue = this.colorValue;
    let params = new HttpParams()
      .set('param', "storage")
      .set('partId', partValue)
      .set('colorId', colorValue);

    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.elementList = result.sort((a, b) => a.color.name.localeCompare(b.color.name));
        this.storageLoaded = true;

        //get the selected element and remove it from the rest of the list.
        this.selectedElement = this.elementList.find(element => element.element_id === this.elementValue.element_id)!;
        this.selectedElement.selected = true;
        this.elementList = this.elementList.filter(element => element.element_id !== this.selectedElement.element_id);
    },
      error: (error) => {
        console.error(error);
        this.storageLoaded = false;
      }
    })
  }

  saveAllStorage(item: IElement) {
    let result = {};
    let loading = true;
    let error = "";

    const data: IStorage_updateList = {
      bin: item.storage_location.bin,
      drawer: item.storage_location.drawer,
      element_ids: [item.storage_location.element_id]
    }
    let dataList: IStorage_updateList[] = [data];
    //change the data to an arra of data to allow all th eelements to get saved
    this.elementList.forEach((elem, index) => {
      //loop through the list and get the storage location
      let bin = elem.storage_location.bin;
      let drawer = elem.storage_location.drawer;
      let elemId = elem.storage_location.element_id;

      //check datalist and add to the list as approp
      const testitem = dataList.find(x => x.bin == bin && x.drawer == drawer);
      if (testitem != undefined) {
        testitem.element_ids.push(elemId);
      } else {
        const data: IStorage_updateList = {
          bin: bin,
          drawer: drawer,
          element_ids: [elemId]
        }
        dataList.push(data);
      }

    });

    const jsonString = JSON.stringify(dataList);

    this.http.post('/api/storage', jsonString, this.httpOptions).subscribe({
      next: (res) => {
        result = res;
        loading = false;
        this.elementList.forEach((item, index) => {
          item.storage_location.bin = data.bin;
          item.storage_location.drawer = data.drawer;
        })
        this.saveStorageEvent.emit(data);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }
  protected readonly title = signal('reinstructible.client');
}
