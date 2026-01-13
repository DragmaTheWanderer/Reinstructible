import { Component, OnInit, OnChanges, signal, input, SimpleChanges, output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IFilterOptions } from '../../interfaces/rebrickable'

@Component({
  selector: 'filterComponent',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './filter.html',
  styleUrl: './filter.css'
})

export class FilterComponent implements OnInit, OnChanges {
  public type = input<string>();
  public options = input<IFilterOptions[]>([]);

  public onOptionsSent = output<any[]>();

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // `changes` parameter is intentionally unused beyond triggering the refresh.
    let change = changes;
  }

  onSelected(option: IFilterOptions) {
    option.selected = !option.selected; // toggle the selected state
    this.elementFilter();
  }

  selectAll() {
    this.options().forEach(x => x.selected = true)
    this.elementFilter();
  }
  clearSelections() {
    this.options().forEach(x => x.selected = false)
    this.elementFilter();
  }
  toggleSelections() {
    this.options().forEach(x => x.selected = !x.selected)
    this.elementFilter();
  }
  elementFilter() {
    let filteredIds = this.options().filter(f => f.selected).flatMap(o => o.id);
    this.onOptionsSent.emit(filteredIds); //emit the array
  }

  protected readonly title = signal('reinstructible.client');
}
