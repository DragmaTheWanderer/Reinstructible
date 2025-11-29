interface ILegoSet {
  id: number;
  set_num: string;
  set_num_parent: string;
  name: string;
  theme_id: number;
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
}
interface IPart {
  part_num: string;
  name: string;
  part_cat_id: number;
  year_from: number;
  year_to: number;
  part_url: string;
  part_img_url: string[];
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

export type {
  IColor,
  IElement,
  ILegoSet,
  IPart,
  IPartCategory,
  
}
