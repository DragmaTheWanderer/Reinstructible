import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { IElement, IPart, IColor, IPartCategory, } from '../interfaces/rebrickable'

@Component({
  selector: 'element-root',
  standalone: false,
  templateUrl: './element.html',
  styleUrl: './element.css'
})
export class Element implements OnInit {
  public elements: IElement[] = [];
  public partCategory: IPartCategory[] = [];
  public Loaded: boolean = false;
  constructor(private http: HttpClient) {}

  public filterValue: string = "";
  public idValue: string = "";

  ngOnInit() {
  /*    this.getElement();*/
  }

  getElement() {
    let filterValue: string = this.filterValue;
    let idValue: string = this.idValue;
    

    let params = new HttpParams()
      .set('filter', filterValue)
      .set('id', idValue); // Convert non-string values if needed

    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.elements = result;
        this.getCategory();
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
    let elements = this.elements;
    let item: IPartCategory;

    elements.forEach(element => {
      if (!categoryId.includes(element.part.part_cat_id)) {
        categoryId.push(element.part.part_cat_id);
      }
    });

    categoryId.forEach(idValue => {
      let params = new HttpParams()
        .set('id', idValue); // Convert non-string values if needed
      this.http.get<IPartCategory[]>('/api/partcategory', { params: params }).subscribe({
        next: (result) => {
          item = result[0];
          this.partCategory.push(item);
        },
        error: (error) => {
          console.error(error);
        }
      });
    });
  }

  protected readonly title = signal('reinstructible.client');
}
