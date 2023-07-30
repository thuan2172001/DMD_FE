import { read, utils as xlsxUtils } from "xlsx";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.js';

let uid = 0;
function matchText(search: string, text: string) {
  if (!(search && text)) return false;
  return text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
}
function getUid() {
  return uid++;
}
function intToString(val: number) {
  if (val < 10000) {
    return val;
  }
  let value = Math.round(val);
  var suffixes = ["", "k", "m", "b", "t"];
  var suffixNum = Math.floor(("" + value).length / 3);
  var shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2)
  );
  if (shortValue % 1 != 0) {
    // @ts-ignore
    shortValue = shortValue.toFixed(1).toString();
  }
  return shortValue + suffixes[suffixNum];
}
function convertValue(val: any, data: any) {
  if (!val) return val;
  if (typeof val === "number") {
    return val;
  }
  if (val[0] === "$") {
    const key: string = val.substr(1, val.length - 1);
    //@ts-ignore
    return data[key];
  }
  return val;
}
function checkExpression(express: any, data: any) {
  for (var i in express) {
    let e = express[i];
    switch (String(i)) {
      case "$eq":
        if (convertValue(e[0], data) !== convertValue(e[1], data)) {
          return false;
        }
        break;
      case "$in":
        if (
          !(
            convertValue(e[0], data) in
            e[1].map((i: any) => convertValue(i, data))
          )
        ) {
          return false;
        }
        break;
      case "$nin":
        if (
          convertValue(e[0], data) in
          e[1].map((i: any) => convertValue(i, data))
        ) {
          return false;
        }
        break;
      case "$neq":
        if (convertValue(e[0], data) === convertValue(e[1], data)) {
          return false;
        }
        break;

      default:
        return false;
    }
  }
  return true;
}
const getStringifyValue = (value: any) => {
  try {
    let data = JSON.parse(value);
    return value;
  } catch (err) {
    return JSON.stringify(value);
  }
};

async function cropPdfCenterToImages(file: any): Promise<{page: number, src: string, text: string}[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const data = new Uint8Array(this.result as ArrayBufferLike);
      // @ts-ignore
      let dataRes = await window.cropPdfCenterToImages(data)
      resolve(dataRes)
    };

    fileReader.onerror = (error) => {
      console.error('Error reading file: ', error);
      reject(error); // Reject with an error if FileReader encounters an error
    };

    fileReader.readAsArrayBuffer(file);
  });
}


function convertImageToText(imageBase64: string) {
  Tesseract.recognize(
    imageBase64,
    "eng", // Language code for English, you can change it based on the image content
    {
      logger: (info) => console.log(info.status, info.progress, info.status),
    }
  )
    .then(({ data: { text } }) => {
      return text;
    })
    .catch((error) => {
      console.error("Error during OCR:", error);
    });
}

const handleFileExcel = (file: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File not provided.'));
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });

      // Assuming you have only one sheet, read its data
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert the worksheet data to JSON
      const jsonData = xlsxUtils.sheet_to_json(worksheet);

      resolve(jsonData);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsArrayBuffer(file);
  });
};


const utils = {
  matchText,
  getUid,
  checkExpression,
  intToString,
  getStringifyValue,
  cropPdfCenterToImages,
  handleFileExcel,
};
export default utils;
