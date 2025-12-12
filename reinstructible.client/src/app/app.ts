import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

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
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  public forecasts: WeatherForecast[] = [];
  public forcastLoaded: boolean = false;
  public test: TestString = {
    value: ""
  };

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
