import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components
import { FormsModule } from '@angular/forms';

import { ILegoSet, IElement, IElementGroup, IPartCategory, ISubInventory, ISubBuildGroup, ISubInventoryGroupHeader } from '../interfaces/rebrickable';

import { InventoryItem } from './inventoryItem/inventoryItem';
import { SubBuildItem } from './subBuildItem/subBuildItem';
import { ButtonComponent } from '../shared/button/button.component';

import sorting from '../Utilities/sorting';

@Component({
  selector: 'subBuild',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule, InventoryItem, FormsModule, SubBuildItem, ButtonComponent],
  templateUrl: './subBuild.html',
  styleUrls: ['./subBuild.css']
})
export class SubBuild implements OnInit {
  @ViewChild('subBuildContainer') private subBuildContainer!: ElementRef;
  @Input() legoSet: Partial<ILegoSet> = { id: 0 };
  public inventoryList: IElement[] = [];

  public partGroups: IElementGroup[] = [];
  public selectedPartGroups: IElementGroup[] = [];
  public pageStepGroups: ISubBuildGroup[] = [];
  public partCategories: IPartCategory[] = [];
  public selectedCategory = -1;
  public Loaded: boolean = false;
  constructor(private http: HttpClient) { }


  ngOnInit() {
    //combine the items in part types so the colors are grouped.
    this.getInventory();
  }

  getInventory() {
    // let filterValue: string = this.filterValue;
    let idValue: string = (this.legoSet?.set_num ?? 0).toString();

    let params = new HttpParams()
      .set('id', idValue)
      .set('param', 'loadSetElements');
    // Convert non-string values if needed
    this.http.get<IElement[]>('/api/element', { params: params }).subscribe({
      next: (result) => {
        this.inventoryList = result;
        this.partGroups = sorting.groupByPart(this.inventoryList);
        this.selectedPartGroups = this.partGroups;
        this.pageStepGroups = sorting.groupBySubBuild(this.inventoryList);
        this.getCategory();
      },
      error: (error) => {
        console.error(error);
        this.Loaded = false;
      }
    });
  }

  getCategory() {
    let allPC: IPartCategory = {
      id: -1,
      name: "All",
      part_count: 0,
      selected: true
    };
    this.partCategories = [];

    let categoryId: number[] = [];
    let elements = this.inventoryList;
    let item: IPartCategory;
    let cat: IPartCategory[] = [];

    // Filter the unique category IDs of elements in a set
    elements.forEach(element => {
      if (!categoryId.includes(element.part.part_cat_id)) {
        categoryId.push(element.part.part_cat_id);
      }
    });

    // Get the category objects for each ID
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
          //set the selected for each category to true so that they are all selected by default
          this.partCategories.forEach(category => { category.selected = true; });
          // Sort the new list
          this.partCategories = [allPC, ...cat.sort((a, b) => a.name.localeCompare(b.name))];
        }
      });
    });
  }

  categoryChange(value: string) {
    if (Number(value) == -1) {
      this.selectedPartGroups = this.partGroups;
    } else {
      this.selectedPartGroups = [];
      this.partGroups.forEach(pg => {
        if (pg.elements.filter(x => x.part.part_cat_id == Number(value)).length > 0) {
          this.selectedPartGroups.push(pg);
        }
      });
    }
  }

  addNewSubBuildStep() {
    let pageStepItem: ISubInventoryGroupHeader = { page: 2, step: 1, subBuildName: this.legoSet.name!};
    if (this.pageStepGroups.length > 0) {
      let lastPageStepItem: ISubInventoryGroupHeader = this.pageStepGroups[this.pageStepGroups.length - 1].grouping;
      pageStepItem = { page: lastPageStepItem.page, step: lastPageStepItem.step + 1, subBuildName: lastPageStepItem.subBuildName };
    }
    let pageStepGrouping: ISubBuildGroup = {
      grouping: pageStepItem,
      selected: true,
      elements: []
    }
    this.pageStepGroups.push(pageStepGrouping);
    this.setSelectedSubBuildItem(pageStepGrouping);
    this.scrollToSubBuildBottom("bottomOfPage");
  }

  addNewSubBuildPageStep() {
    let pageStepItem: ISubInventoryGroupHeader = { page: 2, step: 1, subBuildName: this.legoSet.name! };
    if (this.pageStepGroups.length > 0) {
      let lastPageStepItem = this.pageStepGroups[this.pageStepGroups.length - 1].grouping;
      pageStepItem = { page: lastPageStepItem.page + 1, step: lastPageStepItem.step + 1, subBuildName: lastPageStepItem.subBuildName };
    }
    let pageStepGrouping: ISubBuildGroup = {
      grouping: pageStepItem,
      selected: true,
      elements: []
    }
    this.pageStepGroups.push(pageStepGrouping);
    this.setSelectedSubBuildItem(pageStepGrouping);
    this.scrollToSubBuildBottom("bottomOfPage");
  }

  addNewSubBuildPageNewSteps() {
    let pageStepItem: ISubInventoryGroupHeader = { page: 2, step: 1, subBuildName: this.legoSet.name! };
    if (this.pageStepGroups.length > 0) {
      let lastPageStepItem = this.pageStepGroups[this.pageStepGroups.length - 1].grouping;
      pageStepItem = { page: lastPageStepItem.page + 1, step: 1, subBuildName: lastPageStepItem.subBuildName };
    }
    let pageStepGrouping: ISubBuildGroup = {
      grouping: pageStepItem,
      selected: true,
      elements: []
    }

    this.pageStepGroups.push(pageStepGrouping);
    this.setSelectedSubBuildItem(pageStepGrouping);
    this.scrollToSubBuildBottom("bottomOfPage");
  }

  setSelectedSubBuildItem(value: ISubBuildGroup) {
    //clear the selected tag from the other pageStepGroups
    this.pageStepGroups.forEach(item => {
      if (item.grouping != value.grouping) { item.selected = false; }
    });
  }

  setPageStep(value: ISubBuildGroup) {
    value.elements.forEach(e => {
      e.sub_inventory.forEach(s => {
        this.modifySubBuild(s);
      })
    })
  }

  addElement(value: IElement) {
    //find the pageStepGroups that is selected
    value.set_num = this.legoSet.set_num!;
    let selected = this.pageStepGroups.find(x => x.selected)!;
    let group = selected.grouping;

    //formattred element is causing the ID to become 0  Not sure how to fix yet.
    let subInventory = formatElement();

    if (subInventory.id == 0) {
      value.sub_inventory.push(subInventory);
      this.saveSubbuild(subInventory);
    } else {
      this.modifySubBuild(subInventory);
    }
    this.updateInventory(value);

    function formatElement(): ISubInventory {
      // check if a subuild exsists fro the page/step
      // if so then return that, if not create a new one.
      let subInventory: ISubInventory | undefined = value.sub_inventory.find(s => s.page == group.page && s.step == group.step);
      if (subInventory == undefined) {
        subInventory = {
          id: 0,
          set_num: value.set_num,
          element_id: value.element_id,

          //fields
          quantity: 1,
          subBuildName: group.subBuildName,
          page: Number(group.page),
          step: Number(group.step),
        }
      }
      else {
        subInventory.quantity += 1;
      }

      return subInventory;
    }


  }
  removeElement(value: IElement) {
    //find the pageStepGroups that is selected
    let selected = this.pageStepGroups.find(x => x.selected)!;
    let foundElement = selected.elements.find(x => x.element_id == value.element_id)!;
    let foundSubInventory = foundElement.sub_inventory.find(s => s.element_id == value.element_id)!;
    if (foundSubInventory.quantity == 1) { this.deleteSubBuild(foundElement); }
    foundSubInventory.quantity -= 1;
    if (foundSubInventory.quantity == 0) {
      //remove the subinv
      const indexSubInventory = foundElement.sub_inventory.findIndex(s => s.element_id == value.element_id)!;
      foundElement.sub_inventory.splice(indexSubInventory, 1);
      //remove the element from the group
      const indexElement = selected.elements.findIndex(x => x.element_id == value.element_id)!;
      selected.elements.splice(indexElement, 1);
    } else {
      foundElement.sub_inventory.forEach(s => {
        this.modifySubBuild(s);
      })
      
    }
    this.updateInventory(value);
  }

  updateInventory(value: IElement) {
    //find the element in the inventory group
    this.partGroups.forEach(pc => {
      pc.elements.forEach(e => {
        if (e.element_id == value.element_id) {
          //update the quantities in each of the subbuilds
          for (let i = 0; i < e.sub_inventory.length; i++) {
            e.sub_inventory[i] = { ...e.sub_inventory[i], quantity: value.sub_inventory[i].quantity };
          }
        }
      })
    })
    this.categoryChange(this.selectedCategory.toString());
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };

  saveSubbuild(value: ISubInventory) {
    let result = {};
    let loading = true;
    let error = "";

    let foundSubBuild = value;
    const jsonString = JSON.stringify(foundSubBuild);
    this.http.post('/api/subbuild', jsonString, this.httpOptions).subscribe({
      next: (res) => {
        //need to make sure the correct sub build item is being updated.
        foundSubBuild.id = Number(res.body);
        this.scrollToSubBuildBottom("bottomOfPage");
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }
  modifySubBuild(value: ISubInventory) {
    let result = {};
    let loading = true;
    let error = "";
    let foundSubBuild = value;
    const jsonString = JSON.stringify(foundSubBuild);
    this.http.put('/api/subbuild', jsonString, this.httpOptions).subscribe({
      next: (res) => {
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }
  deleteSubBuild(value: IElement) {
    let result = {};
    let loading = true;
    let error = "";
    let foundSubBuild = value.sub_inventory.find(s => s.element_id == value.element_id)!;
    //const jsonString = JSON.stringify(foundSubBuild);
    const url = `/api/subbuild`
    let params = new HttpParams();
    params = params.append('set_num', foundSubBuild.set_num);
    params = params.append('element_id', foundSubBuild.element_id);
    this.http.delete(url, { params }).subscribe({
      next: (res) => {
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }

 
  scrollToSubBuildBottom(elementName: string): void {
    this.subBuildContainer.nativeElement.scrollTop = this.subBuildContainer.nativeElement.scrollHeight
  }
}
