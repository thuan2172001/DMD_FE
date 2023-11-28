import printJs from "print-js";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Icon, Modal } from "semantic-ui-react";
import { utils } from "services";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfPreview = ({ pdfBase64, autoShow, showPrint }: { pdfBase64: string; autoShow?: boolean; showPrint?: boolean }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handlePrint = () => {
    printJs({ printable: pdfBase64.replace("data:application/pdf;base64,", ""), type: "pdf", base64: true });
  };

  return (
    <div className="cursor-pointer">
      {autoShow ? (
        <Document file={pdfBase64} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      ) : (
        <>
          <div
            className="cursor-pointer text-[#3c81c2] font-bold"
            onClick={() => {
              togglePopup();
            }}
          >
            View
          </div>

          <Modal open={showPopup} onClose={togglePopup} size="small" className="p-[0px] max-w-custom-full">
            <Modal.Content className="w-full">
              <Document file={pdfBase64} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document>
            </Modal.Content>
            <Modal.Actions>
              <Icon name="close" size="large" className="cursor-pointer absolute top-[10px] right-[10px]" onClick={togglePopup} />
              <Icon
                name="download"
                size="large"
                className="cursor-pointer absolute bottom-1 left-1/2 -translate-x-[50%]"
                onClick={() => {
                  utils.downloadAsPDF(pdfBase64);
                }}
              />
            </Modal.Actions>
          </Modal>
        </>
      )}
      {showPrint && (
        <div className="w-full flex justify-center mt-4">
          <Button color="blue" icon="print" onClick={handlePrint} className="text-center mx-auto">
            Print
          </Button>
        </div>
      )}
    </div>
  );
};

export default PdfPreview;
