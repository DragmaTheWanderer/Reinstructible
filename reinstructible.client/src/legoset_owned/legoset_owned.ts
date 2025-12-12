import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ILegoSet, ITheme } from '../interfaces/rebrickable'

@Component({
  selector: 'legoset_owned-root',
  standalone: false,
  templateUrl: './legoset_owned.html',
  styleUrl: './legoset_owned.css'
})
export class LegoSet_owned implements OnInit {
  public legoSets: ILegoSet[] = [];
  public setsLoaded: boolean = false;
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  public idValue: string = "";
  public paramValue: string = "LoadSets";

  ngOnInit() {
    this.getSets();
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
    let loading = true;
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
      next: (res) => { result = res; loading = false; },
      error: (error) => { console.error(error); error = 'Failed to create post'; loading = false; }
    });
  }
  protected readonly title = signal('reinstructible.client');
}
