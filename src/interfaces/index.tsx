export enum ConfigDataType {
  String,
  Number,
  Boolean,
  Date,
  Object,
}
export enum DialogType {
  MessageDialog,
  ConfirmDialog,
}
export enum AdminPermission {
  Notification,
  NotificationView,
  NotificationEdit,
  Mail,
  MailView,
  MailEdit,
  RewardPool,
  RewardPoolView,
  RewardPoolEdit,
  Authen,
  Config,
  ConfigView,
  ConfigEdit,
  User,
  UserView,
  UserEdit,
  Request,
  RequestView,
  RequestEdit,
  RequestApprove,
  Tool,
  MaintainTool,
}
export enum AlertType {
  Success,
  Info,
  Warning,
  Danger,
}
export interface ConfirmCallback {
  (result: boolean): void;
}
export interface Dialog {
  id?: number;
  type: DialogType;
  label?: string;
  content: string;
  onClose: Function;
  onResult: ConfirmCallback;
}

export interface GridEntity {
  name: string;
  label: string;
  api: string;
  buttons: Button[];
  columns: GridColumn[];
  filter: SearchItem[];
  host?: string;
  tokens?: any;
  inputs?: Input[];
  where?: any;
}
export interface UserEntity {
  id: number;
  name: string;
  role: number;
  permissions: AdminPermission[];
}
export interface MenuEntity {
  name: string;
  url: string;
  icon: string;
  permissions: AdminPermission[];
  children: MenuEntity[];
}
export interface EnumEntity {
  name: string;
  items: EnumItem[];
  value_type: "string" | "number";
}
export interface FormEntity {
  totalGrid: number;
  name: string;
  label: string;
  api: number | string;
  buttons: Button[];
  controls: FormControl[];
  host?: string;
}
export enum UserRole {
  Admin,
  Teacher,
  Student,
  CustomerCare,
  Academic,
  Agent,
  AcademicManager,
}
export enum NotificationType {
  Message,
  NewUserRegister,
}
export enum CellDisplay {
  Text = "text",
  Number = "number",
  Date = "date",
  Image = "image",
  Switch = "switch",
  Enum = "enum",
  Entity = "entity",
  JSON = "json",
  Entities = "entities",
  ArrayString = "arraystring",
  File = "file",
  MultiLanguage = "multilanguage",
  Mail = "mail",
  Reward = "reward",
  Link = "link",
  RewardRarity = "rewardrarity",
  TreeView = "treeview",
  BidItem = "biditem",
  Ticket = "ticket",
  Chain = "chain",
  CheckBox = "checkbox",
  DataTracking = "data_tracking",
}
export interface SearchItem {
  label: string;
  field: string;
  type: "text" | "number" | "date";
  control?: "input" | "enum" | "date" | "entity";
  enum?: string;
  multiple?: boolean;
  gridName: string;
}
export interface GridColumn {
  label: string | JSX.Element;
  field: string;
  sortField?: string;
  display: CellDisplay;
  api?: string;
  sorter?: boolean;
  defaultSortOrder?: string;
  enumName?: string;
  fixed?: string;
  width: number;
  url?: string;
}
export interface Button {
  require?: any;
  label: string;
  pageMode?: string;
  classes?: string;
  icon?: string;
  color?: string;
  showInColumn?: string;
  action: "api" | "redirect" | "connect" | "download" | "generate" | 'popup';
  api?: string;
  redirectUrl?: string;
  redirectUrlEmbed?: any;
  embedData?: object;
  popupData?: object;
  popupName?: string;
  confirmText?: string;
  backOnAction?: boolean;
  position?: string;
  successMessage?: string;
  failMessage?: string;
  disableReload?: boolean;
  hideExpression?: object;
  isRender?: any;
}
export interface Input {
  label: string;
  field: string;
  display: CellDisplay;
}
export enum SchemaDataType {
  String = "string",
  Number = "number",
  Boolean = "boolean",
  Array = "array",
  Object = "object",
}
export enum SchemaControl {
  Enum = "enum",
  Text = "text",
  Number = "number",
  TextArea = "textarea",
  Image = "image",
  ArrayImage = "arrayimage",
  Location = "location",
  RichText = "richtext",
  Password = "password",
  Captcha = "captcha",
  Label = "label",
  Step = "step",
  Entity = "entity",
  JSON = "json",
  Date = "date",
  DateTime = "datetime",
  TextArray = "textarray",
  Divider = "divider",
  CheckList = "checklist",
  Checkbox = "checkbox",
  Schema = "schema",
  Upload = "upload",
  RewardEdit = "rewardedit",
  ListRewardEdit = "listrewardedit",
  DailyQuestRewardEdit = "dailyquestrewardedit",
  TopBattlefrontListRewardEdit = "topbattlefrontlistrewardedit",
  Battlepassreward = "battlepassreward",
  BattlepassRewardTopPlayer = "battlepassrewardtopplayer",
  MultiLanguage = "multilanguage",
  Mail = "mail",
  Tree = "tree",
  RewardRarity = "rewardrarity",
  LockFeature = "lockfeature",
  UploadIdentity = "uploadidentity",
  Milestone = "milestone",
  BossInfoSchedule = "bossinfoschedule",
  BossConditionConfig = "bossconditionconfig",
  BossMilestonesConfig = "bossmilestonesconfig",
  BossConditionSelect = "bossconditionselect",
  Decorationpatterns = "decorationpatterns",
  decorationpatterns = "decorationpatterns",
  TicketRewardRarity = "ticketrewardrarity",
  PoolIcon = "poolicon",
  Images = "images"
}


export interface FormControl {
  isTrim?: boolean;
  label: string;
  field: string;
  dataType: SchemaDataType;
  caption?: string;
  required: boolean;
  disabled: boolean;
  control: SchemaControl;
  gridName: string;
  schemaName: string;
  enum: string;
  hideExpression?: object;
  requireExpression?: object;
  api: string;
  multiple?: boolean;
  description: string;
  placeholder?: string;
  displayField?: string;
  subLabels?: string[];
  maxLength?: string;
  max?: number;
  min?: number;
  show?: any;
  default?: any;
  length?: number;
  grid?: number;
  className?: string;
}
export enum Language {
  English,
  Chinese,
}
export interface EnumItem {
  value: string;
  label: string;
  color?: string;
}

export interface LanguageItem {
  name: string;
  value: string;
}

export const AllColors = [
  "red",
  "orange",
  "yellow",
  "olive",
  "green",
  "teal",
  "blue",
  "violet",
  "purple",
  "pink",
  "brown",
  "grey",
  "black",
];

export enum YesNoEnum {
  No,
  Yes,
}

export enum BarCodeType {
  CODE128 = "CODE128",
  EAN13 = "EAN13",
  CODE39 = "CODE39"
}


export enum CancelStatus {
  None,
  Cancelling,
  Canceled
}