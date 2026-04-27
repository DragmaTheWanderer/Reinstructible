import { ILegoSet, IElement, IFilterOptions, IElementOptions } from '../interfaces/rebrickable';

export default class updateInterfaces {

 static updateLegoSet(o: Partial<ILegoSet>, n: ILegoSet) {
  o.id = n.id;
  o.set_num = n.set_num;
  o.set_num_parent = n.set_num_parent;
  o.name = n.name;
  o.theme_id = n.theme_id;
  o.theme = n.theme;
  o.set_img_url = n.set_img_url;
  o.set_imager_resource = n.set_imager_resource;
  o.set_element_count = n.set_element_count;
  o.set_element_storage_count = n.set_element_storage_count;
 }

 static populateLegoSetFromPartial(o: Partial<ILegoSet>): ILegoSet {
  let legoset: ILegoSet = {
   id: o.id ?? 0,
   name: o.name ?? "",
   set_num: o.set_num ?? "",
   set_num_parent: o.set_num_parent ?? "",
   theme_id: o.theme_id ?? 0,
   theme: o.theme ?? [],
   set_img_url: o.set_img_url ?? "",
   set_imager_resource: o.set_imager_resource ?? 0,
   set_element_count: o.set_element_count ?? 0,
   set_element_storage_count: o.set_element_storage_count ?? 0,
  };
  return legoset;
 }
 static updateOptions(o: IElementOptions, n: IElementOptions) {
  o.currentGrouping = n.currentGrouping;
  o.displayMode = n.displayMode;
  o.filterType = n.filterType;
 }

 static updateElementArray(o: IElement[], n: IElement[]) {
  o.splice(0, o.length);
  n.forEach(i => o.push(i));
 }

 static updateFilterOptionsArray(o: IFilterOptions[], n: IFilterOptions[]) {
  o.splice(0, o.length);
  n.forEach(i => o.push(i));
 }

 static updateNumberFilteredArray(o: number[], n: number[]) {
  o.splice(0, o.length);
  n.forEach(i => o.push(i));
 }

 static updateStringFilteredArray(o: string[], n: string[]) {
  o.splice(0, o.length);
  n.forEach(i => o.push(i));
 }

}

