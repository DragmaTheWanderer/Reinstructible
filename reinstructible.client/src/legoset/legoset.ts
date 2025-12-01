import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ILegoSet, ITheme } from '../interfaces/rebrickable'

@Component({
  selector: 'legoset-root',
  standalone: false,
  templateUrl: './legoset.html',
  styleUrl: './legoset.css'
})
export class LegoSet implements OnInit {
  public legoSets: ILegoSet[] = [];
  public setsLoaded: boolean = false;
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  public idValue: string = "";

  ngOnInit() {
    //this.getSet();
  }

  getSet() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue) // Convert non-string values if needed
      .set('param', '');

    this.http.get<ILegoSet[]>('/api/set', { params: params }).subscribe({
      next: (result) => {
      this.legoSets = result;
      this.setsLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.setsLoaded = false;
      }
    })
  }
  protected readonly title = signal('reinstructible.client');
}
