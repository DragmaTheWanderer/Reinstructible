import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components
import { FormsModule } from '@angular/forms';

import { ISubBuildGroup, IElement } from '../../interfaces/rebrickable'

import { ImageCountComponent } from '../../shared/imageCount/imageCount.component';

@Component({
 selector: 'subBuildItem',
 standalone: true, // Components are standalone by default from Angular 19/20
 imports: [CommonModule, FormsModule, ImageCountComponent],
 templateUrl: './subBuildItem.html',
 styleUrls: ['./subBuildItem.css']
})
export class SubBuildItem implements OnInit, OnChanges {
 @Input() pageStep!: ISubBuildGroup;
 @Output() pageStepSelectedEvent = new EventEmitter<ISubBuildGroup>();
 @Output() pageStepChangeEvent = new EventEmitter<ISubBuildGroup>();

 public selectedClass: string = 'w3-yellow';

 ngOnInit() {
 
 }
 ngOnChanges() {
 
 }

 getQuantity(element: IElement) {
  let subinv = element.sub_inventory.find(e => e.page == this.pageStep.grouping.page && e.step == this.pageStep.grouping.step);
  return subinv?.quantity;
 }

 selectedBackground() {
  let result = '';
  if (this.pageStep.selected) { result = this.selectedClass; }
  return result;
 }

 selectedSubBuild(value: ISubBuildGroup, e: Event) {
  e.stopPropagation();
  this.pageStepSelectedEvent.emit(this.pageStep);
  this.pageStep.selected = true;
 }

 onPageChange(event: FocusEvent) {
  let value: number = this.pageStep.grouping.page;
  //make the pageStep mods needed

  //ensure the only items that get changed are the sub steps for the item in question
  this.pageStep.elements.forEach(el => {
   el.sub_inventory.forEach(si => {
    if (si.step == this.pageStep.grouping.step &&
      si.subBuildName == this.pageStep.grouping.subBuildName)
    si.page = Number(value);
   })
  })
  this.pageStepChangeEvent.emit(this.pageStep);
 }
 onStepChange(event: FocusEvent) {
  let value: number = this.pageStep.grouping.step;
  //make the pageStep mods needed
  this.pageStep.elements.forEach(el => {
   el.sub_inventory.forEach(si => {
    if (si.page == this.pageStep.grouping.page &&
      si.subBuildName == this.pageStep.grouping.subBuildName)
    si.step = Number(value);
   })
  })
  this.pageStepChangeEvent.emit(this.pageStep);
 }
 onNameChange(event: FocusEvent) {
  let value: string = this.pageStep.grouping.subBuildName
  //make the pageStep mods needed
  this.pageStep.elements.forEach(el => {
   el.sub_inventory.forEach(si => {
    if (si.step == this.pageStep.grouping.step &&
      si.page == this.pageStep.grouping.page)
    si.subBuildName = value;
   })
  })
  this.pageStepChangeEvent.emit(this.pageStep);
 }
}
