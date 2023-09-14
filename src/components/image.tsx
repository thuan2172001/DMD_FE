import React, { useState } from 'react';
import { Image, Modal, Icon } from 'semantic-ui-react';

const ImagePopup = ({ imageUrl }: { imageUrl: string }) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    return (
        <div className="cursor-pointer">
            <Image src={imageUrl} alt="Image" onClick={togglePopup} className='h-8 object-contain' />

            <Modal
                open={showPopup}
                onClose={togglePopup}
                size="small"
                className="p-[0px]"
            >
                <Modal.Content image>
                    <Image src={imageUrl} alt="Image" size="large" centered />
                </Modal.Content>
                <Modal.Actions>
                    <Icon name="close" size="large" className="cursor-pointer absolute top-[10px] right-[10px]" onClick={togglePopup} />
                </Modal.Actions>
            </Modal>
        </div>
    );
};

export default ImagePopup;