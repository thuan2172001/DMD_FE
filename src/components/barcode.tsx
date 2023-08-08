import React, { useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { BarCodeType } from 'interfaces';
import { Button } from 'semantic-ui-react';

const BarcodeGenerator = ({ inputString, barcodeType = BarCodeType.CODE128 }: { inputString: string, barcodeType?: BarCodeType }) => {
    const barcodeRef = useRef(null);

    const generateBarcode = () => {
        JsBarcode(barcodeRef.current, inputString, {
            format: barcodeType, // Replace with the barcode type you want (e.g., "CODE128", "EAN13", "CODE39", etc.)
            displayValue: true // Set to true to display the input string below the barcode
        });
    };

    return (
        <div>
            <div ref={barcodeRef} />
            <Button
                color={"blue"}
                className="mr-1"
                icon={"sync"}
                content={"Generate Barcode"}
                size={"mini"}
                primary
                onClick={async () => {
                    await generateBarcode()
                }}
            />
        </div>
    );
};

export default BarcodeGenerator;