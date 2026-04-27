import { IElement, IFilterOptions, IFilterOptionGroups, IPart, IColor, ISubInventory } from "../interfaces/rebrickable"

export default class filterOption {

 static partCategory(elements: IElement[]): IFilterOptions[] {
  let options: IFilterOptions[] = [];
  let partC: IPart[] = [];
  // Filter the unique Categories objects of elements in a set
  elements.forEach(e => {
   if (!partC.some(item => item.part_cat_id === e.part.part_cat_id)) {
    partC.push(e.part);
   }
  });
  //sort the catergories map the sorted list into the options
  options = partC.sort((a, b) => a.part_cat_name.localeCompare(b.part_cat_name))
   .map(pc => ({id: pc.part_cat_id, name: pc.part_cat_name, subOptions:[], selected: true}));
  
  return options;
 }
 static partColor(elements: IElement[]): IFilterOptions[] {
  let options: IFilterOptions[] = [];
  let partC: IColor[] = [];
  // Filter the unique Categories objects of elements in a set
  elements.forEach(e => {
   if (!partC.some(item => item.name === e.color.name)) {
    partC.push(e.color);
   }
  });
  //sort the catergories map the sorted list into the options
  options = partC.sort((a, b) => a.name.localeCompare(b.name))
   .map(pc => ({ id: pc.id, name: pc.name, subOptions: [], selected: true }));

   return options;
 }
 static partStorage(elements: IElement[]): IFilterOptions[] {
  let options: IFilterOptions[] = [];
  // Filter and sort the unique color objects of elements in a set
  const storageBins = [...new Set(elements.map(s => s.storage_location.bin)
   .filter(x => x != 'Unassigned')
   .sort((a, b) => a.localeCompare(b))
  )];

  const unassignedBin = [...new Set(elements.map(s => s.storage_location.bin)
   .filter(x => x == 'Unassigned'))];
  // The following commented code shows how to request color objects per id from the API.
  // It is retained for reference in case a switch to server-driven color lookup is desired.

  if (unassignedBin.length > 0) {
   options.push({
    id: -1,
    name: 'Unassigned',
    subOptions: [],
    selected: true
   });
  }

  storageBins.forEach(bin => (
   options.push({
    id: bin == 'Unassigned' ? -1 : Number(bin),
    name: bin,
    subOptions: [],
    selected: true
   })
  ))

  return options;
 }
 static subBuild(elements: IElement[]): IFilterOptions[] {
  let options: IFilterOptions[] = [];
  let subI: ISubInventory[] = [];
  // Filter the unique Categories objects of elements in a set
  elements.forEach(e => {
   e.sub_inventory.forEach(i => {
   if (!subI.some(item => item.subBuildName === i.subBuildName)) {
    subI.push(i);
    }
   })
  });
  //sort the catergories map the sorted list into the options
  options = subI.sort((a, b) => a.subBuildName.localeCompare(b.subBuildName))
   .map(pc => ({ id: pc.id, name: pc.subBuildName, subOptions: [], selected: true, compacted: true }));
  //in a loop get the page/step associated with each name and add it on the subFilter
  options.forEach(o => {
   o.subOptions = this.subBuildPageStep(elements, o);
  })

  return options;
 }
 static subBuildPageStep(elements: IElement[], option: IFilterOptions): IFilterOptions[] {
  let options: IFilterOptions[] = [];
  let subI: ISubInventory[] = [];

  //filter the suboptions by the name first
  elements.forEach(e => {
   e.sub_inventory.forEach(i => {
    if (option.name === i.subBuildName) {
     if (!subI.some(item => (item.page === i.page) && (item.step === i.step))) {
         subI.push(i);
        }
     
    }
   })
  })

  //sort the catergories map the sorted list into the options
  options = subI.sort((a, b) => a.page-b.page).sort((a,b) => a.step-b.step)
   .map(pc => ({ id: pc.id, name: "Page:" + pc.page.toString() + " / Step:" + pc.step.toString(), subOptions: [], selected: true }));
  return options;
 }


 static applyFilter(elementsBase: IElement[], filterOptionGroups: IFilterOptionGroups): IElement[] {
  let filteredElements: IElement[] = [];

  const categoryIds = [...new Set(filterOptionGroups.partCategoryOptions.filter(item => item.selected === true).map(item => item.id))];
  const colorIds = [...new Set(filterOptionGroups.partColorOptions.filter(item=>item.selected===true).map(item => item.id))];
  const storageBins = [...new Set(filterOptionGroups.partStorageOptions.filter(item => item.selected === true).map(item => item.name))];

  const subBuildNameCount = filterOptionGroups.subBuildOptions.length;


  //base filter
  filteredElements = elementsBase
   .filter(i => colorIds.includes(i.color.id))
   .filter(i => categoryIds.includes(i.part.part_cat_id))
   .filter(i => storageBins.includes(i.storage_location.bin))
   ;
  if (subBuildNameCount > 0) { filteredElements = this.SubBuildFilter(filteredElements, filterOptionGroups)}

  return filteredElements;
 }

 static SubBuildFilter(elements: IElement[], filterOptionGroups: IFilterOptionGroups): IElement[] {
  let filteredElements: IElement[] = [];

  const subBuildNameItems = filterOptionGroups.subBuildOptions.filter(item => item.selected === true);
  const subBuildPageStepItems: IFilterOptions[] = [];
  subBuildNameItems.forEach(obj => subBuildPageStepItems.push(...obj.subOptions.filter(i => i.selected == true)));


  const subBuildNames = [...new Set(subBuildNameItems.map(item => item.name))];
  const subBuildPageSteps = [...new Set(subBuildPageStepItems.map(item => item.name))];
  //const subBuildSteps = [...new Set(filterOptionGroups.subBuildStepOptions.filter(item => item.selected === true).map(item => item.name))];

  //filter out the sub_inv objects of each element
  //remove any elements that do not have a subbuild item any longer, and calculate the new quantity
  elements.forEach(e => {
   let subbuild: ISubInventory[] = e.sub_inventory
    .filter(i => subBuildNames.includes(i.subBuildName))
    .filter(i => subBuildPageSteps.includes(`Page:${i.page} / Step:${i.step}`))
    //.filter(i => subBuildSteps.includes(i.step.toString()));

  


   if (subbuild.length > 0) {
    const eItem = structuredClone(e);
    eItem.sub_inventory = [];
    let q = 0;
    subbuild.forEach(sItem => {
     q += sItem.quantity;
     eItem.sub_inventory.push(sItem);
    })
    eItem.quantity = q;
    filteredElements.push(eItem);
   }
  })
  return filteredElements;
 }
}
