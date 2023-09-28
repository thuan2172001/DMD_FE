import { Button, Card, Form, Header, Input, Message } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import api from "services/api";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ui from "services/ui";
import { AlertType } from "interfaces";
export default function Tracking() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [data, setData] = useState<any>({});
  const [trigger, setTrigger] = useState<any>(false);
  const { id } = useParams();

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
    if (data?.pdf) {
      let instance = document.getElementById("myImage");
      if (instance) {
        printImage();
      } else {
        setTimeout(() => {
          setTrigger(!trigger);
        }, 500);
      }
    }
  }, [data, trigger]);

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div>
        {data?.pdf && (
          <div>
            <img id="myImage" src={data.pdf} className="object-contain h-screen" />
          </div>
        )}
      </div>
    </div>
  );
}
