import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  public ElementVisable = false;
  public SetVisable = true;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getForecasts();
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

  protected readonly title = signal('reinstructible.client');
}
