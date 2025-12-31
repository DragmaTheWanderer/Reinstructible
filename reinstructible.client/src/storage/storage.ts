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
  public elementList :IElement[] = [];
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

  ngOnInit() {
    this.getStorage();
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
        this.elementList = result;
        this.storageLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.storageLoaded = false;
      }
    })
  }

  saveCurrentStorage(item: IElement) {
    let result = {};
    let loading = true;
    let error = "";
    const data: IStorage_updateList = {
      bin: item.storage_location.bin,
      drawer: item.storage_location.drawer,
      element_ids: []
    }
    data.element_ids.push(item.element_id);
    const jsonString = JSON.stringify(item.storage_location);

    this.http.post('/api/storage', jsonString, this.httpOptions).subscribe({
      next: (res) => {
        result = res;
        loading = false;
        this.saveStorageEvent.emit(data);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create storage'; loading = false;
      }
    });
  }
  saveAllStorage(item: IElement) {
    let result = {};
    let loading = true;
    let error = "";
    const data: IStorage_updateList = {
      bin: item.storage_location.bin,
      drawer: item.storage_location.drawer,
      element_ids: []
    }
    this.elementList.forEach((item, index) => {
      let element_id = item.storage_location.element_id;
      data.element_ids.push(element_id);
    })
    const jsonString = JSON.stringify(data);

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
