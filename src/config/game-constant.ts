const GameConstant = {
  // [health, spokiness, magic, aggresion] - race
  BaseFormStat: [
    [41, 35, 31, 39, 35],
    [39, 35, 39, 39, 31],
    [30, 39, 43, 35, 35],
    [30, 31, 27, 27, 39],
  ],
  //  health - sturdiness - magic -aggrestion - rarity
  FormRarityBaseMultiply: [
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
  ],
  //  health - sturdiness - magic -aggrestion - rarity
  LevelStatMultiply: [
    [1.5, 0.6, 0.6, 1.2, 1.2],
    [0.6, 1.2, 1.5, 1.5, 0.6],
    [0.6, 0.6, 0.6, 0.6, 0.6],
    [1.2, 1.5, 1.2, 0.6, 1.5],
  ],
  // [statsList [race [rarity]]]
  // race: beast - tectos - mystic - celest - chaos
  // rarity: uncommon - common - rare - epic
  MaxBodyPart: [
    // statsList: Form - Head - Eyes - Horns - Tails - Back - Frontleg - Backleg - Mouth
    [
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
    ],
    [
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
      [2, 1, 1, 1, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
      [3, 2, 2, 2, 1],
    ],
    [
      [60, 60, 60, 60, 60],
      [60, 60, 60, 60, 60],
      [60, 60, 60, 60, 60],
      [60, 60, 60, 60, 60],
      [60, 60, 60, 60, 60],
    ],
  ],
  // common - uncommon - rare - epic - legendary
  RarityPowerRange: [0, 264, 407, 580, 782],
  //  health - sturdiness - magic -aggrestion - rarity
  BodyPartRarityBaseMultiply: [
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
    [1, 1.25, 1.5, 1.75, 2.25],
  ],
  // [health, spokiness, magic, aggresion] - race
  BaseBodyPartStat: [
    [3, 0, 0, 1, 1],
    [1, 3, 1, 3, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 3, 0, 3],
  ],
};
export default GameConstant;
