import { PDFDocument } from "pdf-lib";
import ExcelJS from "exceljs";
import fs from "fs";
import QRCode from "qrcode";
import { read, write, utils as xlsxUtils } from "xlsx";
import Tesseract from "tesseract.js";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import JsBarcode from "jsbarcode";

GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.js";

let uid = 0;
function matchText(search: string, text: string) {
  if (!(search && text)) return false;
  return (
    text
      ?.toString()
      ?.toLowerCase()
      .indexOf(search?.toString()?.toLowerCase()) >= 0
  );
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
  var shortValue = parseFloat((suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(2));
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
        if (!(convertValue(e[0], data) in e[1].map((i: any) => convertValue(i, data)))) {
          return false;
        }
        break;
      case "$nin":
        if (convertValue(e[0], data) in e[1].map((i: any) => convertValue(i, data))) {
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

async function cropPdfCenterToImages(
  setPercentage: any,
  file: any
): Promise<{ page: number; src: string; text: string; pageKey: string }[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const data = new Uint8Array(this.result as ArrayBufferLike);
      // @ts-ignore
      let dataRes = await window.cropPdfCenterToImages(setPercentage, data);
      resolve(dataRes);
    };

    fileReader.onerror = (error) => {
      console.error("Error reading file: ", error);
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
      reject(new Error("File not provided."));
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: "array" });

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

function generateBarcodeToBase64(text: string, barcodeType = "CODE128") {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, text, {
        format: barcodeType,
        displayValue: true,
      });

      // Convert canvas to Base64 encoded image
      const base64Image = canvas.toDataURL();

      resolve(base64Image);
    } catch (error) {
      reject(error);
    }
  });
}

function generateQRCodeToBase64(text: string) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement("canvas");
      QRCode.toCanvas(canvas, text, (error: any) => {
        if (error) {
          reject(error);
        } else {
          // Convert canvas to Base64 encoded image
          const base64Image = canvas.toDataURL();
          resolve(base64Image);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

const formatString = (str: string, isTrim = false) => {
  if (!str) return "";

  let res = str.toString().toLowerCase();
  if (isTrim) {
    res.replaceAll(" ", "");
  }
  return res;
};

function downloadXLSXFile(headers: string[], data: any[], fileName: string) {
  var wb = xlsxUtils.book_new();

  data = data.map((item: any) => {
    return headers.map((header) => {
      if (header === "Status") {
        return item[header] ? "Valid" : "Invalid";
      } else if (header === "PDF" && item[header]) {
        console.log(item[header]);
        return { t: "s", v: item[header], s: { base64: true } };
      }
      return item[header];
    });
  });
  var ws = xlsxUtils.aoa_to_sheet([headers].concat(data));
  xlsxUtils.book_append_sheet(wb, ws, "Sheet1");

  var blob = write(wb, { bookType: "xlsx", type: "array" });
  var url = window.URL.createObjectURL(new Blob([blob], { type: "application/octet-stream" }));

  var a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = fileName + ".xlsx";
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

const generateExcelWithImages = async (headers: string[], data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.addRow(headers);

  let indexPdf = -1;
  if (headers.indexOf("PDF") >= 0) {
    indexPdf = headers.indexOf("PDF");
  }
  if (headers.indexOf("pdf") >= 0) {
    indexPdf = headers.indexOf("pdf");
  }

  data.forEach((item) => {
    const row = worksheet.addRow(
      headers.map((header) => {
        if (header === "Status") {
          if (item?.errorValue?.includes("Duplicate")) return "Duplicate";
          return item[header] ? "Valid" : "Invalid";
        }
        if (header === "PDF" || header === "pdf") {
          return "";
        }
        return item[header];
      })
    );

    if (item.PDF || item.pdf) {
      const image = workbook.addImage({
        base64: item.PDF || item.pdf,
        extension: "png", // Replace with the actual image extension
      });

      worksheet.addImage(image, {
        tl: { col: indexPdf, row: row.number - 1 }, // Adjust column index as needed
        ext: { width: 100, height: 100 }, // Set the width and height as needed
      });
    }
  });

  const blob = await workbook.xlsx.writeBuffer();
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${fileName}.xlsx`; // Set the desired file name
  document.body.appendChild(a);
  a.click();

  // Clean up the Blob URL and link element
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const generateExcelWithoutLabel = async (headers: string[], data: any[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.addRow(headers);
  data.forEach((item) => {
    const row = worksheet.addRow(
      headers.map((header) => {
        if (header === "Status") {
          return item[header] ? "Valid" : "Invalid";
        }
        if (header === "PDF" || header === "pdf") {
          return "";
        }
        return item[header];
      })
    );
  });

  const blob = await workbook.xlsx.writeBuffer();
  const url = window.URL.createObjectURL(new Blob([blob]));
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${fileName}.xlsx`; // Set the desired file name
  document.body.appendChild(a);
  a.click();

  // Clean up the Blob URL and link element
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Function to convert base64 image to Uint8Array
function base64ToUint8Array(base64: string) {
  let dataFormat = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "").replace(/^data:application\/(pdf);base64,/, "");
  let binaryString = window.atob(dataFormat);
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

const generatePDF = async (imageBase64List: string[], fileName: string) => {
  const pdfDoc = await PDFDocument.create();

  for (const imageBase64 of imageBase64List) {
    const imageBytes = base64ToUint8Array(imageBase64);
    const image = await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const utils = {
  matchText,
  getUid,
  checkExpression,
  intToString,
  getStringifyValue,
  cropPdfCenterToImages,
  handleFileExcel,
  generateBarcodeToBase64,
  generateQRCodeToBase64,
  formatString,
  downloadXLSXFile,
  generateExcelWithImages,
  generateExcelWithoutLabel,
  generatePDF,
  base64ToUint8Array,
};
export default utils;
