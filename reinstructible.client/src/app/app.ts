import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ILegoSet,  } from '../interfaces/rebrickable'


import { LegoSet_owned } from '../legoset_owned/legoset_owned';
import { Element } from '../element/element';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
interface TestString {
  value: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LegoSet_owned, Element],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  public forecasts: WeatherForecast[] = [];
  public forcastLoaded: boolean = false;
  public test: TestString = {
    value: ""
  };
  public ElementVisable: boolean = false;
  public SetVisable: boolean = true;
  public legoSet: Partial<ILegoSet> = { id: 0 };
  public setNum: string = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //this.getForecasts();
  }

  getForecasts() {
    this.http.get<WeatherForecast[]>('/weatherforecast').subscribe({
      next: (result) => {
      this.forecasts = result;
      this.forcastLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.forcastLoaded = false;
      }
    });
  }

  loadElements(legoSet: ILegoSet ) {
    
    this.legoSet = legoSet;
    this.SetVisable = false;
    this.ElementVisable = true;
  }

  protected readonly title = signal('reinstructible.client');
}
