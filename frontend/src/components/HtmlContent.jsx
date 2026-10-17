import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

// Renders user-written rich text after stripping anything unsafe.
const HtmlContent = ({ html, className }) => (
  <div
    className={cn("rte", className)}
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html ?? "") }}
  />
);

export default HtmlContent;
