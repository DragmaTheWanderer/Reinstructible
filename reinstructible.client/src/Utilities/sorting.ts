import { IElement, IElementGroup, IFilterOptions, ISubInventory } from '../interfaces/rebrickable'

export default class sorting{

  static groupByColor(elements: IElement[], groupColor: IFilterOptions[]) {

    let elementCards: IElementGroup[] = []; 
    groupColor.forEach(c => {
      let elementsForGroup = elements.filter(e => e.color.id === c.id)
        .sort((a, b) => {
          let elementComparison = a.color.name.localeCompare(b.color.name);
          return elementComparison;
        });
      if (elementsForGroup.length > 0) {
        let elementCard: IElementGroup = {
          grouping: c.name,
          selected: false,
          elements: elementsForGroup
        }
        
        elementCards.push(elementCard);
      }
      
    });
return elementCards;
  }

  static groupByCategory(elements: IElement[], groupCategory: IFilterOptions[]) {
    let elementCards: IElementGroup[] = [];

    groupCategory.forEach(c => {
      let elementsForGroup = elements.filter(e => e.part.part_cat_id === c.id)
        .sort((a, b) => {
          let elementComparison = a.part.name.localeCompare(b.part.name);
          return elementComparison || a.color.name.localeCompare(b.color.name);
        });
      if (elementsForGroup.length > 0) {
        let elementCard: IElementGroup = {
          grouping: c.name,
          selected: false,
          elements: elementsForGroup
        }
        elementCards.push(elementCard);
      }
    });
    return elementCards;
  }

  static groupByStorage(elements: IElement[], groupStorage: IFilterOptions[]) {
    let elementCards: IElementGroup[] = [];

    groupStorage.forEach(s => {
      let elementsForGroup = elements
        .filter(e => e.storage_location.bin === s.name)
        .sort((a, b) =>
          a.storage_location.drawer.localeCompare(b.storage_location.drawer)
          || a.part.name.localeCompare(b.part.name)
          || a.color.name.localeCompare(b.color.name)
        );
      if (elementsForGroup.length > 0) {
        let elementCard: IElementGroup = {
          grouping: s.name,
          selected: false,
          elements: elementsForGroup
        }
        elementCards.push(elementCard);
      }
    });

    return elementCards;
  }

  static groupByAlpha(elements: IElement[]) {
    let elementCards: IElementGroup[] = [];
    let groupAlpha: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    groupAlpha.forEach(a => {
      let elementsForGroup = elements.filter(e => e.part.name.startsWith(a))
        .sort((a, b) => {
          let elementComparison = a.part.name.localeCompare(b.part.name);
          return elementComparison || a.color.name.localeCompare(b.color.name);
        });
      if (elementsForGroup.length > 0) {
        let elementCard: IElementGroup = {
          grouping: a,
          selected: false,
          elements: elementsForGroup
        }
        elementCards.push(elementCard);
      }
    })
    return elementCards;
  }

  static groupByPart(elements: IElement[]) {
    let elementGroups: IElementGroup[] = [];
    let group: string[] = [...new Set(elements.map(part => part.part.name))].sort();


    group.forEach(a => {
      let elementsForGroup = elements.filter(e => e.part.name == a)
        .sort((a, b) => {
          let elementComparison = a.part.name.localeCompare(b.part.name);
          return elementComparison || a.color.name.localeCompare(b.color.name);
        });
      if (elementsForGroup.length > 0) {
        let elementCard: IElementGroup = {
          grouping: a,
          selected: false,
          elements: elementsForGroup
        }
        elementGroups.push(elementCard);
      }
    })
    return elementGroups;
  }

  static groupBySubBuild(elements: IElement[]): IElementGroup[] {
    let elementGroups: IElementGroup[] = [];
    let subInventoryGroup: Partial<ISubInventory>[] = [];
    let groupNonString: Partial<ISubInventory>[] = [];

    //get the sets of subinventories
    elements.filter(e => e.sub_inventory.length > 0).forEach(element => {
      element.sub_inventory.forEach(sub => {
        let SubInventoryPartialItem:Partial<ISubInventory>={
          page: sub.page,
          step: sub.step,
          subBuildName: sub.subBuildName
        }
        let test = subInventoryGroup.find(x => x.page == SubInventoryPartialItem.page
          && x.step == SubInventoryPartialItem.step);
        if (test == undefined) {
          subInventoryGroup.push(SubInventoryPartialItem);
        }
      });
    });
    groupNonString = [...subInventoryGroup].sort((a, b) =>
      Number(a.page) - Number(b.page)
      || Number(a.step) - Number(b.step)
    );

    //filter each group and add the results to the element Groups
    groupNonString.forEach(g => {
      let eg: IElementGroup = {
        grouping: `${g.page}|${g.step}|${g.subBuildName}`,
        selected: false,
        elements: []
      };
      elements.filter(e => e.sub_inventory.length > 0).forEach(e => {
        e.sub_inventory.forEach(sub => {
          if (g.page == sub.page && g.step == sub.step && g.subBuildName == sub.subBuildName) {
            eg.elements.push(e);
          }
        });
      });
      elementGroups.push(eg);
    });

    return elementGroups;
  }

}
