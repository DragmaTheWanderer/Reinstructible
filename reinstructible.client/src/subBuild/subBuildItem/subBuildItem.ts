import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

import { IElementGroup } from '../../interfaces/rebrickable'

import { ImageCountComponent } from '../../shared/imageCount/imageCount.component';

@Component({
  selector: 'subBuildItem',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule, ImageCountComponent],
  templateUrl: './subBuildItem.html',
  styleUrls: ['./subBuildItem.css']
})
export class SubBuildItem implements OnInit, OnChanges {
  @Input() pageStep!: IElementGroup;
  @Output() pageStepSelectedEvent = new EventEmitter<IElementGroup>();;
  public page: string = "";
  public step: string = "";
  public name: string = "";

  public selectedClass: string = 'w3-yellow';

  ngOnInit() {
    this.formatLocals();
  }
  ngOnChanges() {
    this.formatLocals();
  }
  formatLocals() {
    let groupItem = this.pageStep.grouping.split('|');
    this.page = groupItem[0];
    this.step = groupItem[1];
    this.name = groupItem[2];
  }

  selectedBackground() {
    let result = '';
    if (this.pageStep.selected) { result = this.selectedClass; }
    return result;
  }

  selectedSubBuild(value: IElementGroup, e: Event) {
    e.stopPropagation();
    this.pageStepSelectedEvent.emit(this.pageStep)
    this.pageStep.selected = true;
  }
}
