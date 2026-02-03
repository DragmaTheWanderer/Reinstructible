import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild, signal,Output, EventEmitter, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { ILegoSet, ITheme } from '../interfaces/rebrickable'

import { ButtonComponent } from '../shared/button/button.component';


@Component({
  selector: 'legoset_add',
  standalone: true,
  imports: [ButtonComponent,
    CommonModule, FormsModule],
  templateUrl: './legoset_add.html',
  styleUrl: './legoset_add.css'
})
export class LegoSet_add implements OnInit, AfterViewInit {
  @ViewChild('setNumberInput') inputElement!: ElementRef;

  public legoSets: ILegoSet[] = [];
  public setsLoaded: boolean = false;
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  public idValue: string = "";
  public paramValue: string = "AddSets";
  public setsLoading: boolean = false;

  @Output() addSetEvent = new EventEmitter<ILegoSet>();
  addSet(value: ILegoSet) {
    this.saveSet(value);
  }
  @Output() closeModalEvent = new EventEmitter<boolean>();
  closeModal() {
    this.closeModalEvent.emit(false);
  }

  ngOnInit() {
    //this.getSet();
  }
  ngAfterViewInit() {
    // Standard focus call
    this.inputElement.nativeElement.focus();
  }

  getSet() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue) // Convert non-string values if needed
      .set('param', 'AddSets');

    this.http.get<ILegoSet[]>('/api/set', { params: params }).subscribe({
      next: (result) => {
      this.legoSets = result;
      this.setsLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.setsLoaded = false;
      }
    });
  }

  saveSet(legoSet: ILegoSet){
    let result = {};
    this.setsLoading = true;
    let error = "";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as 'response', // To get the full HttpResponse
    };

    // const body = { 'legoSetJSON' : JSON.stringify(legoSet) };
    const data: string = legoSet.set_num;
    const jsonString = JSON.stringify(data);


    this.http.post('/api/set', jsonString, httpOptions).subscribe({
      next: (res) => {
        result = res;
        this.setsLoading = false;
        this.addSetEvent.emit(legoSet);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; this.setsLoading = false;
      }
    });
  }
  protected readonly title = signal('reinstructible.client');
}
