import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import ReactMarkdown from "react-markdown";

const Modal = ({ setShowModal, content }) => {
  const [markdown] = useState(content.content);

  const handleClick = () => {
    setShowModal(false);
  };
  return (
    <div className="absolute inset-0 bg-background z-50 h-screen">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-btn" onClick={handleClick}>
            <IoMdClose size={24} />
          </div>
        </div>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Modal;
