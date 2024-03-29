import PdfPreview from "components/pdf-preview";
import { AlertType } from "interfaces";
import printJs from "print-js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import api from "services/api";
import ui from "services/ui";
export default function Tracking() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [data, setData] = useState<any>({});
  const [trigger, setTrigger] = useState<any>(false);
  const { id } = useParams();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageLoaded(false);
  };

  function printImage() {
    // Get the image element
    const imageElement = document.getElementById("myImage");

    // Create a new style element
    const styleElement = document.createElement("style");

    // Add the necessary CSS rules to the style element
    const cssText = `
      @media print {
        // body * {
        //   display: none;
        // }
        @page {
          size: auto; /* Set paper size to auto */
          margin: 0; /* Reset margins to remove default header and footer */
        }
        img {
          display: block;
          width: 100%;
          height: auto;
        }
      }
    `;

    // Set the CSS rules for the style element
    styleElement.innerHTML = cssText;

    // Append the style element to the document's head
    document.head.appendChild(styleElement);

    // Print the page
    window.print();

    // Remove the added style element after printing
    styleElement.remove();

    nav("/scan-data");
  }

  function printPdf(pdfBase64: string) {
    console.log(pdfBase64)
    printJs({ printable: pdfBase64.replace("data:application/pdf;base64,", ""), type: "pdf", base64: true });
    // nav("/scan-data");
  }

  useEffect(() => {
    const load = async () => {
      try {
        let rs = await api.post("/order/get-by-tracking", {
          tracking: id,
        });
        setData(rs);
      } catch (err: any) {
        ui.alert(t(err?.message), AlertType.Danger);
        nav(-1);
      }
    };
    load();
  }, []);

  useMemo(() => {
    if (data?.pdf && imageLoaded && !data?.pdf.includes("data:application/pdf")) {
      let instance = document.getElementById("myImage");
      if (instance) {
        printImage();
      } else {
        setTimeout(() => {
          setTrigger(!trigger);
        }, 500);
      }
    } else if (data?.pdf && data?.pdf.includes("data:application/pdf")) {
      printPdf(data.pdf);
    }
  }, [data, trigger, imageLoaded]);

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div>
        {data?.pdf &&
          (data.pdf.includes("data:application/pdf") ? (
            <div>
              <PdfPreview pdfBase64={data.pdf} autoShow={true} showPrint={true} />
            </div>
          ) : (
            <div>
              <img onLoad={handleImageLoad} id="myImage" src={data.pdf} className="object-contain h-screen" />
            </div>
          ))}
      </div>
    </div>
  );
}
