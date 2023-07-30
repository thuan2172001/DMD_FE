import { EnumEntity, FormEntity, GridEntity, MenuEntity } from "../interfaces";
let grids: { [key: string]: GridEntity } = {};
let forms: { [key: string]: FormEntity } = {};
let enums: { [key: string]: EnumEntity } = {};
let menus: MenuEntity[] = [];
let troops: any[];
let skills: any[];
let isSetMeta: boolean = false;

function setMeta(
  _grids: { [key: string]: GridEntity },
  _forms: { [key: string]: FormEntity },
  _enums: { [key: string]: EnumEntity },
  _menus: MenuEntity[],
  _troops: any[],
  _skills: any[]
): void {
  isSetMeta = true;
  grids = _grids;
  forms = _forms;
  enums = _enums;
  menus = _menus;
  troops = _troops ?? [];
  skills = _skills ?? [];
}
function getMenus() {
  return menus;
}
function getAllEnums(): { [key: string]: EnumEntity } {
  return enums;
}
function getEnum(name: string): EnumEntity {
  return enums[name];
}

function getGrid(name: string): GridEntity {
  return grids[name];
}

function getFormByName(name: string): FormEntity {
  return forms[name];
}
function checkIsSetMeta(): boolean {
  return isSetMeta;
}
function getAllTroop(): any[] {
  return troops;
}
function getAllSkill(): any[] {
  return skills;
}
const dataServices = {
  getMenus,
  getGrid,
  getFormByName,
  getEnum,
  checkIsSetMeta,
  setMeta,
  getAllEnums,
  getAllTroop,
  getAllSkill,
};
export default dataServices;
