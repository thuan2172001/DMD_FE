const Config = {
  ApiHost: process.env.REACT_APP_API_HOST,
  NofiticationTime: 5000,
  PageSize: 10,
  TransitionDuration: 2000,
  TimeBlockDuration: 30, //minutes
  WorkStart: 17, //block
  WorkEnd: 43,
  DayOfWeek: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  TimeSheetDuration: 7, //days
  CancelTime: 2, //hour
  EncruptedKey: process.env.REACT_APP_REQUEST_ENCRYPT_KEY,
};
export default Config;
