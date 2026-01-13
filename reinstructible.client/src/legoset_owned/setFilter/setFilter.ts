import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../interfaces/rebrickable'

@Component({
  selector: 'setFilterComponent',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './setFilter.html',
  styleUrl: './setFilter.css'
})

export class SetFilterComponent implements OnInit, OnChanges {
  public options = input<IFilterOptions[]>([]);
  public selectedTheme: string = "All";

  public onOptionsSent = output<string>();
  

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;
  }

  selectedThemeCheck(value: string) {
    let result = "";
    if (value === this.selectedTheme) { result = "w3-green"; }
    return result;
  }

  clearTheme() {
    this.selectedTheme = "All";
    this.onOptionsSent.emit(this.selectedTheme);
  }

  setTheme(id: number, name: string) {
    this.selectedTheme = name;
    this.onOptionsSent.emit(this.selectedTheme);
  }

  protected readonly title = signal('reinstructible.client');



  }
