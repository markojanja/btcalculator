import ReactMarkdown from "react-markdown";
import FullScreenPanel from "./FullScreenPanel";

const HelpModal = ({ content, onClose }) => (
  <FullScreenPanel onClose={onClose}>
    <div className="modal-container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  </FullScreenPanel>
);

export default HelpModal;
