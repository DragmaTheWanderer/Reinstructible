import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ILegoSet } from '../../../interfaces/rebrickable'

@Component({
  selector: 'setCard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './setCard.html',
  styleUrl: './setCard.css'
})

export class SetCard {
  public legoSet = input<ILegoSet | null>(null);
  public setNumOut = output<string>();
  constructor(private http: HttpClient) { }

  loadSet(value: string) {
    console.log("loadSet Clicked");
    this.setNumOut.emit(value);
  }

  addSet(value: ILegoSet) {
    console.log("add set clicked");
    event?.stopPropagation();
    this.saveSet(value);
  }
  saveSet(legoSet: ILegoSet) {
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
      next: (res) => {
        result = res;
        loading = false;
        //this.addSetEvent.emit(legoSet);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }

}

