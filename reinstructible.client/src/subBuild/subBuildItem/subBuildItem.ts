import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components
import { FormsModule } from '@angular/forms';

import { IElementGroup } from '../../interfaces/rebrickable'

import { ImageCountComponent } from '../../shared/imageCount/imageCount.component';

@Component({
  selector: 'subBuildItem',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule, FormsModule, ImageCountComponent],
  templateUrl: './subBuildItem.html',
  styleUrls: ['./subBuildItem.css']
})
export class SubBuildItem implements OnInit, OnChanges {
  @Input() pageStep!: IElementGroup;
  @Output() pageStepSelectedEvent = new EventEmitter<IElementGroup>();
  @Output() pageStepChangeEvent = new EventEmitter<IElementGroup>();
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
    this.pageStepSelectedEvent.emit(this.pageStep);
    this.pageStep.selected = true;
  }

  onPageChange(value: string) {
    //make the pageStep mods needed
    this.pageStep.elements.forEach(el => {
      el.sub_inventory.forEach(si => {
        si.page = Number(value);
        this.pageStep.grouping = `${si.page}|${si.step}|${si.subBuildName}`
      })
    })
    this.pageStepChangeEvent.emit(this.pageStep);
  }
  onStepChange(value: string) {
    //make the pageStep mods needed
    this.pageStep.elements.forEach(el => {
      el.sub_inventory.forEach(si => {
        si.step = Number(value);
        this.pageStep.grouping = `${si.page}|${si.step}|${si.subBuildName}`
      })
    })
    this.pageStepChangeEvent.emit(this.pageStep);
  }
  onNameChange(value: string) {
    //make the pageStep mods needed
    this.pageStep.elements.forEach(el => {
      el.sub_inventory.forEach(si => {
        si.subBuildName = value;
        this.pageStep.grouping = `${si.page}|${si.step}|${si.subBuildName}`
      })
    })
    this.pageStepChangeEvent.emit(this.pageStep);
  }
}
