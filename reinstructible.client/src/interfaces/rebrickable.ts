interface ILegoSet {
  id: number;
  set_num: string;
  set_num_parent: string;
  name: string;
  theme_id: number;
  theme: ITheme[];
  set_img_url: string;
  set_imager_resource: number;
  set_element_count: number;
  set_element_storage_count: number;
}
interface IElement {
  id: number;
  inv_part_id: number;
  part: IPart;
  color: IColor;
  set_num: string;
  quantity: number;
  is_spare: boolean;
  element_id: string;
  num_sets: number;
  part_img_url: string;
  part_url: string;
  storage_location: IStorage
  sub_inventory: ISubInventory;
}
interface IPart {
  part_num: string;
  name: string;
  part_cat_id: number;
  year_from: number;
  year_to: number;
  
  prints: string[];
  molds: string[];
  alternates: string;
}
interface IPartCategory {
  id: number;
  name: string;
  part_count: number;
}
interface IColor {
  id: number;
  name: string;
  rgb: string;
  is_trans: boolean;
}
interface ITheme {
  id: number;
  parent_id: number;
  name: string;
}

interface ISubInventory {
  //Key combo
  id: number;
  set_num: string;
  element_id: string;

  //fields
  quantity: number;
  subBuildName: string;
  page: number;
  step: number;
}
interface IStorage {
  //Id: number;
  element_id: string;
  bin: string;
  drawer: string;
}

interface IStorage_updateList {
  element_ids: string[];
  bin: string;
  drawer: string;
}
export type {
  IColor,
  IElement,
  ILegoSet,
  IPart,
  IPartCategory,
  ITheme,

  IStorage,
  IStorage_updateList,
  ISubInventory,
}
