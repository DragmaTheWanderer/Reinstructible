import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ILegoSet, } from '../../interfaces/rebrickable'

import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'setTable',
  standalone: true,
  imports: [ButtonComponent, CommonModule, FormsModule,],
  templateUrl: './setTable.html',
  styleUrl: './setTable.css'
})

export class SetTable {
  public legoSets = input<ILegoSet[]>([]);
  public setNumOut = output<string>();

  public setsLoading: boolean = false;

  constructor(private http: HttpClient) { }

  loadSet(value: string) {
    this.setNumOut.emit(value);
  }
  addSet(value: ILegoSet, e: Event) {
    console.log("add set clicked");
    e.stopPropagation();
    this.saveSet(value);
  }
  saveSet(legoSet: ILegoSet) {
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
        //this.addSetEvent.emit(legoSet);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; this.setsLoading = false;
      }
    });
  }
}
