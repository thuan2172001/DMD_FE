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
  label: string;
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
  label: string;
  pageMode?: string;
  classes?: string;
  icon?: string;
  color?: string;
  showInColumn?: string;
  action: "api" | "redirect" | "connect";
  api?: string;
  redirectUrl?: string;
  redirectUrlEmbed?: any;
  embedData?: object;
  popupData?: object;
  confirmText?: string;
  backOnAction?: boolean;
  position?: string;
  successMessage?: string;
  failMessage?: string;
  disableReload?: boolean;
  hideExpression?: object;
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
}

export enum BossConditionType {
  Rarity = "rarity",
  Race = "race",
  Effect = "effect",
  EffectBonusDmg = "effect_bonus_dmg",
  CriticalOnly = "critical_only",
  NoCritical = "no_critical",
  CriticalBonusDmg = "critical_bonus_dmg",
  Burned = "burned",
  Slowed = "slowed",
  Poisoned = "poisoned",
  Stat = "stat",
  Regen = "regen",
  CourseExplode = "course_explode",
}

export interface FormControl {
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
export enum CourseStatus {
  WaitingForApprove,
  Approve,
  Cancel,
  Expired,
}

export enum CourseType {
  Trial,
  Official,
}

export enum RewardType {
  Food,
  MAG,
  MSTR,
  EvolutionItem,
  Experience,
  SOULCORE,
  PLOT,
  Mongen,
  Avatar,
  DailyQuestPoint
}

export enum BidType {
  MONGEN,
  SOUL_CORE,
  LAND,
  PLOT,
  EVOL_ITEM,
  SKILL_STONE,
}
export interface RewardEntity {
  reward_type: RewardType;
  reward_quantity: number;
  plot_type?: PlotType;
  race?: MongenRace;
  rarity?: Rarity | TicketRarity;
  rate?: number;
  reward_pool_id?: number;
  min?: number;
  max?: number;
  total_rewards?: number;
  avatar_id?: number;
  decoration_code?: string;
  is_high_fee?: boolean;
  wish?: string;
  sub_plot_type?:
    | TrapType
    | BombardType
    | CampType
    | TowerType
    | BarrackType
    | -1;
  emoji_id?: string;
  is_premium?: boolean;
  rune_code?: string;
  dna?: number[][];
  troop_list?: any;
}
export interface BidEntity {
  type: RewardType;
  quantity: number;
  plot_type?: PlotType;
  race?: MongenRace;
  rarity?: Rarity | TicketRarity;
  avatar_id?: number;
  decoration_code?: string;
  reward_pool_id?: number;
  sub_plot_type?:
    | TrapType
    | BombardType
    | CampType
    | TowerType
    | BarrackType
    | -1;
  emoji_id?: string;
  is_premium?: boolean;
  rune_code?: string;
  dna?: number[][];
  troop_list?: any;
}
export interface DailyQuestRewardItem {
  reward: RewardEntity;
  cost: number;
}
export interface BidConfigEntity {
  _id: string;
  item_type: BidConfigItemEntity;
  data: ConfigType[];
}

export interface BidConfigItemEntity {
  name: string;
  index: number;
}

export interface ConfigType {
  type: BidConfigItemEntity;
  race: BidConfigItemEntity[];
  rarity: BidConfigItemEntity[];
  sub_type?: BidConfigItemEntity[];
}

export enum PlotType {
  LandCore,
  Pasture,
  Breeding,
  Hatching,
  Production,
  Storage,
  Camp,
  Tower,
  Bombard,
  Trap,
  Barracks,
  Decor,
  All,
  Tree,
}
export enum MongenRace {
  Beast,
  Tectos,
  Mystic,
  Celest,
  Chaos,
  All,
}
export enum Rarity {
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
}
export enum TicketRarity {
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
  General,
  Global,
}

export interface LanguageItem {
  name: string;
  value: string;
}

export interface TokenEntity {
  name: string;
  chainId: string;
  sortName: string;
}
export enum SupportTicketSubject {
  Account,
  Gameplay,
  Marketplace,
  Bridge,
  DAO,
  Guild,
  PortalGame,
  Others,
}
export enum SupportTicketStatus {
  Pending,
  Resolved,
  Reject,
}

export enum SupportTicketPriority {
  Low,
  Medium,
  High,
  Highest,
}
export interface SupportTicketComment {
  name: string;
  content: string;
  attachs: string[];
  time: Date;
  creator_id: number;
  is_admin: boolean;
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
export enum FeatureAffect {
  All,
  Account,
  BSC,
  Terra,
  Avalanche,
  Facebook,
  Google,
  Okex,
}
export enum Feature {
  ALL,
  DAO_LOGIN,
  DAO_STAKE_MSTR,
  DAO_STAKE_MAG,
  DAO_IMPORT_FT,
  DAO_UNSTAKE_MSTR,
  DAO_UNSTAKE_MAG,
  DAO_CONVERT_FT,
  DAO_REFERRAL_EVENT,
  DAO_REFERRAL_SUBMIT,
  DAO_FAUCET,
  DAO_CLAIM_REWARD,
  DAO_RESTAKE_REWARD,
  GAMEPLAY_LOGIN,
  GAMEPLAY_STAKE_MAG,
  GAMEPLAY_STAKE_MSTR,
  GAMEPLAY_CONVERT_NFT,
  GAMEPLAY_CONVERT_FT,
  GAMEPLAY_IMPORT_NFT,
  GAMEPLAY_IMPORT_FT,
  GAMEPLAY_REFILL_ENERGY,
  GAMEPLAY_MAIL,
  GAMEPLAY_ADVENTURE,
  GAMEPLAY_BATTLEFRONT,
  GAMEPLAY_BOSS_CHALLENGE,
  GAMEPLAY_ARENA,
  GAMEPLAY_INVENTORY,
  GAMEPLAY_BUILD,
  GAMEPLAY_MONGEN_INFO,
  GAMEPLAY_CLAIM_DAILY_QUEST,
  SUPPORT_LOGIN,
  SCHOLAR_LOGIN,
  GAMEPLAY_EDIT_LAND,
  GAMEPLAY_CREATE_BLUE_PRINT,
  GAMEPLAY_HATCH_EGG,
  GAMEPLAY_BREED,
  GAMEPLAY_FEED_FOOD,
  GAMEPLAY_EVOLVE,
  GAMEPLAY_EXTRACT_EVO,
  GAMEPLAY_EDIT_SKILL,
  GAMEPLAY_UPGRADE_PLOT,
  GAMEPLAY_TRAINING_TROOPS,
  GAMEPLAY_EVENT_BUTTON,
  GAMEPLAY_WRITE_LOG,
  BATTLE_SHARE_GAME,
  MINIGAME,
  GAMEPLAY_SKIP_PLOT,
}
export enum MongenMorale {
  VeryHappy,
  Happy,
  Content,
  Unhappy,
  VeryUnhappy,
}

export enum LoginType {
  BSC,
  Terra,
  UserName,
  Avalanche,
  Facebook,
  Google,
  GoogleMobile,
  SavedToken,
  Okex,
}

export enum QueryMode {
  UserInfo,
  MongenInfo,
  PlotInfo,
  DAOTransactionInfo,
  MintEventInfo,
  ChainEventInfo,
  BoxInfo,
  MailInfo,
  CustomerQuestInfo,
  Analytics,
  AuthInfo,
  StakingData,
}

export const AnalyticsTable = [
  "earn_token_off",
  "spend_token_off",
  "event_properties",
  "token_tracking",
  "claim_two_quests",
  "get_items",
];

export enum AnalyticsEventSrc {
  user_profile = "user_profile",
  event_reward = "event_reward",
  stake = "stake",
  daily_quests = "daily_quests",
  system = "system",
  adventure = "adventure",
  production = "production",
  extract = "extract",
  upgrade = "upgrade",
  breeding = "breeding",
  withdraw = "withdraw",
  feed = "feed",
  clean = "clean",
  evolve = "evolve",
  buy_shield = "buy_shield",
  skip = "skip",
  mongen = "mongen",
  soulcore = "soulcore",
  cheat = "cheat",
  finish_game = "finish_game",
  point_to_items = "point_to_items",
  landplot = "landplot",
  blueprint = "blueprint",
  fee_mongen = "fee_mongen",
  fee_landplot = "fee_landplot",
  fee_soulcore = "fee_soulcore",
  fee_bp = "fee_bp",
  fee_evo = "fee_evo",
  fee_withdraw = "fee_withdraw",
  fee_marketplace = "fee_marketplace",
  hatching = "hatching",
  delete = "delete",
  level_up = "level_up",
  create_new = "create_new",
  pool_id = "pool_id",
  mail = "mail",
  mail_battlefront = "mail_battlefront",
  claim_faucet_DAO = "claim_faucet_DAO",
  box = "box",
  box_battlefront = "box_battlefront",
  claim_stake_reward = "claim_stake_reward",
  claim_referral = "claim_referral",
  battlefront_result = "battlefront_result",
  arena_result = "arena_result",
  training = "training",
  battlefront_entry = "battlefront_entry",
  battlefront_refresh = "battlefront_refresh",
  boss_challenge = "boss_challenge",
  arena_entry = "arena_entry",
  arena_refresh = "arena_refresh",
  ref_cashback = "ref_cashback",
  spend_stone = "spend_stone",
  spend_ticket = "spend_ticket",
  craft_decoration = "craft_decoration",
  change_decoration_pattern = "change_decoration_pattern",
  buy_daily_quest_items = "buy_daily_quest_items",
}
export enum AnalyticsEventSrcEarnTokenOff {
  stake = "stake",
  cheat = "cheat",
  adventure = "adventure",
  battlefront_result = "battlefront_result",
  user_profile = "user_profile",
  claim_stake_reward = "claim_stake_reward",
  production = "production",
  upgrade = "upgrade",
  breeding = "breeding",
  evolve = "evolve",
  training = "training",
  claim_referral = "claim_referral",
  box = "box",
  box_battlefront = "box_battlefront",
  mail = "mail",
  mail_battlefront = "mail_battlefront",
  daily_quests = "daily_quests",
  event_reward = "event_reward",
  ref_cashback = "ref_cashback",
  buy_daily_quest_items = "buy_daily_quest_items",
}
export enum AnalyticsEventSrcSpendTokenOff {
  clean = "clean",
  spend_ticket = "spend_ticket",
  change_decoration_pattern = "change_decoration_pattern",
  buy_shield = "buy_shield",
  battlefront_refresh = "battlefront_refresh",
  battlefront_entry = "battlefront_entry",
  skip = "skip",
  evolve = "evolve",
  feed = "feed",
  craft_decoration = "craft_decoration",
  breeding = "breeding",
  training = "training",
  upgrade = "upgrade",
  spend_stone = "spend_stone",
  fee_marketplace = "fee_marketplace",
  buy_daily_quest_items = "buy_daily_quest_items",
}
export enum TokenType {
  mag = "mag",
  stake_mag = "stake_mag",
  mstr = "mstr",
  food = "food",
  evo_item = "evo_item",
  evo_point = "evo_point",
  user_exp = "user_exp",
  pool_id = "pool_id",
  nm_stone = "nm_stone",
  rr_stone = "rr_stone",
  el_stone = "el_stone",
  nmr_stone = "nmr_stone",
  rrr_stone = "rrr_stone",
  elr_stone = "elr_stone",
  ticket_co = "ticket_co",
  ticket_uc = "ticket_uc",
  ticket_ra = "ticket_ra",
  ticket_ep = "ticket_ep",
  ticket_le = "ticket_le",
  star_adventure = "star_adventure",
  energy = "energy",
  battlefront_elo = "battlefront_elo",
  arena_elo = "arena_elo",
  pigment = "pigment",
  ticket_ge = "ticket_ge",
  ticket_gl = "ticket_gl",
  dailyquest_points = "dailyquest_points",
  battlepass_exp = "battlepass_exp",
  battlepass_exp_arena = "battlepass_exp_arena",
  elective_stone_co = "elective_stone_co",
  elective_stone_rune_co = "elective_stone_rune_co",
  elective_stone_uc = "elective_stone_uc",
  elective_stone_rune_uc = "elective_stone_rune_uc",
  elective_stone_ra = "elective_stone_ra",
  elective_stone_rune_ra = "elective_stone_rune_ra",
  elective_stone_ep = "elective_stone_ep",
  elective_stone_rune_ep = "elective_stone_rune_ep",
  elective_stone_le = "elective_stone_le",
  elective_stone_rune_le = "elective_stone_rune_le",
  worldcup_event_point = "worldcup_event_point",
  mutated_gen = "mutated_gen",
  elixir = "elixir",
  abyss_star = "abyss_star",
}

export enum TrapType {
  Random = -1,
  Default,
  Poison,
  Slowed,
  Paralyzed,
  Confused,
  Bleeding,
  Silence,
  Burned,
  MG,
  STD,
  AGR,
}

export enum BombardType {
  Random = -1,
  Default,
  RNG,
  ENG,
}

export enum BarrackType {
  Random = -1,
  Default,
  Food,
}

export enum TowerType {
  Random = -1,
  Default,
  RNG,
  CD,
}

export enum CampType {
  Random = -1,
  Default,
  HP,
  MG,
  STD,
  AGR,
}

export enum BodyPart {
  Form,
  Head,
  Eyes,
  Horns,
  Tail,
  Back,
  FrontLeg,
  BackLeg,
  Mouth,
  Aura,
}

export enum MongenStatType {
  Health,
  Sturdiness,
  Magic,
  Aggresion,
}
