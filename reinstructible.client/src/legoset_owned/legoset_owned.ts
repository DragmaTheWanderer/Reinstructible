import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ILegoSet, ITheme, IFilterOptions, } from '../interfaces/rebrickable'
import { LegoSet_add } from '../legoset_add/legoset_add';
import { SetFilterComponent } from './setFilter/setFilter';
import { SetTable } from './setTable/setTable';
import { SetCards } from './setCards/setCards';

@Component({
  selector: 'legoset_owned',
  standalone: true,
  imports: [LegoSet_add, SetFilterComponent, SetTable, SetCards, CommonModule, FormsModule],
  templateUrl: './legoset_owned.html',
  styleUrl: './legoset_owned.css'
})
export class LegoSet_owned implements OnInit {
  public legoSets: ILegoSet[] = [];
  public legoSetsBase: ILegoSet[] = [];
  public themes: ITheme[] = []
  public setThemeOptions: IFilterOptions[] = [];

  public selectedTheme: string = "All";
 
  public setsLoaded: boolean = false;
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  public idValue: string = "";
  public paramValue: string = "LoadSets";

  public showPopUp: boolean = false;
  public displayMode: string = "TV";

  //setting up an emitter to send the setnumber to the events component.
  @Output() loadElementsEvent = new EventEmitter<string>();
  loadSet(value: string) {
    this.loadElementsEvent.emit(value);
  }

  addedSet(newSet: ILegoSet) {
    this.showPopUp = false;
    this.getSets();
  }
  ngOnInit() {
    setTimeout( () => {
      this.getSets();
    }, 2000)
    
  }

  getSets() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;
    let paramValue: string = this.paramValue;

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue) // Convert non-string values if needed
      .set('param', paramValue);

    this.http.get<ILegoSet[]>('/api/set', { params: params }).subscribe({
      next: (result) => {
        this.legoSetsBase = result;
        this.legoSets = result;
        if (this.selectedTheme != "All") {
          this.legoSets = this.legoSetsBase.filter(x => x.theme[0].name === this.selectedTheme);
        }

        this.themes = result.flatMap(t => t.theme)
          .sort((a,b) => a.name.localeCompare(b.name))
          .filter((item, index, self) =>
              index === self.findIndex((t) => (
                t.id === item.id && t.name === item.name)));
        this.setThemeOptions = this.themes.map(t => ({ id: t.id, name: t.name, selected: false }));
        this.setsLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.setsLoaded = false;
      }
    });
  }
  popUp(value: string) {
    switch (value) {
      case "CV":
      case "TV":
        this.displayMode = value;
        break;
      default:
        this.showPopUp = !this.showPopUp;
        break;

    }
    
  }
  closeModal() {
    this.showPopUp = false;
  }
  setTheme(value:string) {
    //filter
    if (value === "All") {
      this.legoSets = this.legoSetsBase;
    } else {
      this.legoSets = this.legoSetsBase.filter(x => x.theme[0].name === value);
    }
    
    this.selectedTheme = value;
  }
  protected readonly title = signal('reinstructible.client');
}
