import { IElement, IElementGroup, IFilterOptions } from '../interfaces/rebrickable'

export default class sorting{

  static groupByColor(elements: IElement[], groupColor: IFilterOptions[]) {

    let elementCards: IElementGroup[] = []; 
    groupColor.forEach(c => {
      let elementsForGroup = elements.filter(e => e.color.id === c.id)
        .sort((a, b) => {
          const elementComparison = a.color.name.localeCompare(b.color.name);
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
          const elementComparison = a.part.name.localeCompare(b.part.name);
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
          const elementComparison = a.part.name.localeCompare(b.part.name);
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
      let elementsForGroup = elements.filter(e => e.part.name.includes(a))
        .sort((a, b) => {
          const elementComparison = a.part.name.localeCompare(b.part.name);
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

}
