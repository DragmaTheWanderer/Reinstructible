import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ILegoSet, } from '../../interfaces/rebrickable'

@Component({
  selector: 'setTable',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './SetTable.html',
  styleUrl: './SetTable.css'
})

export class SetTable {
  public legoSets = input<ILegoSet[]>([]);
  public setNumOut = output<string>();

  loadSet(value: string) {
    this.setNumOut.emit(value);
  }
}
