import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, OnChanges, signal, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IElement, IPart, IColor, IPartCategory, } from '../interfaces/rebrickable'

@Component({
  selector: 'element',
  standalone: true,
    imports: [CommonModule, FormsModule],
  templateUrl: './element.html',
  styleUrl: './element.css'
})
export class Element implements OnInit, OnChanges {
  public elements: IElement[] = [];
  public elementsBase: IElement[] = [];
  public partCategory: IPartCategory[] = [];
  public partColor: IColor[] = [];

  public Loaded: boolean = false;
  public selectedCategoryValue: any = null; // Bind the selected value here
  public selectedColorValue: any = null; // Bind the selected value here
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  //public idValue: string = "";

  @Input() idValue: string = "";
  ngOnChanges(changes: SimpleChanges) {
    let change = changes;
    this.getElement();
  }
  ngOnInit() {
  /*    this.getElement();*/
  }

  onCategorySelected(): void {
    this.elementFilter();
  }
  onColorSelected(): void {
    this.elementFilter();
  }
  elementFilter() {
    let categoryValue = this.selectedCategoryValue;
    let colorValue = this.selectedColorValue;
    console.log(categoryValue);
    console.log(colorValue);
    if (categoryValue === null && colorValue === null) {
      this.elements = this.elementsBase;
    } else {
      //filter by category ID
      if (categoryValue !== null && colorValue === null) {
        this.elements = this.elementsBase.filter(p => p.part.part_cat_id === categoryValue.id);
      }
      else if (categoryValue === null && colorValue !== null) {
        this.elements = this.elementsBase.filter(p => p.color.id === colorValue.id);
      }
      else {
        this.elements = this.elementsBase.filter(p => p.part.part_cat_id === categoryValue.id);
        this.elements = this.elements.filter(p => p.color.id === colorValue.id);
      }
    }
  }

  getElement() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;
    

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue); // Convert non-string values if needed

    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.elementsBase = result;
        this.elements = result;
        this.getCategory();
        this.getColor();
        this.Loaded = true;
      },
      error: (error) => {
        console.error(error);
        this.Loaded = false
      }
    });
  }

  getCategory() {
    this.partCategory = [];
    let categoryId: number[] = [];
    let elements = this.elementsBase;
    let item: IPartCategory;
    let cat: IPartCategory[] = [];

    //filter the unique category ID's of elements in a set
    elements.forEach(element => {
      if (!categoryId.includes(element.part.part_cat_id)) {
        categoryId.push(element.part.part_cat_id);
      }
    });

    //get the category objects for each ID
    categoryId.forEach(idValue => {
      let params = new HttpParams()
        .set('id', idValue); // Convert non-string values if needed
      this.http.get<IPartCategory[]>('/api/partcategory', { params: params }).subscribe({
        next: (result) => {
          item = result[0];
          cat.push(item);
          
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          //sort the new list
          this.partCategory = cat.sort((a, b) => a.name.localeCompare(b.name));
        }
      });
    });

  }

  getColor() {
    this.partColor = [];
    let elements = this.elementsBase;
    let item: IColor;
    let color: IColor[] = [];

    //filter the unique category ID's of elements in a set
    elements.forEach(element => {
      if (!color.some(item => item.name === element.color.name)) {
        color.push(element.color);
      }
    });
    //sort the new list
    this.partColor = color.sort((a, b) => a.name.localeCompare(b.name));


    //get the category objects for each ID
    //colorId.forEach(idValue => {
    //  let params = new HttpParams()
    //    .set('id', idValue); // Convert non-string values if needed
    //  this.http.get<IColor[]>('/api/color', { params: params }).subscribe({
    //    next: (result) => {
    //      item = result[0];
    //      color.push(item);
    //    },
    //    error: (error) => {
    //      console.error(error);
    //    },
    //    complete: () => {
    //      //sort the new list
    //      this.partColor = color.sort((a, b) => a.name.localeCompare(b.name));
    //    }
    //  });
    //});

  }

  
  protected readonly title = signal('reinstructible.client');
}
