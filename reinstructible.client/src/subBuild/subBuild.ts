import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for standalone components

import { ILegoSet, IElement, IElementGroup, ISubInventory } from '../interfaces/rebrickable';

import { InventoryItem } from './inventoryItem/inventoryItem';
import { SubBuildItem } from './subBuildItem/subBuildItem';
import { ButtonComponent } from '../shared/button/button.component';

import sorting from '../Utilities/sorting';

@Component({
  selector: 'subBuild',
  standalone: true, // Components are standalone by default from Angular 19/20
  imports: [CommonModule, InventoryItem, SubBuildItem, ButtonComponent],
  templateUrl: './subBuild.html',
  styleUrls: ['./subBuild.css']
})
export class SubBuild implements OnInit {
  @Input() legoSet: Partial<ILegoSet> = { id: 0 };
  public inventoryList: IElement[] = [];

  public partGroups: IElementGroup[] = [];
  public pageStepGroups: IElementGroup[] = [];

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
      },
      error: (error) => {
        console.error(error);
        this.Loaded = false;
      }
    });
  }

  addNewSubBuild() {

    let pageStepItem: Partial<ISubInventory>
    if (this.pageStepGroups.length == 0) {
      pageStepItem = { page: 2, step: 1, subBuildName: this.legoSet.name }
    } else {
      let lastPageStepItem = this.pageStepGroups[this.pageStepGroups.length - 1].grouping.split("|");
      pageStepItem = { page: Number(lastPageStepItem[0]), step: Number(lastPageStepItem[1]!) + 1, subBuildName: lastPageStepItem[2] }
    }
    let pageStepGrouping: IElementGroup = {
      grouping: `${pageStepItem.page}|${pageStepItem.step}|${pageStepItem.subBuildName}`,
      selected: true,
      elements: []
    }

    this.pageStepGroups.push(pageStepGrouping);
    this.setSelectedSubBuildItem(pageStepGrouping);
  }

  setSelectedSubBuildItem(value: IElementGroup) {
    //clear the selected tag from the other pageStepGroups
    this.pageStepGroups.forEach(item => {
      if (item.grouping != value.grouping) {        item.selected = false;      }
    });

    
  }

  addElement(value: IElement) {
    //find the pageStepGroups that is selected
    value.set_num = this.legoSet.set_num!;
    let selected = this.pageStepGroups.find(x => x.selected)!;
    let group = selected.grouping.split('|');
    if (selected.elements.length == 0) {
      selected.elements.push(formatElement());
      this.saveSubbuild(formatElement());
    } else {
      //See if the element exsists on the list,  otherwise add it in
      let foundElement = selected.elements.find(x => x.element_id == value.element_id);
      if (foundElement != null) {
        foundElement.sub_inventory.find(s => s.element_id == value.element_id)!.quantity += 1;
        this.modifySubBuild(foundElement);
      } else {
        selected.elements.push(formatElement());
        this.saveSubbuild(formatElement());
      }
    }

    function formatElement():IElement{
      let subInv: ISubInventory = {
        id: -1,
        set_num: value.set_num,
        element_id: value.element_id,

        //fields
        quantity: 1,
        subBuildName: group[2],
        page: Number(group[0]),
        step: Number(group[1]),
      }
      value.sub_inventory = [];
      value.sub_inventory.push(subInv);
      return value;
    }
    
    
  }
  removeElement(value: IElement) {
    //find the pageStepGroups that is selected
    let selected = this.pageStepGroups.find(x => x.selected)!;
    let foundElement = selected.elements.find(x => x.element_id == value.element_id)!;
    let foundSubInventory = foundElement.sub_inventory.find(s => s.element_id == value.element_id)!;
    if(foundSubInventory.quantity == 1){this.deleteSubBuild(foundElement);}
    foundSubInventory.quantity -= 1;
    if (foundSubInventory.quantity == 0) {
      //remove the subinv
      const indexSubInventory = foundElement.sub_inventory.findIndex(s => s.element_id == value.element_id)!;
      foundElement.sub_inventory.splice(indexSubInventory, 1);
      //remove the element from the group
      const indexElement = selected.elements.findIndex(x => x.element_id == value.element_id)!;
      selected.elements.splice(indexElement, 1);
    } else {
      this.modifySubBuild(foundElement);
    }
  }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };

  saveSubbuild(value: IElement) {
    let result = {};
    let loading = true;
    let error = "";
    let foundSubBuild = value.sub_inventory.find(s => s.element_id == value.element_id)!;
    const jsonString = JSON.stringify(foundSubBuild);
    this.http.post('/api/subbuild', jsonString, this.httpOptions).subscribe({
      next: (res) => {
        //result = res;
        //loading = false;
        //this.elementList.forEach((item, index) => {
        //  item.storage_location.bin = data.bin;
        //  item.storage_location.drawer = data.drawer;
        //})
        //this.saveStorageEvent.emit(data);
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create post'; loading = false;
      }
    });
  }
  modifySubBuild(value: IElement) {
    let result = {};
    let loading = true;
    let error = "";
    let foundSubBuild = value.sub_inventory.find(s => s.element_id == value.element_id)!;
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
}
